import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeMethodVariants = cva(
  'items-center flex whitespace-nowrap w-fit border border-transparent rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase tracking-wide',
  {
    variants: {
      method: {
        GET: 'bg-cobalt-500 text-emerald-100',
        POST: 'bg-mint-500 text-mint-900',
        PUT: 'bg-lilac-400 text-lilac-800',
        PATCH: 'bg-gold-500 text-emerald-100',
        DELETE: 'bg-red-background text-red-foreground',
        HEAD: 'bg-cobalt-700 text-emerald-100',
        OPTIONS: 'bg-emerald-300 text-emerald-800',
      },
      size: {
        sm: 'h-5 px-1.5 gap-1 text-[10px]/none',
        md: 'h-6 px-2.5 gap-2 text-xs/none',
        lg: 'h-7 px-3 gap-2 text-sm/none',
      },
    },
    defaultVariants: {
      method: 'GET',
      size: 'md',
    },
  }
);

export type TBadgeMethodProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeMethodVariants>;

function BadgeMethod({ className, method, size, ...props }: TBadgeMethodProps) {
  return (
    <span
      data-slot="badge-method"
      className={cn(badgeMethodVariants({ method, size }), className)}
      {...props}
    >
      {method}
    </span>
  );
}

export { BadgeMethod, badgeMethodVariants };
