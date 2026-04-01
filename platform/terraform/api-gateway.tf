# ============================================
# API Gateway — HTTP API
# ============================================
# Routes all portal/admin requests to Lambda.
# JWT authorizer validates Cognito tokens.
# ============================================

resource "aws_apigatewayv2_api" "platform" {
  name          = "${var.project_name}-platform-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "https://velonyxsystems.com",
      "https://www.velonyxsystems.com",
      "http://localhost:8080",
    ]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

# JWT Authorizer — validates Cognito tokens on every request
resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.platform.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.portal.id]
    issuer   = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.clients.id}"
  }
}

# --- Upload Routes ---
resource "aws_apigatewayv2_integration" "uploads" {
  api_id                 = aws_apigatewayv2_api.platform.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.uploads.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "upload_url" {
  api_id             = aws_apigatewayv2_api.platform.id
  route_key          = "POST /upload-url"
  target             = "integrations/${aws_apigatewayv2_integration.uploads.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "list_files" {
  api_id             = aws_apigatewayv2_api.platform.id
  route_key          = "GET /files"
  target             = "integrations/${aws_apigatewayv2_integration.uploads.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "delete_file" {
  api_id             = aws_apigatewayv2_api.platform.id
  route_key          = "DELETE /files"
  target             = "integrations/${aws_apigatewayv2_integration.uploads.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

# --- Project Routes ---
resource "aws_apigatewayv2_integration" "projects" {
  api_id                 = aws_apigatewayv2_api.platform.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.projects.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_project" {
  api_id             = aws_apigatewayv2_api.platform.id
  route_key          = "GET /project"
  target             = "integrations/${aws_apigatewayv2_integration.projects.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "update_project" {
  api_id             = aws_apigatewayv2_api.platform.id
  route_key          = "PUT /project"
  target             = "integrations/${aws_apigatewayv2_integration.projects.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "create_project" {
  api_id             = aws_apigatewayv2_api.platform.id
  route_key          = "POST /project"
  target             = "integrations/${aws_apigatewayv2_integration.projects.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

# --- Notification Routes ---
resource "aws_apigatewayv2_integration" "notifications" {
  api_id                 = aws_apigatewayv2_api.platform.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.notifications.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "send_notification" {
  api_id             = aws_apigatewayv2_api.platform.id
  route_key          = "POST /notify"
  target             = "integrations/${aws_apigatewayv2_integration.notifications.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

# --- Lambda Permissions (allow API Gateway to invoke) ---
resource "aws_lambda_permission" "uploads" {
  function_name = aws_lambda_function.uploads.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.platform.execution_arn}/*/*"
}

resource "aws_lambda_permission" "projects" {
  function_name = aws_lambda_function.projects.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.platform.execution_arn}/*/*"
}

resource "aws_lambda_permission" "notifications" {
  function_name = aws_lambda_function.notifications.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.platform.execution_arn}/*/*"
}

# --- Deployment Stage ---
resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.platform.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      method         = "$context.httpMethod"
      path           = "$context.path"
      status         = "$context.status"
      responseLength = "$context.responseLength"
    })
  }
}

# CloudWatch log group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}-platform"
  retention_in_days = 30
}
