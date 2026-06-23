'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

export default function CodeSnippetHeader() {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <CodeSnippet
        code={`import { SDK } from '@formance/formance-sdk';

const client = new SDK({ serverURL: process.env.FORMANCE_API_URL });
const response = await client.ledger.v2.listLedgers();`}
        language="typescript"
        showHeader
      />
      <CodeSnippet
        code="fctl stack list --organization <organization-id>"
        language="bash"
        showHeader
        isSingleLine
      />
    </div>
  );
}
