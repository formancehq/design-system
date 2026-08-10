import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const CONTEXT_TYPES = {
  ORGANIZATION: 'ORGANIZATION',
  STACK: 'STACK',
} as const;

type TContextType = (typeof CONTEXT_TYPES)[keyof typeof CONTEXT_TYPES];

// The tiles are art, not glyphs: each one is a full-colour octilinear pattern on
// its own background, so it is served as a file rather than inlined as
// `currentColor` paths. `xs` is the size that fits a line of text — a menu row,
// a table cell; the larger steps are for cards and headers.
const contextIconVariants = cva('shrink-0 object-contain', {
  variants: {
    size: {
      xs: 'size-4',
      sm: 'size-5',
      md: 'size-6',
      lg: 'size-8',
      xl: 'size-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type TContextIconProps = Omit<React.ComponentProps<'img'>, 'src' | 'alt'> &
  VariantProps<typeof contextIconVariants> & {
    type: TContextType;
  };

function ContextIcon({ type, size, className, ...props }: TContextIconProps) {
  const slug = type.toLowerCase();

  return (
    <img
      data-slot="context-icon"
      src={`/icons/${slug}.svg`}
      alt=""
      loading="lazy"
      className={cn(contextIconVariants({ size }), className)}
      {...props}
    />
  );
}

export {
  ContextIcon,
  contextIconVariants,
  CONTEXT_TYPES,
  type TContextType,
  type TContextIconProps,
};
