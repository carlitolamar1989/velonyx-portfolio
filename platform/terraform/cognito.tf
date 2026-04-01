# ============================================
# Cognito — Authentication
# ============================================
# User pool for client + admin login.
# Handles signup, login, password reset, email
# verification — all managed by AWS.
# ============================================

resource "aws_cognito_user_pool" "clients" {
  name = "${var.project_name}-client-pool"

  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  # Auto-verify email
  auto_verified_attributes = ["email"]

  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Custom attributes for client data
  schema {
    name                = "business_name"
    attribute_data_type = "String"
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                = "role"
    attribute_data_type = "String"
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 20
    }
  }

  # Account recovery via email
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Customized verification messages
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Velonyx Systems — Verify Your Account"
    email_message        = "Welcome to Velonyx Systems! Your verification code is: {####}"
  }
}

# App client — used by the portal frontend
resource "aws_cognito_user_pool_client" "portal" {
  name         = "${var.project_name}-portal-client"
  user_pool_id = aws_cognito_user_pool.clients.id

  # Auth flows
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  # Token validity
  access_token_validity  = 24   # hours
  id_token_validity      = 24   # hours
  refresh_token_validity = 30   # days

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  # No client secret (public client for browser-based auth)
  generate_secret = false
}

# Admin group — separates admin from regular clients
resource "aws_cognito_user_group" "admins" {
  name         = "admins"
  user_pool_id = aws_cognito_user_pool.clients.id
  description  = "Velonyx Systems administrators"
}
