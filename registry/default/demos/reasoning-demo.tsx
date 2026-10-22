'use client';

import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';

import { getMessageText } from '@/lib/ai';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

const chat = createChat()
  .user('Why do withdrawals fail for some clients?')
  .assistant(({ writer }) => {
    writer.reasoning(
      'The withdrawal script debits clients:$id:available and does not allow an overdraft.\n\nThree of the failed clients have a deposit that is still pending. Their available balance is zero until the bank settles the deposit, so the ledger rejects the withdrawal.',
      { delayMs: 40 }
    );
    writer.sleep(400);
    writer.text(
      'Withdrawals fail when the available balance is zero. Wait for the deposit to settle, or allow a bounded overdraft on clients:$id:available in the withdrawal script.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function ReasoningRow({
  text,
  running,
  defaultOpen,
}: {
  text: string;
  running: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  const line = (
    <TraceLine status={running ? 'running' : undefined}>
      <TraceTitle>{running ? 'Thinking' : 'Thought for 5s'}</TraceTitle>
    </TraceLine>
  );

  if (text.length === 0) {
    return line;
  }

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

export default function ReasoningDemo() {
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

        const streaming = busy && message === messages.at(-1);
        const reasoning = message.parts.filter(
          (part) => part.type === 'reasoning'
        );
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {reasoning.length > 0 && (
                <Trace>
                  {reasoning.map((part, index) => (
                    <ReasoningRow
                      key={index}
                      text={part.text}
                      running={streaming && part.state === 'streaming'}
                      defaultOpen={busy ? undefined : true}
                    />
                  ))}
                </Trace>
              )}
              {text && <p>{text}</p>}
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
