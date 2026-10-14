#!/usr/bin/env bash
# Fetch a pinned upstream code-only review tree. Never modifies tracked PFx XP files.
set -Eeuo pipefail

UPSTREAM_URL="https://github.com/aduncandev/web-xp.git"
UPSTREAM_SHA="bc9528db08c3714e6dfd52be43e1dcb3fe4a216a"

for command in git; do
  if ! command -v "$command" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$command" >&2
    exit 1
  fi
done

ROOT="$(git rev-parse --show-toplevel)"
STAGE="$ROOT/.upstream/web-xp"
mkdir -p "$ROOT/.upstream"

if [ -e "$STAGE" ] && [ ! -d "$STAGE/.git" ]; then
  printf 'Refusing to overwrite an existing non-repository path: %s\n' "$STAGE" >&2
  exit 1
fi

if [ ! -d "$STAGE/.git" ]; then
  git clone --filter=blob:none --no-checkout --single-branch --branch master "$UPSTREAM_URL" "$STAGE"
else
  ACTUAL_URL="$(git -C "$STAGE" remote get-url origin)"
  if [ "$ACTUAL_URL" != "$UPSTREAM_URL" ]; then
    printf 'Unexpected upstream origin: %s\n' "$ACTUAL_URL" >&2
    exit 1
  fi
  git -C "$STAGE" fetch --filter=blob:none origin master
fi

# Sparse review: avoid downloading or republishing third-party media.
git -C "$STAGE" sparse-checkout init --cone
git -C "$STAGE" sparse-checkout set src/WinXP src/components src/context src/hooks tests
git -C "$STAGE" checkout --detach "$UPSTREAM_SHA"

ACTUAL_SHA="$(git -C "$STAGE" rev-parse HEAD)"
if [ "$ACTUAL_SHA" != "$UPSTREAM_SHA" ]; then
  printf 'Revision mismatch. Expected %s, got %s\n' "$UPSTREAM_SHA" "$ACTUAL_SHA" >&2
  exit 1
fi

printf '\nPinned webXP code prepared at: %s\n' "$STAGE"
printf 'Commit: %s\n' "$ACTUAL_SHA"
printf 'No application code was published or merged into PFx XP.\n'
printf 'Media assets are intentionally absent: this copy is for code review, not running.\n'
