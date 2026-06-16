'use client';

import { Markdown } from '@/registry/default/ui-fragments/markdown';

const SOURCE = `## Mermaid diagrams

A \`\`\`mermaid fence renders as a diagram. The mermaid bundle is loaded lazily,
so pages without diagrams never pay for it.

\`\`\`mermaid
flowchart LR
  world([world]) -->|100 USD/2| wallet[users:001:wallet]
  wallet -->|fee 2 USD/2| fees[platform:fees]
  wallet -->|98 USD/2| payout[users:001:payout]
\`\`\``;

export default function MarkdownMermaid() {
  return (
    <div className="w-full max-w-2xl">
      <Markdown>{SOURCE}</Markdown>
    </div>
  );
}
