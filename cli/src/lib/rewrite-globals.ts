import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss, {
  type AtRule,
  type Declaration,
  type Root,
  type Rule,
} from 'postcss';

type TComponentsJson = {
  tailwind?: { css?: string };
};

type TVarMap = Map<string, string>;

const here = dirname(fileURLToPath(import.meta.url));

const findTemplate = (fileName: string): string => {
  const relative = join('templates', fileName);
  const candidates = [
    join(here, relative),
    join(here, '..', relative),
    join(here, '..', '..', 'src', relative),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    `Could not locate ${fileName} template. Looked in:\n${candidates.join('\n')}`
  );
};

/**
 * The globals.css template imports `./typeset.css`, so the file must sit next
 * to every stylesheet written from it. It is DS-owned and copied verbatim on
 * each run — consumers tune typeset with a `.typeset-*` preset in their own
 * globals.css, never by editing this file.
 */
const writeTypeset = (cssAbs: string) =>
  copyFileSync(
    findTemplate('typeset.css'),
    join(dirname(cssAbs), 'typeset.css')
  );

const collectVars = (container: Rule | AtRule): TVarMap => {
  const map: TVarMap = new Map();
  container.walkDecls((decl: Declaration) => {
    if (decl.parent !== container) return;
    if (!decl.prop.startsWith('--')) return;
    map.set(decl.prop, decl.value);
  });

  return map;
};

const extractValues = (css: string) => {
  const root = postcss.parse(css);
  const rootVars: TVarMap = new Map();
  const darkVars: TVarMap = new Map();
  const themeVars: TVarMap = new Map();

  root.walkRules((rule) => {
    if (rule.parent?.type !== 'root') return;
    if (rule.selector === ':root') {
      for (const [k, v] of collectVars(rule)) rootVars.set(k, v);
    } else if (rule.selector === '.dark') {
      for (const [k, v] of collectVars(rule)) darkVars.set(k, v);
    }
  });

  root.walkAtRules('theme', (atRule) => {
    if (atRule.parent?.type !== 'root') return;
    if (!/\binline\b/.test(atRule.params)) return;
    for (const [k, v] of collectVars(atRule)) themeVars.set(k, v);
  });

  return { rootVars, darkVars, themeVars };
};

const TEMPLATE_OWNED_KEYS = new Set(['--font-sans', '--font-mono']);

const applyValues = (container: Rule | AtRule, overrides: TVarMap): number => {
  let patched = 0;
  container.walkDecls((decl) => {
    if (decl.parent !== container) return;
    if (!decl.prop.startsWith('--')) return;
    if (TEMPLATE_OWNED_KEYS.has(decl.prop)) return;
    const next = overrides.get(decl.prop);
    if (next !== undefined && next !== decl.value) {
      decl.value = next;
      patched += 1;
    }
  });

  return patched;
};

const FORMANCE_CDN_RE = /formance01\.b-cdn\.net/;
const POLYMATH_FAMILY_RE = /^\s*'Polymath'\s*,\s*/;
const BERKELEY_FAMILY_RE = /^\s*'Berkeley Mono'\s*,\s*/;

const stripFormanceFonts = (root: Root) => {
  root.walkAtRules('font-face', (atRule) => {
    if (FORMANCE_CDN_RE.test(atRule.toString())) atRule.remove();
  });

  root.walkRules(':root', (rule) => {
    if (rule.parent?.type !== 'root') return;
    rule.walkDecls('--font-sans', (decl) => {
      decl.value = decl.value.replace(POLYMATH_FAMILY_RE, '');
    });
    rule.walkDecls('--font-mono', (decl) => {
      decl.value = decl.value.replace(BERKELEY_FAMILY_RE, '');
    });
  });
};

const SOURCE_AT_RULE = 'source';

// `@source '../x'` and `@source "../x"` name the same tree, so comparing the
// params verbatim would preserve a line the template already carries.
const globOf = (atRule: AtRule) =>
  atRule.params.trim().replace(/^["']|["']$/g, '');

const collectSourceGlobs = (root: Root): Set<string> => {
  const globs = new Set<string>();
  root.walkAtRules(SOURCE_AT_RULE, (atRule) => {
    if (atRule.parent?.type !== 'root') return;
    globs.add(globOf(atRule));
  });

  return globs;
};

const lastRootSource = (root: Root): AtRule | null => {
  let last: AtRule | null = null;
  root.walkAtRules(SOURCE_AT_RULE, (atRule) => {
    if (atRule.parent?.type === 'root') last = atRule;
  });

  return last;
};

const BLANK_LINE_RE = /\n\s*\n/;

/**
 * `@source` lines belong to the consumer, not to the template: only the
 * consumer knows which trees Tailwind cannot reach on its own — a workspace
 * package resolved through `node_modules` is never scanned, so a class used
 * only there is never generated. Every root-level `@source` the installed file
 * carries and the template does not is therefore kept, together with the
 * comment directly above it, which is where the reason for it lives.
 *
 * A line the template *used* to ship reads as consumer-authored here and is
 * kept too. Dropping a glob from the template therefore only reaches new
 * consumers; an installed file has to be edited once by hand.
 */
const preserveExtraSources = (templateRoot: Root, installedCss: string) => {
  const globs = collectSourceGlobs(templateRoot);
  // With no `@source` in the template there is nothing to insert after, and
  // dropping the consumer's lines is the one outcome this function exists to
  // prevent — so they go to the end of the file, where Tailwind reads them just
  // the same.
  let anchor = lastRootSource(templateRoot);

  postcss.parse(installedCss).walkAtRules(SOURCE_AT_RULE, (atRule) => {
    if (atRule.parent?.type !== 'root') return;
    const glob = globOf(atRule);
    if (globs.has(glob)) return;
    globs.add(glob);

    const preserved = atRule.clone();
    const above = atRule.prev();
    // Only a comment on the lines immediately above belongs to this `@source`;
    // one separated by a blank line is the previous block's.
    const carriesReason =
      above?.type === 'comment' &&
      !BLANK_LINE_RE.test(atRule.raws.before ?? '');
    const nodes = carriesReason ? [above.clone(), preserved] : [preserved];
    nodes[0]!.raws.before = '\n';

    if (anchor) anchor.after(nodes);
    else for (const node of nodes) templateRoot.append(node);
    anchor = preserved;
  });
};

export type TRewriteOptions = {
  internal?: boolean;
};

const resolveCssPath = (cwd: string): string | null => {
  const componentsJsonPath = join(cwd, 'components.json');
  if (!existsSync(componentsJsonPath)) return null;

  const config = JSON.parse(
    readFileSync(componentsJsonPath, 'utf8')
  ) as TComponentsJson;
  const cssRel = config.tailwind?.css;
  if (!cssRel) return null;

  return resolve(cwd, cssRel);
};

const SHADCN_TAILWIND_CSS = 'shadcn/tailwind.css';

const rootImports = (root: Root) =>
  root.nodes.filter(
    (node): node is AtRule => node.type === 'atrule' && node.name === 'import'
  );

// Where `shadcn add code-themes` lands the stylesheet: its registry target is
// alias-relative, so a `src`-rooted project gets it under `src/`.
const CODE_THEMES_TARGET = join('components', 'code', 'code-themes.css');

/**
 * CodeSnippet, CodeEditor and CodeBlock read their token and ANSI colors from
 * `code-themes.css`, which ships as a separate file of the `code-themes` item.
 * The stylesheet imports it only when it is installed — an `@import` of a
 * missing file breaks the consumer's build — and in the utilities layer, as
 * the docs site does.
 */
const addCodeThemesImport = (
  root: Root,
  cwd: string,
  cssAbs: string
): boolean => {
  const codeThemes = [
    join(cwd, CODE_THEMES_TARGET),
    join(cwd, 'src', CODE_THEMES_TARGET),
  ].find((candidate) => existsSync(candidate));
  const hasCodeThemesImport = root.nodes.some(
    (node) =>
      node.type === 'atrule' &&
      node.name === 'import' &&
      node.params.includes('code-themes.css')
  );
  if (!codeThemes || hasCodeThemesImport) return false;

  const rel = relative(dirname(cssAbs), codeThemes).split(sep).join('/');
  const importRule = postcss.atRule({
    name: 'import',
    params: `'${rel.startsWith('.') ? rel : `./${rel}`}' layer(utilities)`,
  });
  const lastImport = rootImports(root).at(-1);
  if (lastImport) {
    lastImport.after(importRule);
    importRule.raws.before = '\n';
  } else root.prepend(importRule);

  return true;
};

/**
 * The shared AI CSS (`shimmer`, `scroll-fade-*`, the `data-open` / `data-closed`
 * / `data-checked` variants, accordion keyframes) is not shipped per component:
 * like upstream shadcn, every component assumes the stylesheet imports
 * `shadcn/tailwind.css` from the `shadcn` package. It goes right after
 * `tw-animate-css` (where the template has it), else after `tailwindcss`.
 */
const addShadcnTailwindImport = (root: Root): boolean => {
  const imports = rootImports(root);
  if (imports.some((node) => node.params.includes(SHADCN_TAILWIND_CSS)))
    return false;

  const importRule = postcss.atRule({
    name: 'import',
    params: `'${SHADCN_TAILWIND_CSS}'`,
  });
  const anchor =
    imports.find((node) => node.params.includes('tw-animate-css')) ??
    imports.find((node) => /^["']tailwindcss["']/.test(node.params)) ??
    imports.at(-1);
  if (anchor) {
    anchor.after(importRule);
    importRule.raws.before = '\n';
  } else root.prepend(importRule);

  return true;
};

// Rules the DS used to hand-copy from `shadcn/tailwind.css` into globals.css.
// Next to the import they are a second definition that wins over the upstream
// one, so the consumer is told to remove them.
const COPIED_FROM_SHADCN = new Set([
  'custom-variant data-open',
  'custom-variant data-closed',
  'custom-variant data-checked',
  'custom-variant data-disabled',
  'utility shimmer',
  'utility shimmer-none',
  'utility scroll-fade-x',
  'utility scroll-fade-y',
  'utility scroll-fade-b',
  'keyframes accordion-down',
  'keyframes accordion-up',
]);

const findCopiedShadcnRules = (root: Root): string[] =>
  root.nodes
    .filter((node): node is AtRule => node.type === 'atrule')
    .map((node) => `${node.name} ${node.params.trim()}`)
    .filter((rule) => COPIED_FROM_SHADCN.has(rule));

export type TEnsureGlobalsImportsResult = {
  cssPath: string;
  added: string[];
  copiedShadcnRules: string[];
};

/**
 * `add` without `--overwrite` leaves globals.css alone, apart from the imports
 * the installed components cannot work without: `shadcn/tailwind.css` always,
 * and `code-themes.css` once the `code-themes` item is installed.
 */
export function ensureGlobalsImports(
  cwd: string
): TEnsureGlobalsImportsResult | null {
  const cssAbs = resolveCssPath(cwd);
  if (!cssAbs || !existsSync(cssAbs)) return null;

  const root = postcss.parse(readFileSync(cssAbs, 'utf8'));
  const added = [
    addShadcnTailwindImport(root) && SHADCN_TAILWIND_CSS,
    addCodeThemesImport(root, cwd, cssAbs) && 'code-themes.css',
  ].filter((name): name is string => typeof name === 'string');

  if (added.length > 0) writeFileSync(cssAbs, root.toString());

  return {
    cssPath: cssAbs,
    added,
    copiedShadcnRules: findCopiedShadcnRules(root),
  };
}

type TPackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

// The `shadcn` release whose `tailwind.css` the components are written
// against. Upstream lists it as a devDependency of its style item. Older
// releases resolve the import but lack rules: 4.5.0 has no shimmer or
// scroll-fade at all, 4.19.0 no shimmer reduced-motion fallback.
const SHADCN_MIN_VERSION = '4.22.1';

const installedShadcnVersion = (cwd: string): string | null => {
  for (let dir = resolve(cwd); ; dir = dirname(dir)) {
    const pkgPath = join(dir, 'node_modules', 'shadcn', 'package.json');
    if (existsSync(pkgPath))
      return (
        (JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string })
          .version ?? null
      );
    if (dirname(dir) === dir) return null;
  }
};

const isOlderThan = (version: string, minimum: string) => {
  const [a, b] = [version, minimum].map((v) =>
    v.split(/[.-]/).slice(0, 3).map(Number)
  );
  const index = a!.findIndex((part, i) => part !== b![i]);

  return index >= 0 && a![index]! < b![index]!;
};

/**
 * `@import 'shadcn/tailwind.css'` resolves from the consumer's `node_modules`,
 * so the package that owns globals.css must depend on a recent `shadcn`. Adds
 * it as a devDependency when neither dependency list has it, and warns when
 * the installed release is older than the one the components need.
 */
export function ensureShadcnDependency(cwd: string) {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return;

  const raw = readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw) as TPackageJson;
  const declared = pkg.dependencies?.shadcn ?? pkg.devDependencies?.shadcn;

  if (!declared) {
    pkg.devDependencies = Object.fromEntries(
      Object.entries({
        ...pkg.devDependencies,
        shadcn: `^${SHADCN_MIN_VERSION}`,
      }).sort(([a], [b]) => a.localeCompare(b))
    );
    const trailingNewline = raw.endsWith('\n') ? '\n' : '';
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + trailingNewline);
    console.log(
      `✔ Added shadcn@^${SHADCN_MIN_VERSION} to devDependencies (globals.css imports shadcn/tailwind.css). Run your package manager install to fetch it.`
    );

    return;
  }

  const installed = installedShadcnVersion(cwd);
  if (installed && isOlderThan(installed, SHADCN_MIN_VERSION))
    console.warn(
      `⚠ shadcn ${installed} is installed (${pkgPath} declares "${declared}"). shadcn/tailwind.css from it lacks rules the components use. Upgrade it to ^${SHADCN_MIN_VERSION}.`
    );
}

export function writeGlobalsFromTemplate(
  cwd: string,
  options: TRewriteOptions = {}
): string | null {
  const cssAbs = resolveCssPath(cwd);
  if (!cssAbs) return null;

  const templateRoot = postcss.parse(
    readFileSync(findTemplate('globals.css'), 'utf8')
  );

  // Restoring a mangled stylesheet from the template is what `--overwrite` is
  // for, so a destination postcss cannot parse must not abort the write: it
  // loses its `@source` lines, and is told so, rather than the whole install
  // failing on a file it was about to replace anyway.
  if (existsSync(cssAbs)) {
    const installedCss = readFileSync(cssAbs, 'utf8');
    try {
      preserveExtraSources(templateRoot, installedCss);
    } catch (error) {
      console.warn(
        `⚠ Could not read the @source lines in ${cssAbs} (${error instanceof Error ? error.message : String(error)}). Overwriting it from the template; re-add any @source your project needs.`
      );
    }
  }

  addCodeThemesImport(templateRoot, cwd, cssAbs);
  if (!options.internal) stripFormanceFonts(templateRoot);

  writeFileSync(cssAbs, templateRoot.toString());
  writeTypeset(cssAbs);

  return cssAbs;
}

export function rewriteGlobalsFromTemplate(
  cwd: string,
  options: TRewriteOptions = {}
): string | null {
  const cssAbs = resolveCssPath(cwd);
  if (!cssAbs || !existsSync(cssAbs)) return null;

  const installedCss = readFileSync(cssAbs, 'utf8');
  const { rootVars, darkVars, themeVars } = extractValues(installedCss);

  const templateRoot = postcss.parse(
    readFileSync(findTemplate('globals.css'), 'utf8')
  );

  preserveExtraSources(templateRoot, installedCss);

  templateRoot.walkRules((rule) => {
    if (rule.parent?.type !== 'root') return;
    if (rule.selector === ':root') applyValues(rule, rootVars);
    else if (rule.selector === '.dark') applyValues(rule, darkVars);
  });

  templateRoot.walkAtRules('theme', (atRule) => {
    if (atRule.parent?.type !== 'root') return;
    if (!/\binline\b/.test(atRule.params)) return;
    applyValues(atRule, themeVars);
  });

  addCodeThemesImport(templateRoot, cwd, cssAbs);
  if (!options.internal) stripFormanceFonts(templateRoot);

  // Before the early return: a typeset update must land even when the
  // consumer's globals.css is already up to date.
  writeTypeset(cssAbs);

  const output = templateRoot.toString();
  if (output === installedCss) return null;

  writeFileSync(cssAbs, output);

  return cssAbs;
}
