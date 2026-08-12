import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
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

const TEMPLATE_RELATIVE = 'templates/globals.css';

const here = dirname(fileURLToPath(import.meta.url));

const candidateTemplatePaths = [
  join(here, TEMPLATE_RELATIVE),
  join(here, '..', TEMPLATE_RELATIVE),
  join(here, '..', '..', 'src', TEMPLATE_RELATIVE),
];

const findTemplate = (): string => {
  for (const candidate of candidateTemplatePaths) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    `Could not locate globals.css template. Looked in:\n${candidateTemplatePaths.join('\n')}`
  );
};

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

export function writeGlobalsFromTemplate(
  cwd: string,
  options: TRewriteOptions = {}
): string | null {
  const cssAbs = resolveCssPath(cwd);
  if (!cssAbs) return null;

  const templatePath = findTemplate();
  const templateRoot = postcss.parse(readFileSync(templatePath, 'utf8'));

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

  if (!options.internal) stripFormanceFonts(templateRoot);

  writeFileSync(cssAbs, templateRoot.toString());

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

  const templatePath = findTemplate();
  const templateCss = readFileSync(templatePath, 'utf8');
  const templateRoot = postcss.parse(templateCss);

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

  if (!options.internal) stripFormanceFonts(templateRoot);

  const output = templateRoot.toString();
  if (output === installedCss) return null;

  writeFileSync(cssAbs, output);

  return cssAbs;
}
