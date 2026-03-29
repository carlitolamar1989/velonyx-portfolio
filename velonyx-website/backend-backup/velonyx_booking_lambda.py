"""
Velonyx Systems booking handler.
Receives form data from API Gateway, sends SMS via Twilio, email via SES.

BACKUP — copied from AWS Lambda console (velonyx-booking) on 2026-03-29
"""

import json
import os
import urllib.request
import urllib.parse
import base64
import boto3


def lambda_handler(event, context):
    """
    Velonyx Systems booking handler.
    Receives form data from API Gateway, sends SMS via Twilio, email via SES.
    """
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    }

    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        body = json.loads(event.get("body", "{}"))

        first_name = body.get("firstName", "").strip()
        last_name = body.get("lastName", "").strip()
        phone = body.get("phone", "").strip()
        email = body.get("email", "").strip()
        service = body.get("service", "Not specified")
        description = body.get("description", "No description provided")

        if not all([first_name, last_name, phone, email]):
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"success": False, "message": "Missing required fields"})
            }

        phone_e164 = format_phone(phone)

        sms_sent = send_sms(first_name, phone_e164)

        email_sent = send_admin_email(
            first_name, last_name, phone, email, service, description
        )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "success": True,
                "message": "Booking received",
                "sms_sent": sms_sent,
                "email_sent": email_sent
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"success": False, "message": "Server error"})
        }


def format_phone(phone):
    """Convert phone input to E.164 format (+1XXXXXXXXXX)."""
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) == 10:
        return f"+1{digits}"
    if len(digits) == 11 and digits.startswith("1"):
        return f"+{digits}"
    return f"+{digits}"


def send_sms(first_name, phone_e164):
    """Send confirmation SMS to client via Twilio."""
    account_sid = os.environ["TWILIO_ACCOUNT_SID"]
    auth_token = os.environ["TWILIO_AUTH_TOKEN"]
    from_number = os.environ["TWILIO_PHONE_NUMBER"]

    message_body = (
        f"Hi {first_name}! Thank you for choosing Velonyx Systems. "
        f"We received your consultation request and will reach out to you "
        f"within 24 hours. If you need immediate assistance, reply to this "
        f"message or email admin@velonyxsystems.com. — Velonyx Systems"
    )

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"

    data = urllib.parse.urlencode({
        "To": phone_e164,
        "From": from_number,
        "Body": message_body
    }).encode("utf-8")

    credentials = base64.b64encode(f"{account_sid}:{auth_token}".encode()).decode()

    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Basic {credentials}")

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            print(f"SMS sent: {result.get('sid')}")
            return True
    except Exception as e:
        print(f"SMS failed: {str(e)}")
        return False


def send_admin_email(first_name, last_name, phone, email, service, description):
    """Send booking notification email to admin via AWS SES."""
    ses = boto3.client("ses", region_name="us-east-1")

    subject = f"New Booking: {first_name} {last_name} — {service}"

    html_body = f"""\
    <div style="font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #08080A 0%, #0C0C0F 100%); border-radius: 12px; overflow: hidden;">

            <div style="background: linear-gradient(135deg, #1A1508 0%, #0C0C0F 50%, #0C0C0F 100%); padding: 32px 40px;">
                <div style="display: inline-block; border: 1px solid #D4AF37; border-radius: 8px; padding: 6px 16px;">
                    <span style="color: #BF953F; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">NEW BOOKING</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF; margin-top: 16px;">{first_name} {last_name}</h1>
                <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #D4AF37, #F0D060); margin-top: 12px;"></div>
            </div>

            <div style="padding: 36px 40px;">
                <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
                    <tr>
                        <td style="padding: 16px 20px; color: #706E68; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; width: 120px; vertical-align: top;">SERVICE</td>
                        <td style="padding: 16px 20px; color: #F7E17B; font-size: 16px; font-weight: 600;">{service}</td>
                    </tr>
                    <tr>
                        <td style="padding: 16px 20px; color: #706E68; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; vertical-align: top;">EMAIL</td>
                        <td style="padding: 16px 20px; border-top: 1px solid #1A1A1F;">
                            <a href="mailto:{email}" style="color: #F7E17B; font-size: 16px; text-decoration: none;">{email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 16px 20px; color: #706E68; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; vertical-align: top;">PHONE</td>
                        <td style="padding: 16px 20px; border-top: 1px solid #1A1A1F;">
                            <span style="display: inline-block; background: linear-gradient(135deg, #D4AF37, #F0D060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 16px; font-weight: 600;">{phone}</span>
                        </td>
                    </tr>
                </table>

                <div style="margin-top: 20px; background: linear-gradient(165deg, #1A1508 0%, #0C0C0F 50%, #0C0C0F 100%); border-radius: 8px; padding: 20px; border: 1px solid #1A1A1F;">
                    <p style="margin: 0 0 10px 0; color: #706E68; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">DESCRIPTION</p>
                    <p style="margin: 0; color: #B0AEA6; font-size: 14px; line-height: 1.6;">{description}</p>
                </div>

                <div style="padding: 24px 40px 36px; text-align: center; border-top: 1px solid #1A1A1F; margin-top: 24px;">
                    <div style="display: inline-block; width: 8px; height: 8px; background: linear-gradient(135deg, #D4AF37, #F0D060); border-radius: 50%; margin-bottom: 12px;"></div>
                    <span style="color: #34D399; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-left: 8px;">SMS CONFIRMATION SENT</span>
                    <div style="margin-top: 16px;">
                        <span style="color: #706E68; font-size: 11px;">&copy; 2026 Velonyx Systems</span>
                        <span style="color: #D4AF37; font-size: 11px; font-weight: 600; margin-left: 8px;">velonyxsystems.com</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
    """

    try:
        ses.send_email(
            Source="admin@velonyxsystems.com",
            Destination={"ToAddresses": ["admin@velonyxsystems.com"]},
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {
                    "Html": {"Data": html_body, "Charset": "UTF-8"}
                }
            }
        )
        print("Admin email sent")
        return True
    except Exception as e:
        print(f"Email failed: {str(e)}")
        return False
