'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';

export function CollapsibleCode({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        <div className={cn('overflow-hidden', !open && 'max-h-32')}>
          {children}
        </div>
        {!open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full gap-1"
        onClick={() => setOpen(!open)}
      >
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        {open ? 'Hide code' : 'Show code'}
      </Button>
    </div>
  );
}
