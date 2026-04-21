'use client';

import { useState } from 'react';
import {
  KeyValueInput,
  type TKeyValuePair,
} from '@/registry/default/fragments/key-value-input';

export default function KeyValueInputDemo() {
  const [pairs, setPairs] = useState<TKeyValuePair[]>([
    { id: '1', key: 'environment', value: 'production' },
    { id: '2', key: 'region', value: 'eu-west-1' },
    { id: '3', key: '', value: '' },
  ]);

  return (
    <div className="w-full max-w-lg">
      <KeyValueInput value={pairs} onValueChange={setPairs} showJson />
    </div>
  );
}
