'use client';

import { KeyValueInput } from '@/registry/default/fragments/key-value-input';

export default function KeyValueInputDisabled() {
  return (
    <div className="w-full max-w-lg">
      <KeyValueInput
        disabled
        defaultValue={[
          { id: '1', key: 'locked', value: 'true' },
          { id: '2', key: 'reason', value: 'read-only' },
        ]}
      />
    </div>
  );
}
