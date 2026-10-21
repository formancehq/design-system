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

const output = `$ fctl ledger transactions list --ledger omnibus
ID | Reference | Date                 | Metadata
3  | pay-0003  | 2026-10-21T09:20:41Z | client="042" type="payout" connector="stripe" payout_id="po_1Q8vXk2eZvKYlo2C"
2  | int-0002  | 2026-10-21T09:18:05Z | client="042" type="interest" period="2026-10"
1  | dep-0001  | 2026-10-21T09:14:02Z | client="042" type="deposit"`;

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
              variant="outline"
              size="icon-sm"
              aria-label="Wrap lines"
              aria-pressed={wrap}
              className="text-muted-foreground aria-pressed:text-foreground"
              onClick={() => setWrap(!wrap)}
            >
              <WrapTextIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Download"
              className="text-muted-foreground"
              onClick={() => download(output, 'transactions.log')}
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
