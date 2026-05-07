# Velonyx Systems — Cleanup Sweep Summary (May 6, 2026)

End-of-day summary of the cleanup work that landed on `main` after the broader perf sweep finished. Closes out P3 and P4 from the earlier punch list (`docs/REBRAND_FIX_SUMMARY.md`, `/Users/apple/.claude/plans/what-i-want-to-generic-comet.md`).

---

## What got done

### 🔵 P3 — Cleanup decisions

**1. Deleted `/velonyx-website/` mirror folder.**
- 24 git-tracked stale duplicate files removed
- ~649 MB of untracked content (orphan media, files.zip, backend source, IDE state) rm'd
- 4 Lambda backup files (Stripe + booking + lead-intake handlers) preserved at `/Users/apple/Cursor-Claude-archive/lambda-backups-20260506/` outside the repo. Git history retains them too.
- Repo working-tree size: ~2.5 GB → ~1.9 GB
- Verified zero inbound links (no other root HTML referenced `/velonyx-website/*` paths; robots.txt already disallowed it)
- Commit: `f736454`

**2. Audio file `/assets/audio/velonyx-pitch.mp3` — KEPT.**
- 40 MB pre-rebrand AI audio overview, no longer linked from any page
- Recommendation honored from earlier punch list ("keep for repurposing as ad audio later")
- Added `/assets/audio/README.md` documenting:
  - Why the file exists
  - Why it's not on the live site
  - Caveat that it's pre-rebrand voice (don't ship as-is)
  - How to regenerate via NotebookLM if needed
- Net: 0 bytes saved this pass, but future-proofed against confusion

**3. Moved `/external/` and `/velonyx-trades-template/` out of the working tree.**
- These were embedded as separate git histories inside the velonyx-portfolio working tree, creating dual-deployment confusion
- Moved (not deleted) to siblings:
  - `/Users/apple/Cursor-Claude/external/` → `/Users/apple/Cursor-Claude-external/`
  - `/Users/apple/Cursor-Claude/velonyx-trades-template/` → `/Users/apple/Cursor-Claude-trades-template/`
- Both retain their own git remotes and full working state
- The velonyx-portfolio repo no longer needs to know about them
- No git commit needed (they were untracked from this repo's perspective)

### ⚪ P4 — Architectural decision

**Picked `velonyx-trades-template/` as the official Velonyx Portal foundation. Archived `platform/` as a documented learning lab.**

- Wrote `docs/PORTAL_ARCHITECTURE_DECISION.md` with the full rationale (cost, deployment maturity, Carlos's career goals, scale expectations)
- Wrote `platform/README.md` so anyone opening that folder understands it's never been deployed and is preserved as evidence of cloud devops practice (Cognito + DynamoDB + Lambda + API Gateway in Terraform — portfolio-grade)
- The actual portal build lives outside this repo at `/Users/apple/Cursor-Claude-trades-template/` and deploys to `gdk.velonyxsystems.com`
- When Velonyx is ready to scope the next major build cycle, that's the foundation to extend

### 📋 Documentation

**Updated `CLAUDE.md` from scratch.** The previous version was significantly stale:
- Still described 4-tier pricing (collapsed to single Founding Member tier weeks ago)
- Still referenced "luxury websites" voice (rebranded to "premium digital systems for ambitious businesses")
- Pointed to `velonyx-website/` as a mirror to keep in sync (now deleted)
- Documented `platform/` as the "Client Connect" production system (now learning lab)

The new version reflects the actual current state: single-tier pricing, current voice, sibling repo structure, current commit-deploy workflow, and pointers for future Claude sessions.

---

## Cumulative state of the project (post-cleanup)

### Repo structure
- 12 public HTML pages (homepage, checkout, book, financing, for-barbers, 4 legal, 2 SMS, 404)
- `/connect/` landing + `/contact.vcf` + branded QR
- `/assets/` with optimized media (WebP variants, resized logos, optimized hero video)
- `/scripts/refresh-gdk.sh` for one-command demo screenshot updates
- `/platform/` clearly marked as learning lab (not production)
- `/docs/` with audit, perf, decision, and summary docs
- `/client-demos/`, `/demos/garage/` retained as legacy reference

### Sibling working dirs (off-repo)
- `/Users/apple/Cursor-Claude-trades-template/` — production portal foundation (Vercel)
- `/Users/apple/Cursor-Claude-external/notebooklm-py/` — third-party SDK clone
- `/Users/apple/Cursor-Claude-archive/lambda-backups-20260506/` — preserved backend code

### Live site
- `velonyxsystems.com` (apex), `www.velonyxsystems.com` (301 → apex)
- Deployed via GitHub Pages on push to `main`
- ~9 MB lighter per cold load vs. April 2026 baseline
- Median Lighthouse Performance: **99/100 mobile** across 10 audited pages
- Revenue-functional: Founding Member CTA wired to live Stripe Payment Link

### Outstanding (none blocking, all post-launch operational)

These are *not* technical debt — they're things that happen as customers come in:
- Stripe Payment Link housekeeping when 5th founding customer signs (new $5K + $200/mo link)
- Manual founding-spot dot updates per customer
- The "next major build cycle" — extending `velonyx-trades-template/` into the multi-tenant portal — when Carlos is ready

---

## Commits in this sweep

| Commit | What |
|---|---|
| `f736454` | `chore(cleanup): delete stale velonyx-website/ mirror folder (~649 MB)` |
| (this commit, after this doc lands) | `chore(cleanup): docs + READMEs + CLAUDE.md refresh — close P3/P4` |

---

## What this completes

Combined with everything that landed earlier today:
- Sitewide perf optimization (3 rounds of Lighthouse-driven fixes; median 99/100)
- Founding-member checkout migration (`checkout.html` rewrite)
- Stripe Payment Link wiring + First Month Free pill
- Premium QR code for `/connect/`
- Homepage GDK card with live screenshot
- The `refresh-gdk` script

…the entire punch list from earlier in the session is now ✅. Velonyx Systems is in a clean, fast, revenue-functional state ready to take its first founding customer.
