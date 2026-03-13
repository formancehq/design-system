import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeEyebrowVariants = cva(
  'pointer-events-none inline-flex font-medium w-fit shrink-0 items-center justify-center rounded-md border px-3 py-1.5 font-mono text-xs tracking-widest whitespace-nowrap uppercase border-transparent',
  {
    variants: {
      variant: {
        emerald: 'bg-emerald-600 text-emerald-200',
        lilac: 'bg-lilac-400 text-lilac-800',
        secondary: 'bg-secondary text-secondary-foreground',
        gold: 'bg-gold-500 text-emerald-100',
        cobalt:
          'bg-cobalt-500 text-emerald-50 dark:bg-cobalt-800 dark:text-emerald-50',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border-border text-foreground',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'emerald',
      size: 'md',
    },
  }
);

type TBadgeEyeBrowProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeEyebrowVariants> & { asChild?: boolean };

function BadgeEyebrow({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: TBadgeEyeBrowProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span';

  return (
    <Comp
      data-slot="badge-eyebrow"
      className={cn(badgeEyebrowVariants({ variant, size }), className)}
      {...props}
    >
      _{props.children}
    </Comp>
  );
}

export { BadgeEyebrow, badgeEyebrowVariants };
