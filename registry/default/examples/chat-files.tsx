'use client';

import { useChat } from '@ai-sdk/react';
import { createChat } from '@shadcn/helpers/ai-sdk';
import type { FileUIPart } from 'ai';
import {
  ArrowUpIcon,
  ExternalLinkIcon,
  FileTextIcon,
  RotateCwIcon,
} from 'lucide-react';
import * as React from 'react';

import { getMessageText } from '@/lib/ai';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/registry/default/ui/attachment';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/default/ui/input-group';
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from '@/registry/default/ui/marker';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/registry/default/ui/message-scroller';
import { Spinner } from '@/registry/default/ui/spinner';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

// A chat whose turns carry AI SDK file parts: the person sends a statement and
// a photo, and the agent answers with a report file.

const chat = createChat()
  .user('Reconcile this statement against the omnibus account.', {
    files: [
      {
        filename: 'office-receipt.png',
        mediaType: 'image/png',
        url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
      },
      {
        filename: 'bank-statement-2026-09.pdf',
        mediaType: 'application/pdf',
        url: 'https://example.com/bank-statement-2026-09.pdf',
      },
    ],
  })
  .sleep(1000)
  .assistant(({ writer }) => {
    writer.text(
      'The statement has **42** lines. **41** match transactions on `bank:omnibus`. One payout of EUR 120.00 on 14 September has no ledger transaction. The report lists it.'
    );
    writer.file({
      filename: 'reconciliation-2026-09.csv',
      mediaType: 'text/csv',
      url: 'https://example.com/reconciliation-2026-09.csv',
    });
  });

const initialMessages = chat.get(0);
const transport = chat.transport({
  fallback:
    'This demo only knows the scripted turns. Press reset to start over.',
});

export default function ChatFiles() {
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
            <div className="font-medium">Statement review</div>
            <div className="text-sm text-muted-foreground">
              Image and document file parts.
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
                const isUser = message.role === 'user';
                const files = message.parts.filter(
                  (part): part is FileUIPart => part.type === 'file'
                );
                const reply = getMessageText(message);

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={isUser}
                  >
                    <Message align={isUser ? 'end' : 'start'}>
                      <MessageContent
                        className={
                          isUser
                            ? 'flex-col items-end gap-2'
                            : 'flex-col items-start gap-2'
                        }
                      >
                        {files.map((file) => (
                          <FilePart key={file.url} part={file} />
                        ))}
                        {reply &&
                          (isUser ? (
                            <Bubble align="end" variant="muted">
                              <BubbleContent>{reply}</BubbleContent>
                            </Bubble>
                          ) : (
                            <Markdown>{reply}</Markdown>
                          ))}
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}
              {status === 'submitted' && (
                <MessageScrollerItem scrollAnchor={false}>
                  <Marker role="status">
                    <MarkerIcon>
                      <Spinner />
                    </MarkerIcon>
                    <MarkerContent className="shimmer">
                      Reading the files…
                    </MarkerContent>
                  </Marker>
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
              placeholder="Ask about a statement…"
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

function FilePart({ part }: { part: FileUIPart }) {
  const filename = part.filename ?? 'File';

  if (part.mediaType.startsWith('image/')) {
    return (
      <Attachment orientation="vertical" className="w-full max-w-60">
        <AttachmentMedia variant="image" className="aspect-[4/3] w-full">
          <img src={part.url} alt={filename} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{filename}</AttachmentTitle>
        </AttachmentContent>
        <AttachmentTrigger asChild>
          <a
            href={part.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${filename}`}
          />
        </AttachmentTrigger>
      </Attachment>
    );
  }

  return (
    <Attachment className="w-full max-w-72">
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{filename}</AttachmentTitle>
        <AttachmentDescription>{part.mediaType}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction asChild aria-hidden="true">
          <span>
            <ExternalLinkIcon />
          </span>
        </AttachmentAction>
      </AttachmentActions>
      <AttachmentTrigger asChild>
        <a
          href={part.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${filename}`}
        />
      </AttachmentTrigger>
    </Attachment>
  );
}
