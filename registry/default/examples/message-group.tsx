import { FormanceIcon } from '@/registry/default/ui/formance-logo';
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from '@/registry/default/ui/bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from '@/registry/default/ui/message';

export default function MessageGroupExample() {
  return (
    <MessageGroup className="w-full max-w-md py-12">
      <Message>
        <MessageAvatar>
          <FormanceIcon variant="emerald" size="md" />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Schema assistant</MessageHeader>
          <BubbleGroup>
            <Bubble variant="outline">
              <BubbleContent>
                I added a <code>fees:interest</code> account and a daily accrual
                transaction.
              </BubbleContent>
            </Bubble>
            <Bubble variant="outline">
              <BubbleContent>
                The accrual posts from <code>world</code>, so review the funding
                source before you apply it.
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}
