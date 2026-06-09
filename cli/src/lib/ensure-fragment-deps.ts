import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { fetchRegistryItems, type TRegistryItemDetail } from './registry.js';

type TPackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const DEFAULT_VERSION_RANGES: Record<string, string> = {
  'class-variance-authority': '^0.7.1',
  clsx: '^2.1.1',
  'tailwind-merge': '^3.6.0',
  'lucide-react': '^1.17.0',
  'radix-ui': '^1.4.3',
  shiki: '^4.2.0',
};

const hasTargetOutsideUi = (item: TRegistryItemDetail): boolean =>
  (item.files ?? []).some(
    (file) => typeof file.target === 'string' && file.target.length > 0
  );

export type TEnsureDepsResult = {
  added: string[];
};

export async function ensureFragmentDependencies(
  cwd: string,
  base: string,
  installedNames: string[]
): Promise<TEnsureDepsResult> {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return { added: [] };

  const items = (await fetchRegistryItems(base, installedNames)).filter(
    (item): item is TRegistryItemDetail =>
      item !== null && hasTargetOutsideUi(item)
  );

  if (items.length === 0) return { added: [] };

  const needed = new Set<string>();
  for (const item of items) {
    for (const dep of item.dependencies ?? []) needed.add(dep);
  }
  if (needed.size === 0) return { added: [] };

  const raw = readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw) as TPackageJson;
  const deps = pkg.dependencies ?? {};
  const devDeps = pkg.devDependencies ?? {};

  const added: string[] = [];
  for (const dep of needed) {
    if (deps[dep] || devDeps[dep]) continue;
    deps[dep] = DEFAULT_VERSION_RANGES[dep] ?? 'latest';
    added.push(dep);
  }

  if (added.length === 0) return { added: [] };

  pkg.dependencies = Object.fromEntries(
    Object.entries(deps).sort(([a], [b]) => a.localeCompare(b))
  );

  const trailingNewline = raw.endsWith('\n') ? '\n' : '';
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + trailingNewline);

  return { added };
}
