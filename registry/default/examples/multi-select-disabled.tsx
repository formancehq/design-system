'use client';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectDisabled() {
  return (
    <MultiSelect defaultValues={['ledgers']} disabled>
      <MultiSelectTrigger className="w-[280px]">
        <MultiSelectValue placeholder="Select services..." />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          <MultiSelectItem value="ledgers">Ledgers</MultiSelectItem>
          <MultiSelectItem value="payments">Payments</MultiSelectItem>
          <MultiSelectItem value="wallets">Wallets</MultiSelectItem>
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
