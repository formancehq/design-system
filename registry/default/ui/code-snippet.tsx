'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import {
  cssVarsTheme,
  getHighlighter,
  type TCodeLanguage,
} from '@/registry/default/ui/code-themes';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const codeSnippetVariants = cva(
  'not-prose overflow-hidden rounded-lg font-mono [&>pre]:overflow-x-auto [&>pre]:[scrollbar-width:thin] [&_code]:font-mono',
  {
    variants: {
      size: {
        sm: 'text-sm [&>pre]:p-3',
        md: 'text-base [&>pre]:p-4',
        lg: 'text-lg [&>pre]:p-6',
      },
      bordered: {
        true: 'border border-border',
        false: '',
      },
    },
    defaultVariants: {
      size: 'sm',
      bordered: true,
    },
  }
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type TCodeSnippetProps = {
  /** Source code to highlight */
  code: string;
  /** Language for syntax highlighting */
  language?: TCodeLanguage;
  /** Show line numbers gutter */
  showLineNumbers?: boolean;
  /** Show copy-to-clipboard button */
  canCopy?: boolean;
  /** Additional class names on the outer wrapper */
  className?: string;
} & VariantProps<typeof codeSnippetVariants>;

function CodeSnippet({
  code,
  language = 'typescript',
  showLineNumbers = false,
  canCopy = true,
  size,
  bordered,
  className,
}: TCodeSnippetProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!code) {
        setHtml('<pre><code></code></pre>');

        return;
      }

      const highlighter = await getHighlighter();
      const result = highlighter.codeToHtml(code, {
        lang: language,
        theme: cssVarsTheme.name!,
        transformers: showLineNumbers
          ? [
              {
                name: 'line-numbers',
                line(node, line) {
                  node.properties['data-line'] = line;
                  node.children.unshift({
                    type: 'element',
                    tagName: 'span',
                    properties: {
                      class: 'line-number',
                      style:
                        'color: var(--shiki-token-comment); margin-right: 1rem; user-select: none; display: inline-block; width: 2em; text-align: right;',
                    },
                    children: [{ type: 'text', value: String(line) }],
                  });
                },
              },
            ]
          : [],
      });

      if (!cancelled) setHtml(result);
    })();

    return () => {
      cancelled = true;
    };
  }, [code, language, showLineNumbers]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('group/code-snippet relative', className)}>
      {html ? (
        <div
          className={codeSnippetVariants({ size, bordered })}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className={codeSnippetVariants({ size, bordered })}>
          <pre>
            <code className="font-mono">{code}</code>
          </pre>
        </div>
      )}

      {canCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground group-hover/code-snippet:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

export { CodeSnippet, codeSnippetVariants, type TCodeSnippetProps };
