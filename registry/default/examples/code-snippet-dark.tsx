'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

const tsCode = `import { Client } from '@formance/formance-sdk';

const client = new Client({
  serverURL: 'https://sandbox.formance.cloud',
});

const ledger = await client.ledger.v2.createTransaction({
  ledger: 'default',
  postTransaction: {
    postings: [{
      source: 'world',
      destination: 'orders:1234',
      asset: 'USD/2',
      amount: BigInt(1500),
    }],
  },
});`;

export default function CodeSnippetDark() {
  return (
    <div className="rounded-lg bg-emerald-900 p-4">
      <CodeSnippet
        code={tsCode}
        language="typescript"
        showLineNumbers
        bordered={false}
        isDark
      />
    </div>
  );
}
