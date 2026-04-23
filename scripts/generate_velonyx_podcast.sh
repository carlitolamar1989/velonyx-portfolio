#!/bin/bash
# Generate the Velonyx pitch Audio Overview via NotebookLM.
#
# Produces: assets/audio/velonyx-pitch.mp3
# Sources:
#   - https://velonyxsystems.com/
#   - https://velonyxsystems.com/checkout.html
#   - https://velonyxsystems.com/financing.html
#   - content/podcast-sources/velonyx-pitch-brief.md (strategic framing)
#
# Prereqs:
#   - notebooklm-py installed (pipx install 'notebooklm-py[browser]')
#   - Authenticated (~/.notebooklm/storage_state.json exists)
#
# Usage: bash scripts/generate_velonyx_podcast.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NOTEBOOK_NAME="Velonyx Systems — The Pitch"
BRIEF="${REPO_ROOT}/content/podcast-sources/velonyx-pitch-brief.md"
OUT_MP3="${REPO_ROOT}/assets/audio/velonyx-pitch.mp3"
METADATA_JSON="${REPO_ROOT}/assets/audio/velonyx-pitch.meta.json"

mkdir -p "$(dirname "${OUT_MP3}")"

echo "==> 1. Verifying auth"
notebooklm auth check --test

echo "==> 2. Creating notebook: ${NOTEBOOK_NAME}"
NOTEBOOK_ID=$(notebooklm create "${NOTEBOOK_NAME}" --json | python3 -c 'import json,sys;print(json.load(sys.stdin)["notebook"]["id"])')
echo "    Notebook ID: ${NOTEBOOK_ID}"

echo "==> 3. Adding sources"
add_source() {
  local content="$1"
  local src_json
  src_json=$(notebooklm source add "${content}" -n "${NOTEBOOK_ID}" --json)
  local src_id
  src_id=$(echo "${src_json}" | python3 -c 'import json,sys;print(json.load(sys.stdin)["source"]["id"])')
  echo "    + ${content} -> ${src_id}"
  notebooklm source wait "${src_id}" -n "${NOTEBOOK_ID}" >/dev/null
}
add_source "https://velonyxsystems.com/"
add_source "https://velonyxsystems.com/checkout.html"
add_source "https://velonyxsystems.com/financing.html"
add_source "${BRIEF}"

echo "==> 4. Generating Audio Overview (deep-dive)"
notebooklm generate audio \
  "Produce a confident, engaging deep-dive about Velonyx Systems: what it is, who it's for, pricing tiers, payment rails, the Care subscription model, and why it's different from template-based website tools. Keep the tone premium and conversational. Target 8-12 minutes." \
  -n "${NOTEBOOK_ID}" \
  --format deep-dive \
  --wait

echo "==> 5. Downloading MP3"
notebooklm download audio "${OUT_MP3}" -n "${NOTEBOOK_ID}"

echo "==> 6. Saving metadata"
notebooklm metadata -n "${NOTEBOOK_ID}" --json > "${METADATA_JSON}"

echo "==> Done."
echo "    Audio: ${OUT_MP3}"
echo "    Metadata: ${METADATA_JSON}"
