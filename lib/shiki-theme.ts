import { createCssVariablesTheme } from 'shiki/core';
import { createHighlighter } from 'shiki';

export const cssVarsTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

/**
 * Pre-configured Shiki highlighter with all needed languages loaded upfront.
 * Shiki's default lazy loading doesn't work reliably in Next.js Turbopack,
 * so we eagerly load all grammars used in the docs.
 */
export function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: [cssVarsTheme],
    langs: ['tsx', 'typescript', 'javascript', 'bash', 'css', 'json', 'html'],
  });
  return highlighterPromise;
}
