'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

export default function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Select a service" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ledger">Ledger</SelectItem>
        <SelectItem value="payments">Payments</SelectItem>
        <SelectItem value="wallets">Wallets</SelectItem>
        <SelectItem value="webhooks">Webhooks</SelectItem>
      </SelectContent>
    </Select>
  );
}
