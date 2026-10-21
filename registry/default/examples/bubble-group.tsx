import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from '@/registry/default/ui/bubble';

export default function BubbleGroupExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>Which transaction failed?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent>The payout to the omnibus account.</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>It worked yesterday on the same ledger.</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Find the cause and fix the Numscript.</BubbleContent>
          <BubbleReactions role="img" aria-label="Reaction: eyes" align="start">
            <span>👀</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <Bubble variant="muted">
        <BubbleContent>
          The source account has no overdraft, and its balance is 120 USD/2
          short. Do you want me to add a bounded overdraft?
        </BubbleContent>
      </Bubble>
    </div>
  );
}
