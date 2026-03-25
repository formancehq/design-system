import { createHighlighter } from 'shiki';

import { cssVarsTheme } from '@/registry/default/ui/code/code-themes';

export { cssVarsTheme };

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
