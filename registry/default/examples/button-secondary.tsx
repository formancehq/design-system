'use client';

import { Mail } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonSecondary() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary" loading>
        Loading
      </Button>
      <Button variant="secondary">
        <Mail className="mr-2 h-4 w-4" />
        With Icon
      </Button>
      <Button variant="secondary" disabled>
        Disabled
      </Button>
    </div>
  );
}
