'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  Collapsible,
  CollapsibleTrigger,
} from '@/registry/default/ui/collapsible';

const text = `The schema review found two accounts that can go negative without a limit.

I checked the payout, refund, and fee transactions because each one moves money out of a client account.

The payout and refund transactions are fine. The fee transaction needs a bounded overdraft on fees:pending, so that a late settlement cannot drain it.

I also recommend keeping the limit in the Numscript instead of the account metadata, so that each transaction can set its own limit later.`;

const previewLength = 180;

export default function BubbleCollapsible() {
  const [open, setOpen] = useState(false);
  const isLong = text.length > previewLength;
  const preview = `${text.slice(0, previewLength)}…`;

  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>How can I help with your schema today?</BubbleContent>
      </Bubble>
      <Bubble variant="muted" align="end">
        <BubbleContent className="whitespace-pre-line">
          <Collapsible open={open} onOpenChange={setOpen}>
            <div>{open || !isLong ? text : preview}</div>
            {isLong && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="link"
                  caseSensitive
                  className="h-auto gap-1 p-0 text-muted-foreground"
                >
                  {open ? 'Show less' : 'Show more'}
                  <ChevronDownIcon
                    className={cn('size-4', open && 'rotate-180')}
                  />
                </Button>
              </CollapsibleTrigger>
            )}
          </Collapsible>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
