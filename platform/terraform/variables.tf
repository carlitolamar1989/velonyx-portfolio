# ============================================
# Velonyx Platform — Variables
# ============================================
# All configurable values in one place.
# Override with terraform.tfvars or -var flags.
# ============================================

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "velonyx"
}

variable "admin_email" {
  description = "Admin email for notifications"
  type        = string
  default     = "admin@velonyxsystems.com"
}

variable "twilio_phone_from" {
  description = "Twilio phone number for SMS"
  type        = string
  default     = "+18773178643"
}
