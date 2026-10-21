'use client';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

const files = [
  {
    id: 'schema',
    title: 'ledger/schema.yaml',
    language: 'yaml',
    code: `accounts:
  bank:omnibus:
    metadata: { type: asset }
  clients:$id:available:
    metadata: { type: liability }`,
  },
  {
    id: 'payout',
    title: 'transactions/payout.num',
    language: 'numscript',
    code: `vars {
  account $client
  monetary $amount
}

send $amount (
  source = @clients:$client:available
  destination = @bank:omnibus:payouts
)`,
  },
  {
    id: 'env',
    title: '.env.local',
    language: 'bash',
    code: 'FORMANCE_URL=https://sandbox-k3x9.formance.cloud',
  },
];

function FileCode({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language);

  return (
    <CodeBlockContent lineNumbers>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  );
}

export default function CodeBlockTabs() {
  return (
    <Tabs defaultValue="schema" className="w-full max-w-md">
      <TabsList>
        {files.map((file) => (
          <TabsTrigger key={file.id} value={file.id}>
            {file.title.split('/').at(-1)}
          </TabsTrigger>
        ))}
      </TabsList>
      {files.map((file) => (
        <TabsContent key={file.id} value={file.id}>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>{file.title}</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={file.code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <FileCode code={file.code} language={file.language} />
          </CodeBlock>
        </TabsContent>
      ))}
    </Tabs>
  );
}
