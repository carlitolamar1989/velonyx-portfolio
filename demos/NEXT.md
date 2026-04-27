# Next session bookmark — Velonyx demos

**Bookmarked:** 2026-04-25 night session
**Session ended after:** Garage Door Kings Tier 2 visual upgrade deployed live (10/14 photos branded via Gemini AI). Workflow doc added to `/demos/README.md`. Live at https://velonyxsystems.com/demos/garage/

---

## Where things stand

**Live demos (5):**
1. Throne (barber)
2. IronWill (fitness)
3. Lens & Light (photography)
4. Apex SMP Studio (scalp micropigmentation) — `/demos/smp/`
5. Garage Door Kings (Las Vegas trade business) — `/demos/garage/` ← **just shipped Tier 2 + branded photos**

**Last commit on main:** `a7f57a9` — Merge: garage demo Tier 2 visual upgrade

---

## Open options Carlos chose to bookmark

Carlos confirmed all four are valid next moves; revisit when ready:

### 1. Build a 6th demo — HVAC Kings (recommended next vertical)
- Same blueprint as Garage Door Kings, ~3-4 hours active work
- Clone `/demos/garage/` → rebrand colors + copy + services
- Carlos generates 10-14 Gemini photos using prompts in `/demos/README.md` "Photography workflow" section
- Claude swaps photos in via `sips`
- HVAC is higher dollar-value than garage doors — bigger client when he lands one

### 2. Sharpen velonyxsystems.com main landing page
- Audit current portfolio section
- Retrofit the 5 live demos as the hero/anchor of the homepage
- Tighten pricing-tier-to-demo conversion path
- ~2-3 hours

### 3. Resume Next.js production starter at `/Users/apple/Cursor-Claude/velonyx-trades-template/`
- Scaffold is paused at: Next.js 14 + TS + Tailwind + 16 deps installed (Supabase, Stripe, Twilio, Resend, framer-motion, lucide-react, RHF, Zod)
- NOT yet done: shadcn init, brand.config.ts, /src/lib/ wrappers, env validation, real LeadForm, smoke test
- Estimate: 16-24 hours of focused work
- Trigger to start: when Carlos has a paying client signing soon

### 4. Mop up Garage Door Kings — 4 remaining stock photos
- Quick win, 30-60 min total
- Carlos generates 4 more Gemini photos:
  - `svc-emergency.jpg` (currently a cluttered red toolbox workshop)
  - `svc-newdoor.jpg` (currently a modern grey door on brick)
  - `install-modern.jpg` (currently a modern home + 2 cars in driveway)
  - `install-custom.jpg` (currently a white/brown custom home)
- Carlos drops in `~/Downloads/`, Claude swaps via `sips` per documented workflow
- Closes GDK to 100% branded

---

## Other open threads (lower priority, from CLAUDE.md)

- **Stripe Payment Links**: enable "Require customers to accept your terms of service" on all 14 Payment Links once `/terms.html` is verified live (manual Stripe dashboard task)
- **BNPL verification**: confirm Klarna/Affirm/Afterpay enabled on Stripe account
- **Backend Lambda backup**: `velonyx-website/backend/` is `.gitignore`d — back up Lambda code outside the repo
- **BUSINESS-HUB.md vs reality**: reconcile docs with actual AWS state (booking Lambda still active? SES? Twilio?)
- **Client Connect E2E test**: intake form → Lambda → DynamoDB → SES with live AWS creds

---

## To resume next session

Just say: **"pick up the bookmark"** or reference `/demos/NEXT.md` and Claude will read this file and continue from one of the 4 options above.

If Carlos has new Gemini photos for GDK already in `~/Downloads/`, that's the fastest 30-min win to start with.
