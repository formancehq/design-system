'use client';

import { Combobox } from '@/registry/default/ui/combobox';

const ledgers = [
  { label: 'Main Ledger', value: 'main-ledger' },
  { label: 'Test Ledger', value: 'test-ledger' },
  { label: 'Sandbox', value: 'sandbox' },
  { label: 'Production', value: 'production' },
];

export default function ComboboxDemo() {
  return (
    <Combobox
      groups={ledgers}
      label="Select ledger"
      placeholder="Search ledgers..."
    />
  );
}
