'use client';

import { useChat } from '@ai-sdk/react';
import type { UIDataTypes, UIMessage } from 'ai';
import { ChevronRightIcon, FileTextIcon } from 'lucide-react';
import { createChat } from '@shadcn/helpers/ai-sdk';

import { getMessageText } from '@/lib/ai';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui/sheet';
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

type TChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    readFile: {
      input: { path: string };
      output: { path: string; content: string };
    };
  }
>;

const PACKAGE_JSON = `stack: eu-west-1-sandbox
ledger: sandbox
schema:
  path: ./schema
  version: 3`;

const chat = createChat<TChatMessage>()
  .user('Which ledger does the schema deploy to?')
  .assistant(({ writer }) => {
    writer
      .tool('readFile', { input: { path: 'formance.yaml' } })
      .sleep(900)
      .output({ path: 'formance.yaml', content: PACKAGE_JSON });
    writer.text(
      'It deploys version 3 of the schema to the sandbox ledger on the eu-west-1 sandbox stack.'
    );
  });

const initialMessages = chat.get(0);
const transport = chat.transport({ delayMs: 20 });

export default function ToolSheet() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  });
  const nextMessage = chat.next(messages);
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

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return <p key={index}>{part.text}</p>;
                }

                if (part.type !== 'tool-readFile') {
                  return null;
                }

                if (part.state !== 'output-available') {
                  const running =
                    streaming &&
                    (part.state === 'input-streaming' ||
                      part.state === 'input-available');

                  return (
                    <Trace key={part.toolCallId}>
                      <TraceLine status={running ? 'running' : 'error'}>
                        <TraceIcon>
                          <FileTextIcon />
                        </TraceIcon>
                        <TraceTitle>
                          {running ? 'Reading' : 'Failed to read'}{' '}
                          {part.input?.path}
                        </TraceTitle>
                      </TraceLine>
                    </Trace>
                  );
                }

                return (
                  <Trace key={part.toolCallId}>
                    <Sheet>
                      <SheetTrigger>
                        <TraceLine>
                          <TraceIcon>
                            <FileTextIcon />
                          </TraceIcon>
                          <TraceTitle>Read {part.output.path}</TraceTitle>
                          <TraceIcon>
                            <ChevronRightIcon />
                          </TraceIcon>
                        </TraceLine>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle className="font-mono">
                            {part.output.path}
                          </SheetTitle>
                          <SheetDescription>
                            {part.output.content.split('\n').length} lines
                          </SheetDescription>
                        </SheetHeader>
                        <CodeBlock className="mx-6 mb-6 w-auto">
                          <CodeBlockContent lineNumbers>
                            {part.output.content}
                          </CodeBlockContent>
                        </CodeBlock>
                      </SheetContent>
                    </Sheet>
                  </Trace>
                );
              })}
            </MessageContent>
          </Message>
        );
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() =>
            nextMessage
              ? sendMessage(nextMessage)
              : setMessages(initialMessages)
          }
        >
          {nextMessage ? 'Send message' : 'Reset'}
        </Button>
      )}
    </div>
  );
}
