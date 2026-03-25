import {
  createCssVariablesTheme,
  type Highlighter,
  type LanguageRegistration,
  type ThemeRegistration,
} from 'shiki';

import numscriptGrammar from '@/registry/default/ui/code/numscript.tmLanguage.json';

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

export const CODE_LANGUAGES = [
  'typescript',
  'yaml',
  'json',
  'bash',
  'plaintext',
  'markdown',
  'numscript',
] as const;

export type TCodeLanguage = (typeof CODE_LANGUAGES)[number];

// ---------------------------------------------------------------------------
// CSS-variables Shiki theme
// ---------------------------------------------------------------------------

/**
 * A single Shiki theme that defers every color to CSS custom properties.
 * Define `--shiki-token-*` in your global CSS (light + dark) and it Just Works™.
 *
 * Extended with Numscript-specific scopes so the grammar's token types
 * (monetary literals, accounts, etc.) get their own CSS variables.
 */
const baseTheme = createCssVariablesTheme({
  name: 'formance-css-vars',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
}) as ThemeRegistration & { tokenColors?: Record<string, unknown>[] };

export const cssVarsTheme: ThemeRegistration = {
  ...baseTheme,
  tokenColors: [
    ...(baseTheme.tokenColors ?? []),
    {
      scope: 'support.type.property-name',
      settings: { foreground: 'var(--shiki-token-keyword)' },
    },
    {
      scope: 'support.type.property-name.json',
      settings: { foreground: 'var(--shiki-token-keyword)' },
    },
    {
      scope: 'constant.other.monetary.numscript',
      settings: { foreground: 'var(--shiki-token-monetary)' },
    },
  ],
} as ThemeRegistration;

// ---------------------------------------------------------------------------
// Fallback theme for Monaco tokenization (shikiToMonaco needs real colors)
// ---------------------------------------------------------------------------

const monacoFallbackTheme: ThemeRegistration = {
  name: 'formance-monaco-fallback',
  type: 'dark',
  colors: {
    'editor.background': '#01353c',
    'editor.foreground': '#D9E6E7',
  },
  tokenColors: [
    { scope: 'comment', settings: { foreground: '#999988' } },
    { scope: 'string', settings: { foreground: '#cac8f9' } },
    { scope: ['number', 'constant.numeric'], settings: { foreground: '#36ACAA' } },
    { scope: 'keyword', settings: { foreground: '#97c39a' } },
    { scope: ['property', 'variable.other.property'], settings: { foreground: '#36acaa' } },
    { scope: 'support.type.property-name', settings: { foreground: '#97c39a' } },
    { scope: 'support.type.property-name.json', settings: { foreground: '#97c39a' } },
    { scope: 'support.type.property-name.json punctuation', settings: { foreground: '#97c39a' } },
    { scope: 'variable', settings: { foreground: '#36ACAA' } },
    { scope: ['plain', 'entity.name'], settings: { foreground: '#D9E6E7' } },
    { scope: ['builtin', 'support.function'], settings: { foreground: '#97c39a' } },
    { scope: ['symbol', 'storage.type'], settings: { foreground: '#7a78b5' } },
    { scope: 'storage', settings: { foreground: '#97c39a' } },
    { scope: 'punctuation', settings: { foreground: '#D9E6E7' } },
    { scope: 'constant', settings: { foreground: '#36ACAA' } },
    { scope: 'constant.other.monetary.numscript', settings: { foreground: '#cac8f9' } },
    { scope: 'keyword.control.numscript', settings: { foreground: '#97c39a' } },
    { scope: 'string.other.numscript', settings: { foreground: '#D9E6E7' } },
    { scope: 'variable.parameter.function.numscript', settings: { foreground: '#36ACAA' } },
    { scope: 'support.function.numscript', settings: { foreground: '#97c39a' } },
    { scope: 'storage.type.numscript', settings: { foreground: '#7a78b5' } },
  ],
};

// ---------------------------------------------------------------------------
// Highlighter singleton
// ---------------------------------------------------------------------------

let highlighter: Highlighter | null = null;
let pending: Promise<Highlighter> | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter;
  if (pending) return pending;

  pending = (async () => {
    const { createHighlighter } = await import('shiki');

    const instance = await createHighlighter({
      themes: [monacoFallbackTheme, cssVarsTheme],
      langs: [
        ...CODE_LANGUAGES.filter((l) => l !== 'numscript'),
        numscriptGrammar as unknown as LanguageRegistration,
      ],
    });

    highlighter = instance;

    return instance;
  })().catch((err) => {
    pending = null;
    throw err;
  });

  return pending;
}

// ---------------------------------------------------------------------------
// Monaco helpers (used by code-editor)
// ---------------------------------------------------------------------------

/**
 * Resolve any CSS color value (including oklch, hsl, var()) to a hex string
 * by letting the browser's color engine do the conversion.
 * Reuses a single hidden element to avoid DOM thrashing.
 */
let _canvas: HTMLCanvasElement | null = null;
let _ctx: CanvasRenderingContext2D | null = null;

function resolveColorToHex(color: string): string {
  if (!color || typeof document === 'undefined') return '#000000';

  if (!_canvas) {
    _canvas = document.createElement('canvas');
    _canvas.width = 1;
    _canvas.height = 1;
    _ctx = _canvas.getContext('2d', { willReadFrequently: true });
  }

  if (!_ctx) return '#000000';

  // Draw a single pixel with the color, then read it back as RGBA
  _ctx.clearRect(0, 0, 1, 1);
  _ctx.fillStyle = color;
  _ctx.fillRect(0, 0, 1, 1);
  const data = _ctx.getImageData(0, 0, 1, 1).data;
  const hex = (n: number) => n.toString(16).padStart(2, '0');

  return `#${hex(data[0]!)}${hex(data[1]!)}${hex(data[2]!)}`;
}

/**
 * Read a CSS variable's raw value, then resolve it through the browser
 * color engine to get a hex color Monaco can understand.
 */
function resolveCSSVar(el: Element, name: string, fallback: string): string {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  if (!raw) return fallback;

  return resolveColorToHex(raw);
}

/**
 * Read resolved `--shiki-*` CSS variable values from the DOM and build a
 * Monaco `IStandaloneThemeData` on the fly. CSS is the single source of truth.
 */
export function buildMonacoThemeFromCSSVars(
  el: Element
): Record<string, unknown> {
  const v = (name: string, fallback: string) =>
    resolveCSSVar(el, name, fallback);

  const fg = v('--shiki-foreground', '#3e3838');
  const bg = v('--shiki-background', '#ffffff');
  const isDark = document.documentElement.classList.contains('dark');

  const comment = v('--shiki-token-comment', '#999988');
  const string = v('--shiki-token-string', '#74739e');
  const constant = v('--shiki-token-constant', '#1C5655');
  const keyword = v('--shiki-token-keyword', '#507051');
  const fn = v('--shiki-token-function', '#507051');
  const punctuation = v('--shiki-token-punctuation', fg);

  return {
    base: isDark ? 'vs-dark' : 'vs',
    inherit: false,
    rules: [
      { token: '', foreground: fg },
      { token: 'comment', foreground: comment },
      { token: 'string', foreground: string },
      { token: 'string.quoted', foreground: string },
      { token: 'string.other', foreground: string },
      { token: 'number', foreground: constant },
      { token: 'constant', foreground: constant },
      { token: 'constant.numeric', foreground: constant },
      { token: 'constant.other.monetary', foreground: v('--shiki-token-monetary', constant) },
      { token: 'constant.language', foreground: constant },
      { token: 'keyword', foreground: keyword },
      { token: 'keyword.control', foreground: keyword },
      { token: 'keyword.operator', foreground: keyword },
      { token: 'storage', foreground: keyword },
      { token: 'storage.type', foreground: keyword },
      { token: 'type', foreground: keyword },
      { token: 'support.function', foreground: fn },
      { token: 'support.type.property-name', foreground: keyword },
      { token: 'support.type.property-name.json', foreground: keyword },
      { token: 'variable', foreground: fg },
      { token: 'variable.parameter', foreground: fg },
      { token: 'property', foreground: constant },
      { token: 'punctuation', foreground: punctuation },
      { token: 'source', foreground: fg },
    ],
    colors: {
      'editor.background': bg,
      'editor.foreground': fg,
      'editor.lineHighlightBackground': '#00000000',
      'editorLineNumber.foreground': comment,
      'editor.selectionBackground': isDark ? '#024851' : '#ebf0f099',
    },
  };
}

export const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  scrollBeyondLastLine: false,
  overviewRulerBorder: false,
  fontFamily: 'Berkeley Mono, ui-monospace, monospace',
  fontSize: 14,
  padding: { top: 12, bottom: 12 },
  folding: true,
  guides: { indentation: false },
  minimap: { enabled: false },
  quickSuggestions: false,
  matchBrackets: 'never' as const,
  lineNumbers: 'off' as const,
  bracketPairColorization: { enabled: false },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _global = typeof window !== 'undefined' ? (window as any) : undefined;

export function setupMonacoEnvironment(): void {
  if (_global && !_global.MonacoEnvironment) {
    _global.MonacoEnvironment = {
      getWorkerUrl: () => {
        const blob = new Blob([''], { type: 'application/javascript' });

        return URL.createObjectURL(blob);
      },
    };
  }
}
