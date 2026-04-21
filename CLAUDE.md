# Formance Design System

## Mission

Build a **public shadcn registry** for Formance's design system, hosted at `https://design.formance.com`. Anyone can install components via:

```
npx shadcn add https://design.formance.com/r/<component>.json
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

## Dev Server

```
pnpm dev     # localhost:3333
```
