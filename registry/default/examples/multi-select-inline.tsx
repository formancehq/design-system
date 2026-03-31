'use client';

import { useState } from 'react';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectInput,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectInline() {
  const [values, setValues] = useState(['ledgers']);

  return (
    <MultiSelect mode="inline" values={values} onValuesChange={setValues}>
      <MultiSelectTrigger className="w-[320px] flex-wrap">
        <MultiSelectValue
          placeholder="Select services..."
          overflowBehavior="wrap"
          clickToRemove
        />
        <MultiSelectInput placeholder="Search..." />
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
  );
}
