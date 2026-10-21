'use client';

import { toast } from 'sonner';

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from '@/registry/default/ui/bubble';

const replies = [
  'Explain my chart of accounts',
  'Write a Numscript for a fee split',
  'Something else. Talk to a human.',
];

export default function BubbleLinkButton() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>How can I help with your ledger today?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        {replies.map((reply) => (
          <Bubble key={reply} variant="tinted" align="end">
            <BubbleContent asChild>
              <button type="button" onClick={() => toast(reply)}>
                {reply}
              </button>
            </BubbleContent>
          </Bubble>
        ))}
      </BubbleGroup>
    </div>
  );
}
