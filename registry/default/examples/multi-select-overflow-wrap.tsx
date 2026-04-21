'use client';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectOverflowWrap() {
  return (
    <MultiSelect
      defaultValues={['ledgers', 'payments', 'wallets', 'webhooks', 'auth']}
    >
      <MultiSelectTrigger className="w-[280px]">
        <MultiSelectValue
          placeholder="Select services..."
          overflowBehavior="wrap"
        />
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
