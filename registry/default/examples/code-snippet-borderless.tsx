'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

const tsCode = `import { Client } from '@formance/formance-sdk';

const client = new Client({
  serverURL: 'https://sandbox.formance.cloud',
});

const ledger = await client.ledger.v2.listLedgers();`;

export default function CodeSnippetBorderless() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="rounded-lg bg-emerald-50 p-4">
        <CodeSnippet
          code={tsCode}
          language="typescript"
          showLineNumbers
          bordered={false}
          isDark={false}
        />
      </div>
      <div className="rounded-lg bg-emerald-900 p-4">
        <CodeSnippet
          code={tsCode}
          language="typescript"
          showLineNumbers
          bordered={false}
          isDark
        />
      </div>
    </div>
  );
}
