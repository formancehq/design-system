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
// Styled element map (the reusable core — override any key via the
// `components` prop on <Markdown>)
// ---------------------------------------------------------------------------

const markdownComponents: Partial<Components> = {
  h1: ({ node, className, ...props }) => (
    <h1
      className={cn(
        'mt-8 mb-4 scroll-m-20 font-heading text-3xl font-medium first:mt-0',
        className
      )}
      {...props}
    />
  ),
  h2: ({ node, className, ...props }) => (
    <h2
      className={cn(
        'mt-8 mb-3 scroll-m-20 font-heading text-2xl font-medium first:mt-0',
        className
      )}
      {...props}
    />
  ),
  h3: ({ node, className, ...props }) => (
    <h3
      className={cn(
        'mt-6 mb-3 scroll-m-20 font-heading text-xl font-medium',
        className
      )}
      {...props}
    />
  ),
  h4: ({ node, className, ...props }) => (
    <h4
      className={cn(
        'mt-6 mb-2 scroll-m-20 font-heading text-lg font-medium',
        className
      )}
      {...props}
    />
  ),
  h5: ({ node, className, ...props }) => (
    <h5
      className={cn(
        'mt-6 mb-2 scroll-m-20 font-heading text-base font-medium',
        className
      )}
      {...props}
    />
  ),
  h6: ({ node, className, ...props }) => (
    <h6
      className={cn(
        'mt-6 mb-2 scroll-m-20 font-heading text-sm font-medium text-muted-foreground',
        className
      )}
      {...props}
    />
  ),
  p: ({ node, className, ...props }) => (
    <p
      className={cn(
        'leading-7 text-muted-foreground [&:not(:first-child)]:mt-4',
        className
      )}
      {...props}
    />
  ),
  a: ({ node, className, href, ...props }) => {
    const isExternal = /^https?:\/\//.test(href ?? '');

    return (
      <a
        href={href}
        className={cn(
          'font-medium text-foreground underline underline-offset-4 hover:no-underline',
          className
        )}
        {...(isExternal && { target: '_blank', rel: 'noreferrer' })}
        {...props}
      />
    );
  },
  strong: ({ node, className, ...props }) => (
    <strong
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  ),
  ul: ({ node, className, ...props }) => (
    <ul
      className={cn(
        'my-4 ml-6 list-disc [&>li]:mt-2',
        className?.includes('contains-task-list') && 'ml-0 list-none',
        className
      )}
      {...props}
    />
  ),
  ol: ({ node, className, ...props }) => (
    <ol
      className={cn('my-4 ml-6 list-decimal [&>li]:mt-2', className)}
      {...props}
    />
  ),
  li: ({ node, className, ...props }) => (
    <li
      className={cn('leading-7 text-muted-foreground', className)}
      {...props}
    />
  ),
  input: ({ node, className, ...props }) => (
    <input
      className={cn('mr-2 align-middle accent-primary', className)}
      {...props}
    />
  ),
  blockquote: ({ node, className, ...props }) => (
    <blockquote
      className={cn(
        'mt-4 border-l-2 border-border pl-6 italic text-muted-foreground',
        className
      )}
      {...props}
    />
  ),
  hr: ({ node, className, ...props }) => (
    <hr className={cn('my-8 border-border', className)} {...props} />
  ),
  img: ({ node, className, alt, ...props }) => (
    <img
      alt={alt ?? ''}
      className={cn('my-4 rounded-lg border border-border', className)}
      {...props}
    />
  ),
  table: ({ node, className, ...props }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table
        className={cn('w-full border-collapse text-sm', className)}
        {...props}
      />
    </div>
  ),
  thead: ({ node, className, ...props }) => (
    <thead className={cn('bg-muted/50', className)} {...props} />
  ),
  tr: ({ node, className, ...props }) => (
    <tr
      className={cn('border-b border-border last:border-0', className)}
      {...props}
    />
  ),
  th: ({ node, className, ...props }) => (
    <th
      className={cn(
        'px-4 py-2 text-left font-medium text-foreground',
        className
      )}
      {...props}
    />
  ),
  td: ({ node, className, ...props }) => (
    <td
      className={cn('px-4 py-2 align-top text-muted-foreground', className)}
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
        <code
          className={cn(
            'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium text-foreground',
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    const code = raw.replace(/\n$/, '');

    if (lang === 'mermaid') {
      return <MermaidDiagram chart={code} />;
    }

    return (
      <div className="my-4">
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
    <div className={cn('text-foreground', className)}>
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
