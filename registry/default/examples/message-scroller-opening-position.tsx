'use client';

import { useState } from 'react';

import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/default/ui/card';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/registry/default/ui/message-scroller';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';

type TPosition = 'start' | 'end' | 'last-anchor';

const positions: TPosition[] = ['start', 'end', 'last-anchor'];

const messages = [
  {
    id: 'open-1',
    role: 'user',
    content: 'Which accounts does the omnibus template create?',
  },
  {
    id: 'open-2',
    role: 'assistant',
    content:
      'It creates `bank:omnibus`, one `clients:$id:available` account per client, and `platform:fees` for the revenue of the platform.',
  },
  {
    id: 'open-3',
    role: 'user',
    content: 'Add a daily interest accrual for each client.',
  },
  {
    id: 'open-4',
    role: 'assistant',
    content:
      'Done. I added a `clients:$id:interest` account and an `accrue_interest` transaction that posts from `world` each day.\n\nThe transaction takes the rate as a variable, so you can change it without a new schema version.\n\nI also added a query that returns the interest of each client for a period. Use it to build the monthly statement.\n\nRun the design run checks before you deploy: two of them cover the new transaction, and one checks that the omnibus total still equals the sum of the client balances.',
  },
];

export default function MessageScrollerOpeningPosition() {
  const [position, setPosition] = useState<TPosition>('last-anchor');

  return (
    <Card className="mx-auto flex h-140 w-full max-w-md flex-col">
      <CardHeader className="border-b">
        <CardTitle>Opening position</CardTitle>
        <CardDescription>Select where a saved thread opens.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <MessageScrollerProvider
          key={position}
          defaultScrollPosition={position}
        >
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="p-4">
                {messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === 'user'}
                  >
                    <Message align={message.role === 'user' ? 'end' : 'start'}>
                      <MessageContent>
                        <Bubble
                          variant={message.role === 'user' ? 'muted' : 'ghost'}
                        >
                          <BubbleContent className="whitespace-pre-wrap">
                            {message.content}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </CardContent>
      <CardFooter>
        <Tabs
          className="w-full"
          value={position}
          onValueChange={(value) => {
            const next = positions.find((option) => option === value);
            if (next) setPosition(next);
          }}
        >
          <TabsList className="w-full">
            {positions.map((option) => (
              <TabsTrigger key={option} value={option}>
                {option}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardFooter>
    </Card>
  );
}
