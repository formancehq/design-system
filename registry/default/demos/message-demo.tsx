import { FormanceIcon } from '@/registry/default/ui/formance-logo';
import { Avatar, AvatarFallback } from '@/registry/default/ui/avatar';
import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '@/registry/default/ui/message';

export default function MessageDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 py-12">
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Which account holds the client funds before payout?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <FormanceIcon variant="emerald" size="md" />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Schema assistant</MessageHeader>
          <Bubble variant="outline">
            <BubbleContent>
              Deposits land in <code>bank:omnibus</code>. Each client share is
              tracked in <code>clients:$id:available</code> until the payout
              moves it out.
            </BubbleContent>
          </Bubble>
          <MessageFooter>Answered from the current schema</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}
