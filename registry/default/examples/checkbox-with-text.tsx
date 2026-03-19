'use client';

import { Checkbox } from '@/registry/default/ui/checkbox';
import { Label } from '@/registry/default/ui/label';

export default function CheckboxWithTextExample() {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="terms">Accept ledger terms of service</Label>
        <p className="text-sm text-muted-foreground">
          You agree to the Formance Ledger terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}
