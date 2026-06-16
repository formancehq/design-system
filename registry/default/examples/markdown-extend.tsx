'use client';

import { Info } from 'lucide-react';
import type { Components } from 'react-markdown';

import { Markdown } from '@/registry/default/ui-fragments/markdown';

// Consumers extend the defaults by passing a `components` map — it is merged
// over the Formance defaults, so overriding one element keeps the rest intact.
// Here we turn blockquotes into a callout. The docs site does the same to
// inject its own <DocCallout>.
const overrides: Partial<Components> = {
  blockquote: ({ children }) => (
    <div className="my-4 flex gap-3 rounded-lg border border-info/30 bg-card p-4 text-sm">
      <Info className="mt-0.5 size-4 shrink-0 text-info-foreground" />
      <div className="[&>p]:m-0 [&>p]:text-muted-foreground">{children}</div>
    </div>
  ),
};

const SOURCE = `## Extensible by design

The renderer ships sensible defaults, but every element is overridable.

> This blockquote is rendered by a **custom callout component** passed through
> the \`components\` prop — the rest of the markdown still uses the defaults.

Regular paragraphs, \`inline code\`, and [links](https://formance.com) are
untouched.`;

export default function MarkdownExtend() {
  return (
    <div className="w-full max-w-2xl">
      <Markdown components={overrides}>{SOURCE}</Markdown>
    </div>
  );
}
