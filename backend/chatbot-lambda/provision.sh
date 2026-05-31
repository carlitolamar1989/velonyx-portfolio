#!/usr/bin/env bash
# =============================================================================
# Velonyx AI Lead System — One-shot AWS + Twilio provisioning
# =============================================================================
# Provisions everything on the AWS + Twilio side automatically:
#   - IAM execution role for the Lambda
#   - Lambda function (creates or updates)
#   - 11 environment variables
#   - Uploads the function.zip
#   - API Gateway HTTP API with 3 routes (/chat, /form-turn, /sms/inbound)
#   - CORS for velonyxsystems.com
#   - Lambda invoke permission for API Gateway
#   - Twilio Messaging Service inbound webhook → /sms/inbound
#
# Run this ONCE from /Users/apple/Cursor-Claude/backend/chatbot-lambda/
# on your Mac, after exporting the env vars listed below in your shell.
#
# After it finishes:
#   - It prints the API Gateway Invoke URL
#   - It prints the exact line to paste into assets/marketing-config.js
#   - The Twilio Messaging Service inbound webhook is already configured
#   - Only thing left: run the Supabase migration SQL (10 sec, one click)
#
# What you still have to do manually:
#   - aws configure  (one-time, if not done already)
#   - Run the Supabase SQL migration in the Supabase SQL Editor
#   - Verify Resend sender domain DNS (one-time, Resend → Domains)
#   - Confirm Twilio 10DLC status (just read the dashboard)
# =============================================================================

set -euo pipefail

# ── Required env vars (export these in your shell before running) ───────────
: "${ANTHROPIC_API_KEY:?ANTHROPIC_API_KEY must be exported}"
: "${SUPABASE_URL:?SUPABASE_URL must be exported}"
: "${SUPABASE_SERVICE_ROLE_KEY:?SUPABASE_SERVICE_ROLE_KEY must be exported}"
: "${TWILIO_ACCOUNT_SID:?TWILIO_ACCOUNT_SID must be exported}"
: "${TWILIO_AUTH_TOKEN:?TWILIO_AUTH_TOKEN must be exported}"
: "${TWILIO_MESSAGING_SERVICE_SID:?TWILIO_MESSAGING_SERVICE_SID must be exported (MG... preferred over raw number)}"
: "${RESEND_API_KEY:?RESEND_API_KEY must be exported}"
: "${RESEND_FROM_ADDRESS:?RESEND_FROM_ADDRESS must be exported (e.g. 'Velonyx <leads@velonyxsystems.com>')}"
: "${OWNER_EMAIL:?OWNER_EMAIL must be exported}"
: "${OWNER_PHONE:?OWNER_PHONE must be exported (E.164, e.g. +15551234567)}"

# ── Optional (defaults) ─────────────────────────────────────────────────────
REGION="${AWS_REGION:-us-east-1}"
FUNCTION_NAME="${FUNCTION_NAME:-velonyx-chatbot}"
API_NAME="${API_NAME:-velonyx-chatbot-api}"
ROLE_NAME="${ROLE_NAME:-velonyx-chatbot-role}"
ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-https://velonyxsystems.com}"

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  Velonyx AI Lead System — AWS + Twilio Provisioning"
echo "════════════════════════════════════════════════════════════════════"
echo "  Region:        $REGION"
echo "  Lambda:        $FUNCTION_NAME"
echo "  API:           $API_NAME"
echo "  IAM Role:      $ROLE_NAME"
echo "  Allowed Origin: $ALLOWED_ORIGIN"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# ── Prereqs ─────────────────────────────────────────────────────────────────
command -v aws >/dev/null  || { echo "✗ aws CLI not found. Run 'aws configure' first."; exit 1; }
command -v jq >/dev/null   || { echo "✗ jq not found. Install: brew install jq"; exit 1; }
command -v zip >/dev/null  || { echo "✗ zip not found."; exit 1; }
command -v npm >/dev/null  || { echo "✗ npm not found. Install Node 20+."; exit 1; }

# Confirm AWS identity
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "→ AWS account: $ACCOUNT_ID"
echo ""

# ── 1. Build function.zip ───────────────────────────────────────────────────
echo "[1/8] Building function.zip..."
rm -rf node_modules function.zip
npm install --omit=dev --no-audit --no-fund --silent
zip -rq function.zip index.js system-prompt.md system-prompt-form.md system-prompt-sms.md package.json lib/ node_modules/
ZIP_SIZE=$(ls -lh function.zip | awk '{print $5}')
echo "  ✓ function.zip ($ZIP_SIZE)"
echo ""

# ── 2. IAM role for Lambda ──────────────────────────────────────────────────
echo "[2/8] IAM execution role..."
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text 2>/dev/null || true)
if [ -z "$ROLE_ARN" ]; then
  TRUST_POLICY='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
  ROLE_ARN=$(aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "$TRUST_POLICY" \
    --query Role.Arn --output text)
  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  echo "  ✓ Created role: $ROLE_ARN"
  echo "  → Waiting 10s for IAM propagation..."
  sleep 10
else
  echo "  ✓ Role exists: $ROLE_ARN"
fi
echo ""

# ── 3. Lambda function (create or update) ───────────────────────────────────
echo "[3/8] Lambda function..."
ENV_JSON=$(jq -n \
  --arg ak  "$ANTHROPIC_API_KEY" \
  --arg su  "$SUPABASE_URL" \
  --arg sk  "$SUPABASE_SERVICE_ROLE_KEY" \
  --arg ts  "$TWILIO_ACCOUNT_SID" \
  --arg tt  "$TWILIO_AUTH_TOKEN" \
  --arg tms "$TWILIO_MESSAGING_SERVICE_SID" \
  --arg rk  "$RESEND_API_KEY" \
  --arg rf  "$RESEND_FROM_ADDRESS" \
  --arg oe  "$OWNER_EMAIL" \
  --arg op  "$OWNER_PHONE" \
  --arg ao  "$ALLOWED_ORIGIN" \
  '{Variables: {
      ANTHROPIC_API_KEY: $ak,
      SUPABASE_URL: $su,
      SUPABASE_SERVICE_ROLE_KEY: $sk,
      TWILIO_ACCOUNT_SID: $ts,
      TWILIO_AUTH_TOKEN: $tt,
      TWILIO_MESSAGING_SERVICE_SID: $tms,
      RESEND_API_KEY: $rk,
      RESEND_FROM_ADDRESS: $rf,
      OWNER_EMAIL: $oe,
      OWNER_PHONE: $op,
      ALLOWED_ORIGIN: $ao
   }}')

if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "  → Function exists, updating code + config..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --zip-file fileb://function.zip \
    --output text --query LastUpdateStatus >/dev/null
  aws lambda wait function-updated --function-name "$FUNCTION_NAME" --region "$REGION"
  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --memory-size 256 \
    --timeout 30 \
    --environment "$ENV_JSON" \
    --output text --query LastUpdateStatus >/dev/null
  echo "  ✓ Updated"
else
  echo "  → Creating function..."
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --runtime nodejs20.x \
    --role "$ROLE_ARN" \
    --handler index.handler \
    --zip-file fileb://function.zip \
    --memory-size 256 \
    --timeout 30 \
    --environment "$ENV_JSON" \
    --output text --query FunctionArn >/dev/null
  echo "  ✓ Created"
fi
LAMBDA_ARN=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --query Configuration.FunctionArn --output text)
echo "  Lambda ARN: $LAMBDA_ARN"
echo ""

# ── 4. API Gateway HTTP API ─────────────────────────────────────────────────
echo "[4/8] API Gateway HTTP API..."
EXISTING_API=$(aws apigatewayv2 get-apis --region "$REGION" --query "Items[?Name=='$API_NAME'].ApiId | [0]" --output text)
if [ "$EXISTING_API" != "None" ] && [ -n "$EXISTING_API" ]; then
  API_ID="$EXISTING_API"
  echo "  ✓ API exists: $API_ID"
else
  API_ID=$(aws apigatewayv2 create-api \
    --region "$REGION" \
    --name "$API_NAME" \
    --protocol-type HTTP \
    --cors-configuration "AllowOrigins=$ALLOWED_ORIGIN,AllowMethods=POST,OPTIONS,AllowHeaders=content-type" \
    --query ApiId --output text)
  echo "  ✓ Created API: $API_ID"
fi
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com"
echo "  Invoke URL: $API_ENDPOINT"
echo ""

# ── 5. Integration + Routes ─────────────────────────────────────────────────
echo "[5/8] Lambda integration + 3 routes..."
INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id "$API_ID" --region "$REGION" --query "Items[?IntegrationUri=='$LAMBDA_ARN'].IntegrationId | [0]" --output text)
if [ "$INTEGRATION_ID" = "None" ] || [ -z "$INTEGRATION_ID" ]; then
  INTEGRATION_ID=$(aws apigatewayv2 create-integration \
    --api-id "$API_ID" \
    --region "$REGION" \
    --integration-type AWS_PROXY \
    --integration-uri "$LAMBDA_ARN" \
    --payload-format-version 2.0 \
    --query IntegrationId --output text)
  echo "  ✓ Created integration: $INTEGRATION_ID"
else
  echo "  ✓ Integration exists: $INTEGRATION_ID"
fi

for ROUTE_PATH in "/chat" "/form-turn" "/sms/inbound"; do
  ROUTE_KEY="POST $ROUTE_PATH"
  EXISTING_ROUTE=$(aws apigatewayv2 get-routes --api-id "$API_ID" --region "$REGION" --query "Items[?RouteKey=='$ROUTE_KEY'].RouteId | [0]" --output text)
  if [ "$EXISTING_ROUTE" = "None" ] || [ -z "$EXISTING_ROUTE" ]; then
    aws apigatewayv2 create-route \
      --api-id "$API_ID" \
      --region "$REGION" \
      --route-key "$ROUTE_KEY" \
      --target "integrations/$INTEGRATION_ID" \
      --output text --query RouteId >/dev/null
    echo "  ✓ Created route: $ROUTE_KEY"
  else
    echo "  ✓ Route exists: $ROUTE_KEY"
  fi
done
echo ""

# ── 6. Lambda invoke permission for API Gateway ─────────────────────────────
echo "[6/8] Lambda invoke permission for API Gateway..."
STATEMENT_ID="apigateway-invoke-$API_ID"
SOURCE_ARN="arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*/*"
# Try to remove existing first (idempotent), then add
aws lambda remove-permission --function-name "$FUNCTION_NAME" --region "$REGION" --statement-id "$STATEMENT_ID" >/dev/null 2>&1 || true
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --statement-id "$STATEMENT_ID" \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "$SOURCE_ARN" \
  --output text --query Statement >/dev/null
echo "  ✓ Permission set"
echo ""

# ── 7. Configure Twilio Messaging Service inbound webhook ───────────────────
echo "[7/8] Twilio Messaging Service inbound webhook..."
TWILIO_WEBHOOK_URL="$API_ENDPOINT/sms/inbound"
TWILIO_RESPONSE=$(curl -sS -X POST \
  "https://messaging.twilio.com/v1/Services/$TWILIO_MESSAGING_SERVICE_SID" \
  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
  --data-urlencode "InboundRequestUrl=$TWILIO_WEBHOOK_URL" \
  --data-urlencode "InboundMethod=POST")
if echo "$TWILIO_RESPONSE" | jq -e '.sid' >/dev/null 2>&1; then
  echo "  ✓ Webhook set: $TWILIO_WEBHOOK_URL"
else
  echo "  ✗ Twilio webhook update failed:"
  echo "$TWILIO_RESPONSE" | jq . 2>/dev/null || echo "$TWILIO_RESPONSE"
  echo "  → You can set it manually: Twilio Console → Messaging → Services → Velonyx Lead System → Integration"
fi
echo ""

# ── 8. Output marketing-config.js patch ─────────────────────────────────────
echo "[8/8] Output config..."
CHAT_URL="$API_ENDPOINT/chat"
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  ✓ PROVISIONING COMPLETE"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "  API Gateway URL: $API_ENDPOINT"
echo "  Chat endpoint:   $CHAT_URL"
echo "  SMS webhook:     $TWILIO_WEBHOOK_URL"
echo ""
echo "  PASTE THIS into assets/marketing-config.js (replace the commented line):"
echo ""
echo "    window.VELONYX_CHATBOT_API_URL = '$CHAT_URL';"
echo ""
echo "  Then: git add assets/marketing-config.js && git commit && git push"
echo ""
echo "  Still to do manually:"
echo "    1. Supabase migration: Open Supabase Dashboard → SQL Editor →"
echo "       paste backend/supabase-migrations/001_leads.sql → Run"
echo "    2. Resend sender domain: verify DNS for velonyxsystems.com if not done"
echo "    3. Twilio 10DLC: confirm Brand + Campaign are APPROVED"
echo ""
echo "════════════════════════════════════════════════════════════════════"
