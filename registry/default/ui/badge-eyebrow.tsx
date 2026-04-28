import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';

const badgeEyebrowVariants = cva(
  'pointer-events-none inline-flex w-fit shrink-0 items-center justify-center gap-px rounded-[2px] border border-solid px-1.5 py-0.5 font-mono whitespace-nowrap uppercase',
  {
    variants: {
      variant: {
        emerald:
          'bg-emerald-100 border-emerald-600 text-emerald-800 dark:bg-emerald-800 dark:border-emerald-400 dark:text-emerald-50',
        lilac:
          'bg-lilac-300 border-lilac-800 text-lilac-900 dark:bg-lilac-900 dark:border-lilac-500 dark:text-emerald-50',
        gold: 'bg-gold-100 border-gold-700 text-gold-700 dark:bg-gold-900 dark:border-gold-300 dark:text-emerald-100',
        mint: 'bg-mint-300 border-mint-800 text-mint-900 dark:bg-mint-900 dark:border-mint-200 dark:text-mint-200',
        cobalt:
          'bg-cobalt-200 border-cobalt-700 text-cobalt-800 dark:bg-cobalt-900 dark:border-cobalt-200 dark:text-cobalt-200',
      },
    },
    defaultVariants: {
      variant: 'emerald',
    },
  }
);

const decoratorColorMap: Partial<
  Record<
    NonNullable<VariantProps<typeof badgeEyebrowVariants>['variant']>,
    string
  >
> = {
  emerald: 'text-gold-500',
  lilac: 'text-gold-500 dark:text-lilac-500',
  gold: 'dark:text-gold-500',
};

type TBadgeEyebrowProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeEyebrowVariants> & {
    asChild?: boolean;
    prefix?: string;
    suffix?: string;
    showPrefix?: boolean;
    showSuffix?: boolean;
  };

function BadgeEyebrow({
  className,
  variant = 'emerald',
  asChild = false,
  prefix = '_',
  suffix = '/',
  showPrefix = true,
  showSuffix = true,
  children,
  ...props
}: TBadgeEyebrowProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span';
  const decoratorClass = decoratorColorMap[variant ?? 'emerald'];

  return (
    <Comp
      data-slot="badge-eyebrow"
      className={cn(badgeEyebrowVariants({ variant }), className)}
      {...props}
    >
      {showPrefix && (
        <span className={cn('text-xs tracking-none', decoratorClass)}>
          {prefix}
        </span>
      )}
      <span className="text-sm font-medium tracking-wide">{children}</span>
      {showSuffix && (
        <span className={cn('text-xs tracking-none', decoratorClass)}>
          {suffix}
        </span>
      )}
    </Comp>
  );
}

export { BadgeEyebrow, badgeEyebrowVariants };
