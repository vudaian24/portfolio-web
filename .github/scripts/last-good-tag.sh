#!/usr/bin/env bash
# Track the last image tag that passed the deploy checks, so a revert never
# restores a tag that a failed run left live.
#
# Usage: last-good-tag.sh --resolve      print the tag a failed deploy must restore
#        last-good-tag.sh --mark <sha>   record <sha> as verified (after the smoke test)
# Env:   GITOPS_DIR    full-history checkout of portfolio-gitops, push credentials set
#
# The record is the branch verified/portfolio-web in portfolio-gitops. It points
# at the main commit where image.tag held the last verified tag and only moves
# forward along main. Argo CD and the portfolio-gitops workflows ignore it.
#
# --resolve walks the commits on main that changed the image.tag line, newest
# first, and prints the tag of the first one it trusts:
#   - a commit that is not a pipeline deploy commit: a revert (it restored a
#     trusted tag) or a human change, such as a rollback pull request;
#   - a pipeline deploy commit whose tag is the verified tag.
# A deploy commit with any other tag never passed the checks: its run failed
# and the revert did not happen. While the branch does not exist yet, the live
# tag is trusted. Prints nothing when no tag is trusted (before the first deploy).
set -euo pipefail

file="charts/portfolio-web/values-prod.yaml"
marker="verified/portfolio-web"
deploy_prefix="chore: deploy portfolio-web "

cd "$GITOPS_DIR"

# Prints image.tag in $file at commit $1, or fails on an unexpected layout.
tag_at() {
  local content
  content="$(git show "$1:$file")"
  if [[ "$(grep -c '^  tag: "[^"]*"$' <<<"$content")" != "1" ]]; then
    echo "::error::unexpected layout in $file at $1" >&2
    return 1
  fi
  sed -n -E 's/^  tag: "([^"]*)"$/\1/p' <<<"$content"
}

fetch() {
  local attempt
  for attempt in 1 2 3 4 5; do
    if git fetch --quiet origin "$@"; then
      return 0
    fi
    echo "fetch failed (attempt ${attempt}), retrying" >&2
    sleep $((attempt * 3))
  done
  echo "::error::could not fetch portfolio-gitops" >&2
  return 1
}

case "${1:-}" in
  --resolve)
    fetch "+refs/heads/main:refs/remotes/origin/main"
    if [[ -z "$(git ls-remote --heads origin "refs/heads/$marker")" ]]; then
      live="$(tag_at origin/main)"
      echo "no $marker branch yet, trusting the live tag '$live'" >&2
      echo "$live"
      exit 0
    fi
    fetch "+refs/heads/$marker:refs/remotes/origin/$marker"
    verified="$(tag_at "origin/$marker")"

    # -G keeps only commits whose diff adds or removes an image.tag line.
    while IFS=$'\t' read -r commit author subject; do
      tag="$(tag_at "$commit")"
      if [[ -z "$tag" ]]; then
        break
      fi
      if [[ "$subject" != "$deploy_prefix"* || "$author" != *"[bot]" || "$tag" == "$verified" ]]; then
        echo "last good tag: $tag (set by ${commit:0:7} \"$subject\")" >&2
        echo "$tag"
        exit 0
      fi
      echo "::warning::skipping $tag: deploy commit ${commit:0:7} never passed the deploy checks" >&2
    done < <(git log --first-parent --format='%H%x09%an%x09%s' -G '^  tag: ' origin/main -- "$file")

    echo "::warning::no trusted image tag in the history of $file" >&2
    exit 0
    ;;

  --mark)
    sha="${2:-}"
    if [[ ! "$sha" =~ ^[0-9a-f]{40}$ ]]; then
      echo "::error::invalid image tag: $sha" >&2
      exit 1
    fi
    fetch "+refs/heads/main:refs/remotes/origin/main"
    commit="$(git rev-parse origin/main)"
    live="$(tag_at "$commit")"
    if [[ "$live" != "$sha" ]]; then
      echo "::error::image.tag on main is '$live', not $sha; not marking it verified" >&2
      exit 1
    fi
    for attempt in 1 2 3; do
      # No force: the branch only moves forward along main.
      if git push --quiet origin "$commit:refs/heads/$marker"; then
        echo "marked $sha verified at ${commit:0:7}"
        exit 0
      fi
      echo "push failed (attempt ${attempt}), retrying" >&2
      sleep $((attempt * 3))
    done
    echo "::error::could not update $marker" >&2
    exit 1
    ;;

  *)
    echo "usage: last-good-tag.sh --resolve | --mark <sha>" >&2
    exit 2
    ;;
esac
