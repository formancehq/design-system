import * as React from 'react';

import { loadHighlighter } from '@/registry/default/lib/highlighter';

export function useHighlightedCode(value: string, language: string) {
  // A trailing newline would render as an extra empty line.
  const code = value.endsWith('\n') ? value.slice(0, -1) : value;
  const [loaded, setLoaded] = React.useState<{
    language: string;
    highlighter: Awaited<ReturnType<typeof loadHighlighter>>;
  } | null>(null);
  const highlighter = loaded?.language === language ? loaded.highlighter : null;

  React.useEffect(() => {
    let cancelled = false;

    loadHighlighter(language)
      .then((loadedHighlighter) => {
        if (!cancelled) {
          setLoaded({ language, highlighter: loadedHighlighter });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [language]);

  // The complete lines, highlighted. While the code streams, only the new
  // lines are tokenized, starting from the grammar state of the last one.
  const [completeLines, setCompleteLines] = React.useState<{
    highlighter: typeof highlighter;
    text: string;
    lines: React.ReactNode[];
    state?: Parameters<NonNullable<typeof highlighter>['highlight']>[1];
  }>({ highlighter: null, text: '', lines: [] });

  let nextCompleteLines = completeLines;

  if (
    nextCompleteLines.highlighter !== highlighter ||
    !code.startsWith(nextCompleteLines.text)
  ) {
    nextCompleteLines = { highlighter, text: '', lines: [] };
  }

  const end = code.lastIndexOf('\n') + 1;

  if (highlighter && end > nextCompleteLines.text.length) {
    const result = highlighter.highlight(
      code.slice(nextCompleteLines.text.length, end - 1),
      nextCompleteLines.state
    );

    nextCompleteLines = {
      highlighter,
      text: code.slice(0, end),
      lines: [...nextCompleteLines.lines, ...result.lines],
      state: result.state,
    };
  }

  if (nextCompleteLines !== completeLines) {
    setCompleteLines(nextCompleteLines);
  }

  // The last line is still being written, so it is tokenized on every render.
  const tail = code.slice(end);

  return React.useMemo(() => {
    if (!highlighter) {
      return code.split('\n');
    }

    return [
      ...nextCompleteLines.lines,
      highlighter.highlight(tail, nextCompleteLines.state).lines[0],
    ];
  }, [code, highlighter, nextCompleteLines, tail]);
}
