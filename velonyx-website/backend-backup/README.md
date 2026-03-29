# Backend Backup — Velonyx Systems

Local-only backup of AWS Lambda source code. **No secrets in these files.**

## Files

| File | AWS Lambda Name | Purpose |
|------|----------------|---------|
| `stripe_lambda.py` | (Stripe checkout) | Creates Stripe Checkout Sessions — POST /checkout via API Gateway |

## Still in AWS Only (NOT backed up here yet)

| AWS Lambda Name | Purpose | How to Back Up |
|----------------|---------|----------------|
| `velonyx-booking` | Processes booking form → sends SMS (Twilio) + email (SES) | Go to AWS Console → Lambda → `velonyx-booking` → copy the code and save it here as `booking_lambda.py` |

## AWS Resources

- **API Gateway:** `https://hkb4uflm35.execute-api.us-east-1.amazonaws.com/book`
- **AWS Console:** `https://964604399458.signin.aws.amazon.com/console`
- **Twilio Console:** `https://console.twilio.com`
- **Twilio Number:** (877) 317-8643

## Environment Variables (set in AWS Lambda, never committed)

- `STRIPE_SECRET_KEY` — Stripe Dashboard → API keys
- Twilio Account SID / Auth Token — Twilio Console
- SES / SMTP credentials — AWS IAM
