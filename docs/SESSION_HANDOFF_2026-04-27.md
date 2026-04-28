# Session Handoff — 2026-04-27

> **For the next Claude session.** This doc covers everything done in the last ~48 hours of work on the Velonyx Systems demos repo. Read it cold before touching anything; the codebase has evolved a lot since the last audit.

---

## TL;DR

The Garage Door Kings demo (`/demos/garage/`) has been built up into a near-production-quality home-services SaaS demo. It's the canonical pattern for every future home-services vertical (HVAC, plumbing, electrical, etc.). When Carlos asks "build the website model for the home services business," he means: extract or clone this pattern into a new vertical demo OR formalize this as a reusable starter template.

**Live URL:** https://velonyxsystems.com/demos/garage/
**Repo path:** `/Users/apple/Cursor-Claude/velonyx-website/.claude/worktrees/zen-bouman/demos/garage/`
**Git remote:** `https://github.com/carlitolamar1989/velonyx-portfolio` (default branch `main`)

---

## What was done in the last 2 sessions (12 merges, 18 commits)

```
5244522  Merge: in-person flow refactor (drop mocked Tap-to-Pay, single Send Link + card fallback)
be5353c  Drop mocked Tap-to-Pay; in-person flow uses Send Link + inline card fallback
f81d1b9  Merge: in-person Tap to Pay + return to admin (fix wallet-conflict + sign-out bug)
cae3571  In-person payments: hide Apple Pay/Google Pay (wallet conflict), add Tap to Pay, return to admin
5c7c881  Merge: hamburger mobile nav (fix portal not reachable on mobile)
4688ab2  Add hamburger mobile nav across all 11 demo pages
1f1215b  Merge: docs (PORTAL_AUDIT, UX_UPGRADE_SUMMARY, screenshots, NEXT bookmark)
9415f72  docs: portal audit + UX upgrade summary + 10 mobile/desktop screenshots
0d44352  Merge: garage portal UX upgrade
578f3cd  Add $89 service-call deposit to booking flow
4f5ee8f  Polish: dismissible banner, lucide icons, empty states, reusable toast
7d286b0  Add Pay Now button to customer portal outstanding invoices
7014d7b  Wire all placeholder buttons with realistic simulated actions
283d217  Add Today view as default mobile landing for admin dashboard
c90298b  Mobile card-stack layout for all admin and invoice tables
e0f4468  Merge: garage demo payment flow
407b851  Garage demo: tax-season invoice manager
cbd4a52  Garage admin: lead with money, ditch sales jargon
cf8c5d7  Garage demo payments: persist newly-created invoices via localStorage
37def36  Garage demo: custom invoice + branded payment flow
```

### What this added (in plain English)

1. **Custom invoice + payment flow** (`/admin-pay.html` + `/pay.html`)
   - Tradesman types a custom amount, sends a pay link via SMS to the customer
   - Customer opens link on their own phone, sees a branded payment page with Apple Pay / Google Pay / Affirm / Klarna / card form
   - Tradesman gets confirmation; payment is logged

2. **Tax-season invoice manager** (`/invoices.html`)
   - Search any customer, filter by status / date range / customer
   - YTD / This Month / Outstanding / # Invoices KPIs
   - Click row → modal with full receipt + NV sales tax breakdown + mock Stripe charge ID
   - One-click CSV export for the accountant

3. **Mobile-first portal UX**
   - Mobile <768px: lands on a "Today" view (collected today / today's jobs / needs your attention / recent money)
   - Toggle between Today and Full Dashboard
   - Tables collapse to vertical card stacks at <600px (no horizontal scroll)
   - Hamburger mobile nav on every page (slide-in drawer with all links + customer portal access)

4. **All buttons wired** with realistic simulated actions
   - Sign Out → fade overlay + redirect
   - + New Lead → modal form → toast confirmation → row at top of leads table with NEW badge
   - Export Data → multi-section CSV download
   - Reschedule → modal with 3 time slots → toast confirmation
   - Send message → persists + simulated 4s reply from Marcus

5. **Customer portal Pay Now** — outstanding invoices in `/portal.html` have prominent "Pay $X Now" buttons that deep-link to `/pay.html`

6. **$89 service-call deposit** at booking — `/contact.html` now has a 4-stage flow ending with Apple Pay / Google Pay / Card collection of an $89 deposit; new bookings show on admin with a green "Deposit Paid · $89" badge

7. **Polish**: dismissible demo banner (24h re-appear), Lucide icons replacing emojis, empty states, reusable toast component

8. **In-person payment flow refactor** (most recent change)
   - The previous design tried to mock contactless Tap-to-Pay on the merchant's phone — but real contactless requires either a native iOS app or a $59 Bluetooth dongle (Carlos rejected both)
   - Now: ONE primary "Send Pay Link to Customer's Phone" action + inline "Customer doesn't have a smartphone? Take card payment here" card-form fallback
   - Removed: mocked Tap-to-Pay button, NFC ripple overlay, in-person handoff overlay, in-person explanatory note, Apple Pay/Google Pay hiding logic
   - The pay page (`/pay.html`) is now exclusively customer-facing — always opened on the customer's own phone via SMS link, so wallet behavior is correct

---

## File inventory — `/demos/garage/`

### HTML pages (11)

| File | Lines | Purpose |
|---|---|---|
| `index.html` | 365 | Public marketing homepage with hero, services preview, service areas, featured installs, reviews, final CTA |
| `services.html` | 168 | Detailed service pages with photos and descriptions |
| `service-areas.html` | 86 | Map / coverage zones |
| `about.html` | 143 | Marcus's story + Meet the Crew (3 team headshots) |
| `reviews.html` | 91 | Customer testimonials (renders from mock-data.js) |
| `contact.html` | 230 | Lead form with $89 service-call deposit booking flow |
| `portal.html` | 285 | END CUSTOMER's portal (Michael Robinson's view): upcoming service, payment summary with Pay Now buttons, past jobs, conversation with Marcus, documents |
| `admin.html` | 800+ | TRADESMAN's admin dashboard: Today view (mobile default) + Full Dashboard with KPIs, Money/Payments, New Customer Requests, Jobs, SMS, Estimates, Reviews |
| `admin-pay.html` | 270 | "Take a Payment" form — single Send Link primary + inline card-form fallback |
| `invoices.html` | 521 | Tax-season invoice manager — search / filter / export CSV / detail modal with mock Stripe charge ID |
| `pay.html` | 290 | Customer-facing branded payment page — Apple Pay / Google Pay / Affirm / Klarna / card form |

### Assets

| File | Purpose |
|---|---|
| `assets/styles.css` | ~3,000 lines · single global stylesheet · all classes prefixed `gdk-` · brand tokens at `:root` |
| `assets/mock-data.js` | ~600 lines · `window.GDK_DATA` namespace exposing customers / leads / jobs / estimates / smsLog / reviews / payments / portalUser / services / neighborhoods · plus `getDemoPayments` / `saveDemoPayment` / `getDemoLeads` / `saveDemoLead` / `getDemoMessages` / `saveDemoMessage` localStorage helpers · plus `gdkToast()` / `gdkSignOut()` / `gdkInitDismissibleBanner()` UI utilities |
| `assets/nav-mobile.js` | Auto-attaches hamburger mobile nav to any page with a `.gdk-nav` element |
| `config.js` | Brand identity tokens (colors, fonts, business identity) — single source of truth |
| `assets/photos/` | 14 branded Gemini AI photos (hero, 6 service cards, 4 featured installs, 3 team) |
| `assets/gdk-wordmark.png`, `gdk-crown-gold.png`, `favicon.png` | Logo assets |

### Mock data record counts (from `window.GDK_DATA`)

| Collection | Count | Notes |
|---|---|---|
| `customers` | 17 | Realistic Las Vegas mix (names span Hispanic/Latino, Black, Asian, Anglo, Middle Eastern) |
| `leads` | 60 | Status distribution: 12 New / 15 Contacted / 10 Estimated / 15 Won / 8 Lost |
| `jobs` | 12 | Mix of scheduled / in-progress |
| `estimates` | 8 | Mix of draft / sent / approved / declined |
| `smsLog` | 35 | Two-way conversations alternating direction |
| `reviews` | 12 | sent / reviewed states with stars + channel |
| `payments` | 38 | Spans Jun 2025 → today, ~$30K total. All payment methods represented. |
| `services` | 6 | Emergency / Spring / Opener / New Door / Commercial / Maintenance |
| `neighborhoods` | 8 | Henderson / Summerlin / Paradise / Spring Valley / Enterprise / North Las Vegas / Boulder City / Las Vegas |
| `portalUser` (Michael Robinson) | 1 customer + 3 past jobs + 1 upcoming + 4 invoices + 4 messages | |
| Live demo entries (per browser) | localStorage | Newly-created leads / payments / messages persist across reloads, capped at 50 each |

**All data conventions:**
- Phone format: `702-555-XXXX` (FCC fake-number prefix)
- Dates relative via `_d(daysOffset, hour, minute)` helper — never stale
- Real LV neighborhoods + street names
- Realistic amounts ($89 service call → $3,200 commercial door)

---

## Reusable utilities (already exported, callable from any page)

```js
// Toast notifications (P3)
window.gdkToast({
  title: 'New lead added',
  subtitle: 'Pamela Stewart · Henderson',
  icon: '🆕',
  variant: 'success',  // optional
  duration: 3800       // optional ms
});

// Sign-out fade redirect (P3)
window.gdkSignOut('/demos/garage/');  // optional redirect path

// localStorage CRUD for demo state (P3 + earlier)
window.GDK_DATA.saveDemoPayment(record);
window.GDK_DATA.getDemoPayments();
window.GDK_DATA.clearDemoPayments();
window.GDK_DATA.saveDemoLead(record);
window.GDK_DATA.getDemoLeads();
window.GDK_DATA.clearDemoLeads();
window.GDK_DATA.saveDemoMessage(msg);
window.GDK_DATA.getDemoMessages();
```

Mobile nav, dismissible demo banner, and toast-helper are auto-init on DOMContentLoaded — no per-page wiring needed beyond `<script src="/demos/garage/assets/mock-data.js"></script>` and `<script src="/demos/garage/assets/nav-mobile.js" defer></script>`.

---

## CSS architecture (`styles.css`)

Single ~3,000-line global stylesheet. Structure:

1. **Brand tokens** at `:root` (lines ~33-50): copper accents, dark theme, font stack
2. **Demo banner + nav** (~70-200): top-of-page chrome
3. **Buttons** (`.gdk-btn` / `.gdk-btn-primary` / `.gdk-btn-outline` / `.gdk-btn-payment-cta`)
4. **Typography utilities** (`.gdk-eyebrow` / `.gdk-accent-text`)
5. **Hero + sections** (~300-600)
6. **Forms** (`.gdk-input` / `.gdk-error-msg` / `.gdk-consent-card`)
7. **Overlays** (`.gdk-overlay` + `.gdk-stage` two-stage spinner→success pattern)
8. **Portal main** (`.gdk-portal-main` / `.gdk-portal-card` / `.gdk-portal-grid`)
9. **Tables** (`.gdk-table` / `.gdk-badge` family)
10. **Photos** (`.gdk-service-photo` / `.gdk-team-card` / `.gdk-photo-tile`)
11. **Pay page** (`.gdk-pay-card` / `.gdk-pay-method` family with Apple Pay / Google Pay / Affirm / Klarna variants)
12. **Mobile card-stack** (`@media (max-width: 600px)` block — turns `<table>` rows into card grids via `data-card-area` attributes)
13. **Today view** (mobile-first dashboard)
14. **Toast / sign-out / modal** (reusable components)
15. **Hamburger mobile nav** (`.gdk-burger` + `.gdk-mobile-drawer`)
16. **Customer invoice cards** (Pay Now buttons on portal)

**Conventions**: every class prefixed `gdk-`. Brand tokens via CSS custom properties. No CSS frameworks (no Tailwind, no Bootstrap). No build step.

---

## Pattern: how to clone GDK to a new vertical (HVAC, plumbing, etc.)

**The canonical workflow is documented in `/demos/README.md`.** Read that file first if cloning. Summary:

1. **Branch off main**: `git checkout -b claude/<vertical>-demo`
2. **Copy GDK as starting template**: `cp -r demos/garage demos/<vertical>`
3. **Edit `demos/<vertical>/config.js`**: change brand identity, colors, services
4. **Edit `demos/<vertical>/assets/styles.css`**: update `:root` tokens (just the values, keep the variable names)
5. **Find/replace business name** across all 11 HTML files
6. **Update `mock-data.js`**: vertical-appropriate names + services + amounts
7. **Generate 14 branded photos via Gemini** (workflow documented in `/demos/README.md` "Photography workflow" section): hero, 6 service cards, 3 team headshots, 4 featured installs. Drop into `~/Downloads/`, Claude swaps via sips per the documented dimensions.
8. **Update `index.html` portfolio card on root** for the new vertical
9. **Local preview**: `python3 -m http.server 8080` from repo root → `http://localhost:8080/demos/<vertical>/`
10. **Commit + merge to main**

---

## Branding tokens that change per vertical

In `config.js` and `styles.css :root`:

- `--gdk-bg`, `--gdk-bg-deeper`: page background tones (most demos: dark)
- `--gdk-accent`: primary brand color (GDK = copper #B8732E; HVAC could be blue, plumbing teal, electrical yellow, etc.)
- `--gdk-accent-bright`, `--gdk-accent-pale`: hover + light variants
- Fonts: GDK uses Fraunces (display) + Inter (body). Other verticals can use same combo or swap.
- Class prefix: `gdk-` should become `<vertical>-` (e.g., `hvk-` for HVAC Kings) for namespacing — but this is a refactor, not strictly required for an MVP demo

---

## Out-of-scope but worth knowing

### Production starter at `/Users/apple/Cursor-Claude/velonyx-trades-template/`

A Next.js 14 + TypeScript + Tailwind scaffold paused mid-Phase-0. Has 16 deps installed (Supabase / Stripe / Twilio / Resend / framer-motion / lucide-react / RHF / Zod) but no real code yet. Estimated 16-24 hours to bring to production-grade. This is what we use when Carlos lands his first paying client and needs real backend behind the demo. Documented in earlier handoff as future work.

### Other live demos

- `/demos/smp/` — Apex SMP Studio (scalp micropigmentation). Different vertical, different brand tokens. Less feature-rich than GDK (no admin / payments / invoices). Could be upgraded to GDK's level of feature richness if a SMP client signs.

### Public marketing site (Velonyx itself)

`velonyxsystems.com` — Carlos's main lead-gen site for selling these demos to prospects. Lives in repo root (`index.html`, `checkout.html`, `book.html`, etc.). Don't confuse with the demo sub-pages.

---

## Pending decisions / open questions

These came up during the recent sessions and were noted but not resolved:

1. **NV sales tax (8.375%)** is hardcoded in the invoice modal on `/invoices.html`. When cloning to a new state-specific vertical, this needs to be configurable in `config.js` per-state.

2. **Service-call deposit amount ($89)** is hardcoded in `/contact.html`. Different trades may want different amounts (HVAC $129, electrical $149). Move to `config.js`.

3. **Marcus reply texts on portal Send Message** rotate through 5 hardcoded strings. Could be expanded or pulled from config.

4. **Empty states for admin sections** use friendly hand-written copy with single emoji icons. Could be swapped to Lucide SVGs for consistency in v2.

5. **Tradesman's iOS contactless tap-to-pay** is OFF the table for web demos (would require native app). Customer-side Apple Pay via SMS link works perfectly. Documented in `/docs/UX_UPGRADE_SUMMARY.md`.

6. **No backend.** Every interaction is mocked or persists to localStorage. When a paying client signs, work moves to the Next.js production starter (queued separately).

---

## How to verify state cold

```bash
# Live URLs to spot-check
curl -s -o /dev/null -w "%{http_code} %{size_download}b — admin\n" "https://velonyxsystems.com/demos/garage/admin.html"
curl -s -o /dev/null -w "%{http_code} %{size_download}b — admin-pay\n" "https://velonyxsystems.com/demos/garage/admin-pay.html"
curl -s -o /dev/null -w "%{http_code} %{size_download}b — pay\n" "https://velonyxsystems.com/demos/garage/pay.html?id=PAY-1253"
curl -s -o /dev/null -w "%{http_code} %{size_download}b — portal\n" "https://velonyxsystems.com/demos/garage/portal.html"
curl -s -o /dev/null -w "%{http_code} %{size_download}b — invoices\n" "https://velonyxsystems.com/demos/garage/invoices.html"
curl -s -o /dev/null -w "%{http_code} %{size_download}b — contact\n" "https://velonyxsystems.com/demos/garage/contact.html"
```

Expected sizes (live, current):

| Page | Size |
|---|---|
| `/` | 21,793b |
| `/admin.html` | 44,096b |
| `/admin-pay.html` | 20,046b |
| `/portal.html` | 22,803b |
| `/invoices.html` | 28,315b |
| `/pay.html` | 18,856b |
| `/contact.html` | 21,789b |

Smaller-than-expected sizes mean the deploy is stale. The above are correct as of merge `5244522` (the most recent on main).

---

## Reference docs already in the repo

- **`/demos/README.md`** — build-pattern guide for cloning GDK to new verticals. Read this BEFORE starting any new vertical demo.
- **`/docs/PORTAL_AUDIT.md`** — original audit (mid-session). Now somewhat stale — pre-P1-P6 UX upgrade. Useful for historical context.
- **`/docs/UX_UPGRADE_SUMMARY.md`** — comprehensive summary of P1-P6 portal UX work. Still current as of UX upgrade merge.
- **`/docs/screenshots/`** — 10 screenshots (5 desktop, 5 mobile) from the audit. Pre-hamburger-nav, pre-tap-to-pay-removal — useful as historical reference but not current state.
- **`/demos/NEXT.md`** — older bookmark from earlier session (pre-payment-flow). Largely superseded by this doc.
- **`CLAUDE.md`** in repo root — overall project context, deploy gates, infra notes.

---

## What Carlos plans next

> "i want to build a the website model for the home service business starting with the garage door repair. after claude inspects it then i will place the prompt in here"

Two reasonable interpretations:

1. **Formalize GDK as a reusable home-services starter template.** Extract the GDK pattern into `/demos/_template/` or similar with hooks for brand tokens / business identity, so HVAC Kings / Plumbing Kings / Electrician Kings clone in 2-4 hours each instead of the ~12+ hours GDK took. The mock-data.js / styles.css / nav-mobile.js / config.js scaffolding is already mostly reusable; the templating step formalizes it.

2. **Build a NEW garage door repair business demo for a specific paying client.** Different brand name, different colors, different photos — but using GDK as the model. This would be Velonyx's first commercial deploy.

Either way, the next agent should:
- Read this handoff doc first
- Read `/demos/README.md` second
- Open `https://velonyxsystems.com/demos/garage/admin.html` on phone + desktop to feel the current state
- Then receive Carlos's specific prompt and execute

---

## Branch state when this doc was written

- Current branch in worktree: `claude/session-handoff` (this branch)
- `main` last commit: `5244522` (in-person flow refactor)
- All recent feature branches merged into main
- 4 unmerged feature branches still on origin (can be deleted): `claude/garage-payment-flow`, `claude/garage-portal-ux-upgrade`, `claude/garage-mobile-nav`, `claude/garage-tap-to-pay`, `claude/garage-send-link-first`
- Worktree at: `/Users/apple/Cursor-Claude/velonyx-website/.claude/worktrees/zen-bouman/`
- Primary worktree at: `/Users/apple/Cursor-Claude/`

Carlos has been deploying every change to live as we go (`main` → GitHub Pages auto-deploy in ~30s). The live demo is always the source of truth for what's shipped.
