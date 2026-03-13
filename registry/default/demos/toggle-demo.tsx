'use client';

import { Bold, Italic, Underline } from 'lucide-react';

import { Toggle } from '@/registry/default/ui/toggle';

export default function ToggleDemo() {
  return (
    <div className="flex gap-1">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle outline">
        <Bold className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
