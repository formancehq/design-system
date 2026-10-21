'use client';

import { useChat } from '@ai-sdk/react';
import type { UIDataTypes, UIMessage } from 'ai';
import { TerminalIcon } from 'lucide-react';
import { createChat } from '@shadcn/helpers/ai-sdk';

import { getMessageText } from '@/lib/ai';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';
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

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runCommand: {
      input: { command: string };
      output: { stdout: string };
    };
  }
>;

type ToolPart = Extract<
  ChatMessage['parts'][number],
  { type: 'tool-runCommand' }
>;

const chat = createChat<ChatMessage>()
  .user('Which Formance modules are enabled on the sandbox stack?')
  .assistant(({ writer }) => {
    writer
      .tool('runCommand', { input: { command: 'fctl ledger list' } })
      .sleep(900)
      .output({ stdout: 'sandbox\nproduction' });
    writer
      .tool('runCommand', { input: { command: 'fctl wallets list' } })
      .sleep(900)
      .output({ stdout: '3 wallets' });
    writer
      .tool('runCommand', {
        input: { command: 'fctl payments connectors list' },
      })
      .sleep(900)
      .error('payments is not enabled on this stack');
    writer.text('Ledger and Wallets are enabled. Payments is not.');
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function ToolRow({
  part,
  streaming,
  defaultOpen,
}: {
  part: ToolPart;
  streaming: boolean;
  defaultOpen?: boolean;
}) {
  const command = part.input?.command;

  if (part.state === 'output-available' || part.state === 'output-error') {
    const failed = part.state === 'output-error';

    return (
      <TraceCollapsible defaultOpen={defaultOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine status={failed ? 'error' : undefined}>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>
              {failed ? 'Failed to run' : 'Ran'} {command}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {failed ? part.errorText : part.output.stdout}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    );
  }

  return (
    <TraceLine status={streaming ? 'running' : 'error'}>
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {streaming ? 'Running' : 'Failed to run'} {command}
      </TraceTitle>
    </TraceLine>
  );
}

export default function ToolDemo() {
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
        const tools = message.parts.filter(
          (part) => part.type === 'tool-runCommand'
        );
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {tools.length > 0 && (
                <Trace>
                  {tools.map((part) => (
                    <ToolRow
                      key={part.toolCallId}
                      part={part}
                      streaming={streaming}
                      defaultOpen={
                        busy ? undefined : part.state === 'output-error'
                      }
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
