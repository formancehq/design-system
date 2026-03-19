'use client';

import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';

export default function InputWithLabelExample() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="wallet-id">Wallet ID</Label>
      <Input id="wallet-id" placeholder="wallet_xxx" />
    </div>
  );
}
