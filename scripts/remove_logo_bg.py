#!/usr/bin/env python3
"""Remove near-black background from Velonyx logo; write transparent PNG."""
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

    # Flood from edges: only pixels connected to border and "dark" are background
    thresh = 32
    is_bg = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if mx(x, y) < thresh:
                is_bg[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not is_bg[y][x] and mx(x, y) < thresh:
                is_bg[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not is_bg[ny][nx] and mx(nx, ny) < thresh:
                is_bg[ny][nx] = True
                q.append((nx, ny))

    out = Image.new("RGBA", (w, h))
    opx = out.load()

    # Soft fringe only in the brightness band between bg and solid logo (anti-alias)
    soft_lo, soft_hi = 32, 52
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            m = max(r, g, b)
            if is_bg[y][x]:
                opx[x, y] = (0, 0, 0, 0)
            elif m < soft_lo:
                # Enclosed shadows / dark metal — keep solid on top of page bg
                opx[x, y] = (r, g, b, 255)
            elif m < soft_hi:
                t = (m - soft_lo) / (soft_hi - soft_lo)
                a = int(255 * max(0.0, min(1.0, t)))
                opx[x, y] = (r, g, b, a)
            else:
                opx[x, y] = (r, g, b, 255)

    out.save(dst, optimize=True)
    print(f"Wrote {dst}")


if __name__ == "__main__":
    main()
