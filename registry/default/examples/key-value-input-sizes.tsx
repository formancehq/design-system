'use client';

import { KeyValueInput } from '@/components/ui-fragments/key-value-input';
import { Label } from '@/registry/default/ui/label';

export default function KeyValueInputSizes() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Small</Label>
        <KeyValueInput
          size="sm"
          defaultValue={[{ id: '1', key: 'region', value: 'eu-west-1' }]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Medium (default — matches a standard form field)</Label>
        <KeyValueInput
          size="md"
          defaultValue={[{ id: '1', key: 'region', value: 'eu-west-1' }]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Large</Label>
        <KeyValueInput
          size="lg"
          defaultValue={[{ id: '1', key: 'region', value: 'eu-west-1' }]}
        />
      </div>
    </div>
  );
}
