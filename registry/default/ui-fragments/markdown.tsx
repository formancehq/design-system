'use client';

import 'katex/dist/katex.min.css';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { cn } from '@/lib/utils';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';
import {
  CODE_LANGUAGES,
  type TCodeLanguage,
} from '@/registry/default/ui/code/code-themes';

// ---------------------------------------------------------------------------
// Language resolution
// ---------------------------------------------------------------------------

const LANGUAGE_ALIASES: Record<string, TCodeLanguage> = {
  js: 'typescript',
  javascript: 'typescript',
  ts: 'typescript',
  typescript: 'typescript',
  jsx: 'tsx',
  tsx: 'tsx',
  yml: 'yaml',
  yaml: 'yaml',
  json: 'json',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  bash: 'bash',
  css: 'css',
  md: 'markdown',
  markdown: 'markdown',
  numscript: 'numscript',
};

function fenceLanguage(className?: string): string | undefined {
  return className?.match(/language-(\w+)/)?.[1]?.toLowerCase();
}

function resolveLanguage(lang?: string): TCodeLanguage {
  if (!lang) return 'plaintext';
  if (lang in LANGUAGE_ALIASES) return LANGUAGE_ALIASES[lang]!;

  return (CODE_LANGUAGES as readonly string[]).includes(lang)
    ? (lang as TCodeLanguage)
    : 'plaintext';
}

// ---------------------------------------------------------------------------
// Mermaid (lazy — the bundle only loads when a diagram is present)
// ---------------------------------------------------------------------------

// Formance emerald palette for mermaid's `base` theme. Mermaid derives edge,
// border and contrast colors from these, so they must be concrete values
// (not CSS var() references). Kept in sync with the docs framework.
const MERMAID_LIGHT = {
  primaryColor: '#dceced',
  primaryBorderColor: '#7b9ea3',
  primaryTextColor: '#183d47',
  lineColor: '#7b9ea3',
  secondaryColor: '#edf5f5',
  tertiaryColor: '#f5fafa',
  background: '#ffffff',
  mainBkg: '#dceced',
  nodeBorder: '#7b9ea3',
  clusterBkg: '#edf5f5',
  clusterBorder: '#a4c4c8',
  titleColor: '#183d47',
  edgeLabelBackground: '#edf5f5',
  textColor: '#183d47',
};

const MERMAID_DARK = {
  primaryColor: '#1e4a55',
  primaryBorderColor: '#7b9ea3',
  primaryTextColor: '#dceced',
  lineColor: '#a4c4c8',
  secondaryColor: '#183d47',
  tertiaryColor: '#112c33',
  background: '#112c33',
  mainBkg: '#1e4a55',
  nodeBorder: '#7b9ea3',
  clusterBkg: '#183d47',
  clusterBorder: '#4e7178',
  titleColor: '#dceced',
  edgeLabelBackground: '#183d47',
  textColor: '#dceced',
};

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

function MermaidDiagram({ chart }: { chart: string }) {
  const isDark = useIsDark();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: isDark ? MERMAID_DARK : MERMAID_LIGHT,
          fontFamily: 'inherit',
          // Strict sandboxing: Mermaid sanitizes labels and strips click
          // handlers so the rendered SVG injected via dangerouslySetInnerHTML
          // can't carry script when the markdown source is untrusted.
          securityLevel: 'strict',
        });
        const { svg } = await mermaid.render(idRef.current, chart);
        if (!cancelled) {
          setSvg(svg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to render diagram'
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, isDark]);

  if (error) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg border border-destructive/30 bg-card p-4 text-sm text-destructive-foreground">
        {error}
      </pre>
    );
  }

  return (
    <div
      className="my-4 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4 [&_foreignObject_p]:m-0 [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}

// ---------------------------------------------------------------------------
// Element map — typography comes from the `typeset` wrapper; these entries
// only add behavior (override any key via the `components` prop on <Markdown>)
// ---------------------------------------------------------------------------

const markdownComponents: Partial<Components> = {
  a: ({ node, href, ...props }) => {
    const isExternal = /^https?:\/\//.test(href ?? '');

    return (
      <a
        href={href}
        {...(isExternal && { target: '_blank', rel: 'noreferrer' })}
        {...props}
      />
    );
  },
  input: ({ node, className, ...props }) => (
    <input
      className={cn('mr-2 align-middle accent-primary', className)}
      {...props}
    />
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ node, className, children, ...props }) => {
    const raw = String(children ?? '');
    const lang = fenceLanguage(className);
    const isBlock = Boolean(lang) || raw.includes('\n');

    if (!isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    const code = raw.replace(/\n$/, '');

    if (lang === 'mermaid') {
      return (
        <div className="not-typeset">
          <MermaidDiagram chart={code} />
        </div>
      );
    }

    return (
      <div className="not-typeset my-4">
        <CodeSnippet code={code} language={resolveLanguage(lang)} />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export type TMarkdownProps = {
  /** Raw markdown source to render */
  children: string;
  /** Additional class names on the wrapper */
  className?: string;
  /**
   * Per-element overrides merged over the Formance defaults (consumer entries
   * win per key). Use this to inject custom components — e.g. map a callout.
   */
  components?: Partial<Components>;
};

function Markdown({ children, className, components }: TMarkdownProps) {
  return (
    <div className={cn('typeset typeset-docs max-w-[37em]', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{ ...markdownComponents, ...components }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export { Markdown, markdownComponents };
