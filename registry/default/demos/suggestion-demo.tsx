'use client';

import * as React from 'react';
import { ArrowUpIcon, PlusIcon } from 'lucide-react';

import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/default/ui/input-group';
import { Message, MessageContent } from '@/registry/default/ui/message';

const suggestions = [
  'We hold client funds across two banks',
  'Clients hold both EUR and USD balances',
  'Add daily interest accrual',
  'Explain the withdrawal flow',
  'Check the schema for errors',
  'Deploy to the sandbox ledger',
];

const replies: Record<string, string> = {
  'We hold client funds across two banks':
    'Split bank:omnibus into bank:omnibus:main and bank:omnibus:backup. Deposits now name the bank they land in.',
  'Clients hold both EUR and USD balances':
    'Each client account now holds two assets, EUR/2 and USD/2. The withdrawal template asks for the asset.',
  'Add daily interest accrual':
    'Added clients:$id:interest and a daily accrue_interest transaction that posts from world.',
  'Explain the withdrawal flow':
    'A withdrawal debits clients:$id:available and credits bank:omnibus:payouts, which settles against the bank.',
  'Check the schema for errors':
    'All 14 checks passed. One warning: fees:platform has no outgoing transaction.',
  'Deploy to the sandbox ledger':
    'Inserted schema v3 on the sandbox ledger. The next design run uses it.',
};

export default function SuggestionDemo() {
  const [text, setText] = React.useState('');
  const [turn, setTurn] = React.useState<{
    prompt: string;
    reply: string;
  } | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const canSend = text.trim().length > 0;

  function send(prompt: string) {
    setTurn({
      prompt,
      reply:
        replies[prompt] ?? 'This demo only knows the suggestions. Pick one.',
    });
    setText('');
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    send(text.trim());
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-6 text-sm">
      {turn && (
        <div className="flex flex-col gap-4">
          <Message align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{turn.prompt}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageContent>
              <p>{turn.reply}</p>
            </MessageContent>
          </Message>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex scroll-fade-x scrollbar-none gap-2 overflow-x-auto overscroll-x-contain">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              caseSensitive
              className="shrink-0"
              onClick={() => send(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
        <form ref={formRef} onSubmit={onSubmit}>
          <InputGroup>
            <InputGroupTextarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ask the agent to change your code..."
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              className="p-3"
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Attach files"
              >
                <PlusIcon />
              </InputGroupButton>
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="primary"
                className="ml-auto rounded-full"
                disabled={!canSend}
                aria-label="Send"
              >
                <ArrowUpIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
