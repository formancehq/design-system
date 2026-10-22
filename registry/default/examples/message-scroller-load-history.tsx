'use client';

import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

const INITIAL_VISIBLE_COUNT = 2;

const history = [
  {
    id: 'history-1',
    role: 'user',
    content: 'Import the chart of accounts from our spreadsheet.',
  },
  {
    id: 'history-2',
    role: 'assistant',
    content:
      'I imported 42 accounts. Three of them had no type, so I put them under `unclassified:` for you to review.',
  },
  {
    id: 'history-3',
    role: 'user',
    content: 'Move them to `clients:` and remove the old prefix.',
  },
  {
    id: 'history-4',
    role: 'assistant',
    content:
      'Done. The three accounts are now `clients:104:available`, `clients:105:available`, and `clients:106:available`.',
  },
  {
    id: 'history-5',
    role: 'user',
    content: 'Which transactions still use the old accounts?',
  },
  {
    id: 'history-6',
    role: 'assistant',
    content:
      'Two of them: `deposit_legacy` and `fee_legacy`. I updated both to post to the new accounts.',
  },
  {
    id: 'history-7',
    role: 'user',
    content: 'Run the checks again.',
  },
  {
    id: 'history-8',
    role: 'assistant',
    content:
      'All 14 checks passed. The schema is ready to deploy to the sandbox ledger.',
  },
];

export default function MessageScrollerLoadHistory() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [resetCount, setResetCount] = useState(0);
  const canLoadHistory = visibleCount < history.length;

  return (
    <MessageScrollerProvider key={resetCount}>
      <Card className="mx-auto flex h-140 w-full max-w-md flex-col">
        <CardHeader className="border-b">
          <CardTitle>Loading earlier messages</CardTitle>
          <CardDescription>
            Messages added above keep your place.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Reset"
              disabled={visibleCount === INITIAL_VISIBLE_COUNT}
              onClick={() => {
                setVisibleCount(INITIAL_VISIBLE_COUNT);
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
                {history.slice(-visibleCount).map((message) => (
                  <MessageScrollerItem key={message.id} messageId={message.id}>
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
                <MessageScrollerItem>
                  <Marker variant="separator">
                    <MarkerContent>End of conversation</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2">
          <Button
            variant="secondary"
            disabled={!canLoadHistory}
            onClick={() => {
              setVisibleCount(history.length);
              toast('History loaded', {
                description: 'Scroll up to see earlier messages.',
              });
            }}
          >
            {canLoadHistory ? 'Load history' : 'History loaded'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Earlier messages load above, and the view stays where it is.
          </p>
        </CardFooter>
      </Card>
    </MessageScrollerProvider>
  );
}
