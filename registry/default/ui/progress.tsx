'use client';

import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'bg-primary h-full w-full flex-1 transition-transform',
          'data-[state=indeterminate]:w-1/3 data-[state=indeterminate]:animate-progress-indeterminate',
          'motion-reduce:data-[state=indeterminate]:animate-pulse motion-reduce:data-[state=indeterminate]:translate-x-full'
        )}
        style={
          value == null
            ? undefined
            : { transform: `translateX(-${100 - value}%)` }
        }
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
