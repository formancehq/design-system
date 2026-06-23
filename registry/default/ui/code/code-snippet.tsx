'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import {
  cssVarsTheme,
  getHighlighter,
  type TCodeLanguage,
} from '@/registry/default/ui/code/code-themes';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const codeSnippetVariants = cva(
  'not-prose overflow-hidden rounded-lg font-mono [&>pre]:overflow-x-scroll [&>pre]:[scrollbar-width:none] [&>pre::-webkit-scrollbar]:hidden [&_code]:font-mono',
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
      isSingleLine: {
        true: '[&>pre]:whitespace-nowrap',
        false: '',
      },
    },
    defaultVariants: {
      size: 'sm',
      bordered: true,
      isSingleLine: false,
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
  /**
   * Render a top bar showing the language label on the left and the copy
   * button on the right, instead of the floating hover copy button.
   */
  showHeader?: boolean;
  /** Force a specific theme instead of inheriting from the document */
  isDark?: boolean;
  /** Additional class names on the outer wrapper */
  className?: string;
} & VariantProps<typeof codeSnippetVariants>;

function CodeSnippet({
  code,
  language = 'typescript',
  showLineNumbers = false,
  canCopy = true,
  showHeader = false,
  size,
  bordered,
  isDark,
  isSingleLine,
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

  const dataShikiTheme =
    isDark !== undefined
      ? { 'data-shiki-theme': isDark ? 'dark' : 'light' }
      : {};

  const codeAreaClassName = cn(
    codeSnippetVariants({
      size,
      bordered: showHeader ? false : bordered,
      isSingleLine,
    }),
    showHeader && 'rounded-none'
  );

  const codeArea = html ? (
    <div
      className={codeAreaClassName}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <div className={codeAreaClassName}>
      <pre>
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );

  const copyButton = canCopy && (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label="Copy code"
      onClick={handleCopy}
      className={cn(
        'text-muted-foreground',
        !showHeader &&
          'absolute right-3 top-3 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover/code-snippet:opacity-100'
      )}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );

  if (showHeader) {
    return (
      <div
        className={cn(
          'group/code-snippet overflow-hidden rounded-lg',
          bordered !== false && 'border border-border',
          className
        )}
        {...dataShikiTheme}
      >
        <div className="flex items-center justify-between border-b bg-muted/40 p-1.5 pl-3">
          <span className="font-mono text-xs uppercase text-muted-foreground">
            {language}
          </span>
          {copyButton}
        </div>
        {codeArea}
      </div>
    );
  }

  return (
    <div
      className={cn('group/code-snippet relative', className)}
      {...dataShikiTheme}
    >
      {codeArea}
      {copyButton}
    </div>
  );
}

export { CodeSnippet, codeSnippetVariants, type TCodeSnippetProps };
