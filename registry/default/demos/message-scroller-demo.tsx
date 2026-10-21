'use client';

import { SendHorizonalIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/default/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/default/ui/input-group';
import { Marker, MarkerContent } from '@/registry/default/ui/marker';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/registry/default/ui/message-scroller';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

type TChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const history: TChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Where do client deposits land?',
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'Deposits land in `bank:omnibus`, one account for all clients.\n\nEach client share is tracked as its own sub-balance under `clients:$id:available`, so the omnibus total always equals the sum of the client balances.',
  },
  {
    id: 'm3',
    role: 'user',
    content: 'And withdrawals?',
  },
  {
    id: 'm4',
    role: 'assistant',
    content:
      'A withdrawal pays out of the omnibus and draws the sub-balance down:\n\n1. Debit `clients:$id:available`.\n2. Credit `bank:omnibus:payouts`, which settles against the bank.',
  },
];

const reply =
  'Yes. Add a `clients:$id:interest` account and a daily `accrue_interest` transaction that posts from `world`.\n\nSwitch to **Edit** mode and I can draft the change for you to review.';

export default function MessageScrollerDemo() {
  const [messages, setMessages] = useState(history);
  const [draft, setDraft] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const nextId = useRef(history.length);

  const streamReply = (id: string, length: number) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id
          ? { ...message, content: reply.slice(0, length) }
          : message
      )
    );
    if (length < reply.length) {
      setTimeout(() => streamReply(id, length + 4), 20);
    } else {
      setIsBusy(false);
    }
  };

  const send = () => {
    const content = draft.trim();
    if (!content || isBusy) return;

    const userId = `m${++nextId.current}`;
    const assistantId = `m${++nextId.current}`;
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', content },
      { id: assistantId, role: 'assistant', content: '' },
    ]);
    setDraft('');
    setIsBusy(true);
    setTimeout(() => streamReply(assistantId, 4), 1200);
  };

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <Card className="mx-auto flex h-140 w-full max-w-md flex-col">
        <CardHeader className="border-b">
          <CardTitle>Schema assistant</CardTitle>
          <CardDescription>
            Ask about accounts and transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 p-0">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent aria-busy={isBusy} className="p-4">
                {messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === 'user'}
                  >
                    {message.role === 'user' ? (
                      <Message align="end">
                        <MessageContent>
                          <Bubble variant="muted">
                            <BubbleContent>{message.content}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    ) : message.content === '' ? (
                      <Marker role="status">
                        <MarkerContent className="shimmer">
                          Thinking…
                        </MarkerContent>
                      </Marker>
                    ) : (
                      <Message>
                        <MessageContent>
                          <Bubble variant="ghost">
                            <BubbleContent>
                              <Markdown>{message.content}</Markdown>
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    )}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </CardContent>
        <form
          className="border-t p-4"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <InputGroup>
            <InputGroupTextarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about accounts, transactions, or queries…"
              rows={2}
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                type="submit"
                variant="primary"
                size="icon-sm"
                className="ml-auto"
                disabled={!draft.trim() || isBusy}
                aria-label="Send"
              >
                <SendHorizonalIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </Card>
    </MessageScrollerProvider>
  );
}
