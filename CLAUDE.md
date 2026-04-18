# Velonyx Systems — Claude Code Handoff

**Local path (this machine):** `/Users/apple/Cursor-Claude`  
**GitHub:** `carlitolamar1989/velonyx-portfolio` (default branch: `main`)  
**Live site:** `https://www.velonyxsystems.com` / `https://velonyxsystems.com`  
**Primary audience:** SMBs (barbershops, fitness, creatives, service businesses) buying luxury-positioned websites with payments and financing messaging.

---

## Project Overview

- **What it is:** Marketing and conversion site for **Velonyx Systems** — 4-tier web design packages, Stripe checkout flows (deposit vs BNPL), monthly Care subscription upsells, financing explainer, Calendly booking, portfolio demos, full legal pack (Privacy/Terms/MSA/SOW/SMS).
- **Tech stack:** Static **HTML/CSS/JS** (no React, no npm build). **GitHub Pages** for hosting. **Stripe Payment Links** (`buy.stripe.com/...`) for build packages and recurring Care subscriptions. **Calendly** embed for consultations. **Google Analytics 4** — **gated by CCPA cookie consent banner** via `/assets/cookie-consent.js`. Optional **AWS Lambda** code exists locally for Stripe Checkout sessions and (per `BUSINESS-HUB.md`) a legacy booking pipeline — **production checkout does not depend on that Lambda** today.
- **Status:** Launch-ready on branch `claude/zen-bouman`. 4-tier pricing live, Care subscriptions with live Stripe links, legal pack complete, cookie banner functional, consent checkboxes on public forms. Awaiting manual QA + explicit approval before merge to `main`.

---

## Architecture

- **Frontend ↔ backend:** No API calls on the main purchase path. `checkout.html` redirects the browser to **Stripe Payment Links** via inline JS config (`STRIPE_DEPOSIT_LINKS`, `STRIPE_BNPL_LINKS`, maintenance URLs).
- **AWS (optional / partial):**
  - **`velonyx-website/backend/stripe_lambda.py`** — intended pattern: Lambda + API Gateway POST `/checkout`, env `STRIPE_SECRET_KEY`. **This folder is `.gitignore`d** — not published to GitHub; keep a secure backup if you use it.
  - **Booking (documented in `BUSINESS-HUB.md`):** Lambda `velonyx-booking`, API Gateway, SES, Twilio — verify in AWS console what is still active; main funnel uses **Calendly** on `book.html`.
- **Third-party:** Stripe (Payment Links + subscriptions), Calendly, Google Analytics, Twilio/SES (if legacy booking Lambda remains deployed).
- **Database:** None.

---

## Tech Stack

| Layer | Details |
|--------|---------|
| UI | HTML5, CSS (custom properties, animations), vanilla JS |
| Fonts | Google Fonts (Space Grotesk, DM Sans) |
| Payments | Stripe Payment Links (no Stripe.js on site for the primary flow) |
| Analytics | gtag / GA4 (`G-F838ZEJ22J` in page source) |
| Scheduling | Calendly inline widget |
| Hosting | GitHub Pages |
| CI | `.github/workflows/deploy.yml` — upload repo root as Pages artifact on push to `main` |
| Tooling | Python 3 + Pillow for `scripts/remove_logo_bg.py` (logo PNG from JPG) |
| Package manager | **None** for the static site. Lambda: **pip** + `stripe` if you package `stripe_lambda.zip` per file comments |

**Versions:** Pin in AWS/Python only when packaging Lambda; static site has no `package.json`.

---

## Key Commands

| Task | Command / action |
|------|------------------|
| Install (logo script only) | `pip install Pillow` (if regenerating logo) |
| Regenerate transparent logo | `python3 scripts/remove_logo_bg.py` (reads `assets/vs-logo-2026.jpg` → writes `assets/vs-logo-2026.png`) |
| Dev server | Open `index.html` in a browser or run any static server, e.g. `python3 -m http.server 8080` from repo root |
| Build | N/A |
| Deploy | `git push origin main` → GitHub Actions deploys to Pages |
| Tests | None configured |

---

## Folder Structure

```
Cursor-Claude/
├── index.html              # Main landing — 4 build tiers + 4 Care tiers
├── checkout.html           # 4 plan cards + deposit/BNPL + Care upsell (4 tiers)
├── financing.html          # BNPL / pay-over-time messaging + Enterprise note
├── book.html               # Calendly embed (supports ?tier=enterprise)
├── privacy.html            # Privacy Policy (CCPA)
├── terms.html              # Terms of Service
├── msa.html                # Master Services Agreement reference
├── sow.html                # Statement of Work template reference
├── sms-terms.html          # SMS terms (Twilio compliance)
├── sms-opt-in.html         # SMS opt-in consent form
├── 404.html                # Brand-styled 404
├── assets/
│   ├── cookie-consent.js   # CCPA banner + GA4 gate (loaded on all public pages)
│   ├── favicon-32.png, favicon-180.png
│   └── vs-logo-*.png
├── client-demos/           # barber, fitness, photo — portfolio demos
├── platform/               # Client Connect: terraform + lambdas + portal + admin
├── sitemap.xml, robots.txt, CNAME
├── .github/workflows/deploy.yml
├── velonyx-website/        # Mirror (keep in sync)
└── CLAUDE.md               # This file
```

---

## Pricing

### Build tiers (one-time, all include 30-day support)

| Tier | Price | Delivery | Key differentiators |
|---|---|---|---|
| **Starter** | $1,500 | 5–7 days | Single-page site + booking + payments |
| **Growth** | $3,500 | 7–10 days | Multi-page + logo + BNPL + SMS automation |
| **Premium** | $6,000 | 10–14 days | Everything in Growth + brand video + Client Portal + unlimited pages |
| **Enterprise** | **Starting at $12,000** (Contact Us → `/book.html?tier=enterprise`) | Custom | Multi-user/multi-location Client Portal, custom integrations, dedicated PM, HIPAA-ready infra available, quarterly strategy reviews |

### Care subscriptions (monthly, required to keep site live)

| Tier | Price | Stripe Payment Link |
|---|---|---|
| **Standard Care** | $125/mo | `https://buy.stripe.com/6oU7sN1N33CicYe2aecs80b` |
| **Growth Care** | $225/mo | `https://buy.stripe.com/bJe3cx4Zf2ye6zQdSWcs80c` |
| **Premium Care** | $325/mo | `https://buy.stripe.com/7sYbJ34ZfegWaQ6dSWcs80d` |
| **Enterprise Care** | **Custom — Contact Us** (no Stripe link; Carlos invoices manually via Stripe Invoicing per engagement) | — |

### Payment processing

- **Stripe Payment Links** for cards, Apple Pay, Google Pay on all build tiers (full-pay, 50% deposit, BNPL) and recurring Care subscriptions.
- **BNPL (Affirm / Klarna / Afterpay)** available via Stripe on build **pay-in-full only** — NOT for deposits, NOT for recurring Care subscriptions.
- **Enterprise pricing** is always manual — Stripe Invoicing on a case-by-case basis. No preset Payment Link exists for Enterprise build or Enterprise Care.
- **Pay-in-full discount:** 10% off one-time build fee.

### Legacy maintenance links (archived, not rendered)

Preserved in HTML comments for rollback only. Not referenced by any live UI:
- `https://buy.stripe.com/3cI14p2R71uae2ig14cs806` (old $150/mo Standard Maintenance)
- `https://buy.stripe.com/bJe4gBgHXgp44rIeX0cs807` (old $300/mo Priority Retainer)

---

## Compliance & Consent

- **Legal pages:** `/privacy.html`, `/terms.html`, `/msa.html`, `/sow.html`, `/sms-terms.html`. All linked in footer of every public page.
- **CCPA cookie banner:** `/assets/cookie-consent.js` loads on all 10 public pages with equal-weight Accept / Reject buttons. GA4 (`G-F838ZEJ22J`) does NOT load until user explicitly accepts. Choice stored in `localStorage.velonyx_cookie_consent`.
- **Consent checkboxes (required, not pre-checked):**
  - `index.html` booking modal — Privacy Policy + Terms checkbox AND separate SMS consent checkbox.
  - `sms-opt-in.html` — SMS consent (Twilio requirement) AND separate Privacy/Terms checkbox.
- **Intentionally excluded:** `client-demos/*` (portfolio demos), `platform/portal/*` and `platform/admin/*` (authenticated internal), `book.html` Calendly embed (Calendly handles its own consent flow).

---

## Environment Variables

Do **not** commit secrets. Examples of where they appear:

| Variable / secret | Used by | Source |
|-------------------|---------|--------|
| `STRIPE_SECRET_KEY` | Optional Lambda checkout | Stripe Dashboard → API keys |
| Twilio Account SID / Auth Token | Legacy booking SMS (if deployed) | Twilio Console |
| AWS SES / SMTP credentials | Legacy booking email (if deployed) | AWS SES / IAM |
| Google Analytics | Public in HTML | GA4 property |

Stripe **Payment Link** URLs are **public** by design (in `checkout.html`).

---

## Current Issues & TODOs

- **Post-deploy Stripe task:** Once `claude/zen-bouman` is merged to `main` and `/terms.html` is live at `velonyxsystems.com/terms.html`, enable "Require customers to accept your terms of service" on all 14 Payment Links (3 full-pay, 3 deposit, 3 BNPL, 3 Care, 2 legacy maintenance optional). Terms URL: `https://velonyxsystems.com/terms.html`.
- **BNPL:** Confirm Klarna/Affirm/Afterpay enabled on the Stripe account for those links.
- **`velonyx-website/backend/`:** Ignored by git — back up Lambda code and env outside the repo if you rely on it.
- **`BUSINESS-HUB.md`:** May describe booking Lambda paths; live funnel emphasizes **Calendly** — reconcile docs with reality in AWS.
- **Client Connect end-to-end test:** Intake form → Lambda → DynamoDB → SES confirmation email hasn't been run with live AWS creds in this session. Test before relying on production intake.

---

## Deployment

- **Mechanism:** GitHub Actions workflow `Deploy to GitHub Pages` on every push to `main` (full repository root uploaded as the site artifact).
- **Custom domain:** Repo file `CNAME` is `velonyxsystems.com`. In **GitHub** → repo **Settings → Pages**: attach the custom domain and enable **Enforce HTTPS** once DNS validates.
- **Repo:** Single repo; no monorepo packages. **Primary site files live at repository root**, not only under `velonyx-website/`.

### Domain (Namecheap)

- **Registrar:** Namecheap holds **`velonyxsystems.com`** (not configured inside this repo beyond `CNAME` for Pages).
- **DNS:** At Namecheap (Advanced DNS), records must match **GitHub Pages** requirements: apex **A** records to GitHub’s IPs, **`www`** **CNAME** to `<user>.github.io` (see [GitHub: Configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)). Add any **TXT** records GitHub shows for domain verification if prompted.
- **HTTPS:** Provisioned by GitHub once DNS propagates; “DNS check in progress” / mixed `http` vs `https` is usually propagation or wrong `www` vs apex — align **Search Console / sitemap** with the canonical host (e.g. `www`).

### Twilio

- **Purpose:** Business phone **(877) 317-8643** — e.g. call forwarding to your cell and (if still wired) **SMS** from the legacy **AWS Lambda booking** flow (`BUSINESS-HUB.md` documents API Gateway, SES, and Twilio together).
- **Not in repo:** Twilio **Account SID**, **Auth Token**, and phone number config live in the **Twilio Console** (`https://console.twilio.com`) and in **Lambda environment variables** if that stack is deployed — never commit them.
- **Operational detail:** Table URLs, Lambda name, and AWS sign-in link are in **`BUSINESS-HUB.md`**; primary public booking today is **Calendly** on `book.html`.

---

## Session Pointers for Claude Code

1. Prefer editing **root** `index.html`, `checkout.html`, `financing.html`, `book.html` for production parity with `velonyxsystems.com`.
2. After changing Stripe products/prices, update **Payment Link URLs** and any copy in `checkout.html` / `index.html` that references dollar amounts.
3. Regenerate logo PNG after replacing `assets/vs-logo-2026.jpg`, then commit both if JPG is still the source of truth.
