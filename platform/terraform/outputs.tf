# ============================================
# Outputs — Values needed after deployment
# ============================================
# These values are printed after terraform apply
# and used by the frontend configs.
# ============================================

output "api_url" {
  description = "API Gateway base URL"
  value       = aws_apigatewayv2_stage.prod.invoke_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID (for frontend auth config)"
  value       = aws_cognito_user_pool.clients.id
}

output "cognito_client_id" {
  description = "Cognito App Client ID (for frontend auth config)"
  value       = aws_cognito_user_pool_client.portal.id
}

output "s3_bucket_name" {
  description = "S3 bucket for client assets"
  value       = aws_s3_bucket.client_assets.id
}

output "dynamodb_table_name" {
  description = "DynamoDB table for client projects"
  value       = aws_dynamodb_table.client_projects.name
}
