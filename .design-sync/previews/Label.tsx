import { Input, Label } from '@formance/design-system';

export function FieldLabel() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="ledger-name">Ledger name</Label>
      <Input id="ledger-name" placeholder="main" />
    </div>
  );
}

export function Disabled() {
  // The DS dims the label off the peer input's disabled state, so the label
  // must follow the input in the DOM for `peer-disabled:` to apply.
  return (
    <div className="w-full max-w-sm">
      <Input id="region" className="peer" defaultValue="eu-west-1" disabled />
      <Label htmlFor="region" className="mt-2">
        Region (locked to your stack)
      </Label>
    </div>
  );
}
