'use client';

import { Textarea } from '@/registry/default/ui/textarea';

export default function TextareaDisabledExample() {
  return (
    <Textarea
      disabled
      placeholder="Transaction metadata..."
      className="max-w-sm"
    />
  );
}
