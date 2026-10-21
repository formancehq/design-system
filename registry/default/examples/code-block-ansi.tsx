'use client';

import { TerminalIcon } from 'lucide-react';

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

const output = `$ go test ./internal/...
\x1b[32mok\x1b[39m  internal/controller/ledger \x1b[2m(0.84s)\x1b[22m
\x1b[32mok\x1b[39m  internal/storage/ledger \x1b[2m(2.10s)\x1b[22m
\x1b[31mFAIL\x1b[39m internal/api/v2 \x1b[2m(0.41s)\x1b[22m

\x1b[31m--- FAIL: TestPostTransaction/overdraft (0.02s)\x1b[39m

\x1b[31m1 failed\x1b[39m | \x1b[32m2 passed\x1b[39m`;

export default function CodeBlockAnsi() {
  const lines = useHighlightedCode(output, 'ansi');

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={output.replace(/\x1b\[[\d;]*m/g, '')} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
