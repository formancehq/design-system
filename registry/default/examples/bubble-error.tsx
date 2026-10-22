import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import { Message, MessageContent } from '@/registry/default/ui/message';

export default function BubbleError() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 py-12">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Rename every account under clients.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <Bubble variant="destructive" role="alert">
            <BubbleContent>
              The edit didn’t pass validation, so nothing was changed. Try
              rephrasing the instruction.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  );
}
