'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import type { UIDataTypes, UIMessage } from 'ai';
import {
  CheckIcon,
  CircleDashedIcon,
  FileCodeIcon,
  FlaskConicalIcon,
  XIcon,
} from 'lucide-react';

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

type TTest = {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
};

type TChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runTests: {
      input: { command: string };
      output: { suites: { name: string; tests: TTest[] }[] };
    };
  }
>;

type TToolPart = Extract<
  TChatMessage['parts'][number],
  { type: 'tool-runTests' }
>;

const chat = createChat<TChatMessage>()
  .user('Run the ledger tests for the payout transaction.')
  .assistant(({ writer }) => {
    writer
      .tool('runTests', {
        input: { command: 'go test ./internal/controller/ledger/...' },
      })
      .sleep(1500)
      .output({
        suites: [
          {
            name: 'posting_test.go',
            tests: [
              { name: 'TestPosting/deposit', status: 'passed' },
              { name: 'TestPosting/payout', status: 'passed' },
              { name: 'TestPosting/fee_split', status: 'passed' },
            ],
          },
          {
            name: 'overdraft_test.go',
            tests: [
              { name: 'TestOverdraft/unbounded_world', status: 'passed' },
              {
                name: 'TestOverdraft/bounded_client',
                status: 'failed',
                error: `overdraft_test.go:58: expected INSUFFICIENT_FUND, got nil
    the payout drew clients:8812:available below the 5000 USD/2 limit`,
              },
            ],
          },
        ],
      });
    writer.text(
      'One test failed. The payout script does not check the overdraft limit, so a client can go below 5000 USD/2.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function countTests(tests: TTest[]) {
  return {
    total: tests.length,
    failed: tests.filter((test) => test.status === 'failed').length,
    skipped: tests.filter((test) => test.status === 'skipped').length,
  };
}

function formatCounts({
  total,
  failed,
  skipped,
}: ReturnType<typeof countTests>) {
  return [
    `${total} tests`,
    failed > 0 && `${failed} failed`,
    skipped > 0 && `${skipped} skipped`,
  ]
    .filter(Boolean)
    .join(', ');
}

function TestRow({ test }: { test: TTest }) {
  if (test.status === 'failed') {
    return (
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <XIcon />
            </TraceIcon>
            <TraceTitle>{test.name}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {test.error}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    );
  }

  return (
    <TraceLine>
      <TraceIcon>
        {test.status === 'skipped' ? <CircleDashedIcon /> : <CheckIcon />}
      </TraceIcon>
      <TraceTitle>
        {test.status === 'skipped' ? `Skipped ${test.name}` : test.name}
      </TraceTitle>
    </TraceLine>
  );
}

function TestResultsRow({
  part,
  streaming,
}: {
  part: TToolPart;
  streaming: boolean;
}) {
  const command = part.input?.command;

  if (part.state !== 'output-available') {
    const running = streaming && part.state !== 'output-error';

    return (
      <TraceLine status={running ? 'running' : 'error'}>
        <TraceIcon>
          <FlaskConicalIcon />
        </TraceIcon>
        <TraceTitle>
          {running ? 'Running' : 'Failed to run'} {command}
        </TraceTitle>
      </TraceLine>
    );
  }

  const { suites } = part.output;
  const summary = countTests(suites.flatMap((suite) => suite.tests));

  return (
    <TraceCollapsible defaultOpen={summary.failed > 0}>
      <TraceCollapsibleTrigger>
        <TraceLine status={summary.failed > 0 ? 'error' : undefined}>
          <TraceIcon>
            <FlaskConicalIcon />
          </TraceIcon>
          <TraceTitle>Ran {formatCounts(summary)}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {suites.map((suite) => {
            const counts = countTests(suite.tests);

            return (
              <TraceCollapsible
                key={suite.name}
                defaultOpen={counts.failed > 0}
              >
                <TraceCollapsibleTrigger>
                  <TraceLine status={counts.failed > 0 ? 'error' : undefined}>
                    <TraceIcon>
                      <FileCodeIcon />
                    </TraceIcon>
                    <TraceTitle>
                      {suite.name}, {formatCounts(counts)}
                    </TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {suite.tests.map((test) => (
                      <TestRow key={test.name} test={test} />
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            );
          })}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

export default function TestResultsDemo() {
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
          (part) => part.type === 'tool-runTests'
        );
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {tools.length > 0 && (
                <Trace>
                  {tools.map((part) => (
                    <TestResultsRow
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
