'use client';

import { useState } from 'react';
import {
  KeyValueInput,
  type TKeyValuePair,
} from '@/registry/default/fragments/key-value-input';
import { Label } from '@/registry/default/ui/label';

export default function KeyValueInputMetadata() {
  const [pairs, setPairs] = useState<TKeyValuePair[]>([
    { id: '1', key: 'ledger.name', value: 'main' },
    { id: '2', key: 'ledger.created_by', value: 'admin' },
    { id: '3', key: '', value: '' },
  ]);

  return (
    <div className="w-full max-w-lg space-y-2">
      <Label>Metadata</Label>
      <KeyValueInput
        value={pairs}
        onValueChange={setPairs}
        keyPlaceholder="Metadata key"
        valuePlaceholder="Metadata value"
        addLabel="Add metadata"
        showJson
      />
    </div>
  );
}
