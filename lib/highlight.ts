import 'server-only';

import { createHighlighter, type Highlighter } from 'shiki/bundle/full';

import { cssVarsTheme } from '@/lib/shiki-theme';

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
