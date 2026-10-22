import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from '@/registry/default/ui/bubble';
import { Markdown } from '@/registry/default/ui-fragments/markdown';

const ghostAnswer = `Ghost bubbles fit assistant text, **Markdown**, and other content that needs no frame.

They take the full width of the conversation, so a long answer about \`clients:$id:available\` stays readable.`;

export default function BubbleVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble>
        <BubbleContent>Default bubble, for the current user.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>Secondary bubble, for neutral content.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Muted bubble. It uses a lower emphasis color for quiet content.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: thumbs up">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted" align="end">
        <BubbleContent>
          Tinted bubble. The tint comes from the primary color.
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Outline bubble, for secondary content.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="end">
        <BubbleContent>Destructive bubble, with a reaction.</BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: fire">
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          <Markdown>{ghostAnswer}</Markdown>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
