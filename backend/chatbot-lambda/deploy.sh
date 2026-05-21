#!/usr/bin/env bash
# Velonyx Chatbot Lambda — deploy helper.
#
# Prereqs (one-time):
#   1. AWS CLI installed and configured (aws configure)
#   2. Lambda function created in AWS Console named "velonyx-chatbot"
#      Runtime: Node.js 20.x
#      Architecture: x86_64
#      Handler: index.handler
#      Memory: 256 MB
#      Timeout: 30 seconds
#      Env var: ANTHROPIC_API_KEY = <your key from console.anthropic.com>
#   3. API Gateway HTTP API in front of the Lambda
#      Route: POST /chat → velonyx-chatbot
#      CORS: Access-Control-Allow-Origin = https://velonyxsystems.com
#
# What this script does:
#   - Installs production deps via npm
#   - Zips index.js, system-prompt.md, package.json, and node_modules
#   - Uploads to the Lambda function via aws lambda update-function-code
#
# Run from this folder (backend/chatbot-lambda/):
#   bash deploy.sh
#
# After deploy:
#   - Test in the Lambda console with a sample event (see README.md "Test event")
#   - Grab the API Gateway invocation URL
#   - Paste it into assets/marketing-config.js (uncomment + set window.VELONYX_CHATBOT_API_URL)
#   - git commit + push → GitHub Pages auto-deploys → chatbot widget switches from fallback to AI mode

set -euo pipefail

FUNCTION_NAME="${FUNCTION_NAME:-velonyx-chatbot}"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo "→ Installing production deps..."
rm -rf node_modules
npm install --omit=dev --no-audit --no-fund --silent

echo "→ Zipping function..."
rm -f function.zip
zip -rq function.zip index.js system-prompt.md package.json node_modules

echo "→ Uploading to Lambda (function=$FUNCTION_NAME region=$AWS_REGION)..."
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --region "$AWS_REGION" \
  --zip-file fileb://function.zip \
  --output table \
  --no-cli-pager

echo "→ Done. Test in the Lambda console or via:"
echo "    curl -X POST <API_GATEWAY_URL>/chat -H 'Content-Type: application/json' \\"
echo "      -d '{\"sessionId\":\"test\",\"message\":\"What is the $700 build?\",\"history\":[]}'"
