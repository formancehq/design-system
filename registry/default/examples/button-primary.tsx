'use client';

import { Mail } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonPrimary() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="primary" loading>
        Loading
      </Button>
      <Button variant="primary">
        <Mail className="mr-2 h-4 w-4" />
        With Icon
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  );
}
