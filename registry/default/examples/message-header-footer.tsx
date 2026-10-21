import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '@/registry/default/ui/message';

export default function MessageHeaderFooterDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Message>
        <MessageContent>
          <MessageHeader>Schema assistant</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>I already ran the validation checks.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>
              Deploy the schema to the sandbox ledger.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <div>
              Read <span className="font-normal">Yesterday</span>
            </div>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}
