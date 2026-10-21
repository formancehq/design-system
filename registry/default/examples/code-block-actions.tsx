'use client';

import { DownloadIcon, TerminalIcon, WrapTextIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/registry/default/ui/button';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const output = `$ fctl ledger schema validate schema.yaml
schema.yaml
  accounts.fees           error    Account has no outgoing transaction. Add a transaction that moves money out of fees
  transactions.accrue     warning  Posts from world without a cap. Add an overdraft limit or a source account

✖ 2 problems (1 error, 1 warning)`;

function download(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CodeBlockActionsExample() {
  const [wrap, setWrap] = React.useState(true);

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
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
              onClick={() => download(output, 'validate.log')}
            >
              <DownloadIcon />
            </Button>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap}>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
