'use client';

import { BookOpenIcon, CreditCardIcon, WalletIcon } from 'lucide-react';

import {
  RadioGroupCard,
  RadioGroupCardItem,
} from '@/registry/default/ui/radio-group-card';

export default function RadioGroupCardWithChildren() {
  return (
    <RadioGroupCard defaultValue="ledger" className="flex flex-wrap gap-3">
      <RadioGroupCardItem value="ledger" label="Ledger">
        <div className="flex items-center justify-center rounded bg-muted p-4">
          <BookOpenIcon className="size-8 text-muted-foreground" />
        </div>
      </RadioGroupCardItem>
      <RadioGroupCardItem value="payments" label="Payments">
        <div className="flex items-center justify-center rounded bg-muted p-4">
          <CreditCardIcon className="size-8 text-muted-foreground" />
        </div>
      </RadioGroupCardItem>
      <RadioGroupCardItem value="wallets" label="Wallets">
        <div className="flex items-center justify-center rounded bg-muted p-4">
          <WalletIcon className="size-8 text-muted-foreground" />
        </div>
      </RadioGroupCardItem>
    </RadioGroupCard>
  );
}
