# `/platform/` — Velonyx Cloud DevOps Learning Lab

> **⚠ Status:** Designed but **never deployed**. Production portal lives elsewhere — see below.

## TL;DR for visitors

If you opened this folder thinking it's the live Velonyx Client Portal, **it's not.** This is a Terraform + AWS Lambda + Cognito reference design that was built as a cloud devops exercise. It was never `terraform apply`'d.

The actual production portal is built on **Next.js 14 + Supabase + Vercel** and lives in a separate repository (forked/extended from `velonyx-trades-template/`, currently demoed at https://gdk.velonyxsystems.com). For the why, see [`/docs/PORTAL_ARCHITECTURE_DECISION.md`](../docs/PORTAL_ARCHITECTURE_DECISION.md).

## What's in here

| Path | What it is |
|---|---|
| `ARCHITECTURE.md` | Full design doc: AWS services, API endpoints, S3 bucket layout |
| `admin/index.html` | Admin login page wired to Cognito Hosted UI / InitiateAuth |
| `portal/index.html` | Client login page (same Cognito flow) |
| `portal/dashboard.html` | Client dashboard with file upload + project status checklist |
| `lambdas/uploads/` | Python 3.12 Lambda — presigned S3 URL generator, file list/delete |
| `lambdas/projects/` | Python 3.12 Lambda — project CRUD |
| `lambdas/notifications/` | Python 3.12 Lambda — SES + Twilio fan-out |
| `terraform/` | Cognito user pool, DynamoDB `client_projects` table, S3, IAM, API Gateway HTTP API w/ JWT authorizer |

## Why it exists

Carlos is transitioning from law enforcement to cloud devops. This stack is portfolio-grade evidence of:
- AWS Cognito user pools + IAM
- DynamoDB schema design (composite keys, GSI patterns)
- Lambda containers + API Gateway integration
- Terraform module composition
- Multi-Lambda architecture with shared auth

## How to deploy this if you want a real Cognito + DynamoDB stack on your resume

```bash
cd terraform
terraform init
terraform plan
terraform apply   # provisions Cognito user pool, DynamoDB table, S3 bucket,
                  # API Gateway, 3 Lambdas, IAM roles
```

Cost at idle: ~$1-2/month (DynamoDB on-demand minimum + Cognito MAU under 50K free tier + Lambda invocations under free tier). Tear down with `terraform destroy` when not in use.

## Why it's not the production portal

Reasons are documented at `/docs/PORTAL_ARCHITECTURE_DECISION.md`. Short version:
- Already had a working Next.js + Supabase deploy at `gdk.velonyxsystems.com`
- Supabase + Vercel = $0/month at current scale; AWS = $40-100/month minimum
- Carlos's career goals are served by *also* having this Terraform stack as a portfolio artifact, not by routing customers through it

## If Velonyx ever needs to migrate to AWS

(Compliance reasons, scale beyond Supabase free tier, etc.)

This `platform/` directory is the migration plan — already designed. Steps would be:
1. `terraform apply` from a Velonyx Systems LLC AWS account
2. Schema migrate Supabase → DynamoDB (write a one-shot script)
3. Update the Next.js app (now `velonyx-trades-template/` extended) to point at the new endpoints
4. Cut over DNS

Until then: this folder is a museum exhibit, not a live system.
