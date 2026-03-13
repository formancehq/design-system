'use client';

import { Mail } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonOutline() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline">Outline</Button>
      <Button variant="outline" loading>
        Loading
      </Button>
      <Button variant="outline">
        <Mail className="mr-2 h-4 w-4" />
        With Icon
      </Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
    </div>
  );
}
