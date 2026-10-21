import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';

export default function BubbleAlignment() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>
          The schema assistant aligns to the start. This is the default
          alignment.
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          My messages align to the end. Use this for the messages of the user.
        </BubbleContent>
      </Bubble>
    </div>
  );
}
