import { cva } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

// The heading over a group of items: a command group, a select group, a menu
// group, a filter panel section. Sans, not mono: `Eyebrow` is the mono label
// that names a product area, this one names a list of items. It carries no
// padding: the container aligns it with its items.
const sectionLabelVariants = cva(
  'text-muted-foreground font-sans text-xs font-medium tracking-widest uppercase'
);

type TSectionLabelProps = React.ComponentProps<'div'> & {
  asChild?: boolean;
};

function SectionLabel({
  className,
  asChild = false,
  ...props
}: TSectionLabelProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <Comp
      data-slot="section-label"
      className={cn(sectionLabelVariants(), className)}
      {...props}
    />
  );
}

export { SectionLabel, sectionLabelVariants, type TSectionLabelProps };
