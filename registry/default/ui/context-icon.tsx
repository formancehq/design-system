import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const CONTEXT_TYPES = {
  ORGANIZATION: 'ORGANIZATION',
  STACK: 'STACK',
  APP: 'APP',
} as const;

type TContextType = (typeof CONTEXT_TYPES)[keyof typeof CONTEXT_TYPES];

// The tiles are art, not glyphs: each one is a full-colour octilinear pattern on
// its own background, so it is served as a file rather than inlined as
// `currentColor` paths. `xs` is the size that fits a line of text — a menu row,
// a table cell; the larger steps are for cards and headers.
// `md+` and `lg+` are half-steps inside the ramp rather than extensions of it.
// The named sizes are already published, so shifting `lg` or `xl` to make room
// would silently resize every existing caller — a new name is the only additive
// way to reach 28px and 40px.
const contextIconVariants = cva('shrink-0 object-contain', {
  variants: {
    size: {
      xs: 'size-4',
      sm: 'size-5',
      md: 'size-6',
      'md+': 'size-7',
      lg: 'size-8',
      'lg+': 'size-10',
      xl: 'size-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type TContextIconProps = Omit<React.ComponentProps<'img'>, 'src'> &
  VariantProps<typeof contextIconVariants> & {
    type: TContextType;
  };

// `alt` defaults to empty because the tile almost always sits beside the name it
// stands for, and announcing it twice is noise. It stays overridable for the
// cases where the tile is the only thing identifying the row.
function ContextIcon({
  type,
  size,
  className,
  alt = '',
  ...props
}: TContextIconProps) {
  const slug = type.toLowerCase();

  return (
    <img
      data-slot="context-icon"
      src={`/icons/${slug}.svg`}
      alt={alt}
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
