'use client';

import { Markdown } from '@/registry/default/ui-fragments/markdown';

const SOURCE = `## GitHub Flavored Markdown

GFM adds tables, task lists, strikethrough, and autolinks on top of CommonMark.

### Task list

- [x] Define the ledger
- [x] Write the first transaction
- [ ] Reconcile against the PSP
- [ ] ~~Manually recompute balances~~ (let the ledger do it)

### Table

| Module   | Status      | Notes                         |
| -------- | ----------- | ----------------------------- |
| Ledger   | Stable      | Core double-entry engine      |
| Payments | Stable      | PSP connectivity              |
| Wallets  | Beta        | Built on top of the ledger    |

Autolinked: https://formance.com`;

export default function MarkdownGfm() {
  return (
    <div className="w-full max-w-2xl">
      <Markdown>{SOURCE}</Markdown>
    </div>
  );
}
