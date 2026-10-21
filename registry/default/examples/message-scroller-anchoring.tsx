'use client';

import {
  ArrowUpIcon,
  MessageCircleDashedIcon,
  RotateCwIcon,
} from 'lucide-react';
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/default/ui/empty';
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
  ToggleGroup,
  ToggleGroupItem,
} from '@/registry/default/ui/toggle-group';

type TRole = 'user' | 'assistant';

type TChatMessage = {
  id: string;
  role: TRole;
  content: string;
};

const script: TChatMessage[] = [
  {
    id: 'anchor-1-user',
    role: 'user',
    content: 'How do I model client deposits in the ledger?',
  },
  {
    id: 'anchor-1-assistant',
    role: 'assistant',
    content:
      'Post each deposit from `world` to `bank:omnibus`, then move the client share to `clients:$id:available`. The omnibus total then always equals the sum of the client balances.',
  },
  {
    id: 'anchor-2-user',
    role: 'user',
    content: 'What changes when the reply is the anchor?',
  },
  {
    id: 'anchor-2-assistant',
    role: 'assistant',
    content:
      'Now each reply of the schema assistant settles near the top. Use this when the answer is the place where the reader must land after each turn.',
  },
  {
    id: 'anchor-3-user',
    role: 'user',
    content: 'Can I change the role and continue?',
  },
  {
    id: 'anchor-3-assistant',
    role: 'assistant',
    content:
      'Yes. The next message with the selected role becomes the anchor, so you can compare the two roles in one conversation.',
  },
];

export default function MessageScrollerAnchoring() {
  const [anchorRole, setAnchorRole] = useState<TRole>('user');
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const nextMessage = script[messages.length];

  return (
    <Card className="mx-auto flex h-140 w-full max-w-md flex-col">
      <CardHeader className="border-b">
        <CardTitle>Anchoring turns</CardTitle>
        <CardDescription>
          Select the role that settles near the top.
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Reset"
            disabled={messages.length === 0}
            onClick={() => setMessages([])}
          >
            <RotateCwIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        {messages.length === 0 ? (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircleDashedIcon />
              </EmptyMedia>
              <EmptyTitle>No messages</EmptyTitle>
              <EmptyDescription>
                Send the first message to see the selected role anchor.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="p-4">
                  {messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === anchorRole}
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
          </MessageScrollerProvider>
        )}
      </CardContent>
      <CardFooter className="items-center">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-label="Anchor role"
          value={anchorRole}
          onValueChange={(value) => {
            if (value === 'user' || value === 'assistant') {
              setAnchorRole(value);
              setMessages([]);
            }
          }}
        >
          <ToggleGroupItem value="user">User</ToggleGroupItem>
          <ToggleGroupItem value="assistant">Assistant</ToggleGroupItem>
        </ToggleGroup>
        <Button
          size="icon-sm"
          className="ml-auto"
          aria-label="Send message"
          disabled={!nextMessage}
          onClick={() =>
            nextMessage && setMessages((current) => [...current, nextMessage])
          }
        >
          <ArrowUpIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
