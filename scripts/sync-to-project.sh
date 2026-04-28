#!/usr/bin/env bash
set -euo pipefail

# Sync design system components to a consumer project by direct file copy.
# Rewrites DS import aliases to match the target project's aliases.
#
# Unlike update-ds.sh (which uses shadcn add and needs the dev server),
# this script works offline by copying files and rewriting imports via sed.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DS_UI="$DS_ROOT/registry/default/ui"
DS_CSS="$DS_ROOT/app/globals.css"

# -- Defaults (platform-ui) ------------------------------------------------
DEFAULT_TARGET_DIR="/Users/brieuccaillot/Developer/Formance/platform-ui/packages/ui/src/components"
DEFAULT_TARGET_CSS="/Users/brieuccaillot/Developer/Formance/platform-ui/packages/ui/src/styles/globals.css"
DEFAULT_ALIAS_PREFIX="@platform/ui"

usage() {
  cat <<EOF
Usage: $0 [options] [component...]

Copies DS components into a consumer project, rewriting imports.

Options:
  --target-dir <path>    Component directory (default: platform-ui components)
  --target-css <path>    Target globals.css to sync (default: platform-ui styles)
  --alias <prefix>       Import alias prefix (default: @platform/ui)
  --with-css             Also sync globals.css (skipped by default)
  --css-only             Only sync globals.css, skip components
  --dry-run              Show what would be copied without writing
  -h, --help             Show this help

Arguments:
  component...           Specific component filenames to sync (e.g. button.tsx card.tsx).
                         If omitted, syncs ALL components that exist in both source and target.

Examples:
  # Sync all shared components to platform-ui (default)
  $0

  # Sync specific components
  $0 button.tsx badge.tsx input.tsx

  # Sync to internal-ui instead
  $0 --target-dir ../internal-ui/packages/ui/src/components \\
     --alias "@internal/ui"

  # Preview what would change
  $0 --dry-run

  # Only sync CSS tokens
  $0 --css-only
EOF
  exit 0
}

# -- Parse args -------------------------------------------------------------
target_dir="$DEFAULT_TARGET_DIR"
target_css="$DEFAULT_TARGET_CSS"
alias_prefix="$DEFAULT_ALIAS_PREFIX"
css_only=false
sync_css_flag=false
dry_run=false
components=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target-dir) target_dir="$2"; shift 2 ;;
    --target-css) target_css="$2"; shift 2 ;;
    --alias)      alias_prefix="$2"; shift 2 ;;
    --css-only)   css_only=true; shift ;;
    --with-css)   sync_css_flag=true; shift ;;
    --dry-run)    dry_run=true; shift ;;
    -h|--help)    usage ;;
    -*)           echo "Unknown option: $1"; usage ;;
    *)            components+=("$1"); shift ;;
  esac
done

# -- Validate ---------------------------------------------------------------
if [[ ! -d "$DS_UI" ]]; then
  echo "Error: DS components not found at $DS_UI"
  exit 1
fi

if [[ ! -d "$target_dir" ]]; then
  echo "Error: Target directory not found at $target_dir"
  exit 1
fi

# -- Rewrite function -------------------------------------------------------
rewrite_imports() {
  local file="$1"
  # @/lib/utils → @alias/lib/utils
  sed -i '' "s|from '@/lib/utils'|from '${alias_prefix}/lib/utils'|g" "$file"
  # @/lib/compose-refs → @alias/lib/compose-refs
  sed -i '' "s|from '@/lib/compose-refs'|from '${alias_prefix}/lib/compose-refs'|g" "$file"
  # @/registry/default/ui/X → @alias/components/X
  sed -i '' "s|from '@/registry/default/ui/|from '${alias_prefix}/components/|g" "$file"
  # @/hooks/X → @alias/hooks/X
  sed -i '' "s|from '@/hooks/|from '${alias_prefix}/hooks/|g" "$file"
}

# -- Sync CSS ---------------------------------------------------------------
sync_css() {
  if [[ ! -f "$target_css" ]]; then
    echo "Warning: Target CSS not found at $target_css, skipping CSS sync"
    return
  fi
  if $dry_run; then
    echo "[dry-run] Would sync: globals.css"
  else
    cp "$DS_CSS" "$target_css"
    # Rewrite CSS import paths: registry/default/ui/ → components/
    sed -i '' "s|../registry/default/ui/|../components/|g" "$target_css"
    echo "Synced: globals.css"
  fi
}

# -- Sync components --------------------------------------------------------
sync_components() {
  local synced=0
  local skipped=0

  # Build file list
  local files=()
  if [[ ${#components[@]} -gt 0 ]]; then
    # Specific components requested
    for comp in "${components[@]}"; do
      local src="$DS_UI/$comp"
      if [[ -f "$src" ]]; then
        files+=("$comp")
      else
        echo "Warning: $comp not found in DS, skipping"
      fi
    done
  else
    # All components that exist in both source and target
    for src_file in "$DS_UI"/*.tsx; do
      local name
      name="$(basename "$src_file")"
      if [[ -f "$target_dir/$name" ]]; then
        files+=("$name")
      else
        skipped=$((skipped + 1))
      fi
    done
  fi

  if [[ ${#files[@]} -eq 0 ]]; then
    echo "No components to sync."
    return
  fi

  echo "Syncing ${#files[@]} components → $target_dir"
  if [[ $skipped -gt 0 ]]; then
    echo "($skipped DS components skipped — not present in target)"
  fi
  echo ""

  for name in "${files[@]}"; do
    local src="$DS_UI/$name"
    local dst="$target_dir/$name"

    if $dry_run; then
      echo "[dry-run] Would sync: $name"
    else
      cp "$src" "$dst"
      rewrite_imports "$dst"
      echo "Synced: $name"
    fi
    synced=$((synced + 1))
  done

  echo ""
  echo "Done. Synced $synced component(s)."
}

# -- Main -------------------------------------------------------------------
echo "Design System → ${target_dir##*/}"
echo "Alias: $alias_prefix"
echo ""

if $css_only || $sync_css_flag; then
  sync_css
fi

if ! $css_only; then
  sync_components
fi
