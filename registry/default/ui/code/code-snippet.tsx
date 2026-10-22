'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';
import { type TCodeLanguage } from '@/registry/default/ui/code/code-themes';

// A one-line CodeBlock: highlights `code` with the same highlighter as
// CodeBlock, and keeps the Shiki background of the Formance code theme.

const codeSnippetContentVariants = cva('', {
  variants: {
    size: {
      sm: '',
      md: 'px-4 py-4 text-base',
      lg: 'px-6 py-6 text-lg',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

type TCodeSnippetProps = {
  code: string;
  language?: TCodeLanguage;
  showLineNumbers?: boolean;
  canCopy?: boolean;
  /**
   * Render a top bar with the language on the left and the actions on the
   * right, instead of actions that show on hover.
   */
  showHeader?: boolean;
  /** Rendered next to the copy button, in the header or in the hover actions. */
  headerActions?: ReactNode;
  /** Force a theme instead of inheriting it from the document. */
  isDark?: boolean;
  bordered?: boolean;
  /** @deprecated Code never wraps: a long line scrolls. Kept so existing calls compile. */
  isSingleLine?: boolean;
  className?: string;
} & VariantProps<typeof codeSnippetContentVariants>;

function CodeSnippet({
  code,
  language = 'typescript',
  showLineNumbers = false,
  canCopy = true,
  showHeader = false,
  headerActions,
  size,
  bordered = true,
  isDark,
  className,
}: TCodeSnippetProps) {
  const lines = useHighlightedCode(code, language);
  const hasActions = canCopy || headerActions !== undefined;

  const actions = hasActions && (
    <CodeBlockActions>
      {headerActions}
      {canCopy && <CodeBlockCopyButton value={code.trim()} />}
    </CodeBlockActions>
  );

  return (
    <CodeBlock
      data-shiki-theme={
        isDark === undefined ? undefined : isDark ? 'dark' : 'light'
      }
      className={cn(
        'bg-(--shiki-background) text-(--shiki-foreground) dark:bg-(--shiki-background)',
        !bordered && 'border-0',
        className
      )}
    >
      {showHeader ? (
        <CodeBlockHeader>
          <CodeBlockTitle className="uppercase">{language}</CodeBlockTitle>
          {actions}
        </CodeBlockHeader>
      ) : (
        actions
      )}
      <CodeBlockContent
        lineNumbers={showLineNumbers}
        className={codeSnippetContentVariants({ size })}
      >
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  );
}

export { CodeSnippet, type TCodeSnippetProps };
