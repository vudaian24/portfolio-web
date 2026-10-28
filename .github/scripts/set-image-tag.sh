#!/usr/bin/env bash
# Set image.tag in portfolio-gitops charts/portfolio-web/values-prod.yaml and push to main.
# Usage: set-image-tag.sh <40-char-sha> <commit subject>
#        set-image-tag.sh --read    print the current image.tag (no change, no push)
# Env:   GITOPS_DIR    checkout of portfolio-gitops (git identity already set)
#        SOURCE_REPO   source repository (owner/name), for the Argocd-reference-commit-* trailers (ADR 0008)
set -euo pipefail

file="charts/portfolio-web/values-prod.yaml"

if [[ "${1:-}" == "--read" ]]; then
  cd "$GITOPS_DIR"
  # Exactly one image.tag line, and it must be the quoted form `  tag: "<value>"`.
  if [[ "$(grep -c '^  tag: ' "$file")" != "1" ]] ||
     [[ "$(grep -c '^  tag: "[^"]*"$' "$file")" != "1" ]]; then
    echo "::error::unexpected layout in $file" >&2
    exit 1
  fi
  sed -n -E 's/^  tag: "([^"]*)"$/\1/p' "$file"
  exit 0
fi

new_tag="$1"
subject="$2"

if [[ ! "$new_tag" =~ ^[0-9a-f]{40}$ ]]; then
  echo "::error::invalid image tag: $new_tag" >&2
  exit 1
fi

cd "$GITOPS_DIR"

for attempt in 1 2 3 4 5; do
  git fetch --quiet origin main
  git checkout --quiet -B main origin/main

  # Only the image tag line is rewritten; comments and other keys are untouched.
  if [[ "$(grep -c '^  tag: ' "$file")" != "1" ]]; then
    echo "::error::unexpected layout in $file" >&2
    exit 1
  fi
  sed -i -E "s/^  tag: \"[^\"]*\"$/  tag: \"${new_tag}\"/" "$file"
  if ! grep -qx "  tag: \"${new_tag}\"" "$file"; then
    echo "::error::could not set image.tag in $file" >&2
    exit 1
  fi

  if git diff --quiet -- "$file"; then
    echo "image.tag is already ${new_tag}"
    exit 0
  fi

  git add -- "$file"
  git commit --quiet -m "$subject" \
    --trailer "Argocd-reference-commit-sha: ${new_tag}" \
    --trailer "Argocd-reference-commit-repourl: https://github.com/${SOURCE_REPO}"
  if git push --quiet origin HEAD:main; then
    echo "pushed $(git rev-parse --short HEAD) to main"
    exit 0
  fi
  echo "push rejected (attempt ${attempt}), retrying"
  sleep $((attempt * 3))
done

echo "::error::could not push image tag after retries" >&2
exit 1
