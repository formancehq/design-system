'use client';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectSearch() {
  return (
    <MultiSelect defaultValues={['eur']}>
      <MultiSelectTrigger className="w-[280px]">
        <MultiSelectValue placeholder="Select currencies..." />
      </MultiSelectTrigger>
      <MultiSelectContent
        search={{ placeholder: 'Search currencies...', emptyMessage: 'No currency found.' }}
      >
        <MultiSelectGroup>
          <MultiSelectItem value="eur">EUR</MultiSelectItem>
          <MultiSelectItem value="usd">USD</MultiSelectItem>
          <MultiSelectItem value="gbp">GBP</MultiSelectItem>
          <MultiSelectItem value="jpy">JPY</MultiSelectItem>
          <MultiSelectItem value="chf">CHF</MultiSelectItem>
          <MultiSelectItem value="cad">CAD</MultiSelectItem>
          <MultiSelectItem value="aud">AUD</MultiSelectItem>
          <MultiSelectItem value="nzd">NZD</MultiSelectItem>
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
