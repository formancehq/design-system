'use client';

import { Sparkles } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonWrap() {
  return (
    <div className="flex w-full max-w-[390px] flex-col items-start gap-2">
      <Button variant="outline" size="sm" caseSensitive wrap>
        Add a fee account that collects 1% of each payment to the merchant
      </Button>
      <Button variant="outline" caseSensitive wrap>
        <Sparkles className="mr-2 h-4 w-4" />
        Split each payout between the merchant and the platform wallet
      </Button>
      <Button size="lg" wrap>
        Create the ledger and import the opening balances
      </Button>
    </div>
  );
}
