#!/bin/bash
# Pre-commit lint: runs ESLint over only the JS files staged in this commit, so
# lint and formatting errors are caught before they land in history. Scoping to
# staged files keeps the hook fast on this large tree.
#
# Each file is read from the index (`git show ":$file"`) rather than the
# worktree, so what gets checked is exactly what gets committed — unstaged edits
# in a partially staged file are neither linted nor able to mask a problem.
#
# Ported from the entryscape repo's scripts/eslint/pre-commit.sh to keep one
# hook mechanism across the org, with the src/view/react carve-out and
# --max-warnings 0 added. Bypass with `git commit --no-verify`, which preserves
# the WIP-branch convention.
#
# Wired as `pnpm lint:staged` from .husky/pre-commit, so it sits alongside `lint`
# and `lint:fix` in package.json rather than being a hidden fourth lint path.
# Run it by hand to see what a commit would reject.
#
# Note `pnpm lint` (whole repo) cannot be used as the hook instead: src/view/react
# still has ESLint errors (RDFORMS-175, RDFORMS-195), so it would reject every
# commit. Once those land, this script and its carve-out can both go away.

repo_root="$(git rev-parse --show-toplevel)"
eslint_bin="$repo_root/node_modules/.bin/eslint"

# Fail loudly rather than passing silently: a guardrail that can't find its
# linter must not report success.
if [ ! -x "$eslint_bin" ]; then
  echo "pre-commit: eslint not found at $eslint_bin — run 'pnpm install'." >&2
  exit 1
fi

# --max-warnings 0 fails the commit on warnings too, not just errors: the shared
# config rates several real problems (no-undef, no-use-before-define) as
# warnings, and a guardrail that ignored those would let undefined-variable
# references land.
# --no-warn-ignored silences the "File ignored" notice for any config-ignored
# file (samples/, html/, config/, src/**/tests/) that happens to be staged.
eslint_args=(--stdin --no-warn-ignored --max-warnings 0)

status=0

# -z with a null-delimited read handles paths containing spaces.
# --diff-filter=ACMR skips deletions, whose blobs are no longer in the index.
while IFS= read -r -d '' file; do
  case "$file" in
    *.js | *.jsx | *.mjs | *.cjs) ;;
    *) continue ;;
  esac

  # Temporarily skip the src/view/react tree — it still has ESLint errors
  # tracked in RDFORMS-175 and RDFORMS-195, which remove this carve-out once
  # fixed. The exclusion lives only here; eslint.config.mjs still lints React,
  # so `pnpm lint` keeps reporting those errors.
  case "$file" in
    src/view/react/*) continue ;;
  esac

  if ! git show ":$file" | "$eslint_bin" "${eslint_args[@]}" --stdin-filename "$file"; then
    status=1
  fi
done < <(git diff --cached --name-only -z --diff-filter=ACMR)

if [ "$status" -ne 0 ]; then
  echo
  echo "ESLint failed on staged files (formatting counts — prettier runs as an"
  echo "ESLint rule). Auto-fix the fixable ones and re-stage:"
  echo "  pnpm exec eslint --fix <file> && git add <file>"
  echo "To commit without this check: git commit --no-verify"
fi

exit "$status"
