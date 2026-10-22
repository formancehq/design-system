'use client';

import { toast } from 'sonner';

import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';

export default function BubbleReactionsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble variant="muted" align="end">
        <BubbleContent>
          I don’t need a dry run, the Numscript is correct.
        </BubbleContent>
        <BubbleReactions
          align="start"
          role="img"
          aria-label="Reactions: thumbs up, surprised"
        >
          <span>👍</span>
          <span>😮</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Bold. I will run it against a copy of the ledger first and tell you
          the result.
        </BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reactions: eyes, rocket, and 2 more"
        >
          <span>👀</span>
          <span>🚀</span>
          <span>+2</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent>
          The dry run passed. All 142 postings balance. Looks good!
        </BubbleContent>
        <BubbleReactions
          side="top"
          align="start"
          role="img"
          aria-label="Reactions: party popper, clapping hands"
        >
          <span>🎉</span>
          <span>👏</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>
          Can I run <code>fctl ledger transactions revert 4021</code>?
        </BubbleContent>
        <BubbleReactions>
          <Button
            variant="ghost"
            size="sm"
            caseSensitive
            onClick={() => toast.success('Reverting transaction 4021…')}
          >
            Yes, run it
          </Button>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
