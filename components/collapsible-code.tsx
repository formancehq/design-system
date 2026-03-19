'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export function CollapsibleCode({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full overflow-hidden">
      {open && <div>{children}</div>}
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-center gap-1 py-2 text-xs font-mono uppercase text-muted-foreground hover:text-foreground transition-colors',
          open && 'border-t',
        )}
        onClick={() => setOpen(!open)}
      >
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        {open ? 'Hide code' : 'View code'}
      </button>
    </div>
  );
}
