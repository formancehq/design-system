'use client';

import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
} from 'lucide-react';
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
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

type TChatMessage = UIMessage<
  unknown,
  {
    task: {
      title: string;
      steps: { title: string; status: 'done' | 'running' | 'error' }[];
    };
  }
>;

type TTaskPart = Extract<TChatMessage['parts'][number], { type: 'data-task' }>;

type TStatus = 'running' | 'error' | undefined;

type TTaskScript = {
  id: string;
  title: [string, string];
  steps: [string, string][];
};

const TASKS: TTaskScript[] = [
  {
    id: 'find',
    title: ['Finding the schema files', 'Found the schema files'],
    steps: [
      ['Searching for clients:$id', 'Searched for clients:$id'],
      ['Reading schema/accounts.yaml', 'Read schema/accounts.yaml'],
      [
        'Reading schema/transactions/deposit.num',
        'Read schema/transactions/deposit.num',
      ],
    ],
  },
  {
    id: 'update',
    title: ['Adding the interest accrual', 'Added the interest accrual'],
    steps: [
      ['Editing schema/accounts.yaml', 'Edited schema/accounts.yaml'],
      [
        'Creating schema/transactions/accrue-interest.num',
        'Created schema/transactions/accrue-interest.num',
      ],
    ],
  },
];

function taskAt(task: TTaskScript, done: number) {
  return {
    title: task.title[done < task.steps.length ? 0 : 1],
    steps: task.steps.slice(0, done + 1).map(([running, finished], index) => ({
      title: index < done ? finished : running,
      status: index < done ? 'done' : 'running',
    })),
  } satisfies TTaskPart['data'];
}

const chat = createChat<TChatMessage>()
  .user('Add daily interest accrual on client balances.')
  .assistant(({ writer }) => {
    TASKS.forEach((task) => {
      for (let done = 0; done <= task.steps.length; done++) {
        writer
          .data({ type: 'data-task', id: task.id, data: taskAt(task, done) })
          .sleep(900);
      }
    });
    writer.text(
      'Added a clients:$id:interest account to schema/accounts.yaml and a daily accrue-interest transaction in schema/transactions/accrue-interest.num.'
    );
  });

const transcript = chat.get();
const [question] = chat.get(1);
const transport = chat.transport({ delayMs: 20 });

function getStepStatus(
  status: TTaskPart['data']['steps'][number]['status'],
  streaming: boolean
): TStatus {
  if (status === 'done') {
    return undefined;
  }

  return status === 'running' && streaming ? 'running' : 'error';
}

function StatusIcon({ status }: { status: TStatus }) {
  if (status === 'running') {
    return <LoaderCircleIcon className="animate-spin" />;
  }

  return status === 'error' ? <CircleAlertIcon /> : <CircleCheckIcon />;
}

function TaskRow({
  task,
  streaming,
}: {
  task: TTaskPart['data'];
  streaming: boolean;
}) {
  const [open, setOpen] = React.useState<boolean>();
  const steps = task.steps.map((step) => ({
    title: step.title,
    status: getStepStatus(step.status, streaming),
  }));
  const status = steps.some((step) => step.status === 'error')
    ? 'error'
    : steps.some((step) => step.status === 'running')
      ? 'running'
      : undefined;

  return (
    <TraceCollapsible
      open={open ?? status === 'running'}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>
        <TraceLine status={status}>
          <TraceIcon>
            <StatusIcon status={status} />
          </TraceIcon>
          <TraceTitle>{task.title}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {steps.map((step) => (
            <TraceLine key={step.title} status={step.status}>
              <TraceTitle>{step.title}</TraceTitle>
            </TraceLine>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

export default function TaskDemo() {
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
        const tasks = message.parts.filter((part) => part.type === 'data-task');
        const text = getMessageText(message);

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {tasks.length > 0 && (
                <Trace>
                  {tasks.map((part) => (
                    <TaskRow
                      key={part.id}
                      task={part.data}
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
