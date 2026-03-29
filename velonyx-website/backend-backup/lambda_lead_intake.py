"""
Velonyx Systems — Client Connect Lead Intake Lambda

Receives form submissions via API Gateway POST /leads,
stores them in DynamoDB (ClientConnectLeads), and sends
an SMS confirmation to the client via Twilio.

Environment variables (set in Lambda console):
  TWILIO_ACCOUNT_SID   — Twilio Account SID
  TWILIO_AUTH_TOKEN    — Twilio Auth Token
  TWILIO_PHONE_FROM   — Twilio phone number (e.g. +18773178643)
  ADMIN_EMAIL          — (optional) for future SES notifications
"""

import json
import os
import uuid
import urllib.request
import urllib.parse
from datetime import datetime, timezone

import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("ClientConnectLeads")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def lambda_handler(event, context):
    # Handle CORS preflight
    method = event.get("requestContext", {}).get("http", {}).get("method") or event.get("httpMethod", "")
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")

        first_name = body.get("firstName", "").strip()
        last_name = body.get("lastName", "").strip()
        phone = body.get("phone", "").strip()
        email = body.get("email", "").strip()
        service = body.get("service", "").strip()
        description = body.get("description", "").strip()

        # Validate required fields
        if not all([first_name, last_name, phone, email, service]):
            return _response(400, {"success": False, "message": "Missing required fields."})

        lead_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        # Store in DynamoDB
        item = {
            "leadId": lead_id,
            "firstName": first_name,
            "lastName": last_name,
            "phone": phone,
            "email": email,
            "service": service,
            "description": description,
            "status": "new",
            "source": "velonyxsystems.com",
            "createdAt": now,
        }
        table.put_item(Item=item)

        # Send SMS confirmation via Twilio (if configured)
        _send_sms(phone, first_name, service)

        return _response(200, {
            "success": True,
            "message": "Lead received successfully.",
            "leadId": lead_id,
        })

    except Exception as e:
        print(f"Error: {e}")
        return _response(500, {"success": False, "message": "Internal server error."})


def _send_sms(to_phone, first_name, service):
    """Send SMS confirmation via Twilio REST API (no pip dependency)."""
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_phone = os.environ.get("TWILIO_PHONE_FROM")

    if not all([account_sid, auth_token, from_phone]):
        print("Twilio not configured — skipping SMS.")
        return

    # Normalize phone: ensure +1 prefix for US numbers
    digits = "".join(c for c in to_phone if c.isdigit())
    if len(digits) == 10:
        digits = "1" + digits
    to_number = "+" + digits

    message_body = (
        f"Hey {first_name}! Thanks for reaching out to Velonyx Systems. "
        f"We received your inquiry about our {service} and will be in touch "
        f"within 24 hours. Talk soon!"
    )

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = urllib.parse.urlencode({
        "To": to_number,
        "From": from_phone,
        "Body": message_body,
    }).encode("utf-8")

    req = urllib.request.Request(url, data=data, method="POST")
    # Basic auth
    import base64
    credentials = base64.b64encode(f"{account_sid}:{auth_token}".encode()).decode()
    req.add_header("Authorization", f"Basic {credentials}")

    try:
        with urllib.request.urlopen(req) as resp:
            print(f"SMS sent to {to_number}: {resp.status}")
    except Exception as e:
        print(f"SMS failed: {e}")


def _response(status, body):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(body),
    }
