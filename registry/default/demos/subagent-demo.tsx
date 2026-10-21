'use client';

import { useChat } from '@ai-sdk/react';
import type { UIDataTypes, UIMessage } from 'ai';
import {
  CircleAlertIcon,
  CircleCheckIcon,
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

type TSubagentMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runCommand: {
      input: { command: string };
      output: { stdout: string };
    };
  }
>;

type TSubagentPart = TSubagentMessage['parts'][number];

type TChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    researchAgent: {
      input: { task: string };
      output: TSubagentMessage;
    };
  }
>;

type TPart = TChatMessage['parts'][number];

const steps = [
  {
    command: 'grep -n source schema/transactions/deposit.num',
    stdout: '3:  source = @bank:omnibus',
  },
  {
    command: 'fctl ledger accounts show bank:omnibus --ledger sandbox',
    stdout: 'Address  bank:omnibus\nEUR/2    0',
  },
  {
    command: 'fctl ledger transactions list --ledger sandbox',
    stdout: 'No transactions',
  },
];

function getSubagentMessage(done: number, report?: string): TSubagentMessage {
  const parts = steps.slice(0, done).map((step, index): TSubagentPart => ({
    type: 'tool-runCommand',
    toolCallId: `step-${index}`,
    state: 'output-available',
    input: { command: step.command },
    output: { stdout: step.stdout },
  }));

  const next = steps[done];

  if (next) {
    parts.push({
      type: 'tool-runCommand',
      toolCallId: `step-${done}`,
      state: 'input-available',
      input: { command: next.command },
    });
  }

  if (report) {
    parts.push({ type: 'text', text: report });
  }

  return { id: 'research-agent', role: 'assistant', parts };
}

const chat = createChat<TChatMessage>()
  .user('Why does the deposit fail on the sandbox ledger?')
  .assistant(({ writer }) => {
    const subagent = writer
      .tool('researchAgent', {
        input: {
          task: 'Find out why the deposit fails on the sandbox ledger.',
        },
      })
      .sleep(600);
    steps.forEach((_, index) => {
      subagent
        .output(getSubagentMessage(index), { preliminary: true })
        .sleep(1000);
    });
    subagent
      .output(
        getSubagentMessage(
          steps.length,
          'The deposit sends from @bank:omnibus, which has a zero balance on a new ledger.'
        )
      )
      .sleep(400);
    writer.text(
      'The deposit fails because it sends from @bank:omnibus, which is empty on a new ledger. Send from @world, which can go negative, and the deposits will post.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function StepRow({
  part,
  running,
}: {
  part: Extract<TSubagentPart, { type: 'tool-runCommand' }>;
  running: boolean;
}) {
  const command = part.input?.command;

  if (part.state === 'output-available') {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
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
    <TraceLine status={running ? 'running' : 'error'}>
      <TraceIcon>
        {running ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleAlertIcon />
        )}
      </TraceIcon>
      <TraceTitle>
        {running ? 'Running' : 'Failed to run'} {command}
      </TraceTitle>
    </TraceLine>
  );
}

function SubagentRow({
  part,
  streaming,
}: {
  part: Extract<TPart, { type: 'tool-researchAgent' }>;
  streaming: boolean;
}) {
  const done = part.state === 'output-available' && !part.preliminary;
  const running = !done && part.state !== 'output-error' && streaming;
  const parts = part.state === 'output-available' ? part.output.parts : [];
  const report = parts
    .map((agentPart) => (agentPart.type === 'text' ? agentPart.text : ''))
    .join('');

  const line = (
    <TraceLine status={done ? undefined : running ? 'running' : 'error'}>
      <TraceIcon>
        {done ? (
          <CircleCheckIcon />
        ) : running ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleAlertIcon />
        )}
      </TraceIcon>
      <TraceTitle>
        {done ? 'Ran' : running ? 'Running' : 'Failed to run'} the research
        subagent
      </TraceTitle>
    </TraceLine>
  );

  if (parts.length === 0) {
    return line;
  }

  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="flex flex-col gap-3">
        <Trace>
          {parts.map((agentPart) =>
            agentPart.type === 'tool-runCommand' ? (
              <StepRow
                key={agentPart.toolCallId}
                part={agentPart}
                running={running}
              />
            ) : null
          )}
        </Trace>
        {report && <p>{report}</p>}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

export default function SubagentDemo() {
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
        const agents = message.parts.filter(
          (part) => part.type === 'tool-researchAgent'
        );
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {agents.length > 0 && (
                <Trace>
                  {agents.map((part) => (
                    <SubagentRow
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
            sendMessage(question);
          }}
        >
          Replay
        </Button>
      )}
    </div>
  );
}
