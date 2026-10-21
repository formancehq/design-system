import {
  CopyIcon,
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

export default function MessageActionsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              The deploy failed because schema v2 has an unused account.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <Button
              variant="ghost"
              size="icon-md"
              aria-label="Copy"
              title="Copy"
            >
              <CopyIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-md"
              aria-label="Like"
              title="Like"
            >
              <ThumbsUpIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-md"
              aria-label="Dislike"
              title="Dislike"
            >
              <ThumbsDownIcon />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Okay, send me the validation report.</BubbleContent>
          </Bubble>
          <MessageFooter className="gap-2">
            <span className="font-normal text-destructive-foreground">
              Failed to send
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Retry"
              aria-label="Retry"
            >
              <RefreshCcwIcon />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}
