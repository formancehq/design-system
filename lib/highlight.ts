import 'server-only';

import { createHighlighter, type Highlighter } from 'shiki/bundle/full';
import { createCssVariablesTheme } from 'shiki/core';

const cssVarsTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: [cssVarsTheme],
      langs: ['tsx', 'bash', 'json', 'css'],
    });
  }
  return highlighter;
}

export async function highlightCode(code: string, lang = 'tsx'): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme: 'css-variables',
  });
}
