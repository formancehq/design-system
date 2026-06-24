/**
 * Local static analysis of a Numscript snippet — vendored, dependency-free.
 *
 * Ported from `@formance/numscript-engine` (the docs build pipeline). We
 * don't ship a Numscript parser in JS, but we can detect which experimental
 * features a snippet uses from stable, lexical signals: each feature has a
 * recognisable keyword or syntactic shape. The detector is conservative — it
 * errs toward "needs the flag" when uncertain.
 *
 * To keep the lexical pass robust, comments are stripped and string literals
 * are masked first so their contents can't trigger a false positive.
 */

export type TFeatureFlag =
  | 'experimental-overdraft-function'
  | 'experimental-get-asset-function'
  | 'experimental-get-amount-function'
  | 'experimental-oneof'
  | 'experimental-account-interpolation'
  | 'experimental-mid-script-function-call'
  | 'experimental-asset-colors'
  | 'experimental-asset-scaling';

export type TFeatureFlagSpec = {
  id: TFeatureFlag;
  /** Human-readable short name, used in pills/chips. */
  short: string;
};

export type TInterpreter = 'machine' | 'experimental';

export const FEATURE_FLAGS: readonly TFeatureFlagSpec[] = [
  { id: 'experimental-overdraft-function', short: 'overdraft()' },
  { id: 'experimental-oneof', short: 'oneof' },
  { id: 'experimental-account-interpolation', short: 'account interpolation' },
  {
    id: 'experimental-mid-script-function-call',
    short: 'mid-script function call',
  },
  { id: 'experimental-get-asset-function', short: 'get_asset()' },
  { id: 'experimental-get-amount-function', short: 'get_amount()' },
  { id: 'experimental-asset-colors', short: 'asset colors' },
  { id: 'experimental-asset-scaling', short: 'asset scaling' },
] as const;

const FLAG_IDS = new Set(FEATURE_FLAGS.map((f) => f.id));
const FLAG_INDEX = new Map(FEATURE_FLAGS.map((f, i) => [f.id, i]));
const FLAG_SHORT = new Map(FEATURE_FLAGS.map((f) => [f.id, f.short]));

function isFeatureFlag(id: string): id is TFeatureFlag {
  return FLAG_IDS.has(id as TFeatureFlag);
}

/** Sort a flag set into canonical order (the order listed above). */
export function normalizeFlags(flags: readonly string[]): TFeatureFlag[] {
  const seen = new Set<TFeatureFlag>();
  for (const f of flags) if (isFeatureFlag(f)) seen.add(f);

  return [...seen].sort(
    (a, b) => (FLAG_INDEX.get(a) ?? 0) - (FLAG_INDEX.get(b) ?? 0)
  );
}

/** Short, human-readable label for a flag (falls back to stripping the prefix). */
export function flagShortName(flag: TFeatureFlag): string {
  return FLAG_SHORT.get(flag) ?? flag.replace(/^experimental-/, '');
}

const SHEBANGS: ReadonlyArray<{ flag: TFeatureFlag; re: RegExp }> = [
  // overdraft() the function (the `allowing … overdraft` directive is machine-compatible).
  { flag: 'experimental-overdraft-function', re: /\boverdraft\s*\(/ },
  { flag: 'experimental-oneof', re: /\boneof\b/ },
  // `@foo:$var:bar` or `@$var` — a `$var` segment inside an `@` account literal.
  {
    flag: 'experimental-account-interpolation',
    re: /@[A-Za-z0-9_:-]*\$[A-Za-z_]/,
  },
  { flag: 'experimental-get-asset-function', re: /\bget_asset\s*\(/ },
  { flag: 'experimental-get-amount-function', re: /\bget_amount\s*\(/ },
  // `vars { monetary $x = fn(...) }` — a function call on the RHS inside the vars block.
  {
    flag: 'experimental-mid-script-function-call',
    re: /\bvars\s*\{[^}]*=\s*[A-Za-z_][A-Za-z0-9_]*\s*\(/s,
  },
  // `@account \ "GRANT"` color restriction OR `[USD/2#red 100]` asset-literal color suffix.
  {
    flag: 'experimental-asset-colors',
    re: /(?:@[A-Za-z0-9_:$-]+\s*\\\s*"[^"]*")|(?:\[[A-Z][A-Z0-9]*\/\d+#[A-Za-z0-9_-]+)/,
  },
  // `[USD/2 -> USD/4 …]` scale conversion.
  {
    flag: 'experimental-asset-scaling',
    re: /\[[A-Z][A-Z0-9]*\/\d+\s*->\s*[A-Z]/,
  },
];

/** Strip line + block comments, replacing them with spaces (preserves offsets). */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length))
    .replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length));
}

/** Mask string-literal contents with spaces (preserves offsets + quote chars). */
function maskStrings(source: string): string {
  return source.replace(
    /"([^"\\]|\\.)*"/g,
    (m) => `"${' '.repeat(m.length - 2)}"`
  );
}

/** Mask strings FIRST so a `"// foo"` literal can't be misread as a comment. */
function sanitize(script: string): string {
  return stripComments(maskStrings(script));
}

/**
 * Parse a `#![feature("a", "b", …)]` declaration at the top of a snippet.
 * Comment-stripped but NOT string-masked: the flag ids live inside `"…"`.
 */
function extractShebangFlags(script: string): TFeatureFlag[] {
  const match = stripComments(script).match(
    /^\s*#!\[feature\s*\(\s*([^)]+)\s*\)\s*\]/
  );
  if (!match?.[1]) return [];
  const ids = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]!);

  return normalizeFlags(ids);
}

/** Minimum feature-flag set a snippet needs, inferred from lexical signals. */
export function inferFlags(script: string): TFeatureFlag[] {
  const sanitized = sanitize(script);
  const hits = new Set<TFeatureFlag>();
  for (const f of extractShebangFlags(script)) hits.add(f);
  for (const { flag, re } of SHEBANGS) {
    if (re.test(sanitized)) hits.add(flag);
  }

  return normalizeFlags([...hits]);
}

/**
 * Conservative interpreter guess: a snippet that needs no experimental flag
 * runs on the `machine` interpreter, otherwise it's `experimental`. This
 * mirrors the docs' non-validated `useSnippet` path.
 */
export function inferInterpreter(flags: readonly TFeatureFlag[]): TInterpreter {
  return flags.length === 0 ? 'machine' : 'experimental';
}
