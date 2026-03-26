'use client';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

const SERVICES = [
  { value: 'ledgers', label: 'Ledgers' },
  { value: 'payments', label: 'Payments' },
  { value: 'wallets', label: 'Wallets' },
  { value: 'webhooks', label: 'Webhooks' },
  { value: 'auth', label: 'Auth' },
  { value: 'flows', label: 'Flows', disabled: true },
];

export default function MultiSelectDemo() {
  return (
    <MultiSelect defaultValues={['ledgers']}>
      <MultiSelectTrigger className="w-[280px]">
        <MultiSelectValue placeholder="Select services..." />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {SERVICES.map(({ value, label, disabled }) => (
            <MultiSelectItem key={value} value={value} disabled={disabled}>
              {label}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
