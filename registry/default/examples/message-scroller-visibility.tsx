'use client';

import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/default/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/registry/default/ui/hover-card';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerVisibility,
} from '@/registry/default/ui/message-scroller';

const messages = [
  {
    id: 'turn-1',
    role: 'user',
    content: 'Draft the accounts for a wallet product.',
  },
  {
    id: 'turn-1-reply',
    role: 'assistant',
    content:
      'Each user gets `wallets:$id:main`. Holds go to `wallets:$id:hold:$hold_id`, so you can release or confirm each hold on its own. Top-ups post from `world`, and payouts credit `bank:payouts`.',
  },
  {
    id: 'turn-2',
    role: 'user',
    content: 'How do I hold funds for a card payment?',
  },
  {
    id: 'turn-2-reply',
    role: 'assistant',
    content:
      'Move the amount from `wallets:$id:main` to a new hold account. When the card network confirms, send the hold to `merchants:$id`. When it voids, send it back to the main account. Both paths are one Numscript transaction each.',
  },
  {
    id: 'turn-3',
    role: 'user',
    content: 'Can a wallet go negative?',
  },
  {
    id: 'turn-3-reply',
    role: 'assistant',
    content:
      'Not by default: the ledger rejects a posting that overdraws the source. To allow it, add `allowing overdraft up to [USD/2 5000]` to the source in Numscript, and only for the accounts that need it.',
  },
  {
    id: 'turn-4',
    role: 'user',
    content: 'How do I list all wallets with a hold?',
  },
  {
    id: 'turn-4-reply',
    role: 'assistant',
    content:
      'Filter the accounts on the address `wallets::hold:`, and keep those with a balance that is not zero. With fctl, run `fctl ledger volumes list --address wallets::hold:`.',
  },
];

const turns = messages.filter((message) => message.role === 'user');

export default function MessageScrollerVisibility() {
  return (
    <MessageScrollerProvider scrollMargin={12}>
      <div className="relative mx-auto w-full max-w-md">
        <Card className="flex h-140 w-full flex-col">
          <CardHeader className="border-b">
            <CardTitle>Transcript outline</CardTitle>
            <CardDescription>Track the current anchored turn.</CardDescription>
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
                      <Message
                        align={message.role === 'user' ? 'end' : 'start'}
                      >
                        <MessageContent>
                          <Bubble
                            variant={
                              message.role === 'user' ? 'muted' : 'ghost'
                            }
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
        </Card>
        <div className="absolute top-1/2 -right-12 -translate-y-1/2">
          <TranscriptOutline />
        </div>
      </div>
    </MessageScrollerProvider>
  );
}

function TranscriptOutline() {
  const { scrollToMessage } = useMessageScroller();
  const { currentAnchorId } = useMessageScrollerVisibility();

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label="Open the transcript outline"
          className="flex size-9 flex-col items-center justify-center gap-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {turns.map((turn) => (
            <span
              key={turn.id}
              data-current={turn.id === currentAnchorId}
              className="h-0.5 w-4 bg-muted-foreground/40 data-[current=true]:bg-foreground"
            />
          ))}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="left"
        sideOffset={-28}
        className="flex w-64 flex-col gap-1 p-1"
      >
        {turns.map((turn) => (
          <button
            key={turn.id}
            type="button"
            aria-current={turn.id === currentAnchorId ? 'location' : undefined}
            className="truncate px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent aria-[current=location]:bg-accent aria-[current=location]:text-accent-foreground"
            onClick={() =>
              scrollToMessage(turn.id, { align: 'start', behavior: 'smooth' })
            }
          >
            {turn.content}
          </button>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}
