'use client';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectGroups() {
  return (
    <MultiSelect>
      <MultiSelectTrigger className="w-[320px]">
        <MultiSelectValue placeholder="Select connectors..." />
      </MultiSelectTrigger>
      <MultiSelectContent search={{ placeholder: 'Search connectors...' }}>
        <MultiSelectGroup heading="Payment Processors">
          <MultiSelectItem value="stripe">Stripe</MultiSelectItem>
          <MultiSelectItem value="adyen">Adyen</MultiSelectItem>
          <MultiSelectItem value="mangopay">Mangopay</MultiSelectItem>
        </MultiSelectGroup>
        <MultiSelectSeparator />
        <MultiSelectGroup heading="Banking">
          <MultiSelectItem value="modulr">Modulr</MultiSelectItem>
          <MultiSelectItem value="banking-circle">
            Banking Circle
          </MultiSelectItem>
          <MultiSelectItem value="wise">Wise</MultiSelectItem>
        </MultiSelectGroup>
        <MultiSelectSeparator />
        <MultiSelectGroup heading="Crypto">
          <MultiSelectItem value="coinbase" disabled>
            Coinbase (coming soon)
          </MultiSelectItem>
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
