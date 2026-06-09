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
      next = next.replace(fix.pattern, (_, open: string, close: string) => {
        replacements++;

        return `${open}${fix.right}${close}`;
      });
    }
    if (next !== original) {
      writeFileSync(abs, next);
      filesChanged++;
    }
  }

  return { filesScanned, filesChanged, replacements };
}
