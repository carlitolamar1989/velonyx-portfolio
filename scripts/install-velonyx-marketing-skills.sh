#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════╗
# ║  Velonyx Marketing Skills Installer for Claude Code — v2             ║
# ║  Installs eight marketing skill packs into ~/.claude/skills/ via     ║
# ║  symlinks from a single staging directory, so re-running the script  ║
# ║  picks up upstream updates with a git pull. v2 adds local-SEO, sales ║
# ║  playbooks, brand identity, and broad small-business ops packs on    ║
# ║  top of v1's four marketing packs.                                   ║
# ║                                                                      ║
# ║  Run on your Mac:                                                    ║
# ║    chmod +x install-velonyx-marketing-skills.sh                      ║
# ║    ./install-velonyx-marketing-skills.sh                             ║
# ║                                                                      ║
# ║  Idempotent — already-present skills are skipped, never overwritten. ║
# ║  Re-running over a v1 install only adds the new packs (5–8).         ║
# ╚══════════════════════════════════════════════════════════════════════╝

set -euo pipefail

# ── Paths ────────────────────────────────────────────────────────────────
SKILLS_DIR="$HOME/.claude/skills"
AGENTS_DIR="$HOME/.claude/agents"
STAGING_DIR="$HOME/.claude/skills-staging"
VELONYX_CONTEXT="$SKILLS_DIR/VELONYX-CONTEXT.md"

# ── Colors ───────────────────────────────────────────────────────────────
G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; B='\033[0;34m'; C='\033[0;36m'; N='\033[0m'

ok()      { printf "  ${G}✓${N} %s\n" "$1"; }
skip()    { printf "  ${Y}-${N} %s ${Y}(already installed, skipping)${N}\n" "$1"; }
warn()    { printf "  ${Y}⚠${N} %s\n" "$1"; }
err()     { printf "  ${R}✗${N} %s\n" "$1"; }
header()  { printf "\n${B}═══ %s ═══${N}\n" "$1"; }

INSTALLED=0
SKIPPED=0

mkdir -p "$SKILLS_DIR" "$AGENTS_DIR" "$STAGING_DIR"

# ── Helpers ──────────────────────────────────────────────────────────────
link_skill() {
  local src="$1"
  local name
  name="$(basename "$src")"
  local dst="$SKILLS_DIR/$name"

  if [ ! -f "$src/SKILL.md" ]; then
    warn "$name (no SKILL.md found, skipping)"
    return 0
  fi
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    skip "$name"
    SKIPPED=$((SKIPPED + 1))
    return 0
  fi
  ln -s "$src" "$dst"
  ok "$name"
  INSTALLED=$((INSTALLED + 1))
}

link_agent() {
  local src="$1"
  local name
  name="$(basename "$src")"
  local dst="$AGENTS_DIR/$name"

  if [ -e "$dst" ] || [ -L "$dst" ]; then
    skip "agent: $name"
    return 0
  fi
  ln -s "$src" "$dst"
  ok "agent: $name"
}

clone_or_update() {
  local repo_url="$1"
  local target_name="$2"
  local target="$STAGING_DIR/$target_name"
  if [ -d "$target/.git" ]; then
    printf "${C}»${N} Updating %s ...\n" "$target_name"
    git -C "$target" pull --ff-only --quiet || warn "git pull failed for $target_name (using existing copy)"
  else
    printf "${C}»${N} Cloning %s ...\n" "$target_name"
    git clone --depth 1 --quiet "$repo_url" "$target"
  fi
}

# Helper for packs that put every skill at the repo root (no top-level skills/ dir)
link_all_root_skills() {
  local staging_subdir="$1"
  local exclude_pattern="${2:-}"  # optional regex of folders to skip
  for dir in "$STAGING_DIR/$staging_subdir"/*/; do
    [ -d "$dir" ] || continue
    local name
    name="$(basename "${dir%/}")"
    # Skip common non-skill folders + the optional exclude pattern
    case "$name" in
      .git|.github|docs|examples|tests|scripts|node_modules) continue ;;
    esac
    if [ -n "$exclude_pattern" ] && [[ "$name" =~ $exclude_pattern ]]; then
      continue
    fi
    link_skill "${dir%/}"
  done
}

# ── Pack 1: Corey Haines — marketingskills (~40 skills) ─────────────────
header "Pack 1 — coreyhaines31/marketingskills"
clone_or_update "https://github.com/coreyhaines31/marketingskills.git" "marketingskills"
if [ -d "$STAGING_DIR/marketingskills/skills" ]; then
  for dir in "$STAGING_DIR/marketingskills/skills"/*/; do
    [ -d "$dir" ] && link_skill "${dir%/}"
  done
else
  err "marketingskills/skills/ directory not found — upstream layout may have changed"
fi

# ── Pack 2: Bora Oztunc — ogilvy only ────────────────────────────────────
# (Pack 1 already provides copywriting + copy-editing, so we skip those here.)
header "Pack 2 — boraoztunc/skills (ogilvy only)"
clone_or_update "https://github.com/boraoztunc/skills.git" "boraoztunc-skills"
if [ -d "$STAGING_DIR/boraoztunc-skills/ogilvy" ]; then
  link_skill "$STAGING_DIR/boraoztunc-skills/ogilvy"
else
  err "boraoztunc-skills/ogilvy not found — upstream may have moved it"
fi

# ── Pack 3: zubair-trabzada/ai-marketing-claude (orchestrator + 14 subs) ──
header "Pack 3 — zubair-trabzada/ai-marketing-claude (the /market suite)"
clone_or_update "https://github.com/zubair-trabzada/ai-marketing-claude.git" "ai-marketing-claude"
P3="$STAGING_DIR/ai-marketing-claude"

# Main orchestrator (defines the /market slash commands)
[ -d "$P3/market" ] && link_skill "$P3/market"

# Sub-skills
MARKET_SKILLS=(
  market-audit market-copy market-emails market-social market-ads
  market-funnel market-competitors market-landing market-launch
  market-proposal market-report market-report-pdf market-seo market-brand
)
for s in "${MARKET_SKILLS[@]}"; do
  if [ -d "$P3/skills/$s" ]; then
    link_skill "$P3/skills/$s"
  else
    warn "$s not found in upstream — skipping"
  fi
done

# Sub-agents (separate ~/.claude/agents/ directory)
if [ -d "$P3/agents" ]; then
  for a in "$P3/agents"/*.md; do
    [ -f "$a" ] && link_agent "$a"
  done
fi

# Optional Python dep for the /market report-pdf skill
if command -v python3 >/dev/null 2>&1; then
  if python3 -c "import reportlab" 2>/dev/null; then
    ok "python3 + reportlab detected (PDF reports ready)"
  else
    warn "reportlab not installed — only needed for /market report-pdf"
    printf "    Install with: ${C}pip3 install --user reportlab${N}\n"
  fi
fi

# ── Pack 4: boringmarketer — direct-response-copy gist ───────────────────
header "Pack 4 — boringmarketer/direct-response-copy (gist)"
DRC_DIR="$STAGING_DIR/direct-response-copy"
mkdir -p "$DRC_DIR"
DRC_BODY_URL="https://gist.githubusercontent.com/boringmarketer/96192770df22ac2a9ff4aed72b4c20f4/raw/direct-response-copy-gist.md"
if curl -fsSL "$DRC_BODY_URL" -o "$DRC_DIR/_body.md"; then
  # The gist isn't a Claude Code SKILL.md — wrap it with proper YAML
  # frontmatter so the auto-activator can pick the right trigger phrase.
  cat > "$DRC_DIR/SKILL.md" <<'SKILL_EOF'
---
name: direct-response-copy
description: Direct response copywriting principles drawn from classic copywriting masters (Halbert, Hopkins, Ogilvy, Caples, Sugarman) plus modern internet-native conversion techniques. Activate when writing persuasive sales copy, landing pages, VSLs, ad headlines, or any conversion-focused long-form copy. The reference body below is large — read selectively. Source — boringmarketer's published gist.
---

SKILL_EOF
  cat "$DRC_DIR/_body.md" >> "$DRC_DIR/SKILL.md"
  rm -f "$DRC_DIR/_body.md"
  link_skill "$DRC_DIR"
else
  err "Failed to download boringmarketer gist (network?). Skipping Pack 4."
fi

# ──────────────────────────────────────────────────────────────────────────
# v2 ADDITIONS — Packs 5–8 (local SEO, sales, brand, small-biz ops)
# ──────────────────────────────────────────────────────────────────────────

# ── Pack 5: AgriciDaniel/claude-seo — local SEO + GBP + maps + schema ──
header "Pack 5 — AgriciDaniel/claude-seo (local SEO + GBP + maps)"
clone_or_update "https://github.com/AgriciDaniel/claude-seo.git" "claude-seo"
P5="$STAGING_DIR/claude-seo"
# Layout: usually a top-level skills/ folder. Fall back to root scan if missing.
if [ -d "$P5/skills" ]; then
  for dir in "$P5/skills"/*/; do
    [ -d "$dir" ] && link_skill "${dir%/}"
  done
else
  link_all_root_skills "claude-seo"
fi
# Agents (if the pack ships them)
if [ -d "$P5/agents" ]; then
  for a in "$P5/agents"/*.md; do
    [ -f "$a" ] && link_agent "$a"
  done
fi

# ── Pack 6: louisblythe/Sales-Skills — discovery + objections + close ──
header "Pack 6 — louisblythe/Sales-Skills (discovery + objections)"
clone_or_update "https://github.com/louisblythe/Sales-Skills.git" "sales-skills"
P6="$STAGING_DIR/sales-skills"
if [ -d "$P6/skills" ]; then
  for dir in "$P6/skills"/*/; do
    [ -d "$dir" ] && link_skill "${dir%/}"
  done
else
  link_all_root_skills "sales-skills"
fi

# ── Pack 7: rampstackco/claude-skills — brand identity + voice + style ──
# Possible overlap with Pack 1 (copywriting, copy-editing). The link_skill
# helper already skips existing names so duplicates are no-op.
header "Pack 7 — rampstackco/claude-skills (brand identity + voice)"
clone_or_update "https://github.com/rampstackco/claude-skills.git" "rampstack-skills"
P7="$STAGING_DIR/rampstack-skills"
if [ -d "$P7/skills" ]; then
  for dir in "$P7/skills"/*/; do
    [ -d "$dir" ] && link_skill "${dir%/}"
  done
else
  link_all_root_skills "rampstack-skills"
fi

# ── Pack 8: OneWave-AI/claude-skills — quote/SOW + content repurpose + ops ──
header "Pack 8 — OneWave-AI/claude-skills (small-biz ops)"
clone_or_update "https://github.com/OneWave-AI/claude-skills.git" "onewave-skills"
P8="$STAGING_DIR/onewave-skills"
if [ -d "$P8/skills" ]; then
  for dir in "$P8/skills"/*/; do
    [ -d "$dir" ] && link_skill "${dir%/}"
  done
else
  link_all_root_skills "onewave-skills"
fi

# ── VELONYX-CONTEXT.md ──────────────────────────────────────────────────
header "Velonyx context file"
cat > "$VELONYX_CONTEXT" <<'CONTEXT_EOF'
# Velonyx Systems — Marketing Context File

This file is automatically read by all marketing skills. It provides Velonyx-specific business context so every marketing output is calibrated to this brand.

## Brand Identity

- Business name: Velonyx Systems
- Tagline: "Your Legacy, Engineered With Precision."
- Brand voice: Premium, engineered, considered, confident. Never desperate, never pushy, never corporate. Think craftsman + cloud engineer. Patek Philippe meets technical documentation.
- Aesthetic: Black-and-gold luxury, modern, restrained, premium.

## Positioning

Velonyx engineers premium custom platforms for service-based businesses ready to own their infrastructure instead of renting it. We specialize in home service trades (HVAC, plumbing, electrical, garage doors, pool service, pest control, mobile detailing, landscaping) and extend to any service business with the same pain — auto repair, cleaning services, dog grooming, fitness studios, photography studios, mobile services of any kind.

## What We Sell

One custom-engineered platform per business, replacing 4-6 software subscriptions. Includes:
- Custom-branded website (Next.js, mobile-first, SEO-optimized)
- Integrated payments via Stripe (Apple Pay, Google Pay, cards)
- Customer financing built in (Klarna, Affirm, Afterpay)
- Online booking 24/7
- Automated SMS workflows (Twilio) for sub-60-second lead response
- Owner dashboard for jobs, customers, payments
- AWS serverless backend
- Local SEO foundation
- Full code ownership — no monthly platform rent

## Pricing

- Founding rate (first 5 customers only): $3,000 build + $100/month
- Post-founding rate: $5,000 build + $200/month
- Single Stripe Payment Link, single offer (no tiers)

## The Core Pain We Solve

Service operators are paying $250-400/month across 4-6 software subscriptions (Housecall Pro, Squarespace, separate SMS tools, payment processors, BNPL integrations). After 3 years they've spent $9,000-$14,400 and own nothing. Customer data, booking history, branded experience — all trapped on someone else's platform.

## Banned Words and Phrases

NEVER use these in any Velonyx marketing output:
- "juggling apps"
- "stitching tools together"
- "patched-together"
- "duct tape"
- "frankenstein"
- "synergy"
- "leverage" (as a verb — "leverage AI" etc.)
- "ecosystem"
- "solution" (use "platform" or "system")
- "robust"
- "seamless"
- "cutting-edge"
- "best-in-class"
- "world-class"
- "next-level"
- "game-changer"

Generic marketing buzzwords damage premium positioning. Every word must earn its place.

## Preferred Voice Patterns

DO use:
- "Engineered" (not "developed" or "made")
- "Built" (not "created")
- "Owned" (the brand cornerstone)
- "Consolidated" / "unified" (instead of any banned synonym)
- "Custom-engineered" (premium signal)
- "Your platform" / "one system"
- Active voice, specific verbs, no qualifiers ("almost," "basically," "kind of")
- Specific numbers ($3,000, 7-14 days, $250-400/mo) — never vague ranges or "fast"

## Conversion Frameworks to Apply

For every marketing output, apply these direct response principles:

1. Pain quantification — always do the math, make abstract pain concrete and weighable
2. Voice-of-customer language — use words real service operators use, not marketing speak
3. Outcome-first benefits — lead with what they get, not what we built
4. Open-loop headlines — create curiosity gaps, not statements
5. Specific over vague — numbers, names, timeframes, not platitudes
6. Single primary CTA per section — never compete with yourself
7. Social proof prominence — Garage Door Kings demo is the strongest credibility signal
8. Risk reversal — lower the perceived risk of a $3K decision
9. Real urgency — 5 founding spots, real price increase after ($5K + $200/mo)

## Target Audience

Primary: Home service operators (owner-operators of HVAC, plumbing, electrical, garage door, pool service, pest control, mobile detailing, landscaping businesses) doing $100K-$2M/year in revenue.

Secondary: Service-based businesses with identical pain — auto repair, cleaning services, dog grooming, fitness studios, photography studios, any mobile service business.

Buyer characteristics:
- Owner-operator, busy, hands-on
- Skeptical of marketing/tech BS (often burned before)
- Practical, results-driven, ROI-focused
- Time-pressured (checking phone between jobs)
- Plain-English communicators, no jargon
- Long-term thinkers when convinced (otherwise transactional)

## Live Demo / Social Proof Asset

Garage Door Kings (Las Vegas) — live demo at https://gdk.velonyxsystems.com
This is the primary social proof asset. Reference it frequently in marketing copy as proof of capability.

## Live Site

Production site: https://velonyxsystems.com
All marketing should align with and reinforce the messaging there.
CONTEXT_EOF

ok "VELONYX-CONTEXT.md → $VELONYX_CONTEXT"

# ── Summary ──────────────────────────────────────────────────────────────
header "Summary"

# Count by counting symlinks (or real folders with SKILL.md) under skills dir
TOTAL_SKILLS=$(find "$SKILLS_DIR" -mindepth 2 -maxdepth 2 -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')
TOTAL_AGENTS=$(find "$AGENTS_DIR" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

printf "  ${G}New skills installed:${N} %d\n" "$INSTALLED"
printf "  ${Y}Already-present skipped:${N} %d\n" "$SKIPPED"
printf "  ${B}Total skills now:${N} %d  (in %s)\n" "$TOTAL_SKILLS" "$SKILLS_DIR"
printf "  ${B}Total agents now:${N} %d  (in %s)\n" "$TOTAL_AGENTS" "$AGENTS_DIR"
printf "\n  Staging directory (delete to reset everything): %s\n" "$STAGING_DIR"
printf "  Velonyx context file:                            %s\n" "$VELONYX_CONTEXT"
printf "\n${G}Done.${N} Start a new Claude Code session so the new skills are discovered.\n\n"
printf "${C}Sanity-check prompts you can use to confirm activation:${N}\n"
printf "  • \"Help me write a cold B2B email\"           → cold-email skill\n"
printf "  • \"Audit this landing page for conversion\"   → cro / market-landing\n"
printf "  • \"Write an Ogilvy-style headline\"           → ogilvy skill\n"
printf "  • \"Audit my Google Business Profile\"         → claude-seo (Pack 5)\n"
printf "  • \"Write me a discovery-call script\"         → Sales-Skills (Pack 6)\n"
printf "  • \"Build me a brand voice guide\"             → rampstack (Pack 7)\n"
printf "  • \"Generate an SOW for a website project\"    → onewave (Pack 8)\n"
printf "  • \"/market quick https://velonyxsystems.com\" → /market orchestrator\n\n"
