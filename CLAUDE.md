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
  - `config/registry-demos.ts` — `'use client'`, maps component names to `React.lazy()` demos + examples
  - `config/registry-examples.ts` — server-safe (no `'use client'`), example metadata for RSC file reading
- **Doc pages**: `app/docs/[...slug]/page.tsx` — RSC, reads source files, renders previews + code blocks

### Server/Client Boundary

`registry-demos.ts` is `'use client'` (lazy imports). Server components cannot read its values at runtime. That's why `registry-examples.ts` exists as a server-safe duplicate of example metadata. When adding examples, update **both** files.

## Import Conventions

When copying components from platform-ui, adapt imports:

- `@platform/ui/lib/utils` → `@/lib/utils`
- `@platform/ui/components/X` → `@/registry/default/ui/X`

## Syncing Components to Consumer Projects

The DS is the **upstream source of truth**. To push components to consumer projects:

### Direct sync (no dev server needed)

```bash
# Sync all shared components to platform-ui (default target)
./scripts/sync-to-project.sh

# Sync specific components only
./scripts/sync-to-project.sh button.tsx badge.tsx input.tsx

# Preview what would change
./scripts/sync-to-project.sh --dry-run

# Sync to a different project
./scripts/sync-to-project.sh --target-dir ../internal-ui/packages/ui/src/components \
  --target-css ../internal-ui/packages/ui/src/styles/globals.css \
  --alias "@internal/ui"

# Only sync CSS tokens
./scripts/sync-to-project.sh --css-only
```

The script copies files from `registry/default/ui/` and rewrites imports:

- `@/lib/utils` → `@<alias>/lib/utils`
- `@/lib/compose-refs` → `@<alias>/lib/compose-refs`
- `@/registry/default/ui/X` → `@<alias>/components/X`

By default it only syncs components that **already exist** in the target (safe override). Pass specific filenames to force-add new ones.

### Via shadcn registry (needs dev server running)

```bash
pnpm dev  # start DS at localhost:3333
./scripts/update-ds.sh --cwd ../internal-ui/packages/ui
```

This uses `shadcn add --overwrite` against the local registry. Import rewriting is handled by shadcn based on the target's `components.json` aliases.

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
4. When `--internal` is **not** set, strips Formance-CDN `@font-face` blocks and removes `'Polymath'` / `'Berkeley Mono'` from `--font-sans` / `--font-mono` (Google Fonts Figtree import and remaining fallbacks are preserved).
5. Writes the result back.

`add` is intentionally **not** rewritten — adding components rarely brings new tokens.

### Keeping the template in sync with platform-ui

The canonical layout source is `platform-ui/packages/ui/src/styles/globals.css`. Token _values_ are injected from the registry, so token edits in platform-ui flow through automatically once the registry is regenerated.

Only re-sync the template when **layout** changes (section order, comments, `@font-face` URLs, or the canonical `--font-sans` / `--font-mono` strings):

```bash
cp ../platform-ui/packages/ui/src/styles/globals.css cli/src/templates/globals.css
cd cli && pnpm build
```
