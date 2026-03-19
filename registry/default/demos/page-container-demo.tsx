import { PageContainer } from '@/registry/default/ui/page-container'

export default function PageContainerDemo() {
  return (
    <div className="w-full space-y-4">
      <PageContainer size="small" className="rounded-lg border bg-muted/40 p-6">
        <p className="text-sm text-muted-foreground">Small (max-w-[768px])</p>
      </PageContainer>
      <PageContainer size="default" className="rounded-lg border bg-muted/40 p-6">
        <p className="text-sm text-muted-foreground">Default (max-w-[1200px])</p>
      </PageContainer>
      <PageContainer size="large" className="rounded-lg border bg-muted/40 p-6">
        <p className="text-sm text-muted-foreground">Large (max-w-[1600px])</p>
      </PageContainer>
      <PageContainer size="full" className="rounded-lg border bg-muted/40 p-6">
        <p className="text-sm text-muted-foreground">Full (no max-width)</p>
      </PageContainer>
    </div>
  )
}
