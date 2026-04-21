'use client';

import { Button } from '@/registry/default/ui/button';
import { Textarea } from '@/registry/default/ui/textarea';

export default function TextareaWithButtonExample() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Textarea placeholder="Describe the payment workflow..." />
      <Button>Submit Workflow</Button>
    </div>
  );
}
