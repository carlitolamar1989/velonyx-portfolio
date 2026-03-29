#!/usr/bin/env python3
"""
Remove near-black background from Velonyx logo → transparent PNG.

- Background: fully transparent (0,0,0,0). No semi-transparent “haze.”
- Logo (including metallic edge pixels): full opacity so glow/shine is not washed out.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = root / "assets" / "vs-logo-2026.jpg"
    dst = root / "assets" / "vs-logo-2026.png"

    im = Image.open(src).convert("RGB")
    w, h = im.size
    px = im.load()

    def mx(x: int, y: int) -> int:
        r, g, b = px[x, y]
        return max(r, g, b)

    # --- 1) Edge flood fill: “definitely background” ---
    flood_thresh = 34
    is_bg = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if mx(x, y) < flood_thresh:
                is_bg[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not is_bg[y][x] and mx(x, y) < flood_thresh:
                is_bg[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not is_bg[ny][nx] and mx(nx, ny) < flood_thresh:
                is_bg[ny][nx] = True
                q.append((nx, ny))

    # --- 2) Shrink dark JPEG fringe (expand bg slightly into halos only) ---
    # Pixels must stay logo if they’re bright enough (keeps metallic rim intact).
    expand_cap = 48
    for _ in range(4):
        nxt = [[is_bg[y][x] for x in range(w)] for y in range(h)]
        changed = False
        for y in range(h):
            for x in range(w):
                if is_bg[y][x] or mx(x, y) > expand_cap:
                    continue
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and is_bg[ny][nx]:
                        nxt[y][x] = True
                        changed = True
                        break
        is_bg = nxt
        if not changed:
            break

    # --- 3) Output: bg = fully transparent; logo = RGB unchanged, alpha 255 ---
    out = Image.new("RGBA", (w, h))
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if is_bg[y][x]:
                opx[x, y] = (0, 0, 0, 0)
            else:
                r, g, b = px[x, y]
                opx[x, y] = (r, g, b, 255)

    out.save(dst, optimize=True)
    print(f"Wrote {dst}")


if __name__ == "__main__":
    main()
