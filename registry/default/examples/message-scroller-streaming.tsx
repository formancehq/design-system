'use client';

import { ArrowUpIcon, RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/default/ui/card';
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

type TChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const turns = [
  {
    question: 'Draft a ledger schema for a marketplace with client funds.',
    answer:
      'Here is a first draft.\n\nAccounts: `bank:omnibus` holds all client funds. Each seller has `sellers:$id:available` and `sellers:$id:pending`. The platform keeps its revenue in `platform:fees`.\n\nTransactions: a `payin` posts from `world` to `bank:omnibus`, then to `sellers:$id:pending`. A `release` moves the funds from pending to available when the order ships. A `payout` debits available and credits `bank:omnibus:payouts`.\n\nQueries: one balance query per seller, and one aggregate on `sellers:` to reconcile against the omnibus statement.',
  },
  {
    question: 'Where does the platform fee go?',
    answer:
      'Take it in the `release` transaction. Split the posting so that 2% goes to `platform:fees` and the remainder goes to `sellers:$id:available`.\n\nIn Numscript, use an allotment:\n\nsend [USD/2 10000] (\n  source = @sellers:001:pending\n  destination = {\n    2% to @platform:fees\n    remaining to @sellers:001:available\n  }\n)\n\nBoth legs commit in one transaction, so the fee and the seller balance can never drift apart.',
  },
  {
    question: 'How do I test it before I deploy?',
    answer:
      'Push the schema to a sandbox ledger with fctl, then run each transaction with sample variables. Check the balances with `fctl ledger accounts show sellers:001:available`.\n\nWhen all checks pass, promote the same schema to production. The design run keeps the history of each change.',
  },
];

export default function MessageScrollerStreaming() {
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const nextTurn = turns[messages.length / 2];

  const send = () => {
    if (!nextTurn || isBusy) return;

    const assistantId = `a${messages.length}`;
    setMessages((current) => [
      ...current,
      { id: `u${current.length}`, role: 'user', content: nextTurn.question },
      { id: assistantId, role: 'assistant', content: '' },
    ]);
    setIsBusy(true);

    let length = 0;
    const timer = setInterval(() => {
      length += 3;
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: nextTurn.answer.slice(0, length) }
            : message
        )
      );
      if (length >= nextTurn.answer.length) {
        clearInterval(timer);
        setIsBusy(false);
      }
    }, 20);
  };

  return (
    <MessageScrollerProvider autoScroll>
      <Card className="mx-auto flex h-140 w-full max-w-md flex-col">
        <CardHeader className="border-b">
          <CardTitle>Following the live edge</CardTitle>
          <CardDescription>
            Scroll up while the reply streams. The view stays where you are.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Reset"
              disabled={isBusy || messages.length === 0}
              onClick={() => setMessages([])}
            >
              <RotateCwIcon />
            </Button>
          </CardAction>
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
                    {message.content === '' ? (
                      <Marker role="status">
                        <MarkerContent className="shimmer">
                          Thinking…
                        </MarkerContent>
                      </Marker>
                    ) : (
                      <Message
                        align={message.role === 'user' ? 'end' : 'start'}
                      >
                        <MessageContent>
                          <Bubble
                            variant={
                              message.role === 'user' ? 'muted' : 'ghost'
                            }
                          >
                            <BubbleContent className="whitespace-pre-wrap">
                              {message.content}
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
        <CardFooter className="items-center gap-2">
          <p className="line-clamp-2 min-w-0 flex-1 text-sm text-muted-foreground">
            {nextTurn?.question ?? 'No more questions. Reset the chat.'}
          </p>
          <Button
            size="icon-sm"
            aria-label="Send message"
            disabled={!nextTurn || isBusy}
            onClick={send}
          >
            <ArrowUpIcon />
          </Button>
        </CardFooter>
      </Card>
    </MessageScrollerProvider>
  );
}
