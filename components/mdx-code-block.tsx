'use client';

import { Children, isValidElement } from 'react';

import { CopyButton } from '@/components/copy-button';

/**
 * MDX <pre> override. rehype-pretty-code already injects syntax-highlighted
 * HTML into the children, so we just wrap it with our styled container + copy button.
 */
export function MdxCodeBlock(props: React.ComponentProps<'pre'>) {
  // Extract raw code text for the copy button
  const rawCode = extractText(props.children);

  return (
    <div className="group relative">
      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton text={rawCode} />
      </div>
      <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-sm [&_pre]:!bg-transparent [&_code]:font-mono">
        <pre {...props} />
      </div>
    </div>
  );
}

/** Recursively extract text content from React children. */
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (!children) return '';

  const arr = Children.toArray(children);

  return arr
    .map((child) => {
      if (typeof child === 'string') return child;
      if (isValidElement<{ children?: React.ReactNode }>(child)) {
        return extractText(child.props.children);
      }

      return '';
    })
    .join('')
    .trim();
}
