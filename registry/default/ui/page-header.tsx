'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, useContext, type ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { Breadcrumb } from '@/registry/default/ui/breadcrumb'
import { Eyebrow } from '@/registry/default/ui/eyebrow'
import { PageContainer } from '@/registry/default/ui/page-container'

// ============================================================================
// Variants
// ============================================================================

const pageHeaderVariants = cva(['flex flex-col gap-4 w-full'], {
  variants: {
    size: {
      default: 'py-8',
      small: 'py-8',
      large: 'py-8',
      full: 'py-4',
    },
    background: {
      true: 'bg-sidebar',
      false: '',
    },
    border: {
      true: 'border-b',
      false: '',
    },
  },
  defaultVariants: {
    size: 'default',
    background: false,
    border: false,
  },
})

// ============================================================================
// Context
// ============================================================================

type TPageHeaderSize = 'default' | 'small' | 'large' | 'full'

const PageHeaderContext = createContext<{ size: TPageHeaderSize }>({
  size: 'default',
})

const usePageHeaderContext = () => useContext(PageHeaderContext)

// ============================================================================
// Root
// ============================================================================

type TPageHeaderProps = ComponentProps<'div'> & VariantProps<typeof pageHeaderVariants>

function PageHeaderRoot({ className, size, background, border, children, ...props }: TPageHeaderProps) {
  const contextSize: TPageHeaderSize = size ?? 'default'
  return (
    <PageHeaderContext.Provider value={{ size: contextSize }}>
      <div
        data-slot="page-header"
        data-size={contextSize}
        className={cn(pageHeaderVariants({ size: contextSize, background, border }), className)}
        {...props}
      >
        {children}
      </div>
    </PageHeaderContext.Provider>
  )
}

// ============================================================================
// Breadcrumb
// ============================================================================

type TPageHeaderBreadcrumbProps = ComponentProps<typeof Breadcrumb>

function PageHeaderBreadcrumb({ className, children, ...props }: TPageHeaderBreadcrumbProps) {
  const { size } = usePageHeaderContext()
  return (
    <PageContainer size={size}>
      <Breadcrumb
        data-slot="page-header-breadcrumb"
        className={cn('flex items-center gap-4 [&_li]:text-xs', className)}
        {...props}
      >
        {children}
      </Breadcrumb>
    </PageContainer>
  )
}

// ============================================================================
// Icon
// ============================================================================

type TPageHeaderIconProps = ComponentProps<'div'>

function PageHeaderIcon({ className, ...props }: TPageHeaderIconProps) {
  return (
    <div
      data-slot="page-header-icon"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  )
}

// ============================================================================
// Summary
// ============================================================================

type TPageHeaderSummaryProps = ComponentProps<'div'>

function PageHeaderSummary({ className, children, ...props }: TPageHeaderSummaryProps) {
  return (
    <div
      data-slot="page-header-summary"
      className={cn('flex flex-col', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Eyebrow
// ============================================================================

type TPageHeaderEyebrowProps = ComponentProps<typeof Eyebrow>

function PageHeaderEyebrow({ variant = 'gold', withSquare = false, ...props }: TPageHeaderEyebrowProps) {
  return (
    <Eyebrow
      data-slot="page-header-eyebrow"
      variant={variant}
      withSquare={withSquare}
      {...props}
    />
  )
}

// ============================================================================
// Title
// ============================================================================

type TPageHeaderTitleProps = ComponentProps<'h1'>

function PageHeaderTitle({ className, children, ...props }: TPageHeaderTitleProps) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn('text-3xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h1>
  )
}

// ============================================================================
// Description
// ============================================================================

type TPageHeaderDescriptionProps = ComponentProps<'p'>

function PageHeaderDescription({ className, children, ...props }: TPageHeaderDescriptionProps) {
  return (
    <p
      data-slot="page-header-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

// ============================================================================
// Meta
// ============================================================================

type TPageHeaderMetaProps = ComponentProps<'div'>

function PageHeaderMeta({ className, children, ...props }: TPageHeaderMetaProps) {
  const { size } = usePageHeaderContext()
  return (
    <PageContainer size={size}>
      <div
        data-slot="page-header-meta"
        className={cn(
          'flex flex-col @xl:flex-row @xl:justify-between @xl:items-center gap-4',
          '*:data-[slot="page-header-icon"]:shrink-0',
          '*:data-[slot="page-header-summary"]:flex-1',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </PageContainer>
  )
}

// ============================================================================
// Aside (actions)
// ============================================================================

type TPageHeaderAsideProps = ComponentProps<'div'>

function PageHeaderAside({ className, ...props }: TPageHeaderAsideProps) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn('flex items-center gap-2 shrink-0', className)}
      {...props}
    />
  )
}

// ============================================================================
// Exports
// ============================================================================

const PageHeader = PageHeaderRoot

export {
  PageHeader,
  PageHeaderAside,
  PageHeaderBreadcrumb,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderIcon,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
  type TPageHeaderProps,
  type TPageHeaderBreadcrumbProps,
  type TPageHeaderEyebrowProps,
  type TPageHeaderIconProps,
  type TPageHeaderSummaryProps,
  type TPageHeaderTitleProps,
  type TPageHeaderDescriptionProps,
  type TPageHeaderMetaProps,
  type TPageHeaderAsideProps,
}
