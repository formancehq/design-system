import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/registry/default/ui/description-list'

export default function DescriptionListDemo() {
	return (
		<div className='flex flex-col gap-8 w-full max-w-lg'>
			<DescriptionList>
				<DescriptionTerm>Ledger</DescriptionTerm>
				<DescriptionDetails>main-ledger</DescriptionDetails>
				<DescriptionTerm>Status</DescriptionTerm>
				<DescriptionDetails>Active</DescriptionDetails>
				<DescriptionTerm>Created</DescriptionTerm>
				<DescriptionDetails>March 12, 2026</DescriptionDetails>
			</DescriptionList>
		</div>
	)
}
