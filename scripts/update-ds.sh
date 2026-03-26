#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REGISTRY_JSON="$DS_ROOT/registry.json"
REGISTRY_PREFIX="@formance"

usage() {
  echo "Usage: $0 --cwd <path-to-ui-package>"
  echo ""
  echo "Rebuilds the local design system registry, then installs/updates"
  echo "all components into the target package via shadcn."
  echo ""
  echo "Requires the design system dev server to be running (pnpm dev)."
  echo ""
  echo "Example:"
  echo "  $0 --cwd ../internal-ui/packages/ui"
  exit 1
}

cwd=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --cwd) cwd="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

if [[ -z "$cwd" ]]; then
  echo "Error: --cwd is required"
  usage
fi

cwd="$(cd "$cwd" && pwd)"

if [[ ! -f "$cwd/components.json" ]]; then
  echo "Error: No components.json found at $cwd/components.json"
  exit 1
fi

echo "Rebuilding registry..."
(cd "$DS_ROOT" && pnpm registry:build)

# Read component names from registry.json into an array
readarray -t components < <(python3 -c "
import json
with open('$REGISTRY_JSON') as f:
    data = json.load(f)
for item in data['items']:
    print(f'$REGISTRY_PREFIX/{item[\"name\"]}')
")

echo "Found ${#components[@]} components. Installing into $cwd..."

pnpm dlx shadcn@latest add --cwd "$cwd" --overwrite "${components[@]}"

echo "Done. Updated ${#components[@]} components."
