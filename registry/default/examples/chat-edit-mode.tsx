'use client';

import {
  ArrowUpIcon,
  CheckIcon,
  CircleCheckIcon,
  MessageCircleQuestionIcon,
  Wand2Icon,
  XIcon,
} from 'lucide-react';
import * as React from 'react';

import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/default/ui/input-group';
import { Message, MessageContent } from '@/registry/default/ui/message';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/registry/default/ui/toggle-group';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

type TChatMode = 'ask' | 'edit';

type TReview = 'pending' | 'applied' | 'discarded';

const diff = ` accounts:
   platform:
+    fees: {}
 transactions:
   settle_payment:
     script: |
       send [EUR/2 $amount] (
         source = @psp:settlements
-        destination = @clients:$client:available
+        destination = {
+          2% to @platform:fees
+          remainder to @clients:$client:available
+        }
       )`;

const reply =
  'I added a `platform:fees` account and split `settle_payment`: 2% goes to the platform, the remainder to the client.';

export default function ChatEditMode() {
  const [mode, setMode] = React.useState<TChatMode>('edit');
  const [text, setText] = React.useState('');
  const [review, setReview] = React.useState<TReview>('pending');

  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Add a platform:fees account and route 2% of settlements to it.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-3">
          <Markdown>{reply}</Markdown>
          <SchemaDiff review={review} onReview={setReview} />
        </MessageContent>
      </Message>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setText('');
        }}
      >
        <InputGroup>
          <InputGroupTextarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              mode === 'edit'
                ? 'Describe the change to make…'
                : 'Ask about accounts, transactions, or queries…'
            }
            aria-label="Message"
            className="min-h-14"
          />
          <InputGroupAddon align="block-end" className="pt-1">
            <ModeSwitch mode={mode} onModeChange={setMode} />
            <InputGroupButton
              type="submit"
              variant="primary"
              size="icon-sm"
              disabled={text.trim().length === 0}
              className="ml-auto"
            >
              <ArrowUpIcon />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}

function ModeSwitch({
  mode,
  onModeChange,
}: {
  mode: TChatMode;
  onModeChange: (mode: TChatMode) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={mode}
      onValueChange={(value) => {
        if (value === 'ask' || value === 'edit') {
          onModeChange(value);
        }
      }}
      aria-label="Mode"
    >
      <ToggleGroupItem value="ask">
        <MessageCircleQuestionIcon />
        Ask
      </ToggleGroupItem>
      <ToggleGroupItem value="edit">
        <Wand2Icon />
        Edit
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function SchemaDiff({
  review,
  onReview,
}: {
  review: TReview;
  onReview: (review: TReview) => void;
}) {
  return (
    <CodeBlock size="sm">
      <CodeBlockHeader>
        <CodeBlockTitle>schema.yaml</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent>
        {diff.split('\n').map((line, index) => (
          <CodeBlockLine
            key={index}
            variant={
              line.startsWith('+')
                ? 'added'
                : line.startsWith('-')
                  ? 'removed'
                  : 'default'
            }
          >
            {line.slice(1)}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
      <CodeBlockFooter className="pt-2">
        {review === 'pending' ? (
          <>
            <Button size="sm" onClick={() => onReview('applied')}>
              <CheckIcon className="size-3.5" />
              Apply
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReview('discarded')}
            >
              <XIcon className="size-3.5" />
              Discard
            </Button>
          </>
        ) : (
          <span role="status" className="flex items-center gap-1.5 text-xs">
            {review === 'applied' ? (
              <CircleCheckIcon className="size-3.5" />
            ) : (
              <XIcon className="size-3.5" />
            )}
            {review === 'applied' ? 'Applied to the editor' : 'Discarded'}
          </span>
        )}
      </CodeBlockFooter>
    </CodeBlock>
  );
}
