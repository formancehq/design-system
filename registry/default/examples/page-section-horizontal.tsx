import {
  PageSection,
  PageSectionContent,
  PageSectionDescription,
  PageSectionMeta,
  PageSectionSummary,
  PageSectionTitle,
} from '@/registry/default/ui/page-section'
import { Card, CardContent } from '@/registry/default/ui/card'

export default function PageSectionHorizontal() {
  return (
    <div className="w-full">
      <PageSection orientation="horizontal">
        <PageSectionMeta>
          <PageSectionSummary>
            <PageSectionTitle>Danger Zone</PageSectionTitle>
            <PageSectionDescription>
              Irreversible and destructive actions. The summary appears on the
              left, with content on the right on larger screens.
            </PageSectionDescription>
          </PageSectionSummary>
        </PageSectionMeta>
        <PageSectionContent>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                The content area appears alongside the summary in a horizontal
                layout. On smaller screens, it stacks vertically.
              </p>
            </CardContent>
          </Card>
        </PageSectionContent>
      </PageSection>
    </div>
  )
}
