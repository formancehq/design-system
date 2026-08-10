'use client';

import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';

export default function InputFontMono() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mono-name">Ledger name</Label>
        <Input id="mono-name" placeholder="Acme treasury" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mono-address">Account address</Label>
        <Input
          id="mono-address"
          font="mono"
          defaultValue="users:001:wallet:main"
        />
      </div>
    </div>
  );
}
