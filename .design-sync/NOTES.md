# design-sync notes — @formance/design-system

## Repo shape and why the config looks like this

- **No Storybook, no library build.** The root package is private (it is the docs site);
  the components are source `.tsx` under `registry/default/ui`. The converter therefore
  runs in **synth-entry mode** (`[NO_DIST]` in the build log is expected, not an error) and
  `cfg.srcDir` points at `registry/default/ui`.
- **`node_modules/@formance/design-system` is a self-symlink** (`ln -sfn ../.. node_modules/@formance/design-system`).
  Without it `PKG_DIR` resolves to a path that does not exist and the build dies on
  `ENOENT … node_modules/@formance/design-system/package.json`. It is gitignored, so
  **recreate it on every fresh clone**.
- **`cfg.cssEntry` is a compiled artifact, not a repo file.** `app/globals.css` is Tailwind
  v4 source; shipping it would send `@import 'tailwindcss'` to consumers. The entry is
  `.design-sync/tw-entry.css` (committed) — it imports `app/globals.css` and adds
  `@source inline(...)` safelists. Regenerate before every sync (the CLI version must track
  `tailwindcss` in `package.json`):

  ```sh
  pnpm dlx @tailwindcss/cli@4.3.3 -i .design-sync/tw-entry.css -o .design-sync/.cache/ds-compiled.css --minify
  ```

  **Why the safelist exists:** Tailwind only emits classes some scanned file uses, so the
  brand ramps (`bg-lilac-300`, `bg-emerald-800`, …) were _registered as colours but absent
  from the shipped CSS_. A design agent writing them got nothing — caught only because an
  authored preview used `bg-emerald-800` and rendered blank. The safelist ships
  `{bg,text,border,ring,fill,stroke}` × the five brand ramps. **Add to it whenever a token
  family should be reachable by a consumer that doesn't already use it in this repo.**

- **`.d.ts` contracts need a generated type tree.** Synth-entry mode parses zero `.d.ts`
  files, so **every** emitted `<Name>Props` was `{[key: string]: unknown}` — valid TS, so
  `validate` said "all .d.ts parse cleanly" and nothing flagged it, but the design agent got
  no prop names at all. Fix, run before the converter:

  ```sh
  node .design-sync/scripts/prepare-types.mjs          # emits dist/types/**
  ```

  The script is committed, and so is `.design-sync/tsconfig.dts.json`, so this step needs no
  reconstruction on a fresh clone. `dist/` is build output and gitignored. `findTypesRoot`
  picks `dist/types` automatically (it is checked before `lib`). The script writes
  `dist/types/index.d.ts` — the barrel that scopes which components the tree exports — from
  `pilot.json`, because tsc cannot emit it: an entry re-exporting through the `@/*` alias
  lands under its own source path, not at the root.

- **The extractor drops `cva` `VariantProps` intersections**, so `variant` / `size` still
  came out missing even with the type tree. `cfg.dtsPropsFor` carries hand-written bodies for
  the 10 components with real variant APIs, **transcribed from `dist/types/**` — never
  invented**. Re-transcribe after any variant change; a stale union here silently teaches the
  design agent a variant that no longer exists.
- **`content/docs/components/*.mdx` is `cfg.docsDir`** — the 10 root components get real
  `.prompt.md` bodies from it. Subparts (`CardHeader`, `SelectTrigger`, …) have no doc file;
  `[DOCS_UNMAPPED]` on those is expected and their `.prompt.md` is synthesized.

## The `source-kit.mjs` fork (`cfg.libOverrides`)

`.design-sync/overrides/source-kit.mjs` filters the synth entry twice:

1. `HEAVY_RX` drops `ui/code/*`, `chart.tsx` and the validators. **Required, not a
   preference**: `monaco-editor-core` ships `codicon.ttf` and esbuild fails with
   `No loader is configured for ".ttf" files`. If those components are ever synced, the
   converter needs a `.ttf` loader (a lib fork of `bundle.mjs`, which the skill says not to
   fork) — or the DS needs a real prebuilt `dist/`.
2. `PILOT` restricts cards to the 11 modules in `.design-sync/pilot.json` (button, badge,
   input, label, card, select, dialog, tabs, alert, typography, formance-logo) — this was the
   user's chosen scope, **not** a technical limit.
   **To widen the sync, edit `pilot.json`.** The fork reads that file and
   `scripts/prepare-types.mjs` builds the `.d.ts` barrel from it, so the scope lives in one
   place and the two cannot drift. Their imports are already bundled, so widening only adds
   cards, it does not change what renders.
   **`PILOT` is keyed by module name, not export name.** `formance-logo` carries two
   components (`FormanceLogo`, `FormanceIcon`), so a component can be in scope without
   appearing in the list — check `cfg.overrides` / `cfg.dtsPropsFor` for the real export set.

Without the `PILOT` filter the sync emits **349 cards**: shadcn exports every compound part
flat (`CardHeader`, not `Card.Header`), and the converter's subcomponent nesting needs
namespace exports (`export * as Card`) plus a real `.d.ts` tree, neither of which exists
here. Expect ~5 cards per component whatever the scope.

## Known render warns (checked on re-sync — an unrecorded warn is new)

- **`[TOKENS_MISSING]` × 15** — all `--radix-*-content-*` / `--radix-*-trigger-width` plus
  `--skeleton-width`. Radix sets these inline at runtime and `Skeleton` sets its own; they
  are correctly absent from a static stylesheet. Verified against rendered previews
  (Select's open menu positions correctly).
- **`[FONT_REMOTE]` Figtree** — a Google Fonts `@import` survives into `styles.css`.
  Polymath and Berkeley Mono ship as `@font-face` with absolute Formance-CDN URLs
  (`fonts/fonts.css`), so **no font file is copied and none needs to be** — the families
  load at runtime. Both were confirmed rendering in the graded sheets.

## Preview-authoring learnings (this repo)

- `registry/default/demos/*.tsx` (89) and `registry/default/examples/*.tsx` (180) are the
  composition source. Port them, swapping `@/registry/default/ui/x` for
  `'@formance/design-system'`.
- **Radix overlays render inline with `defaultOpen`** — no provider, no `cardMode` needed
  for Dialog (`defaultOpen modal={false}` inside a sized wrapper). Select's open menu
  escapes its grid cell, so it uses `cardMode: "single"` + `primaryStory: "Open"`.
- **Almost every multi-export card needs `cardMode: "column"`.** Side-by-side cells clip at
  the card edge; validate's `[GRID_OVERFLOW]` only caught Select, the rest were found by
  eyeballing the contact sheets. Check the sheets on any re-sync that adds exports.
- **`Label`'s disabled state only shows via `peer-disabled:`** — the label must follow the
  disabled input in the DOM. A `data-disabled` wrapper does nothing.
- **The brand mark is `formance-logo`**, exporting `FormanceLogo` (wordmark lockup) and
  `FormanceIcon` (mark, with the `plain` + 5 tile variants and the `icon-*` size ramp that
  matches `buttonVariants`). Its doc lives at `content/docs/brand/formance-logo.mdx`, outside
  `docsDir`, so both names are pinned in `cfg.docsMap`.
- **Only pilot-scope components are bundle exports.** A preview importing anything outside
  `PILOT` (e.g. `Checkbox`) fails with "Element type is invalid". Check the export list
  before porting a demo.
- **`TypographyBracketed` is a `cva` recipe, not a component** — excluded via
  `componentSrcMap`. Its floor card rendered the raw class string. `typography.tsx` also
  exports `h1Variants`…`h5Variants`; those are lowercase so the PascalCase filter drops
  them. **Any newly synced module needs the same check for `cva` exports.**

## Re-sync risks

- **`ds-compiled.css` is regenerated, not committed.** Skip the Tailwind CLI step and the
  build fails on a missing `cssEntry`; run it with a mismatched Tailwind version and the
  shipped CSS silently drifts from the docs site.
- **Three things are gitignored and all three are needed on a fresh clone**: the self-symlink
  `node_modules/@formance/design-system`, `.design-sync/node_modules` (lets the fork resolve
  `ts-morph`) and `.ds-sync/` — the sync tool's own checkout, which the fork imports from
  (`../../.ds-sync/lib/{common,bundle,dts}.mjs`). Without the last one the committed fork
  cannot resolve at all.
- **The fork will drift from upstream `lib/source-kit.mjs`.** Diff them on re-sync and
  merge; the fork's relative imports are repointed at `../../.ds-sync/lib/`.
- **Scope is pinned in code, not config.** `PILOT` living in the fork means a future
  "sync everything" run must edit the fork — it will not notice the limit otherwise.
- **35 of 53 cards are floor cards** (unauthored subparts). Fully importable and typed;
  authoring them is the standing incremental offer.
- **Two generated inputs are gitignored and must be recreated before every sync**:
  `.design-sync/.cache/ds-compiled.css` (Tailwind CLI) and `dist/types/**` + its
  `index.d.ts` barrel (`scripts/prepare-types.mjs`). Skip either and the build either fails
  on `cssEntry` or silently regresses every prop contract to an empty index signature.
- **`.design-sync/chunk-*.json` and `upload-list.txt` are per-run upload plans**, written
  beside the committed config but gitignored. Never treat a stale one as the current plan —
  re-run the sync to regenerate it.
- **Grades are invalidated by any `cfg` change**, not just preview edits: adding the two logo
  entries to `cfg.overrides` cleared all 18 existing grades and forced a full re-read of the
  review sheets. Batch config changes before a grading pass, not after.
- **This repo syncs to project `420583fb-cb36-4270-8a4b-4856e71a7239`** ("Formance DS —
  registry pilot"), pinned in `config.json`. A separate, hand-authored **`Formance Design
System`** project exists with brand assets and its own `fonts/`; the delete globs in the
  upload plan cover `fonts/**`, so **never retarget this sync at it** without reviewing what
  reconciliation would remove.
