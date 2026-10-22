import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Message, MessageContent } from '@/registry/default/ui/message';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

const answer = `Withdrawals post in two steps:

1. Debit \`clients:$id:available\` for the amount.
2. Credit \`bank:omnibus:payouts\`, which settles against the bank.`;

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 py-12">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How do withdrawals move money?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <Bubble variant="ghost">
            <BubbleContent>
              <Markdown>{answer}</Markdown>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  );
}
