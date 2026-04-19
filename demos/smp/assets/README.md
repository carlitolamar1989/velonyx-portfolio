# `demos/smp/assets/` — imagery & styles

## `styles.css`

Shared stylesheet for `index.html`, `book.html`, `portal.html`. Pure vanilla CSS — no Tailwind, no CDN dependencies, no build step. If you edit colors or layout tokens, they propagate to all three pages.

## Imagery strategy

### What this demo uses right now
The demo **does not ship with stock photos of real people or real scalps.** That was a deliberate correction:

- Early iterations pulled from Unsplash searches like "bald head" and "tattoo studio" but the results were haircut / barbershop imagery — misrepresenting what SMP actually is.
- SMP is a precision tattoo technique. Clients are either (a) fully bald getting a shaved-head illusion, or (b) thinning-haired getting pigment tattooed between existing hairs to read denser.

So the demo now uses:

1. **Styled placeholder tiles** for the before/after gallery (landing page) and the session photo gallery (portal). Each tile is a dark gradient with gold accents, a small "Before / After" tag, an italicised caption (e.g. *"Complete baldness → Full scalp pigmentation, Session 3 complete"*), and a subtle dot pattern that visually hints at pigment stippling. Clicking a tile opens a lightbox with a short description of the scenario.
2. **CSS-generated initials avatars** for the three testimonials (MR, DK, JM) and the portal welcome (MR). Gold-gradient circles with serif initials. Zero broken-image risk, zero cultural/identity mismatch, zero licensing concern.
3. **Hero backdrop** is a pure CSS gradient + radial glow + faint dot pattern. No photo. Atmospheric and consistent with the "precision / pigment" theme.

### What Carlos should swap in before real prospect outreach

Before this demo goes in front of a real SMP artist prospect, swap the gallery tiles for real SMP before/after imagery. Two paths:

**Path A — AI-generated (recommended for speed)**

Use Midjourney, DALL·E, or similar with prompts like:

- *"Photorealistic top-down view of a man's scalp with diffuse thinning on the crown, clinical lighting, medical reference photography"* (Before tile)
- *"Photorealistic top-down view of the same man's scalp after scalp micropigmentation, density fill-in complete, natural-looking follicle replicas"* (After tile)

For each of the 6 gallery tiles on `index.html` and the 7 tiles on `portal.html`, search `demos/smp/index.html` / `demos/smp/portal.html` for `class="gallery-tile"` or `class="portal-tile"` and replace the inner content with `<img src="…" alt="…">`, then drop a rule like `.gallery-tile img { width:100%; height:100%; object-fit:cover; }` into `styles.css`.

**Path B — Real client photography**

If the prospect has their own before/after library, even better. Same swap procedure.

### Recommended imagery scenarios (already labelled in the demo)

| Tile | Scenario the caption describes |
|---|---|
| 1 | Complete baldness → Full scalp pigmentation (Norwood 5–6) |
| 2 | Diffuse crown thinning → Density fill-in (pigment between hairs) |
| 3 | Receding temples → Hairline design (Norwood 2–3) |
| 4 | FUT transplant scar at nape → Scar camouflage |
| 5 | Alopecia areata patches → Patch pigmentation |
| 6 | Advanced baldness (Norwood 6) → Full coverage + shaved-head illusion |

Portal tabs:
- **Before** — Top + Side view of client's starting scalp
- **Progress** — Session 1, Session 2, and Day 30 check-in
- **After** — Top + Side view post-Session 3

If Carlos sources new images, keeping them aligned to these scenario captions makes the demo read cohesively to prospects.

### Avatars

Current: CSS-generated initials circles (MR, DK, JM) in gold gradient.

If Carlos prefers photo avatars, they can be swapped for any bald or shaved-head male portraits (more on-brand for SMP than generic stock photography). The relevant markup in `index.html` is three `<div class="avatar-initials">XX</div>` blocks in the testimonials section, and one `<div class="avatar-initials large">MR</div>` block in `portal.html`'s header. Replace with `<img src="…" alt="…" class="avatar-photo">` and add matching CSS.

### Hero / about section

The hero backdrop is a pure CSS gradient composition — atmospheric but abstract. The about section uses a styled "10+" badge card instead of a photo. Both stay as-is unless Carlos explicitly wants photography in those spots.

## No stock photos shipped

Because of the above, there are **no binary image files in `demos/smp/assets/`** right now. Only `styles.css` and this README. Everything visual is rendered in CSS or SVG.
