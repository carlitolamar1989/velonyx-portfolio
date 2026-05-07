# Velonyx Systems — Claude Code Handoff

**Local working tree:** `/Users/apple/Cursor-Claude/`
**GitHub:** [`carlitolamar1989/velonyx-portfolio`](https://github.com/carlitolamar1989/velonyx-portfolio) (default branch: `main`)
**Live site:** `https://velonyxsystems.com` / `https://www.velonyxsystems.com`
**Subdomain (live demo):** `https://gdk.velonyxsystems.com` (separate Vercel project — see "Sibling repos" below)
**Founder/Operator:** Carlos Glover ([admin@velonyxsystems.com](mailto:admin@velonyxsystems.com), (877) 317-8643, San Diego CA)

---

## What this site is

A revenue-functional marketing site for **Velonyx Systems**, a service that engineers **custom business systems for service operators** (garage door, HVAC, plumbing, electrical, landscaping, and other field-service operators).

The pitch: "Stop renting your business tools. Start owning your infrastructure." Velonyx replaces the common service-business stack (Housecall Pro / Jobber + a generic website + a separate SMS tool + financing add-on = $160-290/mo, owns nothing) with **one integrated, branded, owned platform** at $3,000 build + $100/month.

The site exists to:
1. Convert visitors → Stripe Founding Member checkout
2. Showcase a live demo at `gdk.velonyxsystems.com`
3. Provide an "in-bio" landing at `/connect/` for QR-code / DM sharing

---

## Tech stack

| Layer | Tool | Notes |
|---|---|---|
| Markup | Static HTML5 | No framework, no build step, no `package.json` at root |
| Styling | Vanilla CSS with `:root` custom properties | All inline in `<style>` blocks |
| JS | Vanilla JS | GSAP + ScrollTrigger via CDN (homepage only, deferred) |
| Fonts | Google Fonts — Space Grotesk + DM Sans | Non-blocking preload + onload swap pattern; `<noscript>` fallback |
| Hosting | GitHub Pages | Auto-deploy on push to `main` via `.github/workflows/deploy.yml` |
| Custom domain | `velonyxsystems.com` (apex) | CNAME at root; DNS at Namecheap |
| Payments | Stripe Payment Links | One live link for the Founding Member offer (URL in `index.html` + `checkout.html`) |
| Booking | Calendly inline | Embedded on `book.html` |
| Analytics | GA4 (`G-F838ZEJ22J`) + Meta Pixel (`1486954096175579`) | Both **gated by CCPA cookie consent** via `assets/cookie-consent.js` |
| Image optimization | Pillow (Python) | One-shot scripts in `scripts/` |

---

## Folder structure (current, May 2026)

```
Cursor-Claude/                        ← velonyx-portfolio repo
├── index.html                        Marketing homepage
├── checkout.html                     Single Founding Member checkout page
├── book.html                         Calendly inline booking
├── financing.html                    BNPL explainer
├── for-barbers.html                  Vertical landing (legacy, still useful for ads)
├── privacy.html, terms.html, msa.html, sow.html, sms-terms.html, sms-opt-in.html
├── 404.html                          Brand-styled 404
├── humans.txt                        Plain-text team / tech credit
├── sitemap.xml, robots.txt, CNAME, favicon.ico
├── connect/index.html                "Link in bio" landing page
├── contact.vcf                       vCard 3.0 for one-tap contact save
├── assets/
│   ├── cookie-consent.js             CCPA banner — gates GA4 + Meta Pixel
│   ├── marketing-config.js           Pixel/GA4 IDs (Pixel ID activated: 1486954096175579)
│   ├── audio/velonyx-pitch.mp3       Pre-rebrand AI audio (unlinked, see assets/audio/README.md)
│   ├── lead-magnets/                 Barbershop blueprint PDF
│   ├── connect-qr-velonyx.png        Branded QR → /connect/
│   ├── gdk-preview.{webp,png}        Homepage portfolio screenshot of gdk.velonyxsystems.com
│   ├── velonyx_hero_web.mp4          Hero loop video (5.9 MB, optimized May 2026)
│   ├── velonyx_hero_poster.{jpg,webp}
│   ├── vs-logo-shield-clean.png      Primary brand mark (181 KB) — original
│   ├── vs-logo-shield-512.webp       Native-res WebP (~89 KB) — for hero/loader/watermark
│   ├── vs-logo-shield-240.{webp,png} Smaller variant — for /connect/ logo at 120px
│   ├── vs-logo-monogram.png + .webp  Nav mark
│   └── favicon-32.png, favicon-180.png
├── client-demos/                     Older portfolio demos (4 verticals — legacy, unused on live site)
├── demos/garage/                     Stripped-down GDK static demo (the live operational demo is on the gdk subdomain)
├── platform/                         AWS Cognito + Lambda + Terraform LEARNING LAB
│                                     (designed but unapplied — see platform/README.md)
├── docs/                             Internal audit, perf, decision, and summary docs
├── scripts/                          One-off Python + shell tooling
│   └── refresh-gdk.sh                One-command GDK demo screenshot refresh
├── content/, business-docs/          .gitignored — drafts, internal docs
├── .github/workflows/deploy.yml      GitHub Pages deploy
└── CLAUDE.md                         This file
```

### Sibling working directories (NOT inside the velonyx-portfolio repo)

These were embedded as separate git histories inside the working tree previously. May 2026 cleanup moved them out to siblings to remove the dual-deployment confusion:

| Path | What it is |
|---|---|
| `/Users/apple/Cursor-Claude-trades-template/` | **The future Velonyx Portal foundation.** Next.js 14 + Supabase + Stripe + Twilio + Resend. Currently deployed at `gdk.velonyxsystems.com`. See `docs/PORTAL_ARCHITECTURE_DECISION.md`. |
| `/Users/apple/Cursor-Claude-external/` | Cloned third-party SDKs used for tooling (e.g. `notebooklm-py` for AI audio generation). |
| `/Users/apple/Cursor-Claude-archive/lambda-backups-20260506/` | Lambda handler backups (Stripe + booking + lead intake) preserved before the May 2026 velonyx-website/ deletion. Git history retains them indefinitely too. |

---

## Pricing — Single Founding Member tier (May 2026)

**Live offer:** Founding Member System — first 5 customers only.

| Component | Amount | Notes |
|---|---|---|
| One-time build | **$3,000** | Charged on Stripe checkout immediately |
| Monthly Care | **$100/month** | First month free (31-day trial). Cancel anytime. |
| Stripe Payment Link | `https://buy.stripe.com/7sYfZjajz5Kq9M2bKOcs80e` | ToS-gated to `/terms.html` |
| Lock-in | Pricing locked for life | After 5 founding customers: $5,000 build + $200/mo |

**Founding spots counter:** 5 dots on `index.html` and `checkout.html`. Manually flip `class="founding-dot filled"` → `class="founding-dot empty"` per customer signed.

What's included in the system: custom-built website + admin dashboard (run from phone) + integrated payment system (Stripe + Apple Pay + Google Pay) + customer financing (Klarna/Affirm/Afterpay) + SMS automation + customer management + local SEO + production hosting + ownership in perpetuity.

### Deprecated (preserved in HTML comments for rollback only)

- 4-tier pricing (Starter $1,500 / Growth $3,500 / Premium $6,000 / Enterprise $12,000+) — collapsed to single Founding tier in May 2026
- 3 monthly Care tier links ($125 / $225 / $325) — bundled into the Founding $100/mo

---

## Compliance & consent

- **CCPA cookie banner:** loaded on every public page via `/assets/cookie-consent.js`. GA4 + Meta Pixel only fire after explicit accept (`localStorage.velonyx_cookie_consent === 'accepted'`).
- **Legal pages live + linked from every footer:** `/privacy.html`, `/terms.html`, `/msa.html`, `/sow.html`, `/sms-terms.html`, `/sms-opt-in.html`.
- **Consent checkboxes (not pre-checked):** `index.html` booking modal + `sms-opt-in.html` form.
- **Robots:** `velonyxsystems.com/robots.txt` allows root and disallows `/platform/portal/`, `/platform/admin/`. (The old `/velonyx-website/` disallow is now obsolete — that folder was deleted.)

---

## Performance baseline (post-cleanup, May 2026)

Lighthouse mobile, median **99/100** Performance across 10 audited public pages.

| Page | Performance |
|---|---:|
| `/connect/`, `/checkout.html`, `/sms-opt-in.html`, `/404.html` | **100** |
| `/financing.html`, `/terms.html`, `/privacy.html` | **99** |
| `/book.html` | 98 |
| `/for-barbers.html` | 97 |
| `/` (homepage) | 80 (LCP 3.1s — held back by hero video + GSAP scroll animations) |

See `docs/PERF_AUDIT_SWEEP.md` for the full before/after.

---

## Common operations

### Deploy

Push to `main`; GitHub Actions auto-deploys to GitHub Pages in ~20-30s. Verify with `curl -sI https://velonyxsystems.com/`.

### Refresh the homepage's GDK demo screenshot

```bash
bash /Users/apple/Cursor-Claude/scripts/refresh-gdk.sh
```

Captures via headless Chrome, resizes/optimizes, stages for commit. Or just say "refresh GDK" in chat.

### Re-run sitewide Lighthouse audit

See the snippet at the bottom of `docs/PERF_AUDIT_SWEEP.md`.

### Update founding-spot dots

Edit `index.html` and `checkout.html`. Find `<span class="founding-dot filled">` (or `<span class="spot-dot filled">` on checkout) and change `filled` → `empty` per customer signed.

### When the 5th founding customer signs

1. Create a new Stripe Payment Link: $5,000 setup + $200/mo (ToS gate to `/terms.html`)
2. Replace the URL `buy.stripe.com/7sYfZjajz5Kq9M2bKOcs80e` everywhere it appears
3. Update card amounts in `index.html` and `checkout.html`
4. Remove "Founding Member" framing — change card title to "The Velonyx System"
5. Mark old Stripe Payment Link as inactive in Stripe dashboard

---

## Architectural decisions

- **Portal foundation:** `velonyx-trades-template/` (Next.js + Supabase + Vercel) is the production portal foundation. `platform/` (AWS Cognito + Lambda + Terraform) is preserved as a documented learning lab. See `docs/PORTAL_ARCHITECTURE_DECISION.md`.
- **Hosting consolidation:** marketing site is on GitHub Pages; gdk demo is on Vercel. A future migration could consolidate both onto Vercel for single-pane deployment.

---

## Pointers for future Claude Code sessions

1. **Default to root files.** All production pages live at the repo root (`index.html`, `checkout.html`, etc.). There's no longer a mirror folder to keep in sync.
2. **Edit one source of truth per concept.** When changing the Stripe URL, update `index.html` (founding card CTA) AND `checkout.html` (CTA + the live-link comment block). Both should be kept consistent.
3. **For perf-impacting changes** (new images, new scripts, new fonts), follow the established patterns: WebP first with PNG/JPG fallback in `<picture>`, fonts via the preload + onload + noscript pattern, JS deferred where possible.
4. **The `gdk` subdomain is a separate codebase.** Don't try to fix gdk-related bugs by editing files in this repo. Open `/Users/apple/Cursor-Claude-trades-template/` for that work.
5. **Read the docs/ folder first.** `docs/VELONYX_SITE_DIAGNOSTIC.md`, `docs/PERF_AUDIT_SWEEP.md`, `docs/PORTAL_ARCHITECTURE_DECISION.md`, `docs/REBRAND_FIX_SUMMARY.md`, and `docs/CONNECT_LIGHTHOUSE.md` collectively answer most "wait, why does this exist / what state is it in?" questions.

---

*Last updated: 2026-05-06 — after the cleanup sweep that removed `velonyx-website/`, archived `platform/` as a learning lab, moved sibling repos out, and shipped the sitewide perf optimization.*
