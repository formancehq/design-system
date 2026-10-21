# Migration: AI Elements and the CodeSnippet wrapper

Branch `feat/ai-elements-chat`. Do these steps in `platform-ui` and in
`internal-ui` after the PR is merged and `ds.formance.com` is deployed.

## What changes for consumers

- **New components:** `code-block`, `message`, `message-scroller`, `bubble`,
  `marker`, `trace` and `questionnaire`, plus the `use-highlighted-code` hook.
  The hook brings `lib/highlighter.tsx` with it.
- **CodeSnippet** is now a wrapper on `CodeBlock` and `useHighlightedCode`.
  Its props do not change, so existing calls compile.
  - `CodeSnippet` and `CodeBlock` use one highlighter: the Shiki core, with
    each language loaded when it is first used. Only `CodeEditor` (Monaco)
    still loads the full `shiki` bundle.
  - `isSingleLine` is deprecated and does nothing: code never wraps, and a
    long line scrolls. A multi-line string stays on several lines.
  - The border is `border-input`, the same as `CodeBlock`. Long lines show a
    thin scrollbar with a fade at the edges.
  - The `codeSnippetVariants` export is removed. No consumer used it.
- **`render-hast.tsx` is removed** from the registry. `shadcn add` does not
  delete files, so you must delete it yourself.
- **globals.css** gets new utilities: the `data-open`, `data-closed`,
  `data-checked` and `data-disabled` variants, `scroll-fade-b`,
  `scroll-fade-y`, `shimmer-none`, and the typeset preset fixes. It also gets
  an `@import` of `code-themes.css`.
- **Small fixes:** InputGroupButton sizes its icons (`size-4` when the icon
  has no `size-*` class), and Collapsible passes `forceMount` through.

## 0. Before you start (design-system)

1. Make sure that `https://ds.formance.com/r/code-block.json` returns the new
   item.
2. Publish a new `@formance/ds` version that includes this PR. The
   `code-themes.css` import is new in the CLI. Use the `publish-ds-cli` skill,
   or follow "Publishing" in the root `CLAUDE.md`. Then check that
   `npm view @formance/ds version` shows the new version.

## 1. Pull the components

Do this in a branch of its own, and commit the pull on its own.

```bash
# platform-ui
pnpm dlx @formance/ds@latest add --all --yes --overwrite --internal --cwd packages/ui

# internal-ui
pnpm dlx @formance/ds@latest add --all --yes --overwrite --internal --cwd packages/ui
```

## 2. Refresh globals.css

```bash
pnpm dlx @formance/ds@latest init --internal --all -y --overwrite --cwd packages/ui
```

`init` keeps your own `@source` lines. Make sure that `globals.css` now has
`@import './typeset.css'` and an `@import` of `../components/code/code-themes.css`.

## 3. Delete render-hast

**platform-ui:**

1. Delete `packages/ui/src/components/code/render-hast.tsx`.
2. Remove `"./components/code/render-hast"` from `exports` in
   `packages/ui/package.json`.

**internal-ui:** there is no `render-hast.tsx` in this repo, so there is
nothing to delete.

To find other imports of it:

```bash
grep -rn "render-hast\|codeSnippetVariants" apps packages --include=*.ts --include=*.tsx
```

## 4. Register the new files (platform-ui only)

ADR-0003 requires an `exports` entry for each registry target:

```bash
pnpm ds:drift --write-exports
```

This adds entries for `code-block`, `message*`, `hooks/use-highlighted-code`,
`lib/highlighter`, etc. It also updates `scripts/ds-registry-paths.json`.
Make sure that the `render-hast` entry is no longer in that file.

## 5. Remove duplicate imports of code-themes.css (platform-ui, optional)

The shared `globals.css` now imports `code-themes.css`. The apps also import it
in their `layout.tsx` and `global-error.tsx` files (studio, banking-bridge,
ledger, portal, chain-bridge, console-v3, numscript-playground). The duplicate
import does no harm. To remove it:

```bash
grep -rln "components/code/code-themes.css" apps
```

Keep an app's import if that app does not load `globals.css`, for example a
`global-error.tsx` that renders without the root layout.

## 6. Dependencies

Install the new packages if the pull did not add them:

```bash
pnpm --filter <ui-package> add @shadcn/react
```

`shiki`, `class-variance-authority` and `lucide-react` are already in both
repos.

## 7. Clean the deprecated prop (optional)

`isSingleLine` does nothing now. Remove it from the call sites when you touch
them:

```bash
grep -rn "isSingleLine" apps packages --include=*.tsx
```

## 8. Verify

```bash
pnpm format:fix      # the registry publishes some files unformatted
pnpm typecheck
pnpm lint
pnpm knip            # if the repo runs it
pnpm ds:drift        # platform-ui: must report no drift
```

Then look at these screens in light mode and dark mode:

- A page with `CodeSnippet` and `showHeader`, for example an API snippet or
  the MCP setup page. Check the language label, the copy button and the
  `headerActions`.
- A Numscript snippet. The JS regex engine can colour some tokens
  differently from the old engine.
- A one-line `fctl` command. It must stay on one line and scroll.
- A Markdown answer that contains a code fence, for example in the Studio
  chat.

## Rollback

Revert the pull commit. The old `CodeSnippet` and `render-hast.tsx` come back
with it.
