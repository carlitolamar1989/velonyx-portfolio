#!/usr/bin/env bash
# refresh-gdk.sh — one-command refresh of the Garage Door Kings demo screenshot
# used by the homepage portfolio card.
#
# Captures a fresh screenshot of https://gdk.velonyxsystems.com/ via headless
# Chrome, resizes/optimizes to 1200x750, writes both WebP (primary) and PNG
# (fallback) into /assets/, and stages the changed files for commit.
#
# Run from anywhere:
#   bash /Users/apple/Cursor-Claude/scripts/refresh-gdk.sh
#
# Or just say "refresh GDK" in chat and Claude runs it for you.

set -euo pipefail

REPO_ROOT="/Users/apple/Cursor-Claude"
TMP_PNG="/tmp/gdk-raw-$$.png"
WEBP_OUT="$REPO_ROOT/assets/gdk-preview.webp"
PNG_OUT="$REPO_ROOT/assets/gdk-preview.png"
URL="https://gdk.velonyxsystems.com/"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [[ ! -x "$CHROME" ]]; then
  echo "[refresh-gdk] Chrome not found at: $CHROME" >&2
  exit 1
fi

echo "[refresh-gdk] capturing $URL ..."
"$CHROME" \
  --headless=new \
  --no-sandbox \
  --disable-gpu \
  --hide-scrollbars \
  --window-size=1440,900 \
  --screenshot="$TMP_PNG" \
  "$URL" 2>/dev/null

if [[ ! -s "$TMP_PNG" ]]; then
  echo "[refresh-gdk] screenshot failed (no file written)" >&2
  exit 1
fi

echo "[refresh-gdk] resizing + optimizing ..."
python3 - <<PY
from PIL import Image
import os
src = Image.open("$TMP_PNG")
target_w = 1200
target_h = round(src.height * (target_w / src.width))
resized = src.resize((target_w, target_h), Image.LANCZOS)
resized.save("$WEBP_OUT", "WEBP", quality=82, method=6)
resized.save("$PNG_OUT", "PNG", optimize=True)
print(f"  webp: {os.path.getsize('$WEBP_OUT'):,} bytes")
print(f"  png : {os.path.getsize('$PNG_OUT'):,} bytes")
PY

rm -f "$TMP_PNG"

echo "[refresh-gdk] staging assets/gdk-preview.{webp,png} for commit ..."
cd "$REPO_ROOT"
git add assets/gdk-preview.webp assets/gdk-preview.png

echo ""
echo "[refresh-gdk] done. To deploy:"
echo "  cd $REPO_ROOT"
echo "  git commit -m 'chore(portfolio): refresh GDK demo screenshot'"
echo "  git push origin main"
