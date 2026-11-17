'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import { ArrowUpIcon, RotateCwIcon } from 'lucide-react';
import * as React from 'react';

import { getMessageText } from '@/lib/ai';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import { FormanceIcon } from '@/registry/default/ui/formance-logo';
import { FormanceThinkingLogo } from '@/registry/default/ui/formance-thinking-logo';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/default/ui/input-group';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/registry/default/ui/message-scroller';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

const chat = createChat()
  .user('Why is clients:001:available lower than the bank statement?')
  .sleep(5000)
  .assistant(({ writer }) => {
    writer.text(
      'The statement includes a payin of **EUR 250.00** from 30 September. The ledger posted it on 1 October, so `clients:001:available` shows it in the next period. The two balances match once you include that transaction.'
    );
  });

const initialMessages = chat.get(0);
const transport = chat.transport({
  fallback:
    'This demo only knows the scripted turns. Press reset to start over.',
});

export default function ChatThinkingLogo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  });
  const [draft, setDraft] = React.useState<string | null>(null);
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
      <div className="flex h-140 w-full max-w-md flex-col border bg-background">
        <div className="flex items-start justify-between gap-4 border-b p-4">
          <div className="flex flex-col gap-1">
            <div className="font-medium">Balance check</div>
            <div className="text-sm text-muted-foreground">
              The mark thinks until the first token.
            </div>
          </div>
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
            <RotateCwIcon className="size-4" />
          </Button>
        </div>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-6 p-4">
              {messages.map((message) => {
                const reply = getMessageText(message);

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
                            <BubbleContent>{reply}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                }

                return (
                  <MessageScrollerItem key={message.id} messageId={message.id}>
                    <Message>
                      <MessageAvatar className="bg-transparent">
                        <FormanceIcon className="text-emerald-700 dark:text-emerald-300" />
                      </MessageAvatar>
                      <MessageContent>
                        <Markdown>{reply}</Markdown>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}
              {status === 'submitted' && (
                <MessageScrollerItem scrollAnchor={false}>
                  <Message>
                    <MessageAvatar className="bg-transparent">
                      <FormanceThinkingLogo />
                    </MessageAvatar>
                  </Message>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
        <form onSubmit={onSubmit} className="border-t p-4">
          <InputGroup>
            <InputGroupTextarea
              value={text}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about a balance…"
              aria-label="Message"
              className="min-h-10"
            />
            <InputGroupAddon align="block-end" className="pt-1">
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
    </MessageScrollerProvider>
  );
}
