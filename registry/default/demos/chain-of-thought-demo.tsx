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
import { Badge } from '@/registry/default/ui/badge';
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
    searchWeb: {
      input: { query: string };
      output: { results: { title: string; url: string }[] };
    };
    readBuildLog: {
      input: { deployment: string };
      output: { log: string };
    };
    searchCode: {
      input: { query: string };
      output: { files: string[] };
    };
  }
>;

type TStepPart = Extract<
  TChatMessage['parts'][number],
  { type: 'tool-searchWeb' | 'tool-readBuildLog' | 'tool-searchCode' }
>;

const chat = createChat<TChatMessage>()
  .user('Why does the deposit fail on the sandbox ledger?')
  .assistant(({ writer }) => {
    writer
      .tool('readBuildLog', { input: { deployment: 'run_8Kx2' } })
      .sleep(900)
      .output({
        log: 'validate   ok\ncompile    ok\ndeploy     INSUFFICIENT_FUND',
      });
    writer
      .tool('searchWeb', { input: { query: 'numscript insufficient funds' } })
      .sleep(900)
      .output({
        results: [
          {
            title: 'Numscript | docs.formance.com',
            url: 'https://docs.formance.com/modules/numscript/introduction',
          },
          {
            title: 'Allowing overdrafts | docs.formance.com',
            url: 'https://docs.formance.com/modules/numscript/reference/overdraft',
          },
        ],
      });
    writer
      .tool('searchCode', { input: { query: '@bank:omnibus' } })
      .sleep(900)
      .output({
        files: ['schema/transactions/deposit.num', 'schema/accounts.yaml'],
      });
    writer.text(
      'The deposit sends from @bank:omnibus, which is empty on a new ledger. Send from @world instead.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function StatusIcon({ status }: { status?: 'running' | 'error' }) {
  if (status === 'running') {
    return <LoaderCircleIcon className="animate-spin" />;
  }

  return status === 'error' ? <CircleAlertIcon /> : <CircleCheckIcon />;
}

function Step({
  title,
  status,
  defaultOpen,
  children,
}: {
  title: string;
  status?: 'running' | 'error';
  defaultOpen?: boolean;
  children?: React.ReactNode;
}) {
  const line = (
    <TraceLine status={status}>
      <TraceIcon>
        <StatusIcon status={status} />
      </TraceIcon>
      <TraceTitle>{title}</TraceTitle>
    </TraceLine>
  );

  if (!children) {
    return line;
  }

  return (
    <TraceCollapsible defaultOpen={defaultOpen}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{children}</TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

function StepRow({ part, streaming }: { part: TStepPart; streaming: boolean }) {
  const status =
    part.state === 'output-available'
      ? undefined
      : part.state === 'output-error' || !streaming
        ? 'error'
        : 'running';
  const verb = (running: string, done: string, failed: string) =>
    status === 'running' ? running : status === 'error' ? failed : done;
  const error = part.state === 'output-error' && (
    <CodeBlock size="sm" variant="destructive">
      <CodeBlockContent wrap className="max-h-64">
        {part.errorText}
      </CodeBlockContent>
    </CodeBlock>
  );

  if (part.type === 'tool-searchWeb') {
    return (
      <Step
        status={status}
        title={`${verb('Searching', 'Searched', 'Failed to search')} the web for ${part.input?.query}`}
      >
        {error ||
          (part.state === 'output-available' && (
            <Trace>
              {part.output.results.map((result) => (
                <a
                  key={result.url}
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TraceLine>
                    <TraceIcon>
                      <GlobeIcon />
                    </TraceIcon>
                    <TraceTitle>
                      {result.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </TraceTitle>
                    <TraceIcon>
                      <ArrowUpRightIcon />
                    </TraceIcon>
                  </TraceLine>
                </a>
              ))}
            </Trace>
          ))}
      </Step>
    );
  }

  if (part.type === 'tool-readBuildLog') {
    return (
      <Step
        status={status}
        defaultOpen
        title={`${verb('Reading', 'Read', 'Failed to read')} the deploy log for ${part.input?.deployment}`}
      >
        {error ||
          (part.state === 'output-available' && (
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {part.output.log}
              </CodeBlockContent>
            </CodeBlock>
          ))}
      </Step>
    );
  }

  return (
    <Step
      status={status}
      title={`${verb('Searching', 'Searched', 'Failed to search')} the code for ${part.input?.query}`}
    >
      {error ||
        (part.state === 'output-available' && (
          <div className="flex flex-wrap gap-1.5">
            {part.output.files.map((file) => (
              <Badge key={file} variant="secondary" className="font-mono">
                {file}
              </Badge>
            ))}
          </div>
        ))}
    </Step>
  );
}

function ChainOfThought({
  steps,
  streaming,
  answering,
}: {
  steps: TStepPart[];
  streaming: boolean;
  answering: boolean;
}) {
  const [open, setOpen] = React.useState<boolean>();
  const running = streaming && !answering;
  const failed = steps.filter((part) => part.state === 'output-error').length;
  const status = running ? 'running' : failed > 0 ? 'error' : undefined;

  return (
    <Trace>
      <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine status={status}>
            <TraceIcon>
              <StatusIcon status={status} />
            </TraceIcon>
            <TraceTitle>
              {running
                ? 'Researching'
                : `Researched in ${steps.length} steps${failed > 0 ? `, ${failed} failed` : ''}`}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {steps.map((part) => (
              <StepRow
                key={part.toolCallId}
                part={part}
                streaming={streaming}
              />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}

export default function ChainOfThoughtDemo() {
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
        const steps = message.parts.filter(
          (part) =>
            part.type === 'tool-searchWeb' ||
            part.type === 'tool-readBuildLog' ||
            part.type === 'tool-searchCode'
        );
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {steps.length > 0 && (
                <ChainOfThought
                  steps={steps}
                  streaming={streaming}
                  answering={text.length > 0}
                />
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
