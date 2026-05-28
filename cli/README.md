# @formance/ds

CLI for installing [Formance design system](https://ds.formance.com) components into any shadcn-compatible project.

## Quick start

```bash
# Install a few components
pnpm dlx @formance/ds add button card input

# Install every component in the registry
pnpm dlx @formance/ds add --all

# List what's available
pnpm dlx @formance/ds list
```

Your project must already be set up with shadcn (run `pnpm dlx shadcn@latest init` first).

## Commands

### `add [components...]`

Install one or more components from the Formance registry.

| Flag               | Description                             |
| ------------------ | --------------------------------------- |
| `--all`            | Install every component in the registry |
| `--registry <url>` | Registry base URL (default: production) |
| `--cwd <path>`     | Target project directory                |
| `--overwrite`      | Overwrite existing files                |
| `-y, --yes`        | Skip confirmation prompts               |

Examples:

```bash
pnpm dlx @formance/ds add button
pnpm dlx @formance/ds add --all --overwrite --yes
pnpm dlx @formance/ds add data-table --cwd ./apps/web
```

### `list`

Print every component available in the registry.

```bash
pnpm dlx @formance/ds list
pnpm dlx @formance/ds list --json
```

## Local development

Run the design system locally, then point the CLI at it:

```bash
# Terminal 1 (in design-system/)
pnpm dev

# Terminal 2 (in design-system/cli/)
pnpm build
node dist/index.js add --all --registry http://localhost:3333/r --cwd ../path/to/your/app
```

## How it works

The CLI is a thin wrapper around `shadcn@latest add`. `--all` fetches `registry.json` from the configured base URL and expands to one `${base}/${name}.json` URL per component, then forwards everything to `shadcn add`.
