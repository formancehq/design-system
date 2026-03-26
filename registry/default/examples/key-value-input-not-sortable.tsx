'use client';

import { KeyValueInput } from '@/registry/default/fragments/key-value-input';

export default function KeyValueInputNotSortable() {
  return (
    <div className="w-full max-w-lg">
      <KeyValueInput
        sortable={false}
        defaultValue={[
          { id: '1', key: 'name', value: 'John' },
          { id: '2', key: 'email', value: 'john@example.com' },
        ]}
      />
    </div>
  );
}
