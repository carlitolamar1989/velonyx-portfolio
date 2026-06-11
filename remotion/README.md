# Velonyx Remotion workspace

Motion-graphics pipeline for **velonyxsystems.com**. Compositions live in `src/`, render to MP4/WebM under `../assets/motion/`, and get embedded back into the static site as autoplaying looping `<video>` tags in place of static `<img>` slots.

This workspace is intentionally isolated from the static site at the repo root — GitHub Pages does not touch it; only the rendered video files end up on the live site.

## One-time setup

```bash
cd remotion
npm install
```

That pulls Remotion 4, React 18, and Chromium for headless rendering. Roughly 500 MB. `node_modules/` is gitignored.

## Live preview (Remotion Studio)

```bash
npm run studio
```

Opens the Studio at `http://localhost:3000`. Edit any file in `src/` and the preview hot-reloads.

## Render to MP4

```bash
npm run render:hero-1          # one slot
npm run render:all             # everything currently registered
```

Output lands in `../assets/motion/<name>.mp4` next to the existing WebP slots.

## Adding a new motion graphic

1. Drop a `src/<NewSlot>.tsx` (copy `HeroSlide1.tsx` as the starting point).
2. Register it in `src/Root.tsx`:
   ```tsx
   <Composition id="NewSlot" component={NewSlot}
     durationInFrames={fps * 6} fps={30} width={1920} height={1080} />
   ```
3. Add a render script to `package.json`:
   ```json
   "render:new-slot": "remotion render NewSlot ../assets/motion/new-slot.mp4 --codec=h264 --crf=22"
   ```
4. Render, then swap the static slot in `../index.html`:
   ```html
   <video src="assets/motion/new-slot.mp4" autoplay muted loop playsinline
          width="2400" height="1350"></video>
   ```

## Performance notes

- Use `--crf=22` (default in the scripts) for visually-lossless H.264 at small file sizes. Drop to `--crf=18` for higher fidelity, raise to `--crf=28` for thinner files.
- Keep durations short (~4–6s) and loops seamless — the site uses `loop` attribute, so the end frame must match the start frame.
- Always include `muted` on the `<video>` tag — browsers block autoplay otherwise.
- For LCP-critical slots (Anchor A hero bar), render a WebM/VP9 variant too and serve via `<source>` for smaller mobile downloads.

## Files

- `package.json` — Remotion deps + render scripts.
- `remotion.config.ts` — points Remotion at `../assets/` so `staticFile()` paths resolve to the existing site images.
- `src/Root.tsx` — registers every Composition.
- `src/HeroSlide1.tsx` — sample composition (Ken Burns drift over the existing hero slide).
