# Velonyx Systems — Site + Portal Diagnostic Audit

**Generated:** 2026-05-03
**Mode:** Read-only (no changes, no commits)
**Scope:** Velonyx Systems main site + all related portal infrastructure
**Audit anchor commit:** `e2b1aeb` (Merge: Compliance Built In sales-asset page)
**Branch:** `main` — up to date with `origin/main`

---

## 1. Project Location & Repository

| Item | Value |
|---|---|
| Local working tree | `/Users/apple/Cursor-Claude/` |
| Git repo | `carlitolamar1989/velonyx-portfolio` |
| Default branch | `main` |
| Remote | `https://github.com/carlitolamar1989/velonyx-portfolio.git` (public) |
| Custom domain | `velonyxsystems.com` (apex) + `www.velonyxsystems.com` |
| Subdomain in use | `gdk.velonyxsystems.com` (separate Vercel deployment of `velonyx-trades-template/`) |
| Hosting (main site) | GitHub Pages, deployed via `.github/workflows/deploy.yml` |
| Hosting (gdk subdomain) | Vercel (separate Next.js project, separate git remote) |

**Untracked items in working tree:**
- `external/` — cloned third-party tooling (NotebookLM SDK)
- `velonyx-trades-template/` — embedded separate git repo (Next.js)
- `velonyx-website/.claude/` — IDE state
- `velonyx-website/Luxurious gold and black corporate banner.png` — orphan asset
- `velonyx-website/assets/video for website/` — orphan video assets
- `velonyx-website/files.zip` — orphan archive

---

## 2. Tech Stack

### Main marketing site (`velonyxsystems.com`)
- **Framework:** None — hand-coded static HTML5
- **CSS:** Vanilla CSS with `:root` custom properties (CSS variables). No Tailwind, no SCSS, no PostCSS, no build step.
- **JS:** Vanilla JavaScript only. CDN-loaded GSAP + ScrollTrigger for scroll animations.
- **Fonts:** Google Fonts — `Space Grotesk` (display) + `DM Sans` (body)
- **Build:** None. Files served directly as-is from repo root.
- **Test framework:** None.
- **Linter / formatter:** None configured.

### Garage Door Kings demo (`/demos/garage/`)
- Same stack as main site — static HTML/CSS/JS — but is now a redirect-only page (meta-refresh + JS fallback) pointing to `https://gdk.velonyxsystems.com/`. The 21 underlying pages still exist in the repo for SEO and as a backup.

### Velonyx Trades Template (`/velonyx-trades-template/` → `gdk.velonyxsystems.com`)
- **Framework:** Next.js 14.2.35 (App Router) + React 18 + TypeScript 5
- **Styling:** Tailwind CSS 3.4 + shadcn/ui (Radix primitives) + tailwindcss-animate + framer-motion
- **Backend services:** Supabase (`@supabase/ssr` + `@supabase/supabase-js`) for DB + auth, Stripe (`stripe` + `@stripe/stripe-js`) for payments, Twilio for SMS, Resend for transactional email
- **Forms:** react-hook-form + zod validation
- **Hosting:** Vercel
- **Status:** Active, customer-facing operational demo

### Platform (`/platform/`) — UNAPPLIED
- **Frontend:** Static HTML shells (`platform/portal/index.html`, `platform/portal/dashboard.html`, `platform/admin/index.html`) wired to AWS Cognito Hosted UI / InitiateAuth. Vanilla JS — no framework.
- **Backend:** Python 3.12 Lambda functions in Docker (3 lambdas: `uploads`, `projects`, `notifications`)
- **Infra:** Terraform — Cognito User Pool, DynamoDB `client_projects` table, S3 bucket, API Gateway HTTP API with Cognito JWT authorizer, IAM, CloudWatch logging
- **Status:** **Not applied to AWS.** No `.terraform/` state. Architecture is documented in `platform/ARCHITECTURE.md` but no resources have been provisioned.

---

## 3. Dependencies & Package Management

| Project | Package manager | Lockfile | Notes |
|---|---|---|---|
| `Cursor-Claude/` (main site) | **None** | None | No `package.json`. Pure static. |
| `velonyx-trades-template/` | npm | `package-lock.json` | Next.js 14.2.35 stack — see deps below |
| `platform/lambdas/*/` | pip | `requirements.txt` | Each Lambda has its own Dockerfile |
| `external/notebooklm-py/` | pipx | — | Installed globally; not committed |

### `velonyx-trades-template/` runtime dependencies
```
@supabase/ssr ^0.10.2
@supabase/supabase-js ^2.104.1
stripe ^22.1.0
@stripe/stripe-js ^9.3.1
twilio ^6.0.0
resend ^6.12.2
react-hook-form ^7.74.0
zod ^4.3.6
framer-motion ^12.38.0
lucide-react ^1.11.0
date-fns ^4.1.0
@hookform/resolvers ^5.2.2
@radix-ui/* (checkbox, dialog, label, select, separator, slot, toast)
class-variance-authority, clsx, tailwind-merge, tailwindcss-animate
next 14.2.35, react ^18, react-dom ^18
```

### Devops
- GitHub Actions: `actions/checkout@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`
- No CI tests, no preview deploys, no branch protections documented

---

## 4. File Structure (top-level)

```
Cursor-Claude/
├── 404.html                      Brand-styled 404
├── BUSINESS-HUB.md               Internal ops doc (legacy AWS booking flow)
├── CLAUDE.md                     Project handoff doc for AI agents
├── CNAME                         "velonyxsystems.com"
├── README.md                     (none at root — README is inside trades-template only)
├── about.html (none — about lives only in /demos/garage/)
├── book.html                     Calendly embed (?tier=enterprise supported)
├── checkout.html (49.9 KB)       4 build tiers + deposit/BNPL + Care upsell
├── financing.html                BNPL explainer
├── for-barbers.html              Vertical landing page (built Apr 23)
├── humans.txt                    Plain-text team / tech credit
├── index.html (182 KB, 4,893 ln) Main marketing homepage
├── msa.html / sow.html / privacy.html / terms.html / sms-terms.html / sms-opt-in.html
├── robots.txt                    Allows root, blocks /platform/portal/, /platform/admin/, /velonyx-website/
├── sitemap.xml
├── favicon.ico
├── .github/workflows/deploy.yml  GitHub Pages deploy
├── .gitignore                    Ignores business-docs/, content/, velonyx-website/backend/, terraform state
├── assets/
│   ├── audio/                    NotebookLM-generated 21-min pitch MP3
│   ├── cookie-consent.js         CCPA banner + GA4/Meta Pixel gate
│   ├── marketing-config.js       Pixel/GA4 IDs config
│   ├── lead-magnets/             Barbershop blueprint PDF
│   ├── velonyx_hero_web.mp4      Hero video
│   ├── velonyx_hero_poster.jpg   Hero video poster (1920x1080)
│   ├── vs-logo-monogram.png      256x288
│   ├── vs-logo-shield-clean.png  512x590
│   └── favicon-32.png, favicon-180.png
├── business-docs/                .gitignored — brand voice, persona, internal docs
├── challenge-coin/               Older static demo (unrelated)
├── client-demos/                 Original 4 portfolio demos (Throne, IronWill, Lens & Light, Apex SMP)
├── content/                      .gitignored — draft content, podcast sources
├── demos/garage/                 21-page Garage Door Kings demo (now redirect-only at index)
│   ├── index.html (redirect → gdk subdomain)
│   ├── about.html, services.html, service-areas.html, contact.html, reviews.html
│   ├── pay.html, portal.html, admin.html, admin-pay.html, invoices.html
│   ├── seo-built-in.html, compliance-built-in.html
│   ├── sitemap.xml, robots.txt, humans.txt, config.js
│   └── service-areas/
│       ├── boulder-city.html, enterprise.html, henderson.html
│       ├── las-vegas.html, north-las-vegas.html, paradise.html
│       ├── spring-valley.html, summerlin.html
├── docs/                         Internal audit + planning docs (this file's home)
│   ├── CONSOLIDATION_SUMMARY.md
│   ├── DEPLOYMENT_AUDIT.md
│   ├── PORTAL_AUDIT.md
│   ├── POST_DEPLOY_VERIFICATION.md
│   ├── SEO_BUILD_SUMMARY.md
│   ├── SUBDOMAIN_SETUP.md
│   ├── UX_UPGRADE_SUMMARY.md
│   ├── VELONYX_SITE_GAPS.md
│   └── screenshots/
├── external/notebooklm-py/       Untracked — cloned 3rd-party SDK
├── platform/                     Unapplied AWS Cognito + Lambda + Terraform stack (212 KB)
│   ├── ARCHITECTURE.md
│   ├── admin/index.html
│   ├── portal/{index.html, dashboard.html}
│   ├── lambdas/{notifications, projects, uploads}/handler.py + Dockerfile + requirements.txt
│   └── terraform/
│       ├── main.tf, variables.tf, outputs.tf
│       ├── cognito.tf, dynamodb.tf, s3.tf, lambda.tf
│       ├── api-gateway.tf, iam.tf
├── scripts/                      Python scripts (logo regen, etc.)
├── velonyx-trades-template/      Embedded separate Next.js repo (1.0 GB w/ node_modules), Vercel-deployed
└── velonyx-website/              Stale mirror folder (649 MB) — outdated copies of root HTML files
```

**Mirror folder:** `velonyx-website/` is a **stale duplicate** of the root site files. `.gitignore` excludes its `backend/` subdir but not the duplicate HTML. This causes drift risk and wasted disk space.

---

## 5. Homepage Brand Voice & Copy (verbatim)

### Hero
- **H1:** "Stop Selling in the DMs."
- **H2:** "Start Selling with a Premium Website."
- **Slogan:** "Your Legacy, Engineered With Precision."
- **Hero CTA buttons:** "Book Free Consultation" + "See Pricing"
- **Hero media:** Looping background video (`assets/velonyx_hero_web.mp4`) with poster fallback

### Anchors / Sections
`#services`, `#process`, `#pricing`, `#work`, `#about`, `#contact`, `#faq`, `#listen`

### Services (6)
1. **Premium Website Design** — luxury aesthetic, mobile-first, conversion-optimized
2. **Payment Integration** — Stripe + Apple Pay + Google Pay
3. **Buy Now, Pay Later (BNPL)** — Klarna / Affirm / Afterpay at customer checkout
4. **Hosting & Deployment** — production hosting + SSL + monitoring
5. **Ongoing Maintenance** — Care subscriptions for updates and security
6. **Digital Consulting** — SEO foundation + analytics + booking automation

### Process (5)
1. Free Consultation
2. Secure Your Project (50% deposit)
3. Design & Build
4. Refine
5. Launch

### Build pricing tiers (4)
| Tier | Price | Delivery | Headline differentiator |
|---|---|---|---|
| Starter | $1,500 | 5–7 days | Single-page + booking + payments |
| Growth | $3,500 | 7–10 days | Multi-page + logo + BNPL + SMS |
| Premium | $6,000 | 10–14 days | + brand video + Client Portal + unlimited pages |
| Enterprise | Starting at $12,000 | Custom | Multi-location portal, integrations, dedicated PM, HIPAA-ready |

### Care subscription tiers (4)
| Tier | Price | Stripe Payment Link |
|---|---|---|
| Standard Care | $125/mo | `https://buy.stripe.com/6oU7sN1N33CicYe2aecs80b` |
| Growth Care | $225/mo | `https://buy.stripe.com/bJe3cx4Zf2ye6zQdSWcs80c` |
| Premium Care | $325/mo | `https://buy.stripe.com/7sYbJ34ZfegWaQ6dSWcs80d` |
| Enterprise Care | Custom | (no Stripe link — Stripe Invoicing manually) |

### Portfolio cards (5)
1. **Throne Barbershop** (`client-demos/throne-barber/`)
2. **IronWill Training** (`client-demos/ironwill-fitness/`)
3. **Lens & Light Studio** (`client-demos/lens-and-light/`)
4. **Apex SMP Studio** (`client-demos/apex-smp/`)
5. **Garage Door Kings** — links to `https://gdk.velonyxsystems.com/`

### Testimonials (3 named)
- **Marcus J.** — Barbershop Owner
- **Tanya S.** — Fitness Studio Owner
- **David R.** — Photography Studio Owner

### FAQ (8 visible questions)
Pricing, timeline, what's included, BNPL, ongoing maintenance, hosting, ownership, support response time

### "Hear The Pitch" section
Embedded 21-min NotebookLM-generated audio overview with HTML5 `<audio>` controls.

### Tone
Premium, plain-English, confidence-led. Minimal hype words. Heavy emphasis on "engineered" / "precision" / "luxury" without becoming jargon-heavy. Recent SEO/compliance proof pages explicitly stripped tech jargon (per Apr-29 user feedback).

---

## 6. Styling & Design Tokens

Pulled from `:root` in `index.html`:

```css
--accent: #D4AF37;                    /* core gold */
--accent-light: #F7E17B;              /* warm pale gold */
--accent-dark: #B8860B;               /* dark gold */
--bg-deep: #08080A;                   /* near-black */
--bg-base: #0C0C0F;                   /* page background */
--bg-card: #111114;                   /* card surface */
--white: #F0EDE8;                     /* warm off-white text */
--white-muted: #B0AEA6;               /* muted body text */
--gold-shine: linear-gradient(135deg, #BF953F 0%, #FCF6BA 22%,
                                       #B38728 45%, #FBF5B7 67%,
                                       #AA771C 100%);  /* metallic header gradient */
--gold-btn: linear-gradient(135deg, #D4AF37 0%, #F7E17B 35%,
                                     #D4AF37 65%, #B8860B 100%);  /* CTA buttons */
```

**Typography**
- Display: Space Grotesk (400, 500, 600, 700)
- Body: DM Sans (400, 500)

**Visual signature**
- Dark luxury palette (near-black backgrounds + warm off-white text)
- Metallic gold gradients for headlines, CTAs, dividers
- Glassmorphic cards with subtle gold border-glow on hover
- GSAP ScrollTrigger reveal animations on section entry
- 3D button hover (lift + soft gold glow shadow)

**Layout**
- Mobile-first
- Max content width ~1200px
- Generous whitespace + consistent vertical rhythm

---

## 7. Deployment Infrastructure

### Main site (velonyxsystems.com)
- **Trigger:** push to `main` (or manual `workflow_dispatch`)
- **Action:** `Deploy to GitHub Pages` (`.github/workflows/deploy.yml`)
- **Steps:** Checkout → Setup Pages → Upload entire repo root as artifact → Deploy
- **Concurrency:** group `pages`, cancel in progress = false (queues)
- **Custom domain:** Repo `CNAME` = `velonyxsystems.com`. DNS at Namecheap — A records to GitHub Pages IPs + CNAME for `www`.
- **HTTPS:** GitHub-managed once DNS validates

### Subdomain (gdk.velonyxsystems.com)
- **Hosting:** Vercel
- **Source:** `velonyx-trades-template/` (embedded separate git repo with its own Vercel project)
- **DNS:** CNAME `gdk` → Vercel hostname (configured at Namecheap)
- **Build:** `next build` (Next.js 14)

### Platform AWS stack
- **Status:** Defined in Terraform but **never applied**
- **Would deploy:** Cognito user pool, DynamoDB table, S3 bucket, 3 Dockerized Lambdas, API Gateway HTTP API with JWT authorizer
- **Backend code (`velonyx-website/backend/`):** `.gitignored` — Stripe Lambda + legacy booking Lambda code may exist locally; not under version control

---

## 8. Existing Portal Infrastructure

There are **TWO parallel portal systems** with overlapping intent. This is the single biggest source of architectural ambiguity in the project.

### A. `platform/` — AWS-native, never deployed

**`platform/ARCHITECTURE.md` documents the intent:**
> The Velonyx Platform is a full-stack cloud system that powers two interfaces:
> 1. Client Portal — Where clients log in, upload assets, track project progress
> 2. Admin Dashboard — Where Carlito manages all clients, views uploads, updates project status
> Both share the same AWS backend.

**Built artifacts:**
- `platform/admin/index.html` (1,189 lines) — admin login, Cognito InitiateAuth flow
- `platform/portal/index.html` (878 lines) — client login
- `platform/portal/dashboard.html` (1,037 lines) — client dashboard with checklist + uploads
- `platform/lambdas/uploads/handler.py` — presigned S3 URL generator + file list/delete
- `platform/lambdas/projects/handler.py` — project CRUD
- `platform/lambdas/notifications/handler.py` — SES + Twilio notify
- `platform/terraform/{main,cognito,dynamodb,s3,lambda,api-gateway,iam}.tf` — full IaC

**API design (from ARCHITECTURE.md):**
- `POST /auth/register` (Cognito)
- `POST /auth/login`
- `GET /project` / `PUT /project`
- `POST /upload-url` (presigned S3)
- `GET /files` / `DELETE /files/{key}`
- `POST /notify`

**Status:** No `.terraform/` state, no `tfstate*` files, no AWS resources provisioned. The HTML pages reference Cognito client IDs and API endpoints that do not exist in any AWS account today.

### B. `velonyx-trades-template/` — Vercel + Supabase, live

**Status:** Active, deployed to `gdk.velonyxsystems.com`.

**Stack:** Next.js 14 App Router + Supabase + Stripe + Twilio + Resend.

**Routes:**
- `(marketing)` — public marketing pages
- `(admin)/admin/*` — internal admin shell with sub-routes:
  - `customers, settings, payments, invoices, sms, leads, contracts, pricebook, team, jobs, photos, connect`
- `intake/` — public lead intake form
- `pay/[id]/` — dynamic payment page
- `sign/[id]/` — dynamic e-signature page

**API routes (`src/app/api/`):**
- `bookings`, `quotes`, `leads`, `contracts`, `intake`
- `admin/confirm`
- `uploads/photos`
- `webhooks/stripe`

**Recent work (last 5 commits per summary):** live estimate updates, pricebook editor + change orders, estimate/approval flow, demo simulation polish, Twilio + Resend wiring.

### Conflict / risk
- The two systems were built for the same purpose but never reconciled.
- `platform/` is the documented architecture but is dead code. `velonyx-trades-template/` is a live shadow implementation that uses Supabase instead of Cognito/DynamoDB.
- Customers visiting `gdk.velonyxsystems.com` see the `velonyx-trades-template/` system. Internal docs and `index.html` portfolio messaging still occasionally reference Client Portal capabilities that exist only as static HTML mocks in `platform/`.

---

## 9. Third-Party Integrations

| Integration | ID / Endpoint | Where it loads | Status |
|---|---|---|---|
| Google Analytics 4 | `G-F838ZEJ22J` | `assets/cookie-consent.js` (loaded on all 10+ public pages) | **Consent-gated** — fires only after CCPA accept |
| Meta Pixel (Dataset) | `1486954096175579` | Same — `cookie-consent.js` | **Consent-gated** |
| Stripe Payment Links — Care | 3 live links (Standard / Growth / Premium) | `index.html` + `checkout.html` | Live |
| Stripe Payment Links — Build deposits | Inline `STRIPE_DEPOSIT_LINKS` in `checkout.html` | checkout.html | Live (verify in Stripe Dashboard) |
| Stripe Payment Links — Build full-pay | Inline `STRIPE_BNPL_LINKS` placeholders | checkout.html | **Some still TODO** (placeholder strings) |
| Stripe Invoicing — Enterprise | Manual per engagement | n/a | Process: Carlos invoices manually |
| Calendly | Inline widget on `book.html` | book.html | Live, supports `?tier=enterprise` query param |
| Twilio | (877) 317-8643 | Phone number, not embedded in site | Live — call forwarding + SMS for legacy booking flow |
| AWS SES | (legacy booking Lambda) | n/a | Documented in `BUSINESS-HUB.md`; verify in AWS console |
| NotebookLM | Audio file generated and embedded as MP3 | `index.html` "Hear The Pitch" section | Live |
| OpenStreetMap | Embedded on `/demos/garage/service-areas/*` only | iframe | Live |
| Google Fonts | Space Grotesk + DM Sans | All pages | Live |

**Webhooks / inbound:**
- `velonyx-trades-template/src/app/api/webhooks/stripe/` exists but is for the gdk subdomain product, not for `velonyxsystems.com`.
- No Stripe webhooks configured for the marketing site itself (Payment Links handle their own success pages).

---

## 10. Assets & Media

### Images
- `assets/vs-logo-monogram.png` — 256×288 (transparent PNG)
- `assets/vs-logo-shield-clean.png` — 512×590 (transparent PNG, primary brand mark)
- `assets/favicon-32.png`, `assets/favicon-180.png`, `favicon.ico`
- `assets/velonyx_hero_poster.jpg` — 1920×1080 hero video poster

### Video
- `assets/velonyx_hero_web.mp4` — looping hero background

### Audio
- `assets/audio/*` — NotebookLM-generated ~21 min pitch MP3 ("Hear The Pitch")

### Lead magnets
- `assets/lead-magnets/barbershop-blueprint.pdf` — gated lead magnet for `/for-barbers.html`

### Orphan / stale assets (in `velonyx-website/`)
- `Luxurious gold and black corporate banner.png`
- `assets/video for website/` — additional video files outside main asset pipeline
- `files.zip` — unknown archive

These should be triaged: deleted, moved, or re-imported as canonical assets.

---

## 11. SEO Foundation

### Main site (`velonyxsystems.com`)
- **Schema.org JSON-LD:** 11 blocks on `index.html` (Organization, WebSite + SearchAction, AggregateRating, 3 Reviews, 4 Service tiers, FAQPage)
- **Meta:** title, description, viewport, canonical, theme-color
- **Open Graph + Twitter Card:** complete
- **Geo / ICBM:** present
- **Sitemap:** `sitemap.xml` at root
- **Robots:** allow root; disallow `/platform/portal/`, `/platform/admin/`, `/velonyx-website/`; sitemap reference points to `https://www.velonyxsystems.com/sitemap.xml`
- **humans.txt:** present, lists Carlos as Founder/Operator with phone, email, San Diego location

### Garage Door Kings demo (`/demos/garage/`)
- Comprehensive 7-phase SEO build completed Apr 29 (per `docs/SEO_BUILD_SUMMARY.md`):
  - Phase 1: meta tag foundations across all 21 pages
  - Phase 2: schema (LocalBusiness, Service, Review, FAQ)
  - Phase 3: 8 individual service-area landing pages
  - Phase 4: H1 hierarchy + internal linking + content depth
  - Phase 5: sitemap.xml + robots.txt + image sitemap entries
  - Phase 6: Reputation Engine (review schema visibility)
  - Phase 7: SEO proof page (`seo-built-in.html`) + compliance proof (`compliance-built-in.html`) — both rewritten in plain English

---

## 12. Recent Commit History (last 15)

```
e2b1aeb  Merge: Compliance Built In sales-asset page
b8dc1bb  Add /compliance-built-in.html sales-asset page
c03b9cc  Merge: SEO plain-English rewrite + demo redirect + Velonyx main-site SEO
aa53872  SEO + redirect fixes: plain English, 2x2 cards, demo redirects to gdk subdomain, full SEO on velonyxsystems.com
3aa28e2  Add SEO build summary doc
ddece60  Merge: SEO Build Foundation — comprehensive local SEO across all GDK pages
9d24b09  SEO Phase 7: SEO proof page for sales conversations
1c80dbc  SEO Phase 6: Reputation Engine visibility and review schema
c4be221  SEO Phase 5: Sitemap, robots.txt, discoverability
2465ac4  SEO Phase 4: On-page optimizations (H1 hierarchy, internal linking, content depth)
beccfda  SEO Phase 3: Individual service area landing pages with localized content
6972e4c  SEO Phase 2: Schema markup (LocalBusiness, Service, Review, FAQ) added
3332b69  SEO Phase 1: Technical meta tag foundations across all pages
cc4372c  Merge remote-tracking branch 'origin/main'
9bca25e  Add final consolidation run summary
```

The branch is up-to-date with `origin/main`. No uncommitted edits — only untracked external/embedded folders.

---

## 13. Known TODOs, Stale Code & Risks

### Live TODOs in code
- `checkout.html`:
  - `// TODO: Create these Payment Links in Stripe Dashboard for the discounted amounts` — pay-in-full discounted Stripe links not yet created. Logic guards against `link.startsWith('TODO_')` strings.

### Documented but unfinished work
- **Terraform never applied.** `platform/` is intent-only. No AWS resources exist.
- **`velonyx-website/` mirror folder** (649 MB) is stale — duplicates root HTML files, holds orphan assets. Highest deletion candidate.
- **`velonyx-website/backend/`** is `.gitignored`. Holds Lambda code (Stripe + legacy booking) that exists only on this machine. Lost if disk fails.
- **Stripe ToS gate:** `CLAUDE.md` lists a post-deploy task to enable "Require customers to accept your terms of service" on all 14 Payment Links. Status unknown — verify in Stripe Dashboard.
- **BNPL availability:** confirm Klarna/Affirm/Afterpay are enabled on Stripe account for the relevant Payment Links.
- **`BUSINESS-HUB.md`** documents legacy AWS booking Lambda paths that may or may not still be live. Reconcile docs with actual AWS console state.

### Architectural risks
- **Two portals (platform/ vs velonyx-trades-template/)** with overlapping intent and zero shared code. Either:
  - Pick one (recommended: extend velonyx-trades-template) and delete the other, OR
  - Formally split: `platform/` becomes the Velonyx-internal admin/CRM, `velonyx-trades-template/` stays the per-client product surface.
- **Embedded separate git repo** (`velonyx-trades-template/`) inside the marketing repo creates dual-deployment confusion. PRs in the wrong place, branch divergence, contributor confusion.
- **No env-var management** for the static site. Stripe keys are public Payment Link URLs (correct). Analytics/Pixel IDs hard-coded in `marketing-config.js` (acceptable). But there is no `.env.example`, no documented secrets policy.
- **No automated tests.** Visual regressions, broken links, and Stripe link drift are caught only manually.
- **No staging environment.** Every push to `main` is production. Mitigated only by the size of the site.
- **`docs/` is sprawling** — 9 markdown audit/summary docs, no master index. New contributors have to guess which is current.

### Compliance posture
- CCPA cookie banner gates GA4 + Meta Pixel — good.
- Privacy / Terms / SMS Terms / SMS Opt-In / MSA / SOW pages all live — good.
- Consent checkboxes (not pre-checked) on `index.html` booking modal and `sms-opt-in.html` — good.
- HIPAA messaging on Enterprise tier is "available" / "ready" — no actual BAA, no PHI handling architecture in place. Be careful not to oversell on outbound.

---

## 14. Recommendations for Rebrand & PWA Portal Build

(Read-only diagnostic; below is **observations, not implementation**. Final decisions belong to Carlos.)

### Rebrand-readiness — Marketing site
**Pros (low-friction rebrand):**
- Vanilla HTML/CSS — no framework version locks, no build pipeline to migrate
- All design tokens centralized in `:root` — palette swap is a 10-line change
- Brand assets are PNG + MP4 — drop-in replacement
- Schema.org JSON-LD is searchable as plain text — find/replace is safe

**Cons / friction points:**
- `index.html` is 4,893 lines. Edits are painful. Rebrand is a good moment to extract reusable partials (header / footer / pricing card / testimonial card) into either:
  - server-side includes (Eleventy / Astro static gen with zero runtime), OR
  - tiny vanilla template literal hydration (no framework)
- 11 JSON-LD blocks include hard-coded brand strings ("Velonyx Systems", logo URL, phone). Centralize before rebrand.
- Hero copy is brand-scoped. New brand needs new H1/H2/slogan + new pitch audio (NotebookLM regen).
- `humans.txt`, `BUSINESS-HUB.md`, `CLAUDE.md`, all 9 docs in `docs/` reference "Velonyx Systems" — broad sweep needed.
- Hero video (`velonyx_hero_web.mp4`) is brand-neutral enough to keep, but the poster + audio overview are not.

**Suggested rebrand order:**
1. Create `assets/brand-tokens.css` with new palette + fonts. Swap `:root` to import.
2. Extract `<header>` and `<footer>` to `partials/` and include via SSI or tiny build script.
3. Replace logos, favicons, audio, hero copy.
4. Sweep all `Velonyx Systems` strings in HTML + JSON-LD + docs.
5. Update `CNAME` if domain changes; update Google Search Console + GA4 property name.
6. Re-run schema validators (search.google.com/test/rich-results) on every page.

### PWA Portal Build (Velonyx Client Portal + Velonyx Admin Portal)

**Recommendation: do NOT extend `platform/` (the AWS Cognito stack).** Reasons:
- Never deployed → no migration cost
- Adds complexity (Terraform + Cognito + Lambda + DynamoDB + S3 + API Gateway) for capabilities Supabase already gives you in `velonyx-trades-template/`
- Carlos's stated career goal includes AWS+Terraform+Docker+Python proficiency — so retain `platform/` as a learning lab in a separate repo, not as production infra for the portal

**Recommendation: extend `velonyx-trades-template/` into the official portal foundation.** Reasons:
- Already deployed, already running on Vercel
- Already has Supabase auth, Stripe, Twilio, Resend wired
- Already has admin sub-routes (customers, settings, payments, invoices, sms, leads, contracts, pricebook, team, jobs, photos, connect) — most of what a Client/Admin portal needs is half-built
- Next.js 14 App Router supports PWA natively (manifest + service worker via `next-pwa` or hand-rolled)
- TypeScript + zod give type-safety the static HTML portal will never have

**To make it a true PWA:**
1. Add `public/manifest.webmanifest` with brand icons (192, 512), theme color (`#D4AF37` or new brand), display: `standalone`
2. Add a service worker (next-pwa or manual `/sw.js`) — cache shell, offline fallback
3. Install `<link rel="manifest">` in `app/layout.tsx`
4. iOS-specific tags: `apple-mobile-web-app-capable`, `apple-touch-icon`
5. Add "Install to Home Screen" prompt + Push Notifications via Web Push (already have Resend/Twilio for fallback)

**Two-portal split inside one Next app:**
- `(client)/portal/*` — customer-facing (project status, invoices, file uploads, SMS history)
- `(admin)/admin/*` — already exists; finish the half-built routes
- Shared Supabase tables with RLS policies per role
- Auth via Supabase magic link or OAuth (Google for clients, password for admin)

**Migration path:**
1. Extract the marketing site's portfolio + pricing pages into `(marketing)` route group
2. Move Stripe Payment Links to Stripe Checkout sessions (server-side, more conversion control)
3. Move Calendly to Cal.com self-host or keep Calendly with deep link
4. Wire `velonyxsystems.com` → Vercel (move off GitHub Pages). One deployment, one domain, one brand surface.
5. Decommission `platform/` (or move it to `archive/platform/` as reference)
6. Decommission `velonyx-website/` mirror folder

**Cleanup priority (safe, high-value):**
1. Delete `velonyx-website/` mirror folder (stale, 649 MB, duplicate)
2. Move `external/` and `velonyx-trades-template/` out of this repo (separate git histories)
3. Add `.env.example` and document secret rotation policy
4. Add link-checking GitHub Action (no-cost, catches dead Stripe/Calendly links)
5. Delete or archive `BUSINESS-HUB.md` legacy AWS booking docs once superseded

**Single highest-leverage move (if you only have 1 hour for the rebrand):**
> Centralize brand strings (palette, logo path, audio path, brand name, phone, slogan) into `assets/brand-config.js` and have every HTML file read from it. Then a rebrand becomes a 10-line edit, not a 50-file find/replace.

---

## End of diagnostic

Audit complete. No files were modified. No commits were made.

Carlos: this document is saved at `/Users/apple/Cursor-Claude/docs/VELONYX_SITE_DIAGNOSTIC.md` and mirrored in chat. Bring focused build prompts when you're ready.
