'use client';

import { FileCodeIcon } from 'lucide-react';

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

const code = `send [USD/2 $amount] (
  source = @world
  destination = @clients:$client:available
)`;

export default function CodeBlockTypeset() {
  const lines = useHighlightedCode(code, 'numscript');

  return (
    <div className="typeset w-full max-w-md">
      <h3>Record a deposit</h3>
      <p>
        A deposit moves money from <code>@world</code> into the client
        sub-balance of the omnibus account.
      </p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <FileCodeIcon />
            transactions/deposit.num
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
      <p>
        Run it with <code>fctl ledger transactions num</code>, or send it from
        the SDK.
      </p>
    </div>
  );
}
