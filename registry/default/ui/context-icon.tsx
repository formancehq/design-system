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
// `currentColor` paths.
//
// Most tiles sit beside a control — a picker's chevron, a card's action — so the
// ramp is named after `buttonVariants`' icon sizes and every step is identical
// to the button of the same name. `size="icon-sm"` next to `size="icon-sm"` lines
// up by construction rather than by someone matching numbers, which is what the
// old `md+` half-step existed to patch.
//
// `xs` and `xl` are the two steps no button has: `xs` matches the 16px lucide
// glyphs it shares a left edge with in a menu row or a table cell, and `xl` is
// the page header's art, which answers to a heading rather than to a control.
const contextIconVariants = cva('shrink-0 object-contain', {
  variants: {
    size: {
      xs: 'size-4',
      'icon-xs': 'size-5',
      'icon-sm': 'size-7',
      'icon-md': 'size-8',
      'icon-lg': 'size-9',
      xl: 'size-12',
    },
  },
  defaultVariants: {
    size: 'icon-md',
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
