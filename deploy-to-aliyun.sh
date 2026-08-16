#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_HOST="${DEPLOY_HOST:-47.103.29.78}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_KEY="${DEPLOY_KEY:-$HOME/.ssh/jkinco_aliyun_ed25519}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/apps-plaza/video}"
PUBLIC_URL="${PUBLIC_URL:-https://${DEPLOY_HOST}/video/}"

if [[ ! -f "$DEPLOY_KEY" ]]; then
  echo "SSH key not found: $DEPLOY_KEY" >&2
  exit 1
fi

cd "$ROOT_DIR"

STAGE_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGE_DIR"' EXIT
mkdir -p "$STAGE_DIR/assets"
cp index.html "$STAGE_DIR/index.html"
cp assets/video.mp4 assets/poster.jpg "$STAGE_DIR/assets/"
chmod 755 "$STAGE_DIR" "$STAGE_DIR/assets"
chmod 644 "$STAGE_DIR/index.html" "$STAGE_DIR/assets/"*

SSH=(ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -i "$DEPLOY_KEY")
RSYNC=(rsync -az --delete -e "ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -i $DEPLOY_KEY")

"${SSH[@]}" "$DEPLOY_USER@$DEPLOY_HOST" "install -d -m 755 '$DEPLOY_PATH'"
"${RSYNC[@]}" \
  "$STAGE_DIR/" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

"${SSH[@]}" "$DEPLOY_USER@$DEPLOY_HOST" \
  "test -s '$DEPLOY_PATH/index.html' && test -s '$DEPLOY_PATH/assets/video.mp4' && test -s '$DEPLOY_PATH/assets/poster.jpg'"

echo "Deployed to $PUBLIC_URL"
