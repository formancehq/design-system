'use client';

import * as React from 'react';
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from 'lucide-react';

import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  Message,
  MessageContent,
  MessageFooter,
} from '@/registry/default/ui/message';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

const reply = `Add a \`clients:$id:interest\` account, then post to it from a daily transaction.

\`\`\`numscript
send [EUR/2 100] (
  source = @treasury:interest
  destination = @clients:001:interest
)
\`\`\`

Run it once a day for each client. The transaction fails when **treasury:interest** has no funds, so the ledger never creates money.`;

export default function MessagePattern() {
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(
    null
  );

  React.useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 py-6 text-sm">
      <Message align="end">
        <MessageContent className="gap-2">
          <Bubble align="end" variant="muted">
            <BubbleContent>
              How do I accrue daily interest on client balances? It should come
              from a treasury account.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <MessageAction label="Copy">
              <CopyIcon />
            </MessageAction>
            <MessageAction label="Edit">
              <PencilIcon />
            </MessageAction>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-2">
          <Markdown>{reply}</Markdown>
          <MessageFooter className="px-0">
            <MessageAction
              label={copied ? 'Copied' : 'Copy'}
              onClick={() => {
                navigator.clipboard.writeText(reply);
                setCopied(true);
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </MessageAction>
            <MessageAction
              label="Good response"
              aria-pressed={feedback === 'like'}
              onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
            >
              <ThumbsUpIcon
                className={feedback === 'like' ? 'fill-current' : undefined}
              />
            </MessageAction>
            <MessageAction
              label="Bad response"
              aria-pressed={feedback === 'dislike'}
              onClick={() =>
                setFeedback(feedback === 'dislike' ? null : 'dislike')
              }
            >
              <ThumbsDownIcon
                className={feedback === 'dislike' ? 'fill-current' : undefined}
              />
            </MessageAction>
            <MessageAction label="Retry">
              <RefreshCcwIcon />
            </MessageAction>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}

function MessageAction({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
