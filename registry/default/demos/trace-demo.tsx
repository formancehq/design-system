'use client';

import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIDataTypes, UIMessage } from 'ai';
import {
  ArrowUpRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  GlobeIcon,
  LoaderCircleIcon,
} from 'lucide-react';
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

type Part = ChatMessage['parts'][number];

const chat = createChat<ChatMessage>()
  .user('Why does the deposit fail on the sandbox ledger?')
  .assistant(({ writer }) => {
    writer.reasoning(
      'The ledger rejects a transaction when a source account cannot cover the amount. I should check the balance of the source account, then run the Numscript in dry-run mode.',
      { delayMs: 40 }
    );
    writer
      .tool('runCommand', { input: { command: 'fctl version' } })
      .sleep(700)
      .output({ stdout: 'fctl 3.4.0' });
    writer
      .tool('runCommand', {
        input: {
          command: 'fctl ledger accounts show bank:omnibus --ledger sandbox',
        },
      })
      .sleep(900)
      .output({
        stdout: 'Address  bank:omnibus\nEUR/2    0',
      });
    writer
      .tool('runCommand', {
        input: {
          command:
            'fctl ledger transactions num deposit.num --ledger sandbox --dry-run',
        },
      })
      .sleep(1200)
      .error(
        'INSUFFICIENT_FUND  account @bank:omnibus has insufficient funds for EUR/2 10000'
      );
    writer.sourceUrl({
      url: 'https://docs.formance.com/modules/numscript/introduction',
      title: 'Numscript | docs.formance.com',
    });
    writer.sourceUrl({
      url: 'https://docs.formance.com/modules/ledger/accounts',
      title: 'Accounts | docs.formance.com',
    });
    writer.sleep(1000);
    writer.text(
      'The deposit sends from @bank:omnibus, which is empty on a new ledger. Money enters the ledger from @world, so change the source to @world and deploy the schema again.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function ThinkingRow({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>();

  const line = (
    <TraceLine status={running ? 'running' : undefined}>
      <TraceIcon>
        {running ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleCheckIcon />
        )}
      </TraceIcon>
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

function ToolRow({
  part,
  streaming,
  defaultOpen,
}: {
  part: Extract<Part, { type: 'tool-runCommand' }>;
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
              {failed ? <CircleAlertIcon /> : <CircleCheckIcon />}
            </TraceIcon>
            <TraceTitle>
              {failed ? 'Failed to run' : 'Ran'} {command}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          {failed ? (
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent wrap className="max-h-64">
                {part.errorText}
              </CodeBlockContent>
            </CodeBlock>
          ) : (
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {part.output.stdout}
              </CodeBlockContent>
            </CodeBlock>
          )}
        </TraceCollapsibleContent>
      </TraceCollapsible>
    );
  }

  return (
    <TraceLine status={streaming ? 'running' : 'error'}>
      <TraceIcon>
        {streaming ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleAlertIcon />
        )}
      </TraceIcon>
      <TraceTitle>
        {streaming ? 'Running' : 'Failed to run'} {command}
      </TraceTitle>
    </TraceLine>
  );
}

function SourcesRow({
  sources,
  running,
}: {
  sources: Extract<Part, { type: 'source-url' }>[];
  running: boolean;
}) {
  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? 'running' : undefined}>
          <TraceIcon>
            {running ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <GlobeIcon />
            )}
          </TraceIcon>
          <TraceTitle>
            {running ? 'Using' : 'Used'} {sources.length} sources
          </TraceTitle>
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
                <TraceIcon>
                  <GlobeIcon />
                </TraceIcon>
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
  );
}

export default function TraceDemo() {
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
        const rows = message.parts.filter(
          (part) => part.type === 'reasoning' || part.type === 'tool-runCommand'
        );
        const sources = message.parts.filter(
          (part) => part.type === 'source-url'
        );
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {rows.length + sources.length > 0 && (
                <Trace>
                  {rows.map((part, index) =>
                    part.type === 'reasoning' ? (
                      <ThinkingRow
                        key={index}
                        text={part.text}
                        running={streaming && part.state === 'streaming'}
                      />
                    ) : part.type === 'tool-runCommand' ? (
                      <ToolRow
                        key={part.toolCallId}
                        part={part}
                        streaming={streaming}
                        defaultOpen={index === 2}
                      />
                    ) : null
                  )}
                  {sources.length > 0 && (
                    <SourcesRow
                      sources={sources}
                      running={streaming && text.length === 0}
                    />
                  )}
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
