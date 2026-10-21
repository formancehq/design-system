'use client';

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
  useMessageScrollerScrollable,
} from '@/registry/default/ui/message-scroller';

const messages = [
  {
    id: 'scroll-1',
    role: 'user',
    content: 'Why does my deposit transaction fail?',
  },
  {
    id: 'scroll-2',
    role: 'assistant',
    content:
      'The source `clients:001:available` has no funds yet. A deposit must post from `world`, the only account that can go negative without a limit.',
  },
  {
    id: 'scroll-3',
    role: 'user',
    content: 'Fix it in the Numscript.',
  },
  {
    id: 'scroll-4',
    role: 'assistant',
    content:
      'I changed the source to `@world` and kept the destination `@clients:001:available`. The dry run now passes.',
  },
  {
    id: 'scroll-5',
    role: 'user',
    content: 'Add a reference so that a retry does not post twice.',
  },
  {
    id: 'scroll-6',
    role: 'assistant',
    content:
      'Done. The transaction now takes a `reference` from the payment ID. The ledger rejects a second transaction with the same reference, so a retry is safe.',
  },
  {
    id: 'scroll-7',
    role: 'user',
    content: 'Deploy it to the sandbox.',
  },
  {
    id: 'scroll-8',
    role: 'assistant',
    content:
      'Deployed with `fctl ledger transactions num`. The sandbox ledger shows the new balance of `clients:001:available`.',
  },
];

export default function MessageScrollerScrollable() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <Card className="mx-auto flex h-140 w-full max-w-md flex-col">
        <CardHeader className="border-b">
          <CardTitle>Scroll status</CardTitle>
          <CardDescription>
            The edges that the reader can scroll toward.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 p-0">
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
                          <BubbleContent>{message.content}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </CardContent>
        <ScrollStatus />
      </Card>
    </MessageScrollerProvider>
  );
}

function ScrollStatus() {
  const { start, end } = useMessageScrollerScrollable();

  return (
    <CardFooter className="justify-center text-sm text-muted-foreground">
      {start && end
        ? 'You can scroll up and down.'
        : end
          ? 'You are at the top. You can only scroll down.'
          : start
            ? 'You are at the bottom. You can only scroll up.'
            : 'All messages fit in the viewport.'}
    </CardFooter>
  );
}
