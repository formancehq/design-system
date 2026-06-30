'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonOutlineDashed() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outlineDashed">Outline Dashed</Button>
      <Button variant="outlineDashed" loading>
        Loading
      </Button>
      <Button variant="outlineDashed">
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
      <Button variant="outlineDashed" disabled>
        Disabled
      </Button>
    </div>
  );
}
