'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import type { UIDataTypes, UIMessage } from 'ai';
import { FileCodeIcon, LayersIcon, TerminalIcon } from 'lucide-react';

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
  UIDataTypes,
  {
    runCommand: {
      input: { command: string };
      output: { stdout: string };
    };
  }
>;

type TToolPart = Extract<
  TChatMessage['parts'][number],
  { type: 'tool-runCommand' }
>;

const STACK = `TypeError: Cannot read properties of undefined (reading 'amount')
    at buildDeposit (scripts/seed-ledger.ts:27:34)
    at main (scripts/seed-ledger.ts:51:9)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Object.transformer (node_modules/tsx/dist/register.cjs:3:1104)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)`;

const chat = createChat<TChatMessage>()
  .user('Create the sandbox ledger and seed it with test clients.')
  .assistant(({ writer }) => {
    writer
      .tool('runCommand', {
        input: { command: 'fctl ledger create omnibus' },
      })
      .sleep(900)
      .output({
        stdout: `Ledger "omnibus" created on stack sandbox-k3x9

Schema:
  └─ v4 (accounts: 6, transactions: 3)`,
      });
    writer
      .tool('runCommand', {
        input: { command: 'pnpm tsx scripts/seed-ledger.ts' },
      })
      .sleep(1200)
      .error(STACK);
    writer.text(
      'The ledger exists, but the seed failed in buildDeposit. One fixture has no deposit, so deposit.amount is undefined.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function parseFrame(line: string) {
  const match = line.match(/^at (.+) \((.+):(\d+):(\d+)\)$/);

  return {
    line,
    name: match?.[1],
    file: match?.[2],
    lineNumber: match?.[3],
    internal: line.includes('node_modules') || line.includes('node:'),
  };
}

function StackTrace({ stack }: { stack: string }) {
  const [error, ...lines] = stack.split('\n').map((line) => line.trim());
  const frames = lines.map(parseFrame);
  const appFrames = frames.filter((frame) => !frame.internal);
  const internalFrames = frames.filter((frame) => frame.internal);

  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="error">
          <TraceIcon>
            <TerminalIcon />
          </TraceIcon>
          <TraceTitle>Failed: {error}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="flex flex-col gap-2">
        <p className="font-mono text-xs text-destructive-foreground">{error}</p>
        <Trace>
          {appFrames.map((frame) => (
            <a key={frame.line} href={`#${frame.file}:${frame.lineNumber}`}>
              <TraceLine>
                <TraceIcon>
                  <FileCodeIcon />
                </TraceIcon>
                <TraceTitle>
                  {frame.name} in {frame.file}:{frame.lineNumber}
                </TraceTitle>
              </TraceLine>
            </a>
          ))}
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon>
                  <LayersIcon />
                </TraceIcon>
                <TraceTitle>
                  {internalFrames.length} framework frames
                </TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <ol className="flex flex-col gap-1 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
                {internalFrames.map((frame) => (
                  <li key={frame.line} className="whitespace-nowrap">
                    {frame.line}
                  </li>
                ))}
              </ol>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

function CommandRow({
  part,
  streaming,
}: {
  part: TToolPart;
  streaming: boolean;
}) {
  const command = part.input?.command;

  if (part.state === 'output-error') {
    return <StackTrace stack={part.errorText} />;
  }

  if (part.state === 'output-available') {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran {command}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {part.output.stdout}
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

export default function StackTraceDemo() {
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
                      streaming={streaming}
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
