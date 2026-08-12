import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, resolve, sep } from 'node:path';

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
 *
 * The target arrives over the network, and this pass reads and rewrites whatever
 * it names, so a target that climbs out of the project (`../../../.zshrc`) or
 * names an absolute path must not resolve at all: it stays inside the root it
 * was resolved against or it is nothing.
 */
const containedPath = (root: string, target: string): string | null => {
  if (isAbsolute(target)) return null;

  const candidate = resolve(root, target);
  if (!candidate.startsWith(resolve(root) + sep)) return null;
  if (!existsSync(candidate)) return null;

  // A path can spell out as contained and still leave the project: a symlink
  // inside it may point anywhere, and the write below follows the link. So the
  // real path has to clear the same boundary as the written one.
  return realpathSync(candidate).startsWith(realpathSync(root) + sep)
    ? candidate
    : null;
};

const resolveTargetPath = (cwd: string, target: string): string | null =>
  containedPath(cwd, target) ?? containedPath(join(cwd, 'src'), target);

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
 *
 * Under shadcn's default aliases the `ui` one is the `components` one plus
 * `/ui`, which makes the spliced form and the repaired form the same string. The
 * match is then left alone and not counted — the reported total is work done, so
 * a no-op must not inflate it.
 */
const repairFragmentPrefix = (
  source: string,
  uiAlias: string,
  componentsAlias: string
): { source: string; replacements: number } => {
  let replacements = 0;
  const next = source.replace(
    new RegExp(`(['"\`])${escapeForRegex(uiAlias)}-fragments/`, 'g'),
    (match: string, quote: string) => {
      const repaired = `${quote}${componentsAlias}/ui-fragments/`;
      if (repaired === match) return match;
      replacements++;

      return repaired;
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
    // Whether the specifier shadcn writes needs changing depends on the
    // project's aliases: where the two agree there is nothing to repair, and a
    // fix that rewrites a string to itself would be counted as one.
    if (wrong === right) continue;
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
