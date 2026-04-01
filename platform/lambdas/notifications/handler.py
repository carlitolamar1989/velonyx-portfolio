"""
Velonyx Platform — Notifications Handler
Sends email (SES) and SMS (Twilio) notifications
for project status updates, upload confirmations, etc.
"""
import json
import os
import base64
import urllib.request
import urllib.parse
import boto3

ses = boto3.client("ses", region_name="us-east-1")

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@velonyxsystems.com")
TWILIO_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM = os.environ.get("TWILIO_PHONE_FROM", "")

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
}


def lambda_handler(event, context):
    """Handle notification requests."""
    method = event.get("requestContext", {}).get("http", {}).get("method", "")
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    # Only admins can trigger notifications
    claims = (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
    )
    groups = claims.get("cognito:groups", "")
    if "admins" not in (groups or ""):
        return {
            "statusCode": 403,
            "headers": HEADERS,
            "body": json.dumps({"error": "Admin access required"}),
        }

    try:
        body = json.loads(event.get("body", "{}"))
        notification_type = body.get("type", "")

        if notification_type == "status_update":
            return send_status_update(body)
        elif notification_type == "welcome":
            return send_welcome(body)
        elif notification_type == "upload_received":
            return notify_admin_upload(body)
        else:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({"error": "Invalid notification type"}),
            }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Server error"}),
        }


def send_status_update(body):
    """Notify client that their project status has changed."""
    client_email = body.get("clientEmail", "")
    client_name = body.get("clientName", "")
    new_status = body.get("status", "")
    client_phone = body.get("clientPhone", "")

    status_messages = {
        "design": "We've started designing your site! You'll receive a preview link soon.",
        "review": "Your site preview is ready for review. Log into your portal to see it.",
        "revision": "We're working on your requested revisions. Updates coming soon.",
        "launched": "Your site is LIVE! Congratulations — your business just leveled up.",
    }

    message = status_messages.get(new_status, f"Your project status has been updated to: {new_status}")

    # Send email
    email_sent = send_email(
        to=client_email,
        subject=f"Velonyx Systems — Project Update: {new_status.title()}",
        body=build_status_email(client_name, new_status, message),
    )

    # Send SMS
    sms_sent = False
    if client_phone:
        sms_sent = send_sms(
            to=client_phone,
            message=f"Velonyx Systems: {message} — Log in to your portal for details.",
        )

    return {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps({
            "message": "Notification sent",
            "emailSent": email_sent,
            "smsSent": sms_sent,
        }),
    }


def send_welcome(body):
    """Send welcome email to new client with portal login instructions."""
    client_email = body.get("clientEmail", "")
    client_name = body.get("clientName", "")

    email_sent = send_email(
        to=client_email,
        subject="Welcome to Velonyx Systems — Your Project Portal is Ready",
        body=build_welcome_email(client_name),
    )

    return {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps({"message": "Welcome email sent", "emailSent": email_sent}),
    }


def notify_admin_upload(body):
    """Notify admin when a client uploads files."""
    client_name = body.get("clientName", "")
    category = body.get("category", "")
    file_count = body.get("fileCount", 1)

    send_email(
        to=ADMIN_EMAIL,
        subject=f"New Upload — {client_name}: {file_count} file(s) in {category}",
        body=f"<p>{client_name} uploaded {file_count} file(s) to <strong>{category}</strong>.</p><p>Log into the admin dashboard to review.</p>",
    )

    return {
        "statusCode": 200,
        "headers": HEADERS,
        "body": json.dumps({"message": "Admin notified"}),
    }


def send_email(to, subject, body):
    """Send an HTML email via SES."""
    try:
        ses.send_email(
            Source=ADMIN_EMAIL,
            Destination={"ToAddresses": [to]},
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {"Html": {"Data": body, "Charset": "UTF-8"}},
            },
        )
        return True
    except Exception as e:
        print(f"Email failed: {str(e)}")
        return False


def send_sms(to, message):
    """Send SMS via Twilio REST API."""
    if not TWILIO_SID or not TWILIO_TOKEN or not TWILIO_FROM:
        print("Twilio not configured — skipping SMS")
        return False

    try:
        url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_SID}/Messages.json"
        data = urllib.parse.urlencode({
            "To": to,
            "From": TWILIO_FROM,
            "Body": message,
        }).encode("utf-8")

        credentials = base64.b64encode(
            f"{TWILIO_SID}:{TWILIO_TOKEN}".encode()
        ).decode()

        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Authorization", f"Basic {credentials}")

        with urllib.request.urlopen(req) as response:
            return response.status == 201
    except Exception as e:
        print(f"SMS failed: {str(e)}")
        return False


def build_status_email(name, status, message):
    """Build a branded HTML email for status updates."""
    return f"""
    <div style="font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #08080A, #0C0C0F); padding: 36px 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="color: #D4AF37; font-size: 10px; font-weight: 700; letter-spacing: 3px;">VELONYX SYSTEMS</span>
        </div>
        <h1 style="color: #F5F5F5; font-size: 22px; margin: 0 0 8px;">Project Update</h1>
        <div style="height: 2px; width: 40px; background: linear-gradient(90deg, #D4AF37, transparent); margin-bottom: 20px;"></div>
        <p style="color: #999; font-size: 14px; line-height: 1.7;">Hi {name},</p>
        <p style="color: #999; font-size: 14px; line-height: 1.7;">{message}</p>
        <div style="margin: 24px 0; padding: 16px; background: rgba(212,175,55,0.06); border: 1px solid rgba(212,175,55,0.15); border-radius: 8px;">
          <span style="color: #D4AF37; font-size: 12px; letter-spacing: 2px;">STATUS: {status.upper()}</span>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">&copy; 2026 Velonyx Systems. Your Legacy, Engineered With Precision.</p>
      </div>
    </div>
    """


def build_welcome_email(name):
    """Build a branded welcome email."""
    return f"""
    <div style="font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #08080A, #0C0C0F); padding: 36px 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="color: #D4AF37; font-size: 10px; font-weight: 700; letter-spacing: 3px;">VELONYX SYSTEMS</span>
        </div>
        <h1 style="color: #F5F5F5; font-size: 22px; margin: 0 0 8px;">Welcome to Velonyx Systems</h1>
        <div style="height: 2px; width: 40px; background: linear-gradient(90deg, #D4AF37, transparent); margin-bottom: 20px;"></div>
        <p style="color: #999; font-size: 14px; line-height: 1.7;">Hi {name},</p>
        <p style="color: #999; font-size: 14px; line-height: 1.7;">Thank you for choosing Velonyx Systems. Your client portal is ready.</p>
        <p style="color: #999; font-size: 14px; line-height: 1.7;">Log in to upload your brand assets — logos, photos, videos, and documents. We'll use everything you provide to build your premium website.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="https://velonyxsystems.com/portal/" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D4AF37, #E8C547); color: #08080A; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-decoration: none; border-radius: 6px;">LOG IN TO YOUR PORTAL</a>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">&copy; 2026 Velonyx Systems. Your Legacy, Engineered With Precision.</p>
      </div>
    </div>
    """
