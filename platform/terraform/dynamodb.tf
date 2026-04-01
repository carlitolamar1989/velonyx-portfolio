# ============================================
# DynamoDB — Database
# ============================================
# ClientProjects table stores all project data.
# PAY_PER_REQUEST = no capacity planning needed,
# you only pay for what you use.
# ============================================

resource "aws_dynamodb_table" "client_projects" {
  name         = "${var.project_name}-client-projects"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "clientId"

  attribute {
    name = "clientId"
    type = "S"
  }

  # Point-in-time recovery — can restore data if something goes wrong
  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "ClientProjects"
  }
}
