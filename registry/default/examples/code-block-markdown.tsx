'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import type { Components } from 'react-markdown';

import { getMessageText } from '@/lib/ai';
import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
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
import { Message, MessageContent } from '@/registry/default/ui/message';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

const response = `Add a payout transaction. It moves money from the client sub-balance to the payout account.

\`\`\`numscript
vars {
  account $client
  monetary $amount
}

send $amount (
  source = @clients:$client:available
  destination = @bank:omnibus:payouts
)
\`\`\`

The ledger rejects the payout when the client balance is too low.`;

const chat = createChat()
  .user('How do I pay out a client balance?')
  .assistant(({ writer }) => {
    writer.text(response);
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 30 });

function MarkdownCodeBlock({
  code,
  language,
  incomplete,
}: {
  code: string;
  language: string;
  incomplete: boolean;
}) {
  const lines = useHighlightedCode(code, language);

  return (
    <CodeBlock className="not-typeset">
      <CodeBlockHeader>
        <CodeBlockTitle className="uppercase">
          {language || 'text'}
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} disabled={incomplete} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  );
}

// Fenced code has a language class or spans lines. Everything else is inline.
function codeComponents(text: string, streaming: boolean): Components {
  // While the reply streams, a fence that is still open has an odd count.
  const incomplete = streaming && (text.match(/```/g)?.length ?? 0) % 2 === 1;

  return {
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children }) => {
      const raw = String(children ?? '');
      const language = /language-(\S+)/.exec(className ?? '')?.[1] ?? '';

      if (!language && !raw.includes('\n')) {
        return <code className={className}>{children}</code>;
      }

      return (
        <MarkdownCodeBlock
          code={raw.replace(/\n$/, '')}
          language={language}
          incomplete={incomplete}
        />
      );
    },
  };
}

export default function CodeBlockMarkdown() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  });
  const busy = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex min-h-112 w-full max-w-md flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        const text = getMessageText(message);

        return message.role === 'user' ? (
          <Message key={message.id} align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{text}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        ) : (
          <Message key={message.id}>
            <MessageContent>
              <Markdown
                components={codeComponents(
                  text,
                  busy && message === messages.at(-1)
                )}
              >
                {text}
              </Markdown>
            </MessageContent>
          </Message>
        );
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() => {
            setMessages([]);
            void sendMessage(question);
          }}
        >
          Replay
        </Button>
      )}
    </div>
  );
}
