'use client';

import { Label } from '@/registry/default/ui/label';
import { Textarea } from '@/registry/default/ui/textarea';

export default function TextareaDemo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  );
}
