'use client';

import { RotateCcwIcon } from 'lucide-react';
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

const blocks: {
  title?: string;
  language: string;
  code: string;
  lineNumbers?: boolean;
  highlight?: number[];
  diff?: boolean;
}[] = [
  {
    title: 'ledger/schema.yaml',
    language: 'yaml',
    lineNumbers: true,
    code: `accounts:
  bank:omnibus:
    metadata: { type: asset }
  clients:$id:available:
    metadata: { type: liability }
  clients:$id:interest:
    metadata: { type: liability }`,
  },
  {
    language: 'bash',
    code: 'fctl ledger schemas insert v4 ledger/schema.yaml --ledger omnibus',
  },
  {
    title: 'transactions/payout.num',
    language: 'numscript',
    lineNumbers: true,
    diff: true,
    code: ` send [USD/2 $amount] (
-  source = @clients:$client:available
+  source = @clients:$client:available
+    allowing overdraft up to [USD/2 5000]
   destination = @bank:omnibus:payouts
 )`,
  },
  {
    title: 'transactions/accrue-interest.num',
    language: 'numscript',
    lineNumbers: true,
    highlight: [1, 2],
    code: `send [USD/2 $interest] (
  source = @fees:interest allowing unbounded overdraft
  destination = @clients:$client:interest
)`,
  },
  {
    title: '.env.local',
    language: 'bash',
    code: 'FORMANCE_URL=https://sandbox-k3x9.formance.cloud',
  },
];

// Where each block starts in the stream.
const offsets = blocks.map((_, index) =>
  blocks.slice(0, index).reduce((total, block) => total + block.code.length, 0)
);
const total = blocks.reduce((sum, block) => sum + block.code.length, 0);

function StreamingBlock({
  block,
  code,
}: {
  block: (typeof blocks)[number];
  code: string;
}) {
  const rows = code.split('\n');
  // A diff row starts with +, - or a space. The marker is not part of the code.
  const source = block.diff ? rows.map((row) => row.slice(1)).join('\n') : code;
  const lines = useHighlightedCode(source, block.language);

  return (
    <CodeBlock>
      {block.title && (
        <CodeBlockHeader>
          <CodeBlockTitle>{block.title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton
              value={source}
              disabled={code.length < block.code.length}
            />
          </CodeBlockActions>
        </CodeBlockHeader>
      )}
      <CodeBlockContent lineNumbers={block.lineNumbers}>
        {lines.map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={
              block.diff
                ? rows[index]?.startsWith('+')
                  ? 'added'
                  : rows[index]?.startsWith('-')
                    ? 'removed'
                    : 'default'
                : block.highlight?.includes(index)
                  ? 'highlighted'
                  : 'default'
            }
          >
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  );
}

export default function CodeBlockStreaming() {
  const [length, setLength] = React.useState(total);

  React.useEffect(() => {
    if (length >= total) {
      return;
    }

    const timeout = setTimeout(() => setLength(length + 3), 16);

    return () => clearTimeout(timeout);
  }, [length]);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {blocks.map((block, index) => {
        const offset = offsets[index] ?? 0;

        return (
          length > offset && (
            <StreamingBlock
              key={block.code}
              block={block}
              code={block.code.slice(0, length - offset)}
            />
          )
        );
      })}
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={length < total}
        onClick={() => setLength(0)}
      >
        <RotateCcwIcon />
        Replay
      </Button>
    </div>
  );
}
