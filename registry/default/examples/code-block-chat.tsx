'use client';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';
import { Message, MessageContent } from '@/registry/default/ui/message';

const code = `vars {
  account $client
  monetary $amount
}

send $amount (
  source = @clients:$client:available
  destination = @bank:omnibus:payouts
)`;

export default function CodeBlockChat() {
  const lines = useHighlightedCode(code, 'numscript');

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How do I pay out a client balance?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-3">
          <p>Add a payout transaction to the schema:</p>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>transactions/payout.num</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>
              {lines.map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))}
            </CodeBlockContent>
          </CodeBlock>
          <p>The ledger rejects it when the client balance is too low.</p>
        </MessageContent>
      </Message>
    </div>
  );
}
