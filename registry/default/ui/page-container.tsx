import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

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
})

type TPageContainerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageContainerVariants>

const PageContainer = forwardRef<HTMLDivElement, TPageContainerProps>(
  ({ className, size, ...props }, ref) => {
    return <div ref={ref} {...props} className={cn(pageContainerVariants({ size }), className)} />
  },
)

PageContainer.displayName = 'PageContainer'

export { PageContainer, pageContainerVariants, type TPageContainerProps }
