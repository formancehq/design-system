'use client';

import { Label } from '@/registry/default/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/radio-group';

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="ledger">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="ledger" id="ledger" />
        <Label htmlFor="ledger">Ledger</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="payments" id="payments" />
        <Label htmlFor="payments">Payments</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="wallets" id="wallets" />
        <Label htmlFor="wallets">Wallets</Label>
      </div>
    </RadioGroup>
  );
}
