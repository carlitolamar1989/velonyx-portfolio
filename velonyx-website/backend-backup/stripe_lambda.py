"""
Velonyx Systems — Stripe Checkout Lambda
AWS Lambda function that creates a Stripe Checkout Session and returns a URL.

Deploy steps:
  1. pip install stripe -t ./package && cd package && zip -r ../stripe_lambda.zip . && cd ..
  2. zip -g stripe_lambda.zip stripe_lambda.py
  3. Upload to AWS Lambda (Python 3.12 runtime)
  4. Set environment variable: STRIPE_SECRET_KEY = sk_live_...
  5. Add API Gateway trigger: POST /checkout
  6. Paste the API Gateway endpoint URL into checkout.html → STRIPE_API_URL
"""

import json
import os
import stripe

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

# Prices in cents — update after creating Products in Stripe Dashboard
PRICES = {
    "starter": {
        "name": "Velonyx Starter Package",
        "amount": 150000,       # $1,500.00
        "description": "Single-page custom website, contact form, SSL, custom domain. Delivered in 5–7 days.",
    },
    "growth": {
        "name": "Velonyx Growth Package",
        "amount": 350000,       # $3,500.00
        "description": "Multi-page site, payment integration, booking system. Delivered in 7–10 days.",
    },
    "premium": {
        "name": "Velonyx Premium Package",
        "amount": 600000,       # $6,000.00
        "description": "Full digital system, automation, financing integration, unlimited pages. Delivered in 10–14 days.",
    },
}

DOMAIN = "https://velonyxsystems.com"

CORS_HEADERS = {
    "Access-Control-Allow-Origin":  DOMAIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def lambda_handler(event, context):
    # Handle CORS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        plan = body.get("plan", "").lower()

        if plan not in PRICES:
            return _error(400, "Invalid plan. Choose: starter, growth, or premium.")

        price_data = PRICES[plan]
        customer_email = body.get("email", "")

        session_kwargs = {
            "payment_method_types": ["card"],
            "line_items": [{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": price_data["amount"],
                    "product_data": {
                        "name": price_data["name"],
                        "description": price_data["description"],
                    },
                },
                "quantity": 1,
            }],
            "mode": "payment",
            "success_url": f"{DOMAIN}/checkout-success.html?plan={plan}&session_id={{CHECKOUT_SESSION_ID}}",
            "cancel_url":  f"{DOMAIN}/checkout.html?plan={plan}&cancelled=1",
            "metadata": {
                "plan": plan,
                "source": "velonyxsystems.com",
            },
            "payment_intent_data": {
                "description": f"Velonyx Systems — {price_data['name']}",
                "statement_descriptor_suffix": "VELONYX",
            },
        }

        if customer_email:
            session_kwargs["customer_email"] = customer_email

        session = stripe.checkout.Session.create(**session_kwargs)

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"url": session.url}),
        }

    except stripe.error.StripeError as e:
        return _error(402, str(e.user_message))
    except Exception as e:
        return _error(500, "Internal server error. Please try again.")


def _error(status, message):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": message}),
    }
