'use client';

import { useState } from 'react';

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from '@/registry/default/ui/bubble';
import { Message, MessageContent } from '@/registry/default/ui/message';

const suggestions = [
  'We hold client funds across two banks, not one',
  'Clients hold both EUR and USD balances',
  'Add daily interest accrual on client balances',
];

export default function BubbleSuggestions() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col gap-6 py-12">
      <Message>
        <MessageContent>
          <Bubble variant="ghost">
            <BubbleContent>How does yours differ?</BubbleContent>
          </Bubble>
          <BubbleGroup>
            {suggestions.map((suggestion) => (
              <Bubble key={suggestion} variant="outline">
                <BubbleContent asChild>
                  <button type="button" onClick={() => setPicked(suggestion)}>
                    {suggestion}
                  </button>
                </BubbleContent>
              </Bubble>
            ))}
          </BubbleGroup>
        </MessageContent>
      </Message>
      {picked && (
        <Message align="end">
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>{picked}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      )}
    </div>
  );
}
