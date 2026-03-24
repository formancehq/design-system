import {
  createCssVariablesTheme,
  type Highlighter,
  type LanguageRegistration,
  type ThemeRegistration,
} from 'shiki';

import numscriptGrammar from '@/registry/default/ui/numscript.tmLanguage.json';

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
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
}) as ThemeRegistration & { tokenColors?: Record<string, unknown>[] };

export const cssVarsTheme: ThemeRegistration = {
  ...baseTheme,
  tokenColors: [
    ...(baseTheme.tokenColors ?? []),
    {
      scope: 'constant.other.monetary.numscript',
      settings: { foreground: 'var(--shiki-token-monetary)' },
    },
  ],
} as ThemeRegistration;

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
      themes: [cssVarsTheme],
      langs: [
        ...CODE_LANGUAGES.filter((l) => l !== 'numscript'),
        numscriptGrammar as unknown as LanguageRegistration,
      ],
    });

    highlighter = instance;

    return instance;
  })();

  return pending;
}

// ---------------------------------------------------------------------------
// Monaco helpers (used by code-editor)
// ---------------------------------------------------------------------------

/**
 * Resolve any CSS color value (including oklch, hsl, var()) to a hex string
 * by letting the browser's color engine do the conversion.
 */
function resolveColorToHex(color: string): string {
  if (!color || typeof document === 'undefined') return '#000000';

  const el = document.createElement('span');
  el.style.color = color;
  el.style.display = 'none';
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);

  // computed is "rgb(r, g, b)" or "rgba(r, g, b, a)"
  const match = computed.match(
    /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );
  if (!match) return '#000000';

  const [, r, g, b] = match;
  const hex = (n: string) => parseInt(n).toString(16).padStart(2, '0');

  return `#${hex(r)}${hex(g)}${hex(b)}`;
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

  return {
    base: isDark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: v('--shiki-token-comment', '#999988') },
      { token: 'string', foreground: v('--shiki-token-string', '#74739e') },
      {
        token: 'number',
        foreground: v('--shiki-token-constant', '#1C5655'),
      },
      { token: 'keyword', foreground: v('--shiki-token-keyword', '#507051') },
      {
        token: 'property',
        foreground: v('--shiki-token-constant', '#247372'),
      },
      {
        token: 'type',
        foreground: v('--shiki-token-keyword', '#507051'),
      },
    ],
    colors: {
      'editor.background': bg,
      'editor.foreground': fg,
      'editor.lineHighlightBackground': '#00000000',
      'editorLineNumber.foreground': v('--shiki-token-comment', '#5B7083'),
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

export function setupMonacoEnvironment(): void {
  if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
    window.MonacoEnvironment = {
      getWorkerUrl: () => {
        const blob = new Blob([''], { type: 'application/javascript' });

        return URL.createObjectURL(blob);
      },
    };
  }
}
