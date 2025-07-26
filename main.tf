provider "aws" {
  region = "eu-west-2"
}

// query machine image that matches this filer from AWS
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  owners = ["099720109477"] # Canonical
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.19.0"

  name = "connect-vpc"
  cidr = "10.0.0.0/16"

  azs                  = ["eu-west-2a"]
  private_subnets      = ["10.0.101.0/24"]
  public_subnets       = ["10.0.1.0/24"]
  private_subnet_names = ["connect-priv-1"]
  public_subnet_names  = ["connect-pub-1"]

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

resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  vpc_security_group_ids = [module.vpc.default_security_group_id]
  subnet_id              = module.vpc.public_subnets[0]

  tags = {
    Name         = "connect-app-server"
    project_name = var.project_name
  }
}

resource "aws_eip" "public_ip" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
  tags = {
    Name         = "connect-public-ip"
    project_name = var.project_name
  }
  depends_on = [module.vpc]
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
