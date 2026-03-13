'use client';

import { Input } from '@/registry/default/ui/input';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/registry/default/ui/field';

export default function FieldDemo() {
  return (
    <div className="w-full max-w-sm">
      <Field>
        <FieldLabel>Ledger name</FieldLabel>
        <Input placeholder="my-ledger" />
        <FieldDescription>
          A unique identifier for your ledger instance.
        </FieldDescription>
      </Field>
    </div>
  );
}
