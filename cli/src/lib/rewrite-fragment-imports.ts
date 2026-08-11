import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { fetchRegistryItems, type TRegistryItemDetail } from './registry.js';

type TComponentsJson = {
  aliases?: {
    ui?: string;
    components?: string;
  };
};

const stripExt = (p: string): string => p.replace(/\.tsx?$/, '');

const escapeForRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const readComponentsJson = (cwd: string): TComponentsJson | null => {
  const candidate = join(cwd, 'components.json');
  if (!existsSync(candidate)) return null;

  return JSON.parse(readFileSync(candidate, 'utf8')) as TComponentsJson;
};

/**
 * Where a registry `target` actually landed on disk.
 *
 * A target is alias-relative (`components/ui-fragments/api-snippet.tsx`), and
 * shadcn resolves it through `components.json` and the project's tsconfig
 * paths. Joining it straight onto `cwd` misses every `src`-rooted project —
 * which is all of ours — so the file is silently never scanned. Rather than
 * reimplement tsconfig path resolution, try the two layouts shadcn supports and
 * take the one that exists.
 */
const resolveTargetPath = (cwd: string, target: string): string | null =>
  [join(cwd, target), join(cwd, 'src', target)].find((candidate) =>
    existsSync(candidate)
  ) ?? null;

const resolveTargetImport = (
  target: string,
  componentsAlias: string
): string | null => {
  const noExt = stripExt(target);
  if (!noExt.startsWith('components/')) return null;

  return `${componentsAlias}${noExt.slice('components'.length)}`;
};

/**
 * Repairs shadcn's rewrite of a `ui-fragments` path.
 *
 * shadcn swaps the `@/registry/<style>/ui` prefix for the `ui` alias without
 * requiring a path separator after it, so a fragment importing a sibling
 * fragment comes out spliced: `@/registry/default/ui-fragments/copy-button`
 * becomes `<uiAlias>-fragments/copy-button`, which resolves nowhere. The
 * fragments land under `components/ui-fragments/`, so that is what the
 * specifier has to say.
 */
const repairFragmentPrefix = (
  source: string,
  uiAlias: string,
  componentsAlias: string
): { source: string; replacements: number } => {
  let replacements = 0;
  const next = source.replace(
    new RegExp(`(['"\`])${escapeForRegex(uiAlias)}-fragments/`, 'g'),
    (_, quote: string) => {
      replacements++;

      return `${quote}${componentsAlias}/ui-fragments/`;
    }
  );

  return { source: next, replacements };
};

export type TRewriteResult = {
  filesScanned: number;
  filesChanged: number;
  replacements: number;
};

export async function rewriteFragmentImports(
  cwd: string,
  base: string,
  installedNames: string[]
): Promise<TRewriteResult> {
  const empty: TRewriteResult = {
    filesScanned: 0,
    filesChanged: 0,
    replacements: 0,
  };

  const componentsJson = readComponentsJson(cwd);
  const uiAlias = componentsJson?.aliases?.ui;
  const componentsAlias = componentsJson?.aliases?.components;
  if (!uiAlias || !componentsAlias) return empty;

  const items = (await fetchRegistryItems(base, installedNames)).filter(
    (x): x is TRegistryItemDetail => x !== null
  );

  const fixes: Array<{ pattern: RegExp; right: string }> = [];
  for (const item of items) {
    const file = item.files?.[0];
    if (!file?.target) continue;
    const right = resolveTargetImport(file.target, componentsAlias);
    if (!right) continue;
    const wrong = `${uiAlias}/${item.name}`;
    fixes.push({
      pattern: new RegExp(`(['"\`])${escapeForRegex(wrong)}(['"\`])`, 'g'),
      right,
    });
  }

  const filesToScan = new Set<string>();
  for (const item of items) {
    for (const file of item.files ?? []) {
      const abs = file.target && resolveTargetPath(cwd, file.target);
      if (abs) filesToScan.add(abs);
    }
  }

  let filesScanned = 0;
  let filesChanged = 0;
  let replacements = 0;

  for (const abs of filesToScan) {
    filesScanned++;
    const original = readFileSync(abs, 'utf8');
    let next = original;
    for (const fix of fixes) {
      next = next.replace(fix.pattern, (_, open: string, close: string) => {
        replacements++;

        return `${open}${fix.right}${close}`;
      });
    }

    const repaired = repairFragmentPrefix(next, uiAlias, componentsAlias);
    replacements += repaired.replacements;
    next = repaired.source;

    if (next !== original) {
      writeFileSync(abs, next);
      filesChanged++;
    }
  }

  return { filesScanned, filesChanged, replacements };
}
