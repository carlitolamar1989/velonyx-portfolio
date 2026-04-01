# ============================================
# S3 — File Storage
# ============================================
# One bucket for all client assets.
# CORS allows browser-based uploads via
# presigned URLs from the portal.
# ============================================

resource "aws_s3_bucket" "client_assets" {
  bucket = "${var.project_name}-client-assets"

  tags = {
    Name = "ClientAssets"
  }
}

# Block public access — files are private, accessed via presigned URLs
resource "aws_s3_bucket_public_access_block" "client_assets" {
  bucket = aws_s3_bucket.client_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning — recover accidentally deleted files
resource "aws_s3_bucket_versioning" "client_assets" {
  bucket = aws_s3_bucket.client_assets.id

  versioning_configuration {
    status = "Enabled"
  }
}

# CORS — allow browser uploads from the portal
resource "aws_s3_bucket_cors_configuration" "client_assets" {
  bucket = aws_s3_bucket.client_assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = [
      "https://velonyxsystems.com",
      "https://www.velonyxsystems.com",
      "http://localhost:8080"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

# Lifecycle rule — move old files to cheaper storage after 90 days
resource "aws_s3_bucket_lifecycle_configuration" "client_assets" {
  bucket = aws_s3_bucket.client_assets.id

  rule {
    id     = "archive-old-assets"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }
  }
}

# Server-side encryption — all files encrypted at rest
resource "aws_s3_bucket_server_side_encryption_configuration" "client_assets" {
  bucket = aws_s3_bucket.client_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
