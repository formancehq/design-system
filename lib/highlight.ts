import 'server-only';

import { getHighlighter } from '@/lib/shiki-theme';

export async function highlightCode(
  code: string,
  lang = 'tsx'
): Promise<string> {
  const hl = await getHighlighter();

  return hl.codeToHtml(code, {
    lang,
    theme: 'formance-css-vars',
  });
}
