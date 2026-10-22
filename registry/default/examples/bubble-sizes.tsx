import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';

export default function BubbleSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8 py-12">
      <Bubble>
        <BubbleContent>The schema is valid.</BubbleContent>
      </Bubble>
      <Bubble>
        <BubbleContent>
          The accrual posts from treasury:interest once a day. It fails when the
          treasury account has no funds, instead of creating money from world.
        </BubbleContent>
      </Bubble>
      <Bubble>
        <BubbleContent>
          <p>Schema v2 is in the sandbox ledger.</p>
          <p>
            It adds 14 accounts and 6 transactions. New transactions use the
            interest accrual.
          </p>
          <p>Deploy it to staging when the checks pass.</p>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
