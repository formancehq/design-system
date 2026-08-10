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

const resolveTargetImport = (
  target: string,
  componentsAlias: string
): string | null => {
  const noExt = stripExt(target);
  if (!noExt.startsWith('components/')) return null;

  return `${componentsAlias}${noExt.slice('components'.length)}`;
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

  const fixes: Array<{ pattern: RegExp; replacement: string }> = [];

  // shadcn maps a source import by replacing the `@/registry/default/ui`
  // prefix, and does not require a trailing slash — so a sibling directory such
  // as `@/registry/default/ui-fragments/copy-button` comes out as
  // `<uiAlias>-fragments/copy-button`, which resolves nowhere and only fails at
  // build time. Map any such `<uiAlias>-<dir>/` back onto
  // `<componentsAlias>/ui-<dir>/`.
  fixes.push({
    pattern: new RegExp(
      `(['"\`])${escapeForRegex(uiAlias)}-([A-Za-z0-9_-]+)/`,
      'g'
    ),
    replacement: `$1${componentsAlias}/ui-$2/`,
  });

  for (const item of items) {
    const file = item.files?.[0];
    if (!file?.target) continue;
    const right = resolveTargetImport(file.target, componentsAlias);
    if (!right) continue;
    const wrong = `${uiAlias}/${item.name}`;
    fixes.push({
      pattern: new RegExp(`(['"\`])${escapeForRegex(wrong)}(['"\`])`, 'g'),
      replacement: `$1${right}$2`,
    });
  }

  if (fixes.length === 0) return empty;

  const filesToScan = new Set<string>();
  for (const item of items) {
    for (const file of item.files ?? []) {
      if (file.target) filesToScan.add(join(cwd, file.target));
    }
  }

  let filesScanned = 0;
  let filesChanged = 0;
  let replacements = 0;

  for (const abs of filesToScan) {
    if (!existsSync(abs)) continue;
    filesScanned++;
    const original = readFileSync(abs, 'utf8');
    let next = original;
    for (const fix of fixes) {
      replacements += next.match(fix.pattern)?.length ?? 0;
      next = next.replace(fix.pattern, fix.replacement);
    }
    if (next !== original) {
      writeFileSync(abs, next);
      filesChanged++;
    }
  }

  return { filesScanned, filesChanged, replacements };
}
