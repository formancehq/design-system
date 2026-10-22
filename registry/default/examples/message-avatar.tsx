import { Avatar, AvatarFallback } from '@/registry/default/ui/avatar';
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from '@/registry/default/ui/bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/registry/default/ui/message';

export default function MessageAvatarDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 py-12">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              The deploy to the sandbox ledger failed.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>Can you share the exact error?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>Here is the error from the run</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>
                Transaction accrue_interest posts from world without a cap.
                Change the source, then run the deploy again.
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
    </div>
  );
}
