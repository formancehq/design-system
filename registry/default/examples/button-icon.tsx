'use client';

import { ChevronRight } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="icon-sm">
        <ChevronRight />
      </Button>
      <Button variant="outline" size="icon-md">
        <ChevronRight />
      </Button>
      <Button variant="outline" size="icon-lg">
        <ChevronRight />
      </Button>
      <Button variant="outline" size="icon-xl">
        <ChevronRight />
      </Button>
    </div>
  );
}
