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

resource "aws_ecr_repository" "proxy_container_repo" {
  name = "connect-proxy"
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

module "proxy_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  name        = "proxy-service"
  cluster_arn = module.cluster.arn

  cpu                        = 256 // 0.25 vCPU
  memory                     = 512 // 512 GB
  desired_count              = 1
  deployment_maximum_percent = 200
  enable_autoscaling         = false

  // TODO: do not keep this - we should probably nat to a single public ip
  assign_public_ip = true

  // ssh in for debugging
  enable_execute_command = true

  container_definitions = {
    proxy_container = {
      cpu       = 256
      memory    = 512
      essential = true
      image     = "${aws_ecr_repository.proxy_container_repo.repository_url}:latest"
      portMappings = [{
        containerPort = 80
        protocol      = "tcp"
      }]
    }

  }

  // TODO: service connect

  load_balancer = {
    service = {
      target_group_arn = module.alb.target_groups["proxy"].arn
      container_name   = "proxy_container"
      container_port   = 80
    }
  }

  subnet_ids = module.vpc.public_subnets

  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  tags = {
    Name         = "proxy-ecs-service"
    project_name = var.project_name
  }
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
    proxy = {
      port     = 80
      protocol = "HTTP"
      forward = {
        target_group_key = "proxy"
      }
    }
  }

  target_groups = {
    proxy = {
      protocol    = "HTTP"
      port        = 80
      target_type = "ip"

      // ECS will attach services to the group dynamically
      create_attachment = false

      // TODO: health check
    }
  }
}
