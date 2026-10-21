'use client';

import { DownloadIcon, FileCodeIcon, WrapTextIcon } from 'lucide-react';
import * as React from 'react';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import { Button } from '@/registry/default/ui/button';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const code = `import { SDK } from "@formance/formance-sdk"

export async function payout(clientId: string, amount: number) {
  const formance = new SDK({ serverURL: process.env.FORMANCE_URL })

  return formance.ledger.v2.createTransaction({
    ledger: "omnibus",
    v2PostTransaction: {
      script: { plain: payoutScript, vars: { client: clientId, amount: \`USD/2 \${amount}\` } },
    },
  })
}`;

function download(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CodeBlockDemo() {
  const [wrap, setWrap] = React.useState(false);
  const lines = useHighlightedCode(code, 'ts');

  return (
    <div className="w-full max-w-lg">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <FileCodeIcon />
            app/lib/payout.ts
          </CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Wrap lines"
              aria-pressed={wrap}
              className="aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Download"
              onClick={() => download(code, 'payout.ts')}
            >
              <DownloadIcon />
            </Button>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap} lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={index >= 5 && index <= 9 ? 'highlighted' : 'default'}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
