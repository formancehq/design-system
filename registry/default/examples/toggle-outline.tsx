'use client';

import { Bold } from 'lucide-react';

import { Toggle } from '@/registry/default/ui/toggle';

export default function ToggleOutline() {
  return (
    <Toggle variant="outline" aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  );
}
