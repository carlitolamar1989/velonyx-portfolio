# Velonyx Platform — Architecture

## Overview

The Velonyx Platform is a full-stack cloud system that powers two interfaces:

1. **Client Portal** — Where clients log in, upload assets, track project progress
2. **Admin Dashboard** — Where Carlito manages all clients, views uploads, updates project status

Both share the same AWS backend.

## AWS Services

| Service | Purpose |
|---------|---------|
| **Cognito** | Authentication — client login, admin login, password reset |
| **S3** | File storage — logos, photos, videos, documents per client |
| **DynamoDB** | Database — client profiles, project status, checklist progress |
| **Lambda** | Business logic — all API handlers (Python 3.12 in Docker) |
| **API Gateway** | REST API — connects frontend to Lambda |
| **SES** | Email notifications — project status updates, welcome emails |
| **Twilio** | SMS notifications — upload confirmations, reminders |
| **CloudWatch** | Monitoring — logs, error alerts |

## Infrastructure as Code

All AWS resources defined in **Terraform** (`platform/terraform/`).

One command creates the entire platform:
```
cd platform/terraform
terraform init
terraform apply
```

## API Endpoints

| Method | Path | Lambda | Description |
|--------|------|--------|-------------|
| POST | /auth/register | auth | Create new client account |
| POST | /auth/login | auth | Client login (Cognito) |
| GET | /project | projects | Get client's project info + checklist |
| PUT | /project | projects | Update project info (admin) |
| POST | /upload-url | uploads | Generate presigned S3 upload URL |
| GET | /files | uploads | List uploaded files by category |
| DELETE | /files/{key} | uploads | Delete an uploaded file |
| POST | /notify | notifications | Send status update to client |

## S3 Bucket Structure

```
velonyx-client-assets/
├── {cognito-user-id}/
│   ├── logos/
│   ├── photos/
│   ├── videos/
│   ├── documents/
│   └── inspiration/
```

## DynamoDB Tables

### ClientProjects
- **Partition Key:** `clientId` (String) — Cognito user ID
- **Attributes:**
  - businessName, contactEmail, contactPhone
  - packageType (Starter/Growth/Premium)
  - amountPaid, paymentStatus
  - projectStatus (intake/design/review/revision/launched)
  - checklist (map of category → uploaded file count)
  - brandColors, socialLinks, businessDescription
  - notes (admin notes)
  - createdAt, updatedAt

## Docker

Each Lambda is a Docker container:
```
platform/lambdas/auth/
├── Dockerfile
├── handler.py
└── requirements.txt
```

Built and pushed to ECR, referenced by Terraform.

## Folder Structure

```
platform/
├── ARCHITECTURE.md          ← This file
├── terraform/               ← All infrastructure as code
│   ├── main.tf              ← Provider, backend config
│   ├── cognito.tf           ← User pool, app client
│   ├── dynamodb.tf          ← ClientProjects table
│   ├── s3.tf                ← Asset bucket + policies
│   ├── lambda.tf            ← All Lambda functions
│   ├── api-gateway.tf       ← REST API + routes
│   ├── iam.tf               ← Roles + permissions
│   ├── variables.tf         ← Configurable values
│   └── outputs.tf           ← API URL, bucket name, etc.
├── lambdas/
│   ├── auth/                ← Authentication handler
│   ├── uploads/             ← File upload + listing handler
│   ├── projects/            ← Project CRUD handler
│   └── notifications/       ← Email/SMS handler
├── portal/                  ← Client-facing upload dashboard
│   ├── index.html           ← Login page
│   ├── dashboard.html       ← Upload dashboard
│   ├── style.css
│   └── app.js
└── admin/                   ← Admin dashboard (your view)
    ├── index.html
    ├── dashboard.html
    ├── style.css
    └── app.js
```
