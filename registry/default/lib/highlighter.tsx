import {
  createHighlighterCore,
  type GrammarState,
  type HighlighterCore,
  type LanguageRegistration,
} from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

import { cssVarsTheme } from '@/registry/default/ui/code/code-themes';
import numscriptGrammar from '@/registry/default/ui/code/numscript.tmLanguage.json';

// The shadcn highlighter for CodeBlock, with the Formance code theme: every
// token color is a `--shiki-token-*` variable from code-themes.css, so light
// and dark mode come from the stylesheet, as in CodeSnippet.

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import('shiki/langs/shellscript.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  numscript: () =>
    Promise.resolve({
      default: [numscriptGrammar as unknown as LanguageRegistration],
    }),
  python: () => import('shiki/langs/python.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  toml: () => import('shiki/langs/toml.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
};

const aliases: Record<string, keyof typeof languages> = {
  js: 'javascript',
  md: 'markdown',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  shellscript: 'bash',
  ts: 'typescript',
  yml: 'yaml',
  zsh: 'bash',
};

const ITALIC = 1;

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [cssVarsTheme],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  });

  return highlighter;
}

function getLanguage(language: string) {
  const name = language.toLowerCase();

  if (name === 'ansi') {
    return name;
  }

  if (name in languages) {
    return name as keyof typeof languages;
  }

  return aliases[name] ?? null;
}

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language);

  if (!lang) {
    return null;
  }

  const shiki = await getHighlighter();

  if (lang !== 'ansi' && !shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang]);
  }

  return {
    // Returns one React node per line, and the grammar state after the last
    // line. Pass that state back to continue where the code left off.
    highlight(code: string, state?: GrammarState) {
      const tokenize = (text: string) =>
        shiki.codeToTokens(text, {
          lang,
          theme: cssVarsTheme.name ?? 'formance-css-vars',
          grammarState: state,
        }).tokens;

      // ANSI has no grammar state, so each line is tokenized on its own and
      // gets the same colors whether it arrives in one piece or streams.
      const tokens =
        lang === 'ansi'
          ? code.split('\n').flatMap((line) => tokenize(line))
          : tokenize(code);

      return {
        lines: tokens.map((line) =>
          line.map((token, index) => (
            <span
              key={index}
              style={{
                color: token.color,
                fontStyle:
                  (token.fontStyle ?? 0) & ITALIC ? 'italic' : undefined,
              }}
            >
              {token.content}
            </span>
          ))
        ),
        state: shiki.getLastGrammarState(tokens),
      };
    },
  };
}

// Returns one React node per line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
  const highlighter = await loadHighlighter(language);

  return highlighter ? highlighter.highlight(code).lines : null;
}
