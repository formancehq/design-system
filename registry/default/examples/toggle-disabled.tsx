'use client';

import { Underline } from 'lucide-react';

import { Toggle } from '@/registry/default/ui/toggle';

export default function ToggleDisabled() {
  return (
    <Toggle disabled aria-label="Toggle underline">
      <Underline className="h-4 w-4" />
    </Toggle>
  );
}
