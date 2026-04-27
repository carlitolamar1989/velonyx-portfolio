# Portal Audit — Garage Door Kings Demo

**Generated:** 2026-04-26
**Branch:** `claude/garage-payment-flow` (4 commits ahead of `main`, awaiting Carlos approval to merge)
**Live URL when deployed:** `https://velonyxsystems.com/demos/garage/`

---

## 1. Portal Scope

**Confirmed: BOTH portals are built.**

The demo has two distinct logged-in experiences plus a third payment-focused customer surface:

### A. Tradesman / Owner Portal (the "admin" — Marcus Reed's view)
The business owner's daily-driver dashboard. Money tracking, lead/customer management, job calendar, SMS log, invoice manager, payment creation. Three pages:

| Page | Status | Purpose |
|---|---|---|
| `/demos/garage/admin.html` | ✅ Complete | Main owner dashboard — KPIs, payments table, customer requests, jobs, SMS, estimates, reviews |
| `/demos/garage/admin-pay.html` | ✅ Complete | "Take a Payment" form — type a custom amount, send link OR take payment in person |
| `/demos/garage/invoices.html` | ✅ Complete | Tax-season invoice manager — search, filter, CSV export, full receipt detail with mock Stripe charge IDs |

### B. End-Customer Portal (Maria-the-customer's view)
The logged-in customer's view of their own jobs, invoices, and conversation with the company.

| Page | Status | Purpose |
|---|---|---|
| `/demos/garage/portal.html` | ✅ Complete (basic) | Customer dashboard — upcoming service, payment summary, past jobs, messages, documents |
| `/demos/garage/pay.html` | ✅ Complete | Branded customer-facing payment page — Apple Pay / Google Pay / Affirm / Klarna / card. Shared between Flow 1 (link sent via SMS) and Flow 2 (in-person handoff on tradesman's device) |

### C. Public marketing pages (not portal, but part of the demo for context)
`index.html`, `services.html`, `service-areas.html`, `about.html`, `reviews.html`, `contact.html` — public-facing site that funnels into the portals.

### Not yet started
- Customer-portal "Pay Now" button on outstanding invoices (currently the customer can SEE invoice history but can't tap to pay one — they'd need to receive a fresh link from the tradesman). Documented in `/demos/NEXT.md` as v2.
- Service-call deposit at booking ($89 charged at time of `/contact.html` lead form submit) — discussed with Carlos earlier in session, deferred.
- Customer-portal: "Download my receipts" / yearly-summary view for the END customer's tax records.

---

## 2. File Inventory

### Tradesman / Owner Portal

| Path | Lines | What it shows |
|---|---|---|
| `demos/garage/admin.html` | 403 | Owner dashboard. Top: KPI row (4 cards). Then: Money/Payments section (stat cards + recent invoices table + "+ Take a Payment" CTA). Then: New Customer Requests (filterable leads table). Then: Upcoming Jobs + SMS Log (two-col on desktop). Then: Active Estimates + Recent Reviews (two-col on desktop). |
| `demos/garage/admin-pay.html` | 238 | Take-a-Payment form: 4 inputs (Customer Name, Phone or Email, Amount with $ prefix, Description). Two submit buttons: "Send Link to Customer" (primary copper) and "Take Payment Now" (outline). On Send Link: full-screen overlay shows mock SMS preview with the payment URL. On Take Now: navigates to `/pay.html?...&mode=inperson`. Both flows persist the new invoice to localStorage. |
| `demos/garage/invoices.html` | 521 | Invoice manager. Header has "Stripe connected · last synced just now" green pill. 4 KPI cards (YTD Revenue / This Month / Outstanding / # Invoices YTD). Filter bar (status chips, date range chips, search input). Full invoices table sorted by date desc. Click any row → modal with full receipt: subtotal / NV sales tax (8.375%) / total, payment method, mock Stripe charge ID, action buttons (Download PDF / Resend Receipt / Refund — all mocked with explanatory alerts). "Export CSV" button generates downloadable file with all filtered rows. |

### End-Customer Portal

| Path | Lines | What it shows |
|---|---|---|
| `demos/garage/portal.html` | 224 | Customer dashboard for "Michael Robinson". Sample banner. Welcome header (avatar + name + "Customer since October 2025 · Henderson, NV"). "Your Upcoming Service" card (date, time, tech, address, total + deposit, Reschedule + Directions buttons). "Payment Summary" card (mini invoice table, balance due banner). "Past Jobs" list. "Messages" two-way conversation (latest from Marcus). "Documents & Warranty" 3 mock PDFs. |
| `demos/garage/pay.html` | 312 | Customer-facing branded payment page. Reads `?id=XXX` from URL (looks up in mock data) OR `?name=...&amount=...&desc=...` (newly-created invoice from admin-pay). Shows GDK header + crown, "Hi <FirstName>," greeting, invoice card with description + amount in big serif. Payment buttons in modern hierarchy: Apple Pay (black, top), Google Pay (white), Affirm (blue, ≥$50 minimum), Klarna (pink, ≥$35), then collapsed "or pay by card" expander. Tap any → mock processing overlay → success animation with mock receipt. Supports `?mode=inperson` for the "Pass the phone to your customer" handoff overlay (1.6s before payment UI appears). |

### Shared assets / data layer

| Path | Lines | What it is |
|---|---|---|
| `demos/garage/assets/mock-data.js` | 423 | All fake-but-realistic data exposed as `window.GDK_DATA`. Plus localStorage helpers (`getDemoPayments`, `saveDemoPayment`, `clearDemoPayments`) so newly-created invoices persist across page navigation. |
| `demos/garage/assets/styles.css` | 1,866 | Single global stylesheet for the entire demo (vanilla CSS, no preprocessors, no Tailwind). Brand tokens at `:root` level. All component classes prefixed `gdk-`. |
| `demos/garage/config.js` | 112 | Brand identity tokens (colors, fonts, business identity) — single source of truth that mirrors the CSS custom properties. |

**Total demo footprint:** 11 HTML pages + 3 shared JS/CSS files + 14 photos = ~5,200 lines of code, ~5MB photos.

---

## 3. First Screen / Landing View

**There are two "landing screens" depending on which portal you enter.** The most-recently-iterated and most-feature-rich is the **Tradesman Admin Dashboard** (`/admin.html`) — that's the headline screen of the whole portal experience.

### After simulated login as Marcus Reed (owner), they land on `/admin.html` and see:

1. **Top of page:** Sticky demo banner ("DEMO — EXAMPLE DEPLOYMENT BY VELONYX SYSTEMS") followed by branded nav (GDK wordmark + crown logo on left; Public Site / Customer View / **Dashboard** (active, copper highlight) / **Invoices** / Sign Out (Marcus) on right).

2. **Sample-data callout:** Subtle copper-bordered banner explaining "Sample admin dashboard — logged in as Marcus Reed (owner). Pre-populated with realistic mock data: 60 leads · 12 jobs · 8 estimates · 17 customers · 35 SMS · 12 review requests."

3. **Owner header:** Big "MR" copper avatar, "OWNER DASHBOARD" eyebrow, "Marcus Reed" in large Fraunces serif copper, then today's date + "3 trucks active · 4 techs on shift". Right side: 3 buttons — **Export Data** (outline) / **+ New Lead** (outline) / **+ Take a Payment** (primary copper gradient with credit card icon).

4. **KPI row** (4 cards, equal width on desktop, stack on mobile):
   - **New Leads · 7 Days** (computed from `D.leads` filter) · "↑ 18% vs prior week"
   - **Jobs Scheduled · 30 Days** (computed from `D.jobs`) · "↑ 4 vs last month"
   - **Open Quotes & Booked Jobs** ($43,358 — sum of pipeline + sent estimates) · "Money on the calendar"
   - **Win Rate · 90 Days** (65%) · "↑ 6 pts vs prior 90"

5. **Money/Payments section** (THE HEADLINE, by Carlos's design choice):
   - "MONEY" eyebrow / "Payments" Fraunces title / clarifying subtitle ("Every invoice you've sent or taken in person. Tap '+ Take a Payment' to create a new one — pick whatever amount you negotiated.")
   - **+ Take a Payment** copper CTA on the right
   - 3 stat cards: **Paid · 7 Days** ($7,467) / **Total Collected** ($29,749) / **Pending Links** ($1,835)
   - Recent payments table (Date · Customer · Description · Amount · Method badge · Status badge) — top 14 entries
   - Meta line: "Showing 14 of 38 payments · 2 awaiting payment · View All Invoices →"

6. **New Customer Requests section** (renamed from "Lead Pipeline" per Carlos feedback):
   - "NEW INQUIRIES" eyebrow / "New Customer Requests" Fraunces title / subtitle ("People who reached out asking for service — through your website, a call, or a Google search. Filter by where they are in the process.")
   - Filter chips: All (active) · New · Contacted · Quoted · Won · Lost
   - 7-column table: Name · Service · Neighborhood · Est. Value · Source · Status badge · Created date

7. **Two-column row** (stacks on mobile): **Upcoming Jobs** (next 30 days, with date avatar + customer + tech + value) AND **SMS Log** (last 14 SMS, color-coded in/out direction).

8. **Two-column row** (stacks on mobile): **Active Estimates** table AND **Recent Review Requests** list.

9. **Footer:** Branding + "Built by Velonyx Systems · This is a demonstration platform"

### Full HTML of `admin.html` (the landing page)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/demos/garage/assets/favicon.png">
  <link rel="apple-touch-icon" href="/demos/garage/assets/gdk-crown-gold.png">
  <title>Admin Dashboard — Garage Door Kings (Velonyx Demo)</title>
  <meta name="description" content="Sample admin dashboard for Garage Door Kings. Lead pipeline, jobs calendar, SMS log, reviews. Built by Velonyx Systems.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/demos/garage/assets/styles.css">
</head>
<body>
  <div class="demo-banner">DEMO — EXAMPLE DEPLOYMENT BY <a href="https://velonyxsystems.com" target="_blank" rel="noopener">VELONYX SYSTEMS</a></div>

  <nav class="gdk-nav">
    <div class="gdk-nav-inner">
      <a href="/demos/garage/" class="gdk-logo" aria-label="Garage Door Kings"><img src="/demos/garage/assets/gdk-wordmark.png" alt="Garage Door Kings" class="gdk-logo-img"></a>
      <div class="gdk-nav-links" style="display:flex;">
        <a href="/demos/garage/">Public Site</a>
        <a href="/demos/garage/portal.html" style="color:var(--gdk-text-faint);font-size:0.78rem;">Customer View</a>
        <a href="/demos/garage/admin.html" style="color:var(--gdk-accent);">Dashboard</a>
        <a href="/demos/garage/invoices.html">Invoices</a>
        <button class="gdk-btn gdk-btn-outline gdk-btn-small">Sign Out (Marcus)</button>
      </div>
      <button class="gdk-btn gdk-btn-outline gdk-btn-small gdk-nav-mobile-cta">Sign Out</button>
    </div>
  </nav>

  <main class="gdk-portal-main" style="max-width:1400px;">
    <div class="gdk-sample-banner">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8732E" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" stroke-linecap="round"/></svg>
      <div>
        <div class="t">Sample admin dashboard — logged in as Marcus Reed (owner)</div>
        <div class="s">Pre-populated with realistic mock data: 60 leads · 12 jobs · 8 estimates · 17 customers · 35 SMS · 12 review requests. In a real deployment, all data is live and writable.</div>
      </div>
    </div>

    <!-- HEADER -->
    <header class="gdk-portal-header">
      <div class="gdk-portal-welcome">
        <div class="gdk-avatar-large">MR</div>
        <div>
          <div class="gdk-portal-card-label">Owner Dashboard</div>
          <div class="gdk-portal-name gdk-accent-text">Marcus Reed</div>
          <div class="gdk-portal-meta" id="header-meta">—</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="gdk-btn gdk-btn-outline gdk-btn-small">Export Data</button>
        <button class="gdk-btn gdk-btn-outline gdk-btn-small">+ New Lead</button>
        <a href="/demos/garage/admin-pay.html" class="gdk-btn gdk-btn-primary gdk-btn-small gdk-btn-payment-cta">
          <span style="display:inline-flex;align-items:center;gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            + Take a Payment
          </span>
        </a>
      </div>
    </header>

    <!-- KPI ROW -->
    <div class="gdk-kpi-grid">
      <div class="gdk-kpi">
        <div class="gdk-kpi-label">New Leads · 7 Days</div>
        <div class="gdk-kpi-value" id="kpi-new-leads">—</div>
        <div class="gdk-kpi-delta up" id="kpi-leads-delta">↑ 18% vs prior week</div>
      </div>
      <div class="gdk-kpi">
        <div class="gdk-kpi-label">Jobs Scheduled · 30 Days</div>
        <div class="gdk-kpi-value" id="kpi-jobs">—</div>
        <div class="gdk-kpi-delta up">↑ 4 vs last month</div>
      </div>
      <div class="gdk-kpi">
        <div class="gdk-kpi-label">Open Quotes &amp; Booked Jobs</div>
        <div class="gdk-kpi-value" id="kpi-pipeline">—</div>
        <div class="gdk-kpi-delta up">Money on the calendar</div>
      </div>
      <div class="gdk-kpi">
        <div class="gdk-kpi-label">Win Rate · 90 Days</div>
        <div class="gdk-kpi-value" id="kpi-win">—</div>
        <div class="gdk-kpi-delta up">↑ 6 pts vs prior 90</div>
      </div>
    </div>

    <!-- TWO-COLUMN MAIN -->
    <div class="gdk-portal-grid" style="grid-template-columns:1fr;gap:18px;">

      <!-- PAYMENTS LOG (top — money first) -->
      <section class="gdk-portal-card full">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:10px;">
          <div>
            <div class="gdk-portal-card-label">Money</div>
            <h2 class="gdk-portal-card-title" style="margin-bottom:4px;">Payments</h2>
            <div style="font-size:0.82rem;color:var(--gdk-text-muted);max-width:540px;line-height:1.5;">Every invoice you've sent or taken in person. Tap "+ Take a Payment" to create a new one — pick whatever amount you negotiated.</div>
          </div>
          <a href="/demos/garage/admin-pay.html" class="gdk-btn gdk-btn-primary gdk-btn-small gdk-btn-payment-cta">
            <span style="display:inline-flex;align-items:center;gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              + Take a Payment
            </span>
          </a>
        </div>
        <div class="gdk-payments-totals" id="payments-totals"></div>
        <div class="gdk-table-wrap">
          <table class="gdk-table gdk-payments-table">
            <thead>
              <tr><th>Date</th><th>Customer</th><th>Description</th><th style="text-align:right;">Amount</th><th>Method</th><th>Status</th></tr>
            </thead>
            <tbody id="payments-tbody"></tbody>
          </table>
        </div>
        <div style="font-size:0.78rem;color:var(--gdk-text-faint);margin-top:14px;text-align:center;" id="payments-meta">—</div>
      </section>

      <!-- NEW CUSTOMER REQUESTS (formerly "Lead Pipeline" — friendlier label for trades) -->
      <section class="gdk-portal-card full">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:10px;">
          <div>
            <div class="gdk-portal-card-label">New Inquiries</div>
            <h2 class="gdk-portal-card-title" style="margin-bottom:4px;">New Customer Requests</h2>
            <div style="font-size:0.82rem;color:var(--gdk-text-muted);max-width:540px;line-height:1.5;">People who reached out asking for service — through your website, a call, or a Google search. Filter by where they are in the process.</div>
          </div>
          <div class="gdk-chip-bar" style="margin-bottom:0;">
            <button class="gdk-chip active" data-filter="all">All</button>
            <button class="gdk-chip" data-filter="new">New</button>
            <button class="gdk-chip" data-filter="contacted">Contacted</button>
            <button class="gdk-chip" data-filter="estimated">Quoted</button>
            <button class="gdk-chip" data-filter="won">Won</button>
            <button class="gdk-chip" data-filter="lost">Lost</button>
          </div>
        </div>
        <div class="gdk-table-wrap">
          <table class="gdk-table">
            <thead>
              <tr><th>Name</th><th>Service</th><th>Neighborhood</th><th>Est. Value</th><th>Source</th><th>Status</th><th>Created</th></tr>
            </thead>
            <tbody id="leads-tbody"></tbody>
          </table>
        </div>
        <div style="font-size:0.78rem;color:var(--gdk-text-faint);margin-top:14px;text-align:center;" id="leads-meta">—</div>
      </section>

      <!-- TWO-COL: Jobs + SMS Log -->
      <div style="display:grid;grid-template-columns:1fr;gap:18px;" id="row-jobs-sms"></div>

      <!-- ESTIMATES + REVIEWS -->
      <div style="display:grid;grid-template-columns:1fr;gap:18px;" id="row-est-rev"></div>

    </div>
  </main>

  <footer class="gdk-footer">
    <div class="gdk-footer-inner">
      <div class="gdk-footer-brand"><img src="/demos/garage/assets/gdk-wordmark.png" alt="Garage Door Kings" class="gdk-logo-img" style="height:30px;"></div>
      <p class="gdk-footer-tag">Las Vegas's Most Trusted Garage Door Specialists</p>
      <p class="gdk-footer-meta">Built by <a href="https://velonyxsystems.com" target="_blank" rel="noopener">Velonyx Systems</a> · This is a demonstration platform</p>
    </div>
  </footer>

  <script src="/demos/garage/config.js"></script>
  <script src="/demos/garage/assets/mock-data.js"></script>
  <script>
    // [240 lines of inline JS that:
    //  1. Computes KPI values from D.leads / D.jobs / D.estimates
    //  2. Renders the leads table with filter-chip wiring
    //  3. Renders Jobs + SMS Log cards (innerHTML-injected into row-jobs-sms)
    //  4. Renders Estimates + Reviews cards (innerHTML-injected into row-est-rev)
    //  5. Merges localStorage demo entries with static D.payments + sorts by date desc
    //  6. Renders the Payments table (top 14) with method/status badges
    //  7. Computes Paid·7Days / Total Collected / Pending Links stat cards
    //  8. Wires the "Reset Demo Data" link with confirm() → D.clearDemoPayments() + reload]
    // Full JS shown in the actual file at demos/garage/admin.html lines 165–401.
  </script>
</body>
</html>
```

---

## 4. Navigation Structure

### Tradesman / Owner portal nav (top of every admin page)

| Nav item | Functional? | Destination |
|---|---|---|
| GDK wordmark logo (left) | ✅ Functional | `/demos/garage/` (back to public site) |
| Public Site | ✅ Functional | `/demos/garage/` (homepage) |
| Customer View | ✅ Functional | `/demos/garage/portal.html` (lets owner peek at what their customer sees) |
| Dashboard | ✅ Functional (active state) | `/demos/garage/admin.html` |
| Invoices | ✅ Functional | `/demos/garage/invoices.html` |
| Sign Out (Marcus) | ❌ Placeholder | No-op (no auth system to sign out of) |

### Customer portal nav (top of `/portal.html`)

| Nav item | Functional? | Destination |
|---|---|---|
| GDK wordmark logo (left) | ✅ Functional | `/demos/garage/` |
| Home | ✅ Functional | `/demos/garage/` |
| Services | ✅ Functional | `/demos/garage/services.html` |
| Portal | ✅ Functional (active state) | `/demos/garage/portal.html` |
| Admin View | ✅ Functional (small/dim) | `/demos/garage/admin.html` (lets demo viewer hop to admin perspective) |
| Sign Out | ❌ Placeholder | No-op |

### Customer payment page nav (top of `/pay.html`)

Minimalist by design — focused payment screen with no full nav. Only:
- GDK logo + crown SVG (left, links back to homepage)
- "🔒 Secure payment" indicator (right, decorative)

### Admin-Pay nav (top of `/admin-pay.html`)

| Nav item | Functional? | Destination |
|---|---|---|
| ← Back to Dashboard | ✅ Functional | `/demos/garage/admin.html` |
| Admin (dim/small) | ✅ Functional | `/demos/garage/admin.html` |
| Sign Out (Marcus) | ❌ Placeholder | No-op |

### Invoices page nav (top of `/invoices.html`)

| Nav item | Functional? | Destination |
|---|---|---|
| ← Dashboard | ✅ Functional | `/demos/garage/admin.html` |
| Invoices | ✅ Functional (active state) | `/demos/garage/invoices.html` (current) |
| + New Payment (small/dim) | ✅ Functional | `/demos/garage/admin-pay.html` |
| Sign Out (Marcus) | ❌ Placeholder | No-op |

---

## 5. Key Interactions

### `/admin.html` (owner dashboard)

| Element | Where | What it does | States |
|---|---|---|---|
| **Lead-pipeline filter chips** (All / New / Contacted / Quoted / Won / Lost) | New Customer Requests section | Real client-side filter — re-renders the leads table from `D.leads` on click | Active state on selected chip; no loading state needed (instant) |
| **+ Take a Payment** (header CTA + section CTA) | Header right side; Payments section header | Navigates to `/admin-pay.html` | Static link, hover state |
| **+ New Lead** | Header | ❌ No-op (placeholder for v2 — would open a "manually-add-lead" form) | None |
| **Export Data** | Header | ❌ No-op (placeholder for v2 — would export full CSV; the `/invoices.html` page has a real CSV export for the payments subset) | None |
| **View All Invoices →** | Payments section meta line | Navigates to `/invoices.html` | Static link |
| **Reset Demo Data** | Payments section meta line (only visible when ≥1 live demo entry exists) | `confirm()` dialog → clears localStorage live entries → reload | Confirm dialog → reload |
| **Sign Out (Marcus)** | Nav | ❌ No-op | None |

### `/admin-pay.html` (Take-a-Payment form)

| Element | Where | What it does | States |
|---|---|---|---|
| **Customer Name input** | Form | Required text input | Validation error highlighted on submit if empty |
| **Phone or Email input** | Form | Required text input — accepts either 10-digit phone OR valid email regex | Error if invalid |
| **Amount input** | Form | Required number input with $ prefix decoration; min $1 | Error if <$1 |
| **What was the work** input | Form | Required text input | Error if empty |
| **SEND LINK TO CUSTOMER** button | Bottom of form | (1) Validates form (2) Generates random invoice ID (3) Saves new payment to localStorage as `link-sent` / `pending` (4) Opens overlay: stage 1 spinner ("Sending Payment Link" 1.6s) → stage 2 success with mock SMS preview ("GDK: Hi <name> — your invoice for $X is ready: gdk.com/p/PAY-XXXX") + buttons to "Preview Customer's Page" or "Back to Dashboard" | Spinner → checkmark success → CTAs |
| **TAKE PAYMENT NOW** button | Bottom of form | (1) Validates form (2) Saves new payment to localStorage as `paid-inperson` / `pending` (3) Navigates to `/pay.html?id=...&name=...&amount=...&desc=...&mode=inperson` | Immediate navigation |

### `/pay.html` (branded customer payment page)

| Element | Where | What it does | States |
|---|---|---|---|
| **In-person handoff overlay** | Full-screen, only when `?mode=inperson` | Shows "Pass the phone to your customer" prompt for 1.6s, then auto-fades | Fades out via opacity transition |
| **Apple Pay** button | Top of payment methods | Mock click → processing overlay (1.8s spinner "Processing Payment / Securely charging Apple Pay...") → success animation with mock receipt → updates localStorage to `paid` with `paymentMethod: 'apple-pay'` | Spinner → checkmark with receipt details |
| **Google Pay** button | Same | Same flow, `paymentMethod: 'google-pay'` | Same |
| **Affirm** button | Conditional (≥$50) | Same flow with "Affirm financing" label | Same |
| **Klarna** button | Conditional (≥$35) | Same flow | Same |
| **"or pay by card" expander** | Below BNPL options | Reveals card form (number / exp / CVC / ZIP) when clicked; chevron rotates 180° | Collapsed by default; smooth max-height transition |
| **PAY $X** button (card form) | Inside card expander | Same processing flow with last-4 of typed card number in receipt label | Same |
| **Already-paid handling** | Top of payment methods (replaces buttons if invoice was already paid) | Disables all buttons + shows green "✓ This invoice was already paid on [date]" banner | No interaction |

### `/invoices.html` (invoice manager)

| Element | Where | What it does | States |
|---|---|---|---|
| **Status filter chips** (All / Paid / Pending) | Filter bar | Re-filter table on click | Active state on selection |
| **Date range filter chips** (This Month / This Quarter / This Year (default) / Last Year / All Time) | Filter bar | Real date filter using JS `new Date()` comparisons against each invoice's `paidAt` or `createdAt` | Active state |
| **Search input** | Filter bar | Real live filter on customer name, invoice ID, phone, email, description (lowercase substring match) | Updates table on each keystroke |
| **Click any invoice row** | Table | Opens invoice detail modal with full receipt, tax breakdown, mock Stripe charge ID, and 3 action buttons | Modal fades in via opacity |
| **× Modal close** / Click outside / Escape key | Modal | Closes the detail modal | Modal fades out |
| **Download PDF** (in modal) | Modal action bar | ❌ Mock — `alert()` explaining "In production this hits Stripe Invoices API → their hosted invoice PDF" | Alert popup |
| **Resend Receipt** (in modal) | Modal action bar | ❌ Mock — `alert()` explaining "In production this triggers Resend (email) or Twilio (SMS) with the Stripe-hosted receipt URL" | Alert popup |
| **Refund** (in modal) | Modal action bar | ❌ Mock — `confirm()` then `alert()` (only enabled for paid invoices) | Confirm → alert |
| **Export CSV** | Header right | Real Blob-based CSV download. Filename `gdk-invoices-<range>-<YYYY-MM-DD>.csv`. Headers: Date, Invoice ID, Customer, Phone, Email, Description, Amount, Method, Status, Paid Date, Payment Type, Tech. Properly handles commas/quotes/newlines in field values. | Browser download |

### `/portal.html` (end-customer portal — Michael Robinson's view)

| Element | Where | What it does | States |
|---|---|---|---|
| **Reschedule** | Upcoming Service card | ❌ Placeholder button (would open a calendar picker in v2) | None |
| **Directions** | Upcoming Service card | ✅ Real link to `https://maps.google.com/?q=<address>` | Opens Google Maps in new tab |
| **Send (message input)** | Messages card | ❌ Placeholder — no actual send (input + button render but don't persist) | None |
| **Document download buttons** | Documents & Warranty card | ❌ Mock — `alert("Demo: PDF download would trigger in a real deployment.")` | Alert |
| **Request Service** | Header right | ✅ Real link to `/contact.html` | Navigates to public contact form |

### `/contact.html` (public lead form, not portal but worth listing)

| Element | Where | What it does | States |
|---|---|---|---|
| **Get My Free Quote** | Bottom of form | Validates 6 fields + consent checkbox → opens overlay (stage 1 spinner, then stage 2 with SMS confirmation) → mock SMS preview shown | Spinner → success checkmark |

---

## 6. Mock Data Status

### File location
`demos/garage/assets/mock-data.js` (423 lines, exposed as `window.GDK_DATA`)

### Record counts (live from the actual file)

| Collection | Count | Notes |
|---|---|---|
| `customers` | **17** | Realistic Las Vegas mix — names span Hispanic/Latino, Black, Asian, Anglo, Middle-Eastern, etc. |
| `leads` | **60** | Status distribution: 12 New / 15 Contacted / 10 Estimated / 15 Won / 8 Lost |
| `jobs` | **12** | Upcoming jobs in the next 30 days; mix of statuses (scheduled, in-progress) |
| `estimates` | **8** | Mix of draft / sent / approved / declined |
| `smsLog` | **35** | Two-way conversations between dispatch and customers; alternating direction |
| `reviews` | **12** | Review request log — sent / reviewed states with star ratings + channel (Google / Yelp / Facebook) |
| `payments` (static mock) | **38** | Spans Jun 2025 → today. ~$30K total. Mix of methods (Apple Pay / Google Pay / card / Affirm / Klarna) and types (link-sent / paid-online / paid-inperson) |
| `services` | **6** | Emergency / Spring / Opener / New Door / Commercial / Maintenance |
| `neighborhoods` | **8** | Henderson, Summerlin, Paradise, Spring Valley, Enterprise, North Las Vegas, Boulder City, Las Vegas |
| `portalUser` | 1 customer | Michael Robinson (cust-001) with: customer profile, 3 past jobs, 1 upcoming job, 4 invoices (mix paid/due), 4 messages with Marcus |
| **Live demo payments** | 0–N (per browser localStorage) | Newly-created invoices via `/admin-pay.html` persist to `localStorage['gdk-demo-payments-v1']`, capped at 50 |

### Realism check — sample records

**Customer (cust-005):** Tony Romano · `tromano@example.com` · 702-555-0571 · 7720 W Russell Rd, Spring Valley, NV 89117 · joined 22 days ago · LTV $645

**Lead:** Pamela Stewart · 702-555-3390 · Henderson · service: Emergency Repair · estimated value $245 · source: Google Local · status: new · created today

**Payment (PAY-1244):** Derek Johnson · 702-555-0745 · $685 · "Smart wifi opener + remote programming" · paid-online via Apple Pay · paid 3 days ago by Diego Ruiz

**SMS log entry:** "GDK · Hi Maria, your tech Diego is en route. ETA 25 min. Reply HELP for support." (out, 12 days ago)

**Phone format:** All `702-555-XXXX` (Las Vegas area code + FCC-reserved fake-number prefix — never accidentally rings a real person). Last 4 digits are unique per customer.

**Date strategy:** All dates computed via `_d(daysOffset, hour, minute)` helper relative to `GDK_TODAY` (set at script load). Demo always feels current — no hardcoded "March 14, 2024" stale dates.

### Verdict
**Realistic, not lorem ipsum.** Names match the Las Vegas demographic spread. Phone area code + neighborhood + street names are real. Service catalog matches what an actual garage door company sells. Amounts are believable for the trade ($89 service call, $285–$685 spring/opener jobs, $1,450–$3,200 new-door / commercial). Tech names (Marcus / Diego / Trent) match the Meet-the-Crew section on `/about.html`.

---

## 7. Mobile Responsiveness

### Mobile-first?
Not strictly mobile-first in the SCSS-methodology sense (the CSS isn't written breakpoint-up). But **the layout collapses gracefully to single-column at 375px** with media queries doing the lifting. Every page has been viewport-tested.

### Tested at 375×812 (iPhone width)?
**Yes** — verified during build via Claude Preview MCP at 375px viewport for every page. Screenshots captured at `/docs/screenshots/*-mobile.png` (admin, customer-portal, admin-pay, customer-pay, invoices).

### Layout behavior at mobile

| Page | Mobile rendering |
|---|---|
| `/admin.html` | KPI grid stacks 2×2 then 1-column. Payments section: stat cards stack 1-column. Tables get horizontal-scroll wrappers (`.gdk-table-wrap` with `min-width: 720px`) so they remain usable but require horizontal swipe. Customer Requests filter chips wrap. Two-column rows (Jobs+SMS, Estimates+Reviews) collapse to single column. |
| `/admin-pay.html` | Form stacks vertically (already single-column). Action buttons stack 1-column instead of side-by-side. Form inputs are >44px tall (thumb-friendly). |
| `/pay.html` | Single-column, no horizontal scroll. Payment method buttons stack full-width with proper tap targets. The card form expander reveals fields stacked. Apple Pay / Google Pay / Affirm / Klarna buttons all touch-optimized at ≥56px. |
| `/portal.html` | Cards stack 1-column. Customer dashboard sections (Upcoming Service, Payment Summary, Past Jobs, Messages, Documents) all readable. |
| `/invoices.html` | Filter bar stacks vertically (Status row → Date row → Search). Stats stack 1-col. Invoice table scrolls horizontally (`min-width: 820px`). Invoice detail modal sized for mobile (`max-height: 88vh`, scrollable, action buttons stack vertically below 480px). |

### Known issues at mobile
- **Tables require horizontal scroll** (Payments, Customer Requests, Invoices). This is a deliberate compromise — tradesman gets to see all the columns, but has to swipe. A mobile-native card-list layout would be better but adds complexity. Documented as v2 enhancement.
- **Headless screenshot rendering with `backdrop-filter: blur()`** shows the overlays as semi-transparent in screenshots, but this is a Chrome headless quirk only — real mobile browsers render the overlays as fully opaque with the proper blur effect.
- **Sticky header on `/pay.html`** works fine on real iOS Safari but may have minor 1px jitter on some Android browsers (untested at scale).

---

## 8. UX Concerns I've Noticed

These are honest critiques from inside the build — places where the demo could feel smoother for a tradesman with dirty hands and a cracked phone screen.

### Things that already work well
1. **"+ Take a Payment" is the loudest CTA** — copper gradient, 2 placements (header + Payments section). Hard to miss.
2. **Money is the headline** — Carlos's pivot to put Payments at the top of the dashboard above leads/jobs is the right call. Tradesman opens the app and immediately sees "did I get paid this week?"
3. **Invoice detail modal feels like a real receipt** — Stripe charge ID, NV sales tax breakdown, payment method label all give it credibility.
4. **Live persistence "wow moment"** — typing Maria Gonzalez $1500 → going back to dashboard → seeing it at the top with NEW badge / pulse / "just now" timestamp is the demo's strongest single moment for converting prospects.
5. **"New Customer Requests" terminology** — much friendlier than "Lead Pipeline" for someone who doesn't speak SaaS jargon.

### Things that feel clunky for the target audience

1. **Mobile tables require horizontal scroll** (Payments, Invoices, Customer Requests). For a tradesman flipping through invoices on his iPhone in a truck, this is the worst tap interaction. **Recommend**: build a mobile-native "stacked card" view that shows each row as a vertical card on screens <600px instead of forcing the table.

2. **The admin dashboard is overwhelming on first load.** Eight major sections vertical (KPI · Payments · Customer Requests · Jobs · SMS · Estimates · Reviews · footer). For a tradesman who just wants to know "did anyone send me a payment today?" — that's a lot to scroll past. **Recommend**: a phone-optimized "today" view that shows just Payments + 3 most-urgent leads + 3 next jobs by default, with "see everything" expander to show the rest.

3. **The Sign Out / Export Data / + New Lead buttons are dead ends.** Looks like real software but does nothing on click. A prospect clicking around will hit these and feel the seams. **Recommend**: either wire to mock interactions (toast notifications) or hide them entirely until v2.

4. **Customer portal feels less polished than the admin portal.** It still has emoji icons (📄 📋 🔧) on the Documents section, no real "Pay Now" button on outstanding invoices (which is the most useful thing it could do), and the in-portal messaging input doesn't actually persist. **Recommend**: Apply the same care here that we did to the admin — Lucide icons, working "Pay Now" → `/pay.html?id=X` link, and persist the message in localStorage if typed.

5. **Invoice modal is desktop-tuned.** On mobile, the receipt looks fine but the action buttons (Download PDF / Resend Receipt / Refund) stack and feel cramped. Plus the Stripe charge ID text wraps awkwardly on narrow screens. **Recommend**: make the action row a bottom-sheet style on mobile, or collapse Refund into a "more" overflow menu since it's rarely used.

6. **No global search.** A real tradesman wants to type "Tony Romano" in one box and see all his leads + jobs + invoices + messages. Right now you'd need to navigate to each section's separate filter. **Recommend**: a global search bar in the admin nav that surfaces results across all collections.

7. **"Sample admin dashboard" callout banner is always shown.** Inside the demo, that's correct (it's a demo). But if Carlos shows this to a prospect who's scrolling and missing the demo banner at the very top of the page, the prospect might not realize the data is fake. **Consider** making the sample-data callout dismissible OR more visually prominent.

8. **No empty states for the new tradesman.** Everything is pre-filled with mock data, which is great for the demo. But the moment someone signs up for real, they'll see an empty Payments table, empty leads, no jobs. **Need** beautiful empty states for v2 that show what they SHOULD see ("Your first invoice will appear here. Tap +Take a Payment to get started.").

9. **No notifications.** A tradesman wants to know the moment a customer pays a link. Right now the demo has no notification surface. **Recommend** an in-app toast / pulse on the dashboard when a new payment lands (could be mocked with a setInterval that occasionally shows a fake "Just paid: Maria Gonzalez · $450" toast for the demo).

10. **Demo banner styling.** The "DEMO — EXAMPLE DEPLOYMENT BY VELONYX SYSTEMS" banner at the very top is functional but visually the same on every page. Once a prospect has seen it 3 times they tune it out. **Consider** rotating the message or making it animate subtly.

---

## 9. Screenshots

All saved at **desktop (1400×900)** and **mobile (375×812)** to `docs/screenshots/`.

| File | Description |
|---|---|
| `docs/screenshots/admin-dashboard.png` | Owner dashboard at 1400px — shows nav, sample banner, owner header (MR / Marcus Reed), 4-card KPI row (12 leads / 10 jobs / $43,358 quotes / 65% win), then Money/Payments section with 3 stat cards ($7,467 / $29,749 / $1,835) starting to render below the fold |
| `docs/screenshots/admin-dashboard-mobile.png` | Same page at 375px — KPIs stack 1-col, payments stat cards stack, table scrolls horizontally |
| `docs/screenshots/customer-portal.png` | Michael Robinson's customer dashboard at 1400px — sample banner, MR avatar + "Welcome back / Michael Robinson / Customer since October 2025 · Henderson, NV", "REQUEST SERVICE" button, then "Your Upcoming Service / Opener Install" card showing Tuesday Apr 28 2026 9:00 AM with Diego Ruiz, address 8742 Horizon Ridge Pkwy, $685 total / $200 deposit paid / $485 balance, Reschedule + Directions buttons |
| `docs/screenshots/customer-portal-mobile.png` | Same at 375px — fully single column |
| `docs/screenshots/admin-pay-form.png` | Take-a-Payment form at 1400px — eyebrow "OWNER · MARCUS REED", "Take a Payment" Fraunces title, subtitle, then form (Customer Name, Phone or Email, Amount with $ prefix, Description, two big buttons SEND LINK + TAKE PAYMENT NOW) |
| `docs/screenshots/admin-pay-form-mobile.png` | Same at 375px — buttons stack |
| `docs/screenshots/customer-pay-page.png` | `/pay.html?id=PAY-1253` (Aisha Williams $385) at 1400px — branded GDK header + crown, "Hi Aisha,", invoice card showing PAY-1253 / Spring replacement (single torsion) / $385.00 in big copper serif, then 4 payment method buttons (Apple Pay black, Google Pay white, Affirm blue with "As low as $32/mo · 0% APR available", Klarna pink with "4 payments of $96.25 · No interest"), then "or pay by card" expander |
| `docs/screenshots/customer-pay-page-mobile.png` | Same at 375px — phone-perfect rendering, all buttons full-width |
| `docs/screenshots/invoices-manager.png` | Invoice manager at 1400px — sample banner explaining tax-season + customer lookups, $ avatar + "MONEY · INVOICES / Invoices" title, green "✓ Stripe connected · last synced just now" pill, Export CSV + Take a Payment buttons. Then 4 KPI cards: YTD Revenue $20,463 / This Month $10,376 / Outstanding $1,835 / # Invoices YTD 23. Then "ALL INVOICES / Invoice History" section with full filter bar (Status: All/Paid/Pending; Date range: This Month/This Quarter/This Year/Last Year/All Time; Search input) |
| `docs/screenshots/invoices-manager-mobile.png` | Same at 375px — filter groups stack vertically, table scrolls horizontally |

---

## 10. Current Blockers / Questions / Decisions Made Autonomously

### Blockers
**None.** All requested features built and verified end-to-end. Branch `claude/garage-payment-flow` is 4 commits ahead of `main` and ready to merge. Per CLAUDE.md gate, **the merge to `main` requires Carlos's explicit "deploy" / "merge" approval** — that's the only thing blocking the demo going live at `velonyxsystems.com/demos/garage/`.

### Decisions made autonomously (please verify)

1. **Service-call deposit flow: scoped OUT of this build.** When the original payment-feature plan asked Carlos whether to add a deposit-at-booking option (`$89 charged on /contact.html submit`), he answered "No preference." I scoped it out and noted it as v2. Verify if you want it added back.

2. **Platform fee: scoped OUT for now.** Asked Carlos "should Velonyx take a per-transaction fee via Stripe Connect, or 100% pass-through to the tradesman?" He answered "No preference." I defaulted to **100% pass-through** as the cleaner sales pitch ("we don't take a cut of your jobs"). The Care subscription ($125–$325/mo) covers Velonyx's revenue. Verify.

3. **Apple Pay / Google Pay / BNPL conditional thresholds.** I set Affirm to show only at amounts ≥$50 (Affirm's real minimum) and Klarna at ≥$35. These are the actual thresholds from Affirm/Klarna documentation but Carlos may want to adjust for the demo (e.g., always show all options regardless of amount).

4. **Nevada sales tax baked into invoice modal at 8.375%.** Hardcoded for the GDK demo (NV state rate). When we clone the pattern into HVAC Kings or other verticals, this will need to either be configurable in `config.js` per state OR removed if the trade isn't subject to sales tax (most home services aren't — they're labor + materials, taxed differently per jurisdiction). Verify with Carlos's tax/legal POV.

5. **Renamed "Lead Pipeline" → "New Customer Requests"** based on Carlos saying "I'm not understanding what the lead pipeline is." Also renamed the chip "Estimated" → "Quoted" (more tradesman-natural). And renamed KPI "Pipeline Value" → "Open Quotes & Booked Jobs" with subtitle "Money on the calendar." Verify these read right.

6. **localStorage key `gdk-demo-payments-v1`.** Versioned in case we change the schema later. Live demo entries persist across page reloads and tab restarts (browser-permanent until cleared). Capped at 50 entries. Cleared via "Reset Demo Data" link on admin.html. Consider whether to also auto-expire entries older than X days.

7. **Mock Stripe charge IDs.** Format `ch_3O` + 14 random alphanumeric chars (matches real Stripe charge ID format `ch_3O...`). Deterministic per invoice ID so they stay consistent if you re-open the same invoice modal. Verify the mock format reads as "real-looking" to a prospect who happens to be familiar with Stripe.

### Things I simulated but I'm not sure are convincing enough

1. **The "Pass the phone to your customer" handoff overlay.** It auto-dismisses after 1.6s. In real life that's exactly what should happen. But for a demo, a prospect watching may not even SEE the prompt before it's gone. **Consider** making it dismissible with a tap (currently it auto-fades regardless) and/or making the timing slower (3s) for demo purposes.

2. **The success animation after payment.** Currently a single gold checkmark with "Payment Received". A real Stripe Checkout has a more subtle success state. Mine might feel a touch over-the-top. Verify it doesn't read as "fake."

3. **The "Stripe connected · last synced just now" pill** on `/invoices.html`. Static text, doesn't actually animate or pulse. Consider making it occasionally update with relative time ("synced 2 min ago", "synced 5 min ago") to feel more alive.

4. **CSV download experience.** The browser download bar appears when you click "Export CSV" — that's authentic and impressive. But the CSV has rows in chronological order; an accountant might prefer them grouped by month, or with subtotals per month. **Consider** adding a "monthly grouped" CSV variant.

5. **No customer auth on `/portal.html`.** The portal shows Michael Robinson's data unconditionally — no login form. This is fine for the demo (the sample banner explains it), but if a prospect asks "how does login work?" we have nothing visual to show. **Consider** adding a fake login screen that auto-fills with Michael Robinson's credentials and "logs in" after a 1s spinner.

---

## Summary table

| Metric | Value |
|---|---|
| **Total HTML pages in demo** | 11 |
| **Portal pages specifically** | 5 (admin, admin-pay, invoices, portal, pay) |
| **Lines of code** | ~5,200 (HTML + CSS + JS) |
| **Mock data records** | 17 customers · 60 leads · 12 jobs · 8 estimates · 35 SMS · 12 reviews · **38 payments** + N live demo payments in localStorage |
| **Photos** | 14 branded AI-generated (Gemini) |
| **Mobile-tested viewports** | 375×812 (iPhone), 1400×900 (desktop) |
| **Branch state** | `claude/garage-payment-flow` · 4 commits ahead of `main` |
| **Live deploy status** | ⚠️ Awaiting Carlos's "deploy"/"merge" approval (gated per CLAUDE.md) |
| **Console errors at runtime** | 0 |
| **HTTP smoke check** | All 11 pages return 200 locally |

---

## Open thread for Carlos's strategy session

The strongest things to validate with the other Claude session:

1. **Should we also build a customer-side "Pay Now" button in `/portal.html`?** Right now the customer portal only shows invoices but doesn't let them tap-to-pay. Adding `<a href="/pay.html?id=INV-X">Pay Now</a>` per outstanding invoice would close the loop. ~30 min to build.

2. **Is the demo overwhelming on mobile?** Eight sections vertically on the admin dashboard. A "today" mobile-optimized view that shows just the most recent payments + most urgent leads might convert better.

3. **Should this whole pattern get extracted into a reusable template before we build HVAC Kings?** The pay/admin-pay/invoices files are fairly self-contained and could be templated with config-driven brand tokens. ~3-4 hours to extract.

4. **When do we resume the Next.js production starter?** The mocked demo is converting territory; the real Stripe Connect production stack is what we need when Carlos lands a paying client. 16-24 hours of focused work to bring `/Users/apple/Cursor-Claude/velonyx-trades-template/` to production.

5. **Service-call deposit at booking — ship it or hold it?** $89 collected at the moment a customer fills out `/contact.html` form (refunded against final invoice). Carlos said "no preference" earlier but it's the highest-leverage feature for trades — stops tire-kickers cold.

I'll wait here. When you're back from strategy with new direction, just paste it and I'll get back to building.
