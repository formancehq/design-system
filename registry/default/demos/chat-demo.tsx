'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import type { UIDataTypes, UIMessage } from 'ai';
import {
  ArrowUpIcon,
  CircleCheckIcon,
  FileCodeIcon,
  LoaderCircleIcon,
  MessageCircleDashedIcon,
  PaperclipIcon,
  PlusIcon,
  RotateCwIcon,
  TerminalIcon,
} from 'lucide-react';
import * as React from 'react';

import { getMessageText } from '@/lib/ai';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/default/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/default/ui/input-group';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/registry/default/ui/message-scroller';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

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

type TChatPart = TChatMessage['parts'][number];

type TToolPart = Extract<TChatPart, { type: 'tool-runCommand' }>;

const chat = createChat<TChatMessage>()
  .user('Add daily interest accrual on client balances.')
  .sleep(600)
  .assistant(({ writer }) => {
    writer.reasoning(
      'I need to know which accounts hold client balances before I add an accrual. If they follow the clients:$id:available pattern, one transaction can cover every client.'
    );
    writer.sleep(400);
    writer
      .tool('runCommand', {
        input: { command: 'fctl ledger accounts list' },
      })
      .sleep(800)
      .output({
        stdout:
          'bank:omnibus\nclients:001:available\nclients:002:available\ntreasury:interest',
      });
    writer.sleep(500);
    writer.text(`Client balances follow the \`clients:$id:available\` pattern, so one accrual transaction covers every client.

**Changes**

- Added a \`clients:$id:interest\` account.
- Added an \`accrue_interest\` transaction that posts from \`world\` once a day.

\`\`\`numscript
send [EUR/2 $interest] (
  source = @world
  destination = @clients:$id:interest
)
\`\`\`
`);
  })
  .user('Fund it from a treasury account, not from world.')
  .sleep(600)
  .assistant(({ writer }) => {
    writer.reasoning(
      'The source of the accrual lives in the transaction. I should check if a treasury account already exists.'
    );
    writer.sleep(400);
    writer
      .tool('runCommand', {
        input: { command: 'fctl ledger accounts show treasury:interest' },
      })
      .sleep(800)
      .output({ stdout: 'Address: treasury:interest\nBalance: EUR/2 1250000' });
    writer.sleep(500);
    writer.text(`\`treasury:interest\` already exists. I changed the source of \`accrue_interest\`:

\`\`\`numscript
source = @treasury:interest
\`\`\`

The accrual now fails when the treasury account has no funds, instead of creating money from \`world\`.
`);
  })
  .user('Insert the schema in the sandbox ledger.')
  .sleep(600)
  .assistant(({ writer }) => {
    writer
      .tool('runCommand', {
        input: { command: 'fctl ledger schemas insert v2 schema.yaml' },
      })
      .sleep(1600)
      .output({
        stdout: '✓ Schema v2 inserted\n✓ 14 accounts\n✓ 6 transactions',
      });
    writer.sleep(500);
    writer.text(`Schema **v2** is in the sandbox ledger.

- **14** accounts and **6** transactions.
- New transactions now use the interest accrual.
`);
  });

const initialMessages = chat.get(0);
const transport = chat.transport({
  delayMs: 16,
  fallback:
    'This demo only knows the scripted turns. Press reset to start over.',
});

export default function ChatDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  });
  const [draft, setDraft] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const nextMessage = chat.next(messages);
  const busy = status === 'submitted' || status === 'streaming';
  const text = draft ?? (nextMessage ? getMessageText(nextMessage) : '');
  const canSend = text.trim().length > 0 && !busy;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    if (draft === null && nextMessage) {
      void sendMessage(nextMessage);
    } else {
      void sendMessage({ text: text.trim() });
    }
    setDraft(null);
  }

  return (
    <MessageScrollerProvider>
      <div className="relative flex w-full flex-col gap-4">
        <div className="flex h-200 w-full flex-col gap-4">
          <div className="flex items-start justify-between gap-4 p-8 pb-4">
            <div className="flex flex-col gap-1">
              <div className="font-medium">Schema assistant</div>
              <div className="text-sm text-muted-foreground">
                Ask the agent to change your ledger schema.
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-md"
                  aria-label="Reset conversation"
                  onClick={() => {
                    setMessages(initialMessages);
                    setDraft(null);
                  }}
                  disabled={busy}
                >
                  <RotateCwIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="min-h-0 flex-1">
            {messages.length === 0 ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircleDashedIcon />
                  </EmptyMedia>
                  <EmptyTitle>What should we design?</EmptyTitle>
                  <EmptyDescription>
                    The agent can read your schema, run fctl commands and make
                    changes. Press send to start.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={busy}
                    className="gap-6 px-8 py-0"
                  >
                    {messages.map((message) => {
                      if (message.role === 'user') {
                        return (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            scrollAnchor
                          >
                            <Message align="end">
                              <MessageContent>
                                <Bubble align="end" variant="muted">
                                  <BubbleContent>
                                    {getMessageText(message)}
                                  </BubbleContent>
                                </Bubble>
                              </MessageContent>
                            </Message>
                          </MessageScrollerItem>
                        );
                      }

                      const streaming = busy && message === messages.at(-1);
                      const steps = message.parts.filter(
                        (part) =>
                          part.type === 'reasoning' ||
                          part.type === 'tool-runCommand'
                      );
                      const reply = getMessageText(message);

                      return (
                        <MessageScrollerItem
                          key={message.id}
                          messageId={message.id}
                        >
                          <Message>
                            <MessageContent className="gap-3">
                              {steps.length > 0 && (
                                <Trace>
                                  {steps.map((part, index) => (
                                    <StepRow
                                      key={index}
                                      part={part}
                                      streaming={streaming}
                                    />
                                  ))}
                                </Trace>
                              )}
                              {reply && <Markdown>{reply}</Markdown>}
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      );
                    })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </div>
          <div className="p-8 pt-0">
            <form ref={formRef} onSubmit={onSubmit} className="w-full">
              <InputGroup>
                <InputGroupTextarea
                  value={text}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask about accounts, transactions, or queries…"
                  aria-label="Message"
                  className="min-h-14"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      formRef.current?.requestSubmit();
                    }
                  }}
                />
                <InputGroupAddon align="block-end" className="pt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton
                        aria-label="Add context"
                        type="button"
                        size="icon-sm"
                        variant="outline"
                      >
                        <PlusIcon />
                      </InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="top"
                      className="w-48"
                    >
                      <DropdownMenuItem>
                        <PaperclipIcon />
                        Add files
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <FileCodeIcon />
                        Add a Numscript file
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupButton
                    type="submit"
                    variant="primary"
                    size="icon-sm"
                    disabled={!canSend}
                    className="ml-auto"
                  >
                    <ArrowUpIcon />
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </div>
      </div>
    </MessageScrollerProvider>
  );
}

function StepRow({ part, streaming }: { part: TChatPart; streaming: boolean }) {
  if (part.type === 'reasoning') {
    return (
      <ReasoningRow text={part.text} running={part.state === 'streaming'} />
    );
  }

  if (part.type === 'tool-runCommand') {
    return <ToolRow part={part} streaming={streaming} />;
  }

  return null;
}

function ReasoningRow({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>();

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>
        <TraceLine status={running ? 'running' : undefined}>
          <TraceIcon>
            {running ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <CircleCheckIcon />
            )}
          </TraceIcon>
          <TraceTitle>{running ? 'Thinking' : 'Thought'}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

function ToolRow({ part, streaming }: { part: TToolPart; streaming: boolean }) {
  const command = part.input?.command;

  if (part.state === 'output-available' || part.state === 'output-error') {
    const failed = part.state === 'output-error';

    return (
      <TraceCollapsible>
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
