'use client';

import { Label } from '@/registry/default/ui/label';
import { Textarea } from '@/registry/default/ui/textarea';

export default function TextareaWithLabelExample() {
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="metadata">Transaction Metadata</Label>
      <Textarea id="metadata" placeholder="Enter JSON metadata for this transaction..." />
    </div>
  );
}
