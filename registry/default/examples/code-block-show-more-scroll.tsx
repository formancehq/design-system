'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import { Button } from '@/registry/default/ui/button';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const code = `ledger: omnibus

accounts:
  bank:omnibus:
    metadata:
      type: asset
      bank: acme
  bank:omnibus:payouts:
    metadata:
      type: asset
  clients:$id:available:
    metadata:
      type: liability
  clients:$id:interest:
    metadata:
      type: liability
  fees:interest:
    metadata:
      type: revenue

transactions:
  deposit:
    script: |
      send [USD/2 $amount] (
        source = @world
        destination = @clients:$client:available
      )
  payout:
    script: |
      send [USD/2 $amount] (
        source = @clients:$client:available
        destination = @bank:omnibus:payouts
      )
  accrue_interest:
    script: |
      send [USD/2 $interest] (
        source = @fees:interest allowing unbounded overdraft
        destination = @clients:$client:interest
      )`;

export default function CodeBlockShowMoreScroll() {
  const [expanded, setExpanded] = React.useState(false);
  const lines = useHighlightedCode(code, 'yaml');
  const id = React.useId();

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>schema.yaml</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          lineNumbers
          className={
            expanded
              ? 'max-h-96 scroll-fade-y'
              : 'max-h-64 scroll-fade-y overflow-y-hidden'
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon className="transition-transform in-aria-expanded:rotate-180" />
            {expanded ? 'Show less' : 'Show more'}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  );
}
