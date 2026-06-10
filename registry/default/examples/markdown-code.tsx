'use client';

import { Markdown } from '@/registry/default/ui-fragments/markdown';

const SOURCE = `## Code blocks

Fenced code blocks render through the design system's \`CodeSnippet\` (Shiki,
CSS-variable theming, copy button). Inline code like \`asset = "USD/2"\` stays
lightweight.

\`\`\`typescript
import { SDK } from '@formance/formance-sdk';

const sdk = new SDK({ serverURL: 'https://example.formance.cloud' });
const ledgers = await sdk.ledger.v2.listLedgers({});
\`\`\`

\`\`\`bash
fctl ledger create default --bucket bucket0
\`\`\`

\`\`\`json
{ "postings": [{ "source": "world", "destination": "users:001", "amount": 100, "asset": "USD/2" }] }
\`\`\`

Unknown languages fall back to plain text:

\`\`\`rust
fn main() { println!("falls back to plaintext"); }
\`\`\``;

export default function MarkdownCode() {
  return (
    <div className="w-full max-w-2xl">
      <Markdown>{SOURCE}</Markdown>
    </div>
  );
}
