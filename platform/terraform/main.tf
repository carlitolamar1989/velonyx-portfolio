# ============================================
# Velonyx Platform — Main Terraform Config
# ============================================
# This file sets up the AWS provider and
# configures where Terraform stores its state.
# ============================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Store Terraform state in S3 (set up after first apply)
  # backend "s3" {
  #   bucket = "velonyx-terraform-state"
  #   key    = "platform/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "velonyx-platform"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
