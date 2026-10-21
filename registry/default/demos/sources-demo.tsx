'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import type { UIMessage } from 'ai';
import { ArrowUpRightIcon, GlobeIcon } from 'lucide-react';

import { getMessageText } from '@/lib/ai';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

const chat = createChat()
  .user('How do I run Numscript against a ledger?')
  .assistant(({ writer }) => {
    writer.text(
      'Send the script to the ledger with fctl ledger transactions num. The ledger checks the balances and commits the postings in one transaction.'
    );
    writer.sourceUrl({
      url: 'https://docs.formance.com/ledger',
      title: 'Ledger | docs.formance.com',
    });
    writer.sourceUrl({
      url: 'https://github.com/formancehq/numscript',
      title: 'formancehq/numscript | github.com',
    });
    writer.sourceUrl({
      url: 'https://docs.formance.com/ledger',
      title: 'Ledger | docs.formance.com',
    });
    writer.sourceUrl({
      url: 'https://github.com/formancehq/fctl',
      title: 'formancehq/fctl | github.com',
    });
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

type TSourcePart = Extract<UIMessage['parts'][number], { type: 'source-url' }>;

function Sources({ sources }: { sources: TSourcePart[] }) {
  return (
    <Trace>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>Used {sources.length} sources</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
                  <TraceTitle>
                    {source.title ?? new URL(source.url).hostname}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TraceTitle>
                  <TraceIcon>
                    <ArrowUpRightIcon />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}

export default function SourcesDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  });
  const busy = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        if (message.role === 'user') {
          return (
            <Message key={message.id} align="end">
              <MessageContent>
                <Bubble align="end" variant="muted">
                  <BubbleContent>{getMessageText(message)}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          );
        }

        const sources = message.parts
          .filter((part) => part.type === 'source-url')
          .filter(
            (part, index, all) =>
              all.findIndex((other) => other.url === part.url) === index
          );
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {text && <p>{text}</p>}
              {sources.length > 0 && <Sources sources={sources} />}
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
            sendMessage(question);
          }}
        >
          Replay
        </Button>
      )}
    </div>
  );
}
