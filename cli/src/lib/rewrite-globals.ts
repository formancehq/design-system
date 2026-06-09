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
