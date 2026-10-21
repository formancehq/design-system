'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import type { UIMessage } from 'ai';
import { TerminalIcon } from 'lucide-react';
import * as React from 'react';

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

type TChatMessage = UIMessage<
  unknown,
  {
    terminal: { output: string };
  },
  {
    runCommand: {
      input: { command: string };
      output: { exitCode: number };
    };
  }
>;

type TToolPart = Extract<
  TChatMessage['parts'][number],
  { type: 'tool-runCommand' }
>;

const COMMANDS = [
  {
    id: 'validate',
    command: 'fctl ledger schema validate schema.yaml',
    output: ['Validating schema.yaml', '✓ 14 checks passed'],
  },
  {
    id: 'simulate',
    command: 'fctl ledger schema simulate schema.yaml',
    output: [
      'Simulating 3 transactions on a scratch ledger',
      '',
      ' ✓ deposit           2 postings   12ms',
      ' ✓ payout            2 postings   9ms',
      ' ✓ accrue_interest   2 postings   11ms',
      '',
      ' Transactions  3 passed (3)',
      '     Balances  all accounts balance to 0',
    ],
  },
  {
    id: 'deploy',
    command: 'fctl ledger schema deploy schema.yaml --ledger omnibus',
    output: [
      'Deploying to stack sandbox-k3x9',
      '',
      '   Ledger      omnibus',
      '   Accounts    6 patterns',
      '   Transactions 3 templates',
      ' ✓ Schema v4 is live in 2.1s',
    ],
  },
];

const chat = createChat<TChatMessage>()
  .user('Validate the schema, then deploy it to the sandbox.')
  .assistant(({ writer }) => {
    for (const { id, command, output } of COMMANDS) {
      const tool = writer.tool('runCommand', {
        toolCallId: id,
        input: { command },
      });

      // The tool streams its output as a data part with the tool call's id.
      output.forEach((_, index) => {
        writer
          .data({
            type: 'data-terminal',
            id,
            data: { output: output.slice(0, index + 1).join('\n') },
          })
          .sleep(200);
      });

      tool.output({ exitCode: 0 });
    }

    writer.text(
      'The schema is valid, the simulation balances, and v4 is live on the omnibus ledger.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function getTitle(part: TToolPart, running: boolean) {
  const command = part.input?.command;

  if (part.state === 'output-available') {
    return part.output.exitCode === 0
      ? `Ran ${command}`
      : `${command} exited with code ${part.output.exitCode}`;
  }

  return running ? `Running ${command}` : `Failed to run ${command}`;
}

function getOutput(message: TChatMessage, toolCallId: string) {
  for (const part of message.parts) {
    if (part.type === 'data-terminal' && part.id === toolCallId) {
      return part.data.output;
    }
  }

  return '';
}

function CommandRow({
  part,
  output,
  streaming,
  defaultOpen,
}: {
  part: TToolPart;
  output: string;
  streaming: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const running =
    streaming &&
    (part.state === 'input-streaming' || part.state === 'input-available');
  const failed =
    !running &&
    (part.state !== 'output-available' || part.output.exitCode !== 0);

  return (
    <TraceCollapsible
      open={open ?? (running && output.length > 0)}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? 'running' : failed ? 'error' : undefined}>
          <TraceIcon>
            <TerminalIcon />
          </TraceIcon>
          <TraceTitle>{getTitle(part, running)}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm">
          <CodeBlockContent wrap className="max-h-64">
            {part.state === 'output-error' ? part.errorText : output}
          </CodeBlockContent>
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

export default function TerminalDemo() {
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
                    <CommandRow
                      key={part.toolCallId}
                      part={part}
                      output={getOutput(message, part.toolCallId)}
                      streaming={streaming}
                      defaultOpen={busy ? undefined : part === tools.at(-1)}
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
            void sendMessage(question);
          }}
        >
          Replay
        </Button>
      )}
    </div>
  );
}
