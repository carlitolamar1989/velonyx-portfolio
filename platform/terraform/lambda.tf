# ============================================
# Lambda Functions (Docker-based)
# ============================================
# Each Lambda runs a Docker container from ECR.
# This is placeholder config — ECR image URIs
# will be set after building/pushing containers.
# ============================================

# --- Uploads Lambda ---
resource "aws_lambda_function" "uploads" {
  function_name = "${var.project_name}-uploads"
  role          = aws_iam_role.lambda_exec.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.uploads.repository_url}:latest"
  timeout       = 30
  memory_size   = 256

  environment {
    variables = {
      S3_BUCKET      = aws_s3_bucket.client_assets.id
      DYNAMODB_TABLE = aws_dynamodb_table.client_projects.name
    }
  }
}

# --- Projects Lambda ---
resource "aws_lambda_function" "projects" {
  function_name = "${var.project_name}-projects"
  role          = aws_iam_role.lambda_exec.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.projects.repository_url}:latest"
  timeout       = 30
  memory_size   = 256

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.client_projects.name
    }
  }
}

# --- Notifications Lambda ---
resource "aws_lambda_function" "notifications" {
  function_name = "${var.project_name}-notifications"
  role          = aws_iam_role.lambda_exec.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.notifications.repository_url}:latest"
  timeout       = 30
  memory_size   = 256

  environment {
    variables = {
      ADMIN_EMAIL        = var.admin_email
      TWILIO_ACCOUNT_SID = ""  # Set via AWS Console or terraform.tfvars (sensitive)
      TWILIO_AUTH_TOKEN   = "" # Set via AWS Console or terraform.tfvars (sensitive)
      TWILIO_PHONE_FROM  = var.twilio_phone_from
    }
  }
}

# --- ECR Repositories (Docker image storage) ---
resource "aws_ecr_repository" "uploads" {
  name                 = "${var.project_name}-uploads"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "projects" {
  name                 = "${var.project_name}-projects"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "notifications" {
  name                 = "${var.project_name}-notifications"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}
