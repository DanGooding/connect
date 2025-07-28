provider "aws" {
  region = "eu-west-2"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.19.0"

  name = "connect-vpc"
  cidr = "10.0.0.0/16"

  azs                  = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
  private_subnets      = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  public_subnets       = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
  private_subnet_names = ["connect-priv-a", "connect-priv-b", "connect-priv-c"]
  public_subnet_names  = ["connect-pub-a", "connect-pub-b", "connect-pub-c"]

  create_igw           = true
  enable_dns_hostnames = true

  vpc_tags = {
    Name = "connect-vpc"
  }
  igw_tags = {
    Name = "connect-igw"
  }
  tags = {
    project_name = var.project_name
  }
}

resource "aws_ecr_repository" "api_server_container_repo" {
  name = "connect-api-server"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = {
    project_name = var.project_name
  }
}

resource "aws_ecr_repository" "static_container_repo" {
  name = "connect-static-server"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = {
    project_name = var.project_name
  }
}

module "cluster" {
  source = "terraform-aws-modules/ecs/aws//modules/cluster"

  name = "connect-ecs-cluster"
  default_capacity_provider_strategy = {
    FARGATE = {
      weight = 100
    }
  }

  tags = {
    project_name = var.project_name
  }
}

module "static_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  name        = "static-service"
  cluster_arn = module.cluster.arn

  cpu                        = 256 // 0.25 vCPU
  memory                     = 512 // MB
  desired_count              = 1
  deployment_maximum_percent = 200
  enable_autoscaling         = false

  assign_public_ip = true

  // ssh in for debugging
  enable_execute_command = true

  container_definitions = {
    static_server_container = {
      cpu       = 256
      memory    = 512
      essential = true
      image     = "${aws_ecr_repository.static_container_repo.repository_url}:latest"
      portMappings = [{
        containerPort = var.static_service_port
        protocol      = "tcp"
        name          = "static-service"
      }]

      // nginx writes to /etc and /var
      readonlyRootFilesystem = false
    }
  }

  load_balancer = {
    service = {
      target_group_arn = module.alb.target_groups["static"].arn
      container_name   = "static_server_container"
      container_port   = var.static_service_port
    }
  }

  subnet_ids = module.vpc.public_subnets

  security_group_ingress_rules = {
    from_alb = {
      ip_protocol                  = "tcp"
      from_port                    = var.static_service_port
      referenced_security_group_id = module.alb.security_group_id
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  tags = {
    Name         = "static-ecs-service"
    project_name = var.project_name
  }
}

resource "aws_service_discovery_http_namespace" "service_discovery_namespace" {
  name = "connect"
  tags = {
    project_name = var.project_name
  }
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "connect-db-password"
  tags = {
    project_name = var.project_name
  }
}

module "api_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  name        = "api-service"
  cluster_arn = module.cluster.arn

  cpu                        = 256
  memory                     = 512
  desired_count              = 1
  deployment_maximum_percent = 200
  enable_autoscaling         = false

  assign_public_ip = true

  // ssh in for debugging
  enable_execute_command = true

  container_definitions = {
    api_service_container = {
      cpu       = 256
      memory    = 512
      essential = true
      image     = "${aws_ecr_repository.api_server_container_repo.repository_url}:latest"
      portMappings = [{
        name          = "api-service"
        containerPort = var.api_service_port
        protocol      = "tcp"
      }]
      environment = [
        {
          name  = "DB_NAME"
          value = var.db_credentials.name
        },
        {
          name  = "DB_USER",
          value = var.db_credentials.user
        },
        {
          name  = "DB_URL",
          value = var.db_credentials.url
        }
      ]
      secrets = [
        {
          name      = "DB_PASS"
          valueFrom = aws_secretsmanager_secret.db_password.arn
        }
      ]
    }
  }

  load_balancer = {
    service = {
      target_group_arn = module.alb.target_groups["api"].arn
      container_name   = "api_service_container"
      container_port   = var.api_service_port
    }
  }

  subnet_ids = module.vpc.public_subnets

  security_group_ingress_rules = {
    from_alb = {
      ip_protocol = "-1"
      cidr_ipv4   = module.vpc.vpc_cidr_block
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  tags = {
    Name         = "api-ecs-service"
    project_name = var.project_name
  }
}

data "aws_iam_policy_document" "access_secrets_for_api_service" {
  statement {
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.db_password.arn]
  }
}

resource "aws_iam_policy" "access_secrets_for_api_service" {
  name   = "connect-access-runtime-secrets"
  policy = data.aws_iam_policy_document.access_secrets_for_api_service.json
  tags = {
    project_name = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "api_sevice_can_access_secrets" {
  role       = module.api_service.task_exec_iam_role_name
  policy_arn = aws_iam_policy.access_secrets_for_api_service.arn
}

module "alb" {
  source = "terraform-aws-modules/alb/aws"

  name               = "connect-alb"
  load_balancer_type = "application"

  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets

  // TODO: unset?
  enable_deletion_protection = false

  security_group_ingress_rules = {
    all_http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
    all_https = {
      from_port   = 443
      to_port     = 443
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = module.vpc.vpc_cidr_block
    }
  }

  listeners = {
    listener = {
      protocol = "HTTPS"
      port     = 443

      certificate_arn = var.domain_certificate_arn

      rules = {
        api = {
          conditions = [
            {
              path_pattern = {
                values = ["/api/*"]
              }
            }
          ]
          actions = [
            {
              type             = "forward"
              target_group_key = "api"
            }
          ]
        }
      }

      // default rule
      forward = {
        target_group_key = "static"
      }
    }
  }

  target_groups = {
    static = {
      target_type = "ip"

      // ECS will attach services to the group dynamically
      create_attachment = false
    }

    api = {
      target_type = "ip"

      create_attachment = false

      health_check = {
        matcher = 200
        // TODO: define a proper health check path
        path     = "/api/walls/random"
        port     = "traffic-port"
        protocol = "HTTP"
      }
    }
  }
  tags = {
    project_name = var.project_name
  }
}
