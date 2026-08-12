# Formance Design System

## Mission

Build a **public shadcn registry** for Formance's design system, hosted at `https://ds.formance.com`. Anyone can install components via:

```
npx shadcn add https://ds.formance.com/r/<component>.json
```

### Component Taxonomy

Components are organized into three tiers:

- **Atoms** — base UI primitives (Button, Badge, Input, Calendar, etc.). These are shadcn components with Formance brand styling (colors, typography, variants). They live in `registry/default/ui/`.
- **Fragments** — composed patterns built from atoms (DateRangePicker, DataTable, FilterSidebar, etc.). These combine multiple atoms into reusable, opinionated patterns used across Formance products.
- **Patterns** — full page-level layouts and flows (settings page, list/detail, onboarding wizard). These are higher-level compositions of fragments and atoms.

The sidebar navigation should eventually reflect this taxonomy (Atoms → Fragments → Patterns), replacing the current flat "Components" section.

### Goals

1. **Public registry** — any team (internal or external) can `npx shadcn add` Formance components
2. **Living documentation** — every component has live previews, multiple examples showing real-world usage from platform-ui, syntax-highlighted source code, and one-line install commands
3. **Single source of truth** — platform-ui consumes components from this registry, not the other way around. The DS is upstream.
4. **Brand consistency** — Formance fonts (Polymath, Figtree, Berkeley Mono), color tokens, and design decisions are baked into the components

## Reference Projects

When adding or updating components and examples, use these projects as reference:

### Platform UI (production components)

`/Users/brieuccaillot/Developer/Formance/platform-ui`

- **UI components**: `packages/ui/src/components/` — production shadcn components with Formance customizations
- **Demo components**: `packages/ui/src/components/demo/` — usage examples (date pickers, forms, data tables, etc.)
- **Date components**: `packages/ui/src/components/date/` — DateRangePicker, DateWithHour, DateInput
- **App components**: `packages/ui/src/components/app/` — real-world usage (filter sidebar, query builder)

When creating DS examples, check platform-ui for real-world usage patterns to ensure coverage.

### Internal UI (consumer project)

`/Users/brieuccaillot/Developer/Formance/internal-ui`

Monorepo consuming components from this design system registry. Uses `npx shadcn add` with a local registry URL (`http://localhost:3333/r/{name}.json`).

- **UI package**: `packages/ui/` — shared components, styles, and configuration
- **Components**: `packages/ui/src/components/` — includes both DS-sourced and project-specific components
- **Code components**: `packages/ui/src/components/code/` — code-themes, code-editor, code-snippet (synced from DS)
- **Styles**: `packages/ui/src/styles/globals.css` — must stay aligned with DS `app/globals.css` for color tokens
- **Config**: `packages/ui/components.json` — shadcn config, must use `"style": "default"` to match DS

When updating DS color tokens or code-themes, also update internal-ui to keep them in sync.

### Supabase Design System (architecture reference)

`/Users/brieuccaillot/Developer/Tools/supabase/apps/design-system`

Local clone of the Supabase design system. **Always read files directly from this path** — do not use DeepWiki, WebFetch, or browser tools to look up Supabase DS code.

## Architecture

- **Registry components**: `registry/default/ui/` — shadcn components adapted from platform-ui
- **Demos**: `registry/default/demos/` — one per component, shown in the Preview section
- **Examples**: `registry/default/examples/` — multiple per component, shown in the Examples section
- **Config**:
  - `config/docs.ts` — sidebar nav, `componentMeta` (slug → registry name, description, source file)
  - `config/registry-demos.ts` — `'use client'`, maps component names to `React.lazy()` demos, each with an optional `examples` array
- **Doc pages**: `app/docs/[...slug]/page.tsx` — RSC, reads source files, renders previews + code blocks

### Server/Client Boundary

`registry-demos.ts` is `'use client'` (lazy imports). A demo and its examples are declared in one place: the `examples` array on each demo entry. `buildIndex()` flattens demos and examples into one slug → entry map, so a lookup by example slug returns the same `sourceFile` the RSC page reads. When adding an example, add it to the owning demo's `examples` array — there is no second file to keep in sync.

## Import Conventions

When copying components from platform-ui, adapt imports:

- `@platform/ui/lib/utils` → `@/lib/utils`
- `@platform/ui/components/X` → `@/registry/default/ui/X`

## Syncing Components to Consumer Projects

The DS is the **upstream source of truth**. Consumers pull components **only through the registry** — never by copying files locally. This keeps import rewriting, CSS tokens, and utility classes consistent with what external installs receive.

> Local file-copy syncing (the former `scripts/sync-to-project.sh`) has been removed on purpose: it copied `.tsx` files without the component's CSS (utilities like `shimmer` / `scroll-fade-x` live in `globals.css`), which silently broke styling. Always go through the registry.

### Add / update components (needs dev server running)

```bash
pnpm dev  # start DS at localhost:3333
./scripts/update-ds.sh --cwd ../internal-ui/packages/ui
```

This uses `shadcn add --overwrite` against the local registry. Import rewriting is handled by shadcn based on the target's `components.json` aliases.

**Two things shadcn gets wrong about fragments, repaired by `cli/src/lib/rewrite-fragment-imports.ts`:**

- It replaces the `@/registry/<style>/ui` prefix without requiring a path
  separator, so `@/registry/default/ui-fragments/copy-button` comes out as
  `<uiAlias>-fragments/copy-button` — a path that resolves nowhere. Any fragment
  importing a sibling fragment is affected; today that is `api-snippet` and
  `ledger-schema`, both importing `copy-button`.
- A registry `target` is alias-relative, so the file lands under the project's
  source root (`packages/ui/src/components/…` in both platform-ui and
  internal-ui). The repair pass therefore looks for `<cwd>/<target>` **and**
  `<cwd>/src/<target>`.

Verify a change here by running the built CLI against a real consumer and
grepping for `components-fragments`; a green `--all --overwrite` run must leave
the consumer typechecking.

### Refresh base styles / tokens / utilities (`globals.css`)

CSS utilities and tokens ship via the CLI's `globals.css` template (`cli/src/templates/globals.css`), delivered by `@formance/ds init`. Re-run `init` in the consumer to pull new utilities into its `globals.css`:

```bash
# from the consumer project (has a components.json)
npx @formance/ds init --internal --all -y --overwrite
```

`init` rewrites the destination `globals.css` from the template verbatim (only token values are injected), so any `@utility` / `@keyframes` / `@property` block added to the template lands in the consumer. Component-specific utilities must therefore be added to the template, not only to the docs-site `app/globals.css`.

## Dead Code: `knip`

```bash
pnpm knip   # runs in CI (QA job); must stay clean
```

`knip.ts` reads `registry.json` and marks **every shipped file as an entry point**
(`path!`). This is required: consumers install those files with `shadcn add`, so
their exports have no in-repo caller and would otherwise all be reported as
unused — knip skips unused exports in entry files unless `includeEntryExports` is
turned on. The `!` suffix is a separate flag: it marks the pattern as a
_production_ entry, so `knip --production` still sees the shipped files.

Consequences when you work on the registry:

- A file under `registry/default/` that is **not** listed in `registry.json` is
  treated as docs-site-internal, so knip reports its unused exports and will
  report the file itself if nothing imports it. Add it to `registry.json` if it
  is meant to ship.
- `registry/default/{demos,examples}/` never ship. They are reachable only
  through `config/registry-demos.ts`, so knip reports any demo or example that is
  not wired into a demo entry's `examples` array.
- The root `project` pattern includes `.css`, so `app/globals.css` is in the
  module graph and its CSS-only dependencies (`tailwindcss`,
  `@tailwindcss/typography`, `tw-animate-css`) resolve on their own. `public/**`
  is excluded: Next serves it verbatim, so nothing imports it.
- The `cli` workspace has `ignoreBinaries: ['tsup']`. The CLI is standalone with
  its own lockfile, so the root QA job never installs `cli/node_modules` and
  cannot resolve the binary there.

## Docs Integrity: `pnpm check:docs`

```bash
pnpm check:docs   # runs in CI (QA job)
```

`scripts/check-docs-integrity.ts` guards two invariants that **`pnpm build`
cannot catch, because both fail by rendering rather than by throwing**:

1. **Every sidebar entry needs an MDX file.** `generateStaticParams` prerenders
   each nav href under `/docs/`, and the page calls `notFound()` when
   `content/docs/<slug>.mdx` is missing. A nav item + `componentMeta` entry
   wired up without its MDX file **ships a 404 with a green build**.
2. **Every `<ComponentPreview name>` must resolve** through `findDemo`. A miss
   renders a "No demo available for ..." placeholder in the page body, so a typo
   or a renamed demo is otherwise invisible.

So adding a component to the docs takes four edits, not three: `registry.json`,
`config/registry-demos.ts`, `config/docs.ts` (`componentMeta` + nav), **and**
`content/docs/<section>/<slug>.mdx`.

## Dev Server

```
pnpm dev     # localhost:3333
```

## CLI: `@formance/ds`

The `cli/` package publishes `formance-ds` (used as `npx @formance/ds <cmd>`). It wraps `shadcn add` against the registry and post-processes `globals.css`.

### `init` — install base styles, tokens, fonts

Run from a project that already has a `components.json`.

```bash
npx @formance/ds init              # external (default) — Formance CDN fonts stripped
npx @formance/ds init --internal   # Formance team — keeps Polymath + Berkeley Mono
```

Common flags: `--all`, `--overwrite`, `-y/--yes`, `--cwd <path>`, `--registry <url>`, `--insecure`.

Typical Formance install: `npx @formance/ds init --internal --all -y --overwrite`.

### globals.css template rewrite

After `shadcn add` writes the file, `init` runs `rewriteGlobalsFromTemplate` (`cli/src/lib/rewrite-globals.ts`):

1. Parses the freshly installed `globals.css` with postcss; extracts `:root`, `.dark`, and `@theme inline` variable values.
2. Loads the canonical template from `cli/src/templates/globals.css` (a copy of `platform-ui/packages/ui/src/styles/globals.css`).
3. Injects the extracted values into the template, keeping the template's order, spacing, and comments. `--font-sans` and `--font-mono` always come from the template (listed in `TEMPLATE_OWNED_KEYS`), never from the installed file.
4. Carries over every root-level `@source` the installed file has and the template lacks, with the comment directly above it. Those lines are the consumer's: only it knows which trees Tailwind cannot reach on its own, and a package resolved through `node_modules` is never scanned — so a rewrite that dropped them would silently stop generating classes used only there. A glob the template _used_ to ship is indistinguishable from a consumer-authored one, so deleting one from the template only reaches consumers that have not installed yet; existing ones need a one-off edit to their own file. When the destination cannot be parsed, `add --overwrite` warns and overwrites it anyway — restoring a mangled stylesheet is what that flag is for.
5. When `--internal` is **not** set, strips Formance-CDN `@font-face` blocks and removes `'Polymath'` / `'Berkeley Mono'` from `--font-sans` / `--font-mono` (Google Fonts Figtree import and remaining fallbacks are preserved).
6. Writes the result back.

`add` writes the same template — `writeGlobalsFromTemplate`, which skips the token injection but keeps the `@source` and font handling — and only when `--overwrite` is set.

> **⚠️ Any CSS a component relies on MUST be shipped, not just added to `app/globals.css`.**
> `app/globals.css` only styles the docs site. Consumers get their CSS from the CLI template (`cli/src/templates/globals.css`) via `@formance/ds init`. A component whose class (e.g. `shimmer`, `scroll-fade-x`, `scrollbar-none`) lives only in `app/globals.css` will render **unstyled** everywhere else — this is exactly how the Attachment utilities shipped broken to platform-ui.
>
> **When you add or change any `@utility` / `@keyframes` / `@property` / `@layer` rule for a component:**
>
> 1. Add it to `app/globals.css` (docs site renders correctly).
> 2. Add the **same block** to `cli/src/templates/globals.css` (consumers get it via `init`).
> 3. Rebuild the CLI: `cd cli && pnpm build` (copies the template into `dist/templates`).
> 4. Consumers pull it with `npx @formance/ds init --internal --all -y --overwrite`.
>
> Never hand-copy component `.tsx` files into a consumer — always go through the registry + `init`.

### Keeping the template in sync with platform-ui

The canonical layout source is `platform-ui/packages/ui/src/styles/globals.css`. Token _values_ are injected from the registry, so token edits in platform-ui flow through automatically once the registry is regenerated.

Only re-sync the template when **layout** changes (section order, comments, `@font-face` URLs, or the canonical `--font-sans` / `--font-mono` strings):

```bash
cp ../platform-ui/packages/ui/src/styles/globals.css cli/src/templates/globals.css
cd cli && pnpm build
```

After the copy, delete the `@source` lines that describe platform-ui's own tree (`../../../kit/src/**` and anything like it). They belong to that consumer, the rewrite preserves them there anyway, and in the template they would be a path no other project has.
