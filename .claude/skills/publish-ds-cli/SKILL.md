---
name: publish-ds-cli
description: Publish a new version of the @formance/ds CLI to npm. Handles version bumping, build, typecheck, publish, git tag, and push. Use when the user says "publish ds", "release @formance/ds", "ship the cli", or "bump and publish design-system cli".
---

# Publish @formance/ds

Publishes the `@formance/ds` CLI (lives at `design-system/cli/`) to npm following the repo's release flow.

The publishable package is the CLI at `cli/`, NOT the root `@formance/design-system` (which is the private docs site).

## When to use

The user wants to cut a new release of `@formance/ds`. Trigger phrases include "publish ds", "release the cli", "ship @formance/ds", "bump and publish".

## Preconditions — check first

1. **Working tree clean**: `git status` must show no uncommitted changes in `cli/`. If dirty, stop and ask the user to commit the feature/fix changes first. Release commits must be separate from code changes.
2. **On a release-ready branch**: usually `main`. Confirm with the user if on a feature branch.
3. **npm auth**: `~/.npmrc` must have an Automation token. If publish later fails with `EOTP`, the stored token is wrong type — tell the user to rotate it at https://www.npmjs.com/settings/brieucclt/tokens (Classic → Automation). 2FA is required for writes, so only Automation tokens work non-interactively.
4. **Logged in**: `npm whoami` should return `brieucclt` (or the org account).

## Decide the bump

Inspect the commits since the last tag to recommend a SemVer bump:

```bash
git -C design-system describe --tags --abbrev=0 2>/dev/null
git -C design-system log <last-tag>..HEAD -- cli/
```

- `patch` — bug fixes, internal-only changes, doc tweaks
- `minor` — new commands, new flags, additive features
- `major` — breaking CLI changes (renamed/removed commands, changed defaults)

Propose a bump to the user and confirm before proceeding unless they already specified one.

## Release flow

Run from `design-system/cli/`:

```bash
cd design-system/cli

# 1. Verify build + types pass BEFORE touching the version
pnpm install
pnpm build
pnpm typecheck

# 2. Bump version → creates commit "v<x.y.z>" + tag v<x.y.z>
#    Use the agreed bump level: patch | minor | major
npm version <bump> -m "chore(cli): release v%s"

# 3. Publish (public scope required)
npm publish --access public

# 4. Push commit and tag
git push --follow-tags
```

Notes:

- `npm version` runs in the cli directory and only updates `cli/package.json`. The commit it creates only touches that file — which is what we want (release commit separate from feature commits).
- Tag name will be `v<x.y.z>` at the repo root (not scoped per package). If the design-system repo ever publishes multiple packages, switch to Changesets — see below.
- If `npm publish` fails with `EOTP` despite a token in `~/.npmrc`, abort and tell the user the token isn't an Automation token. Don't retry with `--otp`.
- Never `--no-verify` or skip the build/typecheck steps.

## Post-publish

1. Verify on npm: `npm view @formance/ds version` should match.
2. Tell the user the new version and the tag pushed.

## When NOT to use this skill

- The root `@formance/design-system` package (private docs site) — it's not published.
- If the user wants to publish multiple packages from `design-system/` in one go, recommend setting up Changesets instead of running this skill repeatedly.
