import { Badge } from '@/registry/default/ui/badge'
import { Button } from '@/registry/default/ui/button'
import { Eyebrow } from '@/registry/default/ui/eyebrow'
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs'
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyInlineCode, TypographyP, TypographySmall } from '@/registry/default/ui/typography'

export function TypographyContent() {
	return (
		<div className='space-y-10'>
			<section className='space-y-4'>
				<TypographyH2 id='typefaces'>Typefaces</TypographyH2>
				<TypographyP>The design system uses three typefaces loaded from the Formance CDN.</TypographyP>

				<div className='space-y-6'>
					<div className='rounded-lg border p-6 space-y-3'>
						<div className='flex items-baseline justify-between'>
							<TypographyH3 className='text-lg'>Polymath</TypographyH3>
							<TypographySmall className='font-mono text-muted-foreground'>--font-sans (primary)</TypographySmall>
						</div>
						<TypographyH1>Stop Fighting Your Ledger</TypographyH1>
						<TypographyH2>Stop Fighting Your Ledger</TypographyH2>
						<TypographyH3>Stop Fighting Your Ledger</TypographyH3>
						<TypographyH4>Stop Fighting Your Ledger</TypographyH4>
						<TypographyH5>Stop Fighting Your Ledger</TypographyH5>
						<TypographyP>Stop Fighting Your Ledger</TypographyP>
					</div>

					<div className='rounded-lg border p-6 space-y-3'>
						<div className='flex items-baseline justify-between'>
							<TypographyH3 className='text-lg'>Figtree</TypographyH3>
							<TypographySmall className='font-mono text-muted-foreground'>--font-sans (fallback)</TypographySmall>
						</div>
						<TypographyH1 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH1>
						<TypographyH2 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH2>
						<TypographyH3 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH3>
						<TypographyH4 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH4>
						<TypographyH5 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH5>
						<TypographyP style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyP>
					</div>

					<div className='rounded-lg border p-6 space-y-6'>
						<div className='flex items-baseline justify-between'>
							<TypographyH3 className='text-lg'>Berkeley Mono</TypographyH3>
							<TypographySmall className='font-mono text-muted-foreground'>--font-mono (primary)</TypographySmall>
						</div>

						<div className='space-y-4'>
							<TypographySmall className='text-muted-foreground'>Used in interactive elements — always uppercase, always mono.</TypographySmall>

							<div className='space-y-4'>
								<div className='space-y-2'>
									<TypographySmall className='text-muted-foreground'>Buttons</TypographySmall>
									<div className='flex flex-wrap items-center gap-2'>
										<Button variant='primary'>Primary</Button>
										<Button variant='secondary'>Secondary</Button>
										<Button variant='outline'>Outline</Button>
										<Button variant='ghost'>Ghost</Button>
										<Button variant='bracketed'>Bracketed</Button>
										<Button variant='destructive'>Delete</Button>
									</div>
								</div>

								<div className='space-y-2'>
									<TypographySmall className='text-muted-foreground'>Badges</TypographySmall>
									<div className='flex flex-wrap items-center gap-2'>
										<Badge variant='primary'>Active</Badge>
										<Badge variant='valid'>Valid</Badge>
										<Badge variant='destructive'>Failed</Badge>
										<Badge variant='warning'>Pending</Badge>
										<Badge variant='info'>Info</Badge>
										<Badge variant='outline'>Draft</Badge>
									</div>
								</div>

								<div className='space-y-2'>
									<TypographySmall className='text-muted-foreground'>Eyebrows</TypographySmall>
									<div className='flex flex-col gap-2'>
										<Eyebrow variant='primary'>Getting started</Eyebrow>
										<Eyebrow variant='gold'>New feature</Eyebrow>
									</div>
								</div>

								<div className='space-y-2'>
									<TypographySmall className='text-muted-foreground'>Tabs</TypographySmall>
									<Tabs defaultValue='overview'>
										<TabsList>
											<TabsTrigger value='overview'>Overview</TabsTrigger>
											<TabsTrigger value='transactions'>Transactions</TabsTrigger>
											<TabsTrigger value='settings'>Settings</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>
							</div>
						</div>
					</div>

					<div className='rounded-lg border p-6 space-y-3'>
						<div className='flex items-baseline justify-between'>
							<TypographyH3 className='text-lg'>Space Mono</TypographyH3>
							<TypographySmall className='font-mono text-muted-foreground'>--font-mono (fallback)</TypographySmall>
						</div>
						<TypographySmall className='text-muted-foreground'>
							Fallback monospace font when Berkeley Mono is unavailable. Same uppercase treatment applies.
						</TypographySmall>
					</div>
				</div>
			</section>

			<section className='space-y-4'>
				<TypographyH2 id='usage'>Usage</TypographyH2>
				<TypographyP>
					Buttons, badges, tabs, eyebrows, and other interactive elements use <TypographyInlineCode>font-mono</TypographyInlineCode> (Berkeley Mono, falling back to Space Mono) in uppercase. Body text and
					headings use <TypographyInlineCode>font-sans</TypographyInlineCode> (Polymath, falling back to Figtree).
				</TypographyP>
				<TypographyP>
					See the{' '}
					<a href='/docs/components/typography' className='font-medium underline underline-offset-4'>
						Typography component
					</a>{' '}
					for ready-made heading, paragraph, and text components.
				</TypographyP>
			</section>
		</div>
	)
}
