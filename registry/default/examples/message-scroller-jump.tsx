'use client';

import { Button } from '@/registry/default/ui/button';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from '@/registry/default/ui/message-scroller';

const steps = [
  {
    id: 'accounts',
    title: 'Accounts',
    body: 'Mapped 12 accounts from the omnibus template.',
  },
  {
    id: 'transactions',
    title: 'Transactions',
    body: 'Drafted deposit, withdrawal, and fee transactions.',
  },
  {
    id: 'queries',
    title: 'Queries',
    body: 'Added a balance query per client.',
  },
  {
    id: 'validation',
    title: 'Validation',
    body: 'All 14 checks passed against the design run rules.',
  },
  {
    id: 'summary',
    title: 'Summary',
    body: 'The schema is ready to deploy to the sandbox ledger.',
  },
];

function StepLinks() {
  const { scrollToMessage } = useMessageScroller();

  return (
    <div className="flex flex-wrap gap-2 border-b p-3">
      {steps.map((step) => (
        <Button
          key={step.id}
          variant="outline"
          size="sm"
          onClick={() => scrollToMessage(step.id, { behavior: 'smooth' })}
        >
          {step.title}
        </Button>
      ))}
    </div>
  );
}

export default function MessageScrollerJump() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <div className="mx-auto flex h-96 w-full max-w-md flex-col border">
        <StepLinks />
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4">
              {steps.map((step) => (
                <MessageScrollerItem
                  key={step.id}
                  messageId={step.id}
                  className="min-h-40"
                >
                  <Message>
                    <MessageContent>
                      <Bubble variant="outline">
                        <BubbleContent>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-muted-foreground">{step.body}</p>
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
      </div>
    </MessageScrollerProvider>
  );
}
