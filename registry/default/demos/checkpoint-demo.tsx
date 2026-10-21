'use client';

import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { createChat } from '@shadcn/helpers/ai-sdk';

import { getMessageText } from '@/lib/ai';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import { Marker, MarkerContent } from '@/registry/default/ui/marker';
import { Message, MessageContent } from '@/registry/default/ui/message';

type ChatMessage = UIMessage<
  unknown,
  {
    checkpoint: {
      label: string;
    };
  }
>;

type CheckpointPart = Extract<
  ChatMessage['parts'][number],
  { type: 'data-checkpoint' }
>;

const chat = createChat<ChatMessage>()
  .user('Rename the fees account to platform fees.')
  .assistant(({ writer }) => {
    writer.text('Renamed fees:collected to fees:platform in the schema.');
    writer.data({
      type: 'data-checkpoint',
      id: 'rename',
      data: { label: 'Fees account renamed' },
    });
  })
  .user('Update the Numscript templates to match.')
  .assistant(({ writer }) => {
    writer.text('Updated the three templates that post to fees:platform.');
  });

const transcript = chat.get();
const transport = chat.transport({ delayMs: 20 });

export default function CheckpointDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  });
  const nextMessage = chat.next(messages);
  const busy = status === 'submitted' || status === 'streaming';

  function restore(messageId: string) {
    const index = messages.findIndex((message) => message.id === messageId);

    if (index === -1) {
      return;
    }

    setMessages(messages.slice(0, index + 1));
  }

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        const checkpoint = message.parts.find(
          (part): part is CheckpointPart => part.type === 'data-checkpoint'
        );
        const index = messages.findIndex((item) => item.id === message.id);
        const canRestore = index < messages.length - 1;

        return (
          <React.Fragment key={message.id}>
            {message.role === 'user' ? (
              <Message align="end">
                <MessageContent>
                  <Bubble align="end" variant="muted">
                    <BubbleContent>{getMessageText(message)}</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            ) : (
              <Message>
                <MessageContent>
                  <p>{getMessageText(message)}</p>
                </MessageContent>
              </Message>
            )}
            {checkpoint && (
              <Marker variant="separator">
                <MarkerContent className="inline-flex items-center gap-2">
                  {checkpoint.data.label}
                  {canRestore && (
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`Restore to ${checkpoint.data.label}`}
                      onClick={() => restore(message.id)}
                    >
                      Restore
                    </Button>
                  )}
                </MarkerContent>
              </Marker>
            )}
          </React.Fragment>
        );
      })}
      {!busy && nextMessage && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() => sendMessage(nextMessage)}
        >
          Continue
        </Button>
      )}
    </div>
  );
}
