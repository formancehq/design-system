import { Button } from '@/registry/default/ui/button'
import { PageSection, PageSectionAside, PageSectionContent, PageSectionDescription, PageSectionMeta, PageSectionSummary, PageSectionTitle } from '@/registry/default/ui/page-section'
import { Card, CardContent } from '../ui/card'

export default function PageSectionDemo() {
	return (
		<div className='w-full space-y-0'>
			<PageSection>
				<PageSectionMeta>
					<PageSectionSummary>
						<PageSectionTitle>General</PageSectionTitle>
						<PageSectionDescription>Basic information about your organization.</PageSectionDescription>
					</PageSectionSummary>
					<PageSectionAside>
						<Button variant='outline' size='sm'>
							Edit
						</Button>
					</PageSectionAside>
				</PageSectionMeta>
				<PageSectionContent>
					<Card>
						<CardContent className='p-6'>
							<p className='text-sm text-muted-foreground'>Section content goes here</p>
						</CardContent>
					</Card>
				</PageSectionContent>
			</PageSection>
		</div>
	)
}
