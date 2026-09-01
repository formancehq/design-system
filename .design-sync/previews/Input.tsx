import { Button, Input, Label } from '@formance/design-system';

export function WithLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="wallet-id">Wallet ID</Label>
      <Input id="wallet-id" placeholder="wallet_xxx" />
    </div>
  );
}

export function States() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Input placeholder="you@formance.com" />
      <Input defaultValue="sandbox-eu-west" />
      <Input placeholder="Disabled input" disabled />
      <Input aria-invalid placeholder="Required" />
    </div>
  );
}

export function WithButton() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input placeholder="Search transactions..." />
      <Button type="submit">Search</Button>
    </div>
  );
}
