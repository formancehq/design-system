'use client';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectNoSearch() {
  return (
    <MultiSelect>
      <MultiSelectTrigger className="w-[280px]">
        <MultiSelectValue placeholder="Select environment..." />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        <MultiSelectGroup>
          <MultiSelectItem value="production">Production</MultiSelectItem>
          <MultiSelectItem value="staging">Staging</MultiSelectItem>
          <MultiSelectItem value="development">Development</MultiSelectItem>
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
