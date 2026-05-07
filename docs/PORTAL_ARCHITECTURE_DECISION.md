# Velonyx Systems — Portal Architecture Decision

**Date:** 2026-05-06
**Decided by:** Carlos Glover (Founder/Operator) + Claude (advisor)
**Status:** Decision recorded. Implementation will follow when Carlos is ready to scope the next major build cycle.

---

## Context

The Velonyx site has carried **two parallel "Client Portal + Admin Dashboard" systems** for several months:

1. **`platform/`** — A full-stack AWS-native design: Cognito user pool, DynamoDB `client_projects` table, S3 bucket, three Dockerized Lambda handlers (uploads, projects, notifications), API Gateway HTTP API with JWT authorizer, all wired in Terraform. Static HTML shells (`platform/portal/`, `platform/admin/`) reference Cognito client IDs and API endpoints.
   - **Status:** Designed, never deployed. No `.terraform/` state, no AWS resources provisioned.
   - **Origin:** Built as a learning lab for Carlos's transition from law enforcement to cloud devops. Architecture document at `platform/ARCHITECTURE.md`.

2. **`velonyx-trades-template/`** — A live, deployed Next.js 14 (App Router) + Supabase + Stripe + Twilio + Resend application. Production URL: `gdk.velonyxsystems.com` (Vercel). Already has admin sub-routes for `customers, settings, payments, invoices, sms, leads, contracts, pricebook, team, jobs, photos, connect`, plus public `intake/`, `pay/[id]/`, `sign/[id]/` routes and a working webhook surface.
   - **Status:** Deployed, used as the live GDK demo, half-built admin UI.
   - **Origin:** Started as a vertical demo template, evolved into the de-facto production portal foundation.

The duplication created confusion: design docs pointed to `platform/`, but real customer flows were happening on `velonyx-trades-template/`. Carlos asked for a final call.

---

## Decision

**Extend `velonyx-trades-template/` into the official Velonyx Client Portal + Admin Portal foundation.**
**Archive `platform/` as a learning-lab artifact, not production infrastructure.**

---

## Why `velonyx-trades-template/` wins

1. **It's already deployed.** Vercel pipeline is working. The gdk subdomain demo is live. Zero migration cost — extending it is iteration, not greenfield rebuilding.

2. **Carlos's stated career goal is AWS + Terraform + Docker + Python proficiency.** That's preserved by keeping `platform/` AS A LEARNING LAB — Carlos can deploy it to AWS at his leisure to practice and have the Terraform state on his portfolio. But the customer-facing portal should NOT be a learning lab. Customers shouldn't suffer outages because a junior dev is debugging Cognito.

3. **The trades-template stack handles the same problem space with less operational burden.**
   - Auth: Supabase magic-link or password (Cognito is more flexible but more complex; Supabase's free tier covers Velonyx's volume for the foreseeable future).
   - DB: Supabase Postgres (Cognito + DynamoDB requires more glue code; Postgres is simpler for relational data like customer-job relationships).
   - File storage: Supabase Storage (S3 also works, but adds AWS account management; not needed at this scale).
   - Notifications: Twilio + Resend already wired in trades-template (vs. SES + Twilio in platform/).
   - Cost: Supabase free tier + Vercel Hobby tier = $0/month for the next 50 customers. AWS at the same scale would cost $40-100/month minimum (Cognito MAU pricing + DynamoDB minimum throughput + Lambda invocations + API Gateway requests).

4. **Most of the admin sub-routes already exist** in trades-template's `(admin)/admin/*` route group. The unfinished ones can be filled in incrementally as customers demand them, rather than designing all of it upfront on AWS.

5. **TypeScript + zod give type-safety the static HTML portal will never have.** The platform/ HTML files are vanilla JS that talk to API Gateway via fetch — fine for prototypes, fragile for production.

6. **Single deployment surface.** Right now the marketing site is on GitHub Pages and the gdk demo is on Vercel. Once trades-template extends into the official portal, Carlos can also migrate the marketing site to Vercel — single platform, single dashboard, single deploy log. Simplifies operations.

---

## What this means for `platform/`

`platform/` is **archived as a learning lab**. Concretely:

- It stays in the velonyx-portfolio repo for now (no immediate value to deleting)
- A small `platform/README.md` is added to make its status crystal clear to future-you and any hiring manager looking at the repo as part of Carlos's portfolio: *"Designed but unapplied. Lives here as evidence of cloud devops practice — Cognito + DynamoDB + Lambda + API Gateway in Terraform. Production portal lives in `velonyx-trades-template/`."*
- Carlos can later `terraform apply` it to a personal AWS account purely to have a real Cognito + DynamoDB stack on his resume, without affecting Velonyx customers.
- If Velonyx ever outgrows Supabase (>~10K MAU or strict compliance requirements), `platform/` is the migration plan — already designed, just needs the AWS apply.

---

## What this means for the live portal customers will eventually use

Velonyx customers will get their portal at:

- **Customer-facing:** `app.velonyxsystems.com` (or similar subdomain) → Vercel project = a fork/extension of `velonyx-trades-template/`'s `(admin)` route group
- **Each customer's own branded surface:** continues to be a per-customer Vercel deploy (one site per customer, like `gdk.velonyxsystems.com` is GDK's). Their admin UI lives at their own subdomain.

Two surfaces:
- `gdk.velonyxsystems.com` (live today) — customer-facing public site + admin
- `app.velonyxsystems.com` (future) — Velonyx's internal admin where Carlos manages all customers in one place

Both share the same Supabase backend, separated by RLS policies on tenant ID.

---

## Build sequence (when Carlos is ready)

This is **not** part of the current cleanup sweep. It's the next major build cycle.

1. **Move `velonyx-trades-template/`** out of the velonyx-portfolio working tree (already done as part of the May 2026 cleanup — it's now at `/Users/apple/Cursor-Claude-trades-template/`).
2. **Open a new GitHub repo** specifically for the Velonyx Portal foundation (fork or rename of velonyx-trades-template).
3. **Build out the half-finished admin sub-routes** in priority order: `customers` → `payments` → `invoices` → `jobs` → `pricebook` → the rest.
4. **Add multi-tenancy:** RLS policies on Supabase tables, tenant-aware routing, customer-onboarding flow that provisions a new tenant on Founding Member purchase.
5. **PWA wrapping:** add manifest.webmanifest, service worker, "Install to Home Screen" prompt — so Carlos's customers can use their admin dashboard as an app on their phone (the trades operators are mostly mobile).
6. **Marketing-site → Vercel migration:** consolidate hosting once the portal foundation is stable.

Estimated scope: 3-6 focused weeks of work, broken into phases. Worth scoping with a separate planning session when Carlos has the bandwidth.

---

## Out of scope for this decision

- Specific Supabase schema design — done at build time
- Stripe → Supabase webhook wiring for customer-onboarding
- Brand-customization framework (every customer's portal needs the same skeleton with tenant-specific theming)
- Mobile app (React Native / Expo) — way out beyond MVP

---

## Confirmation

The Velonyx Client Portal foundation is **`velonyx-trades-template/`** (now at `/Users/apple/Cursor-Claude-trades-template/`).
**`platform/`** is preserved in the velonyx-portfolio repo as a documented learning-lab artifact.

This document is the canonical record. If a future me / future-Carlos / future-engineer asks "wait, why are there two portal stacks?" — point them here.
