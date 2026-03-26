'use client';

import { useState } from 'react';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectControlled() {
  const [values, setValues] = useState(['ledgers', 'payments']);

  return (
    <div className="flex flex-col gap-4">
      <MultiSelect values={values} onValuesChange={setValues}>
        <MultiSelectTrigger className="w-[280px]">
          <MultiSelectValue placeholder="Select services..." />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectGroup>
            <MultiSelectItem value="ledgers">Ledgers</MultiSelectItem>
            <MultiSelectItem value="payments">Payments</MultiSelectItem>
            <MultiSelectItem value="wallets">Wallets</MultiSelectItem>
            <MultiSelectItem value="webhooks">Webhooks</MultiSelectItem>
            <MultiSelectItem value="auth">Auth</MultiSelectItem>
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
      <p className="text-sm text-muted-foreground">
        Selected: {values.length > 0 ? values.join(', ') : 'none'}
      </p>
    </div>
  );
}
