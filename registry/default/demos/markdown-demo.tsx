'use client';

import { Markdown } from '@/registry/default/ui-fragments/markdown';

const SOURCE = `# Programmable Ledger

Formance Ledger is a **real-time**, _double-entry_ accounting engine. It exposes
a [single API](https://docs.formance.com) for modelling money movement.

## Why a ledger?

Money movements are recorded as immutable transactions. You get:

- Atomic, multi-posting transactions
- A complete, queryable history
- Strong consistency guarantees

> Treat the ledger as the source of truth for balances — never recompute them
> from application state.

### Writing a transaction

Transactions are written in **Numscript**:

\`\`\`numscript
send [USD/2 100] (
  source = @world
  destination = @users:001:wallet
)
\`\`\`

Or call the SDK directly with an inline \`createTransaction\` request:

\`\`\`typescript
const tx = await sdk.ledger.v2.createTransaction({
  ledger: 'default',
  data: { postings: [{ source: 'world', destination: 'users:001', amount: 100n, asset: 'USD/2' }] },
});
\`\`\`

## Asset scales

| Asset    | Scale | Smallest unit |
| -------- | ----- | ------------- |
| \`USD/2\`  | 2     | cent          |
| \`BTC/8\`  | 8     | satoshi       |
| \`JPY/0\`  | 0     | yen           |

---

Read the [getting started guide](https://docs.formance.com) to go further.`;

export default function MarkdownDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Markdown>{SOURCE}</Markdown>
    </div>
  );
}
