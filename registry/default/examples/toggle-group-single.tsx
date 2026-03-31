'use client';

import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/registry/default/ui/toggle-group';

export default function ToggleGroupSingle() {
  return (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
