import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const statusDotVariants = cva('inline-block size-2.5 shrink-0 rounded-full', {
  variants: {
    variant: {
      valid: 'bg-[oklch(59.6%_0.145_163.225)]',
      destructive: 'bg-red-500',
      info: 'bg-sky-500',
      warning: 'bg-amber-500',
      zinc: 'bg-zinc-300 dark:bg-zinc-700',
      outline: 'bg-foreground',
    },
  },
  defaultVariants: {
    variant: 'zinc',
  },
});

export type TStatusDotProps = ComponentProps<'span'> &
  VariantProps<typeof statusDotVariants>;

export const StatusDot = ({
  className,
  variant = 'zinc',
  children,
  ...props
}: TStatusDotProps) => (
  <span
    data-slot="status-dot"
    data-variant={variant}
    className={cn(
      'inline-flex items-center gap-2 text-sm leading-4',
      className
    )}
    {...props}
  >
    <span aria-hidden className={statusDotVariants({ variant })} />
    {children}
  </span>
);
