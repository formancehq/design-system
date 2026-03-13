'use client';

import { Label } from '@/registry/default/ui/label';
import { Input } from '@/registry/default/ui/input';
import { Checkbox } from '@/registry/default/ui/checkbox';

export default function LabelDemo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree" />
        <Label htmlFor="agree">I agree to the terms</Label>
      </div>
    </div>
  );
}
