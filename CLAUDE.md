# Velonyx Systems — Claude Code Handoff

**Local path (this machine):** `/Users/apple/Cursor-Claude`  
**GitHub:** `carlitolamar1989/velonyx-portfolio` (default branch: `main`)  
**Live site:** `https://www.velonyxsystems.com` / `https://velonyxsystems.com`  
**Primary audience:** SMBs (barbershops, fitness, creatives, service businesses) buying luxury-positioned websites with payments and financing messaging.

---

## Project Overview

- **What it is:** Marketing and conversion site for **Velonyx Systems** — web design packages, Stripe checkout flows (deposit vs BNPL), financing explainer page, Calendly booking, portfolio demos.
- **Tech stack:** Static **HTML/CSS/JS** (no React, no npm build). **GitHub Pages** for hosting. **Stripe Payment Links** (`buy.stripe.com/...`) for packages and maintenance subscriptions. **Calendly** embed for consultations. **Google Analytics 4** (measurement ID in HTML). Optional **AWS Lambda** code exists locally for Stripe Checkout sessions and (per `BUSINESS-HUB.md`) a legacy booking pipeline — **production checkout does not depend on that Lambda** today.
- **Status:** Live. Packages, deposits, BNPL links, maintenance upsell links, SEO (`sitemap.xml`, `robots.txt`), and booking page are implemented. BNPL methods (Klarna/Affirm/Afterpay) may still be subject to **Stripe account approval**. Duplicate `velonyx-website/` tree is kept roughly in sync with root pages for reference.

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
├── index.html              # Main landing (canonical public site entry)
├── checkout.html           # Plans + deposit/BNPL + maintenance upsell
├── financing.html          # BNPL / pay-over-time messaging
├── book.html               # Calendly embed
├── assets/                 # Logos (vs-logo-2026.png primary), legacy PNGs
├── client-demos/           # barber, fitness, photo — portfolio demos + GA
├── scripts/                # remove_logo_bg.py
├── sitemap.xml, robots.txt, CNAME   # SEO + Pages custom domain
├── .github/workflows/deploy.yml
├── velonyx-website/        # Mirror: index, checkout, financing + assets (keep in sync if used)
├── velonyx-website/backend/# gitignored — Lambda sources, local only
├── BUSINESS-HUB.md         # Human ops notes (AWS URLs, Twilio, etc.)
├── challenge-coin/         # Separate mini-project
├── business-docs/, content/ # gitignored — local business/draft content
└── CLAUDE.md               # This file
```

**Most edited for marketing site:** `index.html`, `checkout.html`, `financing.html`, `book.html`, `assets/vs-logo-2026.*`, `sitemap.xml`.

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

- **Logo on site:** User reports background not appearing transparent in browser — verify `assets/vs-logo-2026.png` alpha in an image inspector; check CSS (`mix-blend-mode`, background on `img` wrappers) and cache-bust if CDN/browser caches old JPG.
- **BNPL:** Confirm Klarna/Affirm/Afterpay enabled on the Stripe account for those links.
- **`velonyx-website/backend/`:** Ignored by git — back up Lambda code and env outside the repo if you rely on it.
- **`BUSINESS-HUB.md`:** May describe booking Lambda paths; live funnel emphasizes **Calendly** — reconcile docs with reality in AWS.
- **`robots.txt`:** Disallows some paths (e.g. duplicate site folder if listed); verify Search Console property matches `www` vs apex in `sitemap.xml`.

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
