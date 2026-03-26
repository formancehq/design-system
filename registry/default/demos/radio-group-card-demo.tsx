'use client';

import {
  RadioGroupCard,
  RadioGroupCardItem,
} from '@/registry/default/ui/radio-group-card';

export default function RadioGroupCardDemo() {
  return (
    <RadioGroupCard defaultValue="ledger" className="flex flex-wrap gap-3">
      <RadioGroupCardItem value="ledger" id="r1" label="Ledger" />
      <RadioGroupCardItem value="payments" id="r2" label="Payments" />
      <RadioGroupCardItem value="wallets" id="r3" label="Wallets" />
    </RadioGroupCard>
  );
}
