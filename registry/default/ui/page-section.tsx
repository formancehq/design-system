import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// Variants
// ============================================================================

const pageSectionRootVariants = cva(['pt-12 last:pb-12 gap-6'], {
  variants: {
    orientation: {
      horizontal: 'grid md:grid-cols-[1fr_2fr] md:gap-12',
      vertical: 'flex flex-col',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

// ============================================================================
// Root
// ============================================================================

type TPageSectionProps = ComponentProps<'div'> &
  VariantProps<typeof pageSectionRootVariants>;

function PageSectionRoot({
  className,
  orientation = 'vertical',
  children,
  ...props
}: TPageSectionProps) {
  return (
    <div
      data-slot="page-section"
      data-orientation={orientation}
      className={cn(pageSectionRootVariants({ orientation }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Meta
// ============================================================================

type TPageSectionMetaProps = ComponentProps<'div'>;

function PageSectionMeta({
  className,
  children,
  ...props
}: TPageSectionMetaProps) {
  return (
    <div className="@container">
      <div
        data-slot="page-section-meta"
        className={cn(
          'flex flex-col @xl:flex-row @xl:justify-between @xl:items-center gap-4',
          '[&>[data-slot="page-section-summary"]]:flex-1',
          '[&>[data-slot="page-section-summary"]]:@xl:self-center',
          '[&>[data-slot="page-section-aside"]]:shrink-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Summary
// ============================================================================

type TPageSectionSummaryProps = ComponentProps<'div'>;

function PageSectionSummary({
  className,
  children,
  ...props
}: TPageSectionSummaryProps) {
  return (
    <div
      data-slot="page-section-summary"
      className={cn('flex flex-col gap-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Title
// ============================================================================

type TPageSectionTitleProps = ComponentProps<'h2'>;

function PageSectionTitle({
  className,
  children,
  ...props
}: TPageSectionTitleProps) {
  return (
    <h2
      data-slot="page-section-title"
      className={cn('text-lg font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

// ============================================================================
// Description
// ============================================================================

type TPageSectionDescriptionProps = ComponentProps<'p'>;

function PageSectionDescription({
  className,
  children,
  ...props
}: TPageSectionDescriptionProps) {
  return (
    <p
      data-slot="page-section-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
}

// ============================================================================
// Aside
// ============================================================================

type TPageSectionAsideProps = ComponentProps<'div'>;

function PageSectionAside({ className, ...props }: TPageSectionAsideProps) {
  return (
    <div
      data-slot="page-section-aside"
      className={cn('flex items-center gap-2 @xl:self-end', className)}
      {...props}
    />
  );
}

// ============================================================================
// Content
// ============================================================================

type TPageSectionContentProps = ComponentProps<'div'>;

function PageSectionContent({ className, ...props }: TPageSectionContentProps) {
  return (
    <div
      data-slot="page-section-content"
      className={cn(className)}
      {...props}
    />
  );
}

// ============================================================================
// Exports
// ============================================================================

const PageSection = PageSectionRoot;

export {
  PageSection,
  PageSectionAside,
  PageSectionContent,
  PageSectionDescription,
  PageSectionMeta,
  PageSectionSummary,
  PageSectionTitle,
  type TPageSectionProps,
  type TPageSectionMetaProps,
  type TPageSectionSummaryProps,
  type TPageSectionTitleProps,
  type TPageSectionDescriptionProps,
  type TPageSectionAsideProps,
  type TPageSectionContentProps,
};
