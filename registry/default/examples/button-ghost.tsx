'use client';

import { Mail } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonGhost() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost" loading>
        Loading
      </Button>
      <Button variant="ghost">
        <Mail className="mr-2 h-4 w-4" />
        With Icon
      </Button>
      <Button variant="ghost" disabled>
        Disabled
      </Button>
    </div>
  );
}
