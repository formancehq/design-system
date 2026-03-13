import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const eyebrowVariants = cva(
  'pointer-events-none inline-flex font-mono font-bold uppercase w-fit shrink-0 items-center justify-center rounded-md text-xs whitespace-nowrap border-transparent',
  {
    variants: {
      variant: {
        primary: 'text-foreground',
        secondary: 'text-primary/80 dark:text-primary-foreground/80',
        gold: 'dark:text-gold-300 text-gold-500',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const eyebrowSquareVariants = cva(
  'w-2 h-2 bg-gold-500 rounded-sm mr-1 inline-block',
  {
    variants: {
      variant: {
        primary: 'bg-foreground',
        secondary: 'bg-secondary',
        gold: 'bg-gold-500 dark:bg-gold-300',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

type TEyebrowProps = React.ComponentProps<'span'> &
  VariantProps<typeof eyebrowVariants> & {
    asChild?: boolean;
    withSquare?: boolean;
  };

function Eyebrow({
  className,
  variant,
  size,
  asChild = false,
  withSquare = true,
  ...props
}: TEyebrowProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span';

  return (
    <Comp
      data-slot="eyebrow"
      className={cn(
        eyebrowVariants({ variant, size }),
        className
      )}
      {...props}
    >
      {withSquare && (
        <span className={cn(eyebrowSquareVariants({ variant }))} />
      )}
      {props.children}
    </Comp>
  );
}

export { Eyebrow, eyebrowVariants, type TEyebrowProps };
