'use client';

import { RotateCwIcon } from 'lucide-react';
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
import {
  Message,
  MessageContent,
  MessageHeader,
} from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/registry/default/ui/message-scroller';

type TGroupChatItem =
  | {
      type: 'message';
      id: string;
      sender: string;
      role: 'user' | 'assistant';
      content: string;
      scrollAnchor?: boolean;
    }
  | { type: 'event'; id: string; content: string; scrollAnchor?: boolean };

const currentUser = 'You';

const history: TGroupChatItem[] = [
  {
    type: 'event',
    id: 'created',
    content: 'Léa created the #ledger-schema channel',
  },
  {
    type: 'message',
    id: 'lea-1',
    sender: 'Léa',
    role: 'user',
    content: 'We go live with the omnibus schema on Monday.',
  },
  {
    type: 'message',
    id: 'you-1',
    sender: currentUser,
    role: 'user',
    content: '@assistant, do we have a fee account yet?',
    scrollAnchor: true,
  },
  {
    type: 'message',
    id: 'assistant-1',
    sender: 'Schema assistant',
    role: 'assistant',
    content:
      'Not yet. I suggest `platform:fees`, credited by each withdrawal in the same transaction.',
  },
  {
    type: 'message',
    id: 'lea-2',
    sender: 'Léa',
    role: 'user',
    content: 'Good. Marcus owns the payouts side, I will add him.',
  },
];

const joined: TGroupChatItem = {
  type: 'event',
  id: 'marcus-joined',
  content: 'Marcus joined the channel',
  scrollAnchor: true,
};

const reply: TGroupChatItem = {
  type: 'message',
  id: 'marcus-1',
  sender: 'Marcus',
  role: 'user',
  content:
    'Hi all. Payouts settle from `bank:omnibus:payouts` every day at 17:00. I will check the fee split with fctl on the sandbox ledger.',
};

export default function MessageScrollerGroupChat() {
  const [step, setStep] = useState<'idle' | 'joined' | 'replied'>('idle');
  const [resetCount, setResetCount] = useState(0);
  const items =
    step === 'replied'
      ? [...history, joined, reply]
      : step === 'joined'
        ? [...history, joined]
        : history;

  return (
    <MessageScrollerProvider key={resetCount}>
      <Card className="mx-auto flex h-140 w-full max-w-md flex-col">
        <CardHeader className="border-b">
          <CardTitle>Group chat</CardTitle>
          <CardDescription>
            The marker for a new member is the anchor of the turn.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Reset"
              disabled={step === 'idle'}
              onClick={() => {
                setStep('idle');
                setResetCount((count) => count + 1);
              }}
            >
              <RotateCwIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 p-0">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="p-4">
                {items.map((item) => (
                  <MessageScrollerItem
                    key={item.id}
                    messageId={item.id}
                    scrollAnchor={item.scrollAnchor}
                  >
                    {item.type === 'event' ? (
                      <Marker variant="separator">
                        <MarkerContent>{item.content}</MarkerContent>
                      </Marker>
                    ) : (
                      <GroupChatMessage item={item} />
                    )}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2">
          <Button
            variant="secondary"
            disabled={step === 'replied'}
            onClick={() => setStep(step === 'idle' ? 'joined' : 'replied')}
          >
            {step === 'idle' ? 'Add Marcus' : 'Send message as Marcus'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {step === 'idle'
              ? 'This adds a marker and makes it the anchor.'
              : 'Now send the reply of Marcus below the marker.'}
          </p>
        </CardFooter>
      </Card>
    </MessageScrollerProvider>
  );
}

function GroupChatMessage({
  item,
}: {
  item: Extract<TGroupChatItem, { type: 'message' }>;
}) {
  const isCurrentUser = item.sender === currentUser;

  return (
    <Message align={isCurrentUser ? 'end' : 'start'}>
      <MessageContent>
        {!isCurrentUser && <MessageHeader>{item.sender}</MessageHeader>}
        <Bubble
          variant={
            isCurrentUser
              ? 'muted'
              : item.role === 'assistant'
                ? 'ghost'
                : 'tinted'
          }
        >
          <BubbleContent>{item.content}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
