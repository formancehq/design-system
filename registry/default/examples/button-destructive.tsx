'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonDestructive() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="destructive">Destructive</Button>
      <Button variant="destructive" loading>
        Loading
      </Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
      <Button variant="destructive" disabled>
        Disabled
      </Button>
    </div>
  );
}
