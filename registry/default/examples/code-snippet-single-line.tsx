'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

export default function CodeSnippetSingleLine() {
  return (
    <CodeSnippet
      code="curl -X POST https://sandbox.formance.cloud/api/ledger/v2/default/transactions"
      language="bash"
      isSingleLine
    />
  );
}
