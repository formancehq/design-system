import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const pageContainerVariants = cva(['mx-auto w-full @container px-6 xl:px-10'], {
  variants: {
    size: {
      small: 'max-w-[768px]',
      default: 'max-w-[1200px]',
      large: 'max-w-[1600px]',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type TPageContainerProps = React.ComponentProps<'div'> &
  VariantProps<typeof pageContainerVariants>;

function PageContainer({ className, size, ...props }: TPageContainerProps) {
  return (
    <div
      data-slot="page-container"
      {...props}
      className={cn(pageContainerVariants({ size }), className)}
    />
  );
}

export { PageContainer, pageContainerVariants, type TPageContainerProps };
