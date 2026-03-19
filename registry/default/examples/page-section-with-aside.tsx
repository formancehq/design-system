import { Button } from '@/registry/default/ui/button'
import { Card, CardContent } from '@/registry/default/ui/card'
import { PageSection, PageSectionAside, PageSectionContent, PageSectionDescription, PageSectionMeta, PageSectionSummary, PageSectionTitle } from '@/registry/default/ui/page-section'

export default function PageSectionWithAside() {
	return (
		<div className='w-full'>
			<PageSection>
				<PageSectionMeta>
					<PageSectionSummary>
						<PageSectionTitle>Authentication</PageSectionTitle>
						<PageSectionDescription>Configure authentication providers and session settings.</PageSectionDescription>
					</PageSectionSummary>
					<PageSectionAside>
						<Button variant='outline' size='sm'>
							Documentation
						</Button>
						<Button size='sm'>Save changes</Button>
					</PageSectionAside>
				</PageSectionMeta>
				<PageSectionContent>
					<Card>
						<CardContent className='p-6'>
							<p className='text-sm text-muted-foreground'>The Aside positions actions horizontally aligned with the section summary.</p>
						</CardContent>
					</Card>
				</PageSectionContent>
			</PageSection>
		</div>
	)
}
