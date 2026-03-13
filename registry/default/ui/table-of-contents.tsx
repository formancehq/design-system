'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type THeading = {
	id: string
	title: string
	level: number
}

function useActiveHeading(headings: THeading[]) {
	const [activeId, setActiveId] = useState('')

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
					}
				}
			},
			{ rootMargin: '0% 0% -80% 0%' },
		)

		for (const heading of headings) {
			const el = document.getElementById(heading.id)
			if (el) observer.observe(el)
		}

		return () => observer.disconnect()
	}, [headings])

	return activeId
}

function TableOfContents({ headings }: { headings: THeading[] }) {
	const activeId = useActiveHeading(headings)

	if (headings.length === 0) return null

	return (
		<nav className='space-y-2' aria-label='Table of contents'>
			<p className='font-medium text-sm text-muted-foreground font-mono uppercase'>On This Page</p>
			<ul className='space-y-1'>
				{headings.map((heading) => (
					<li key={heading.id}>
						<a
							href={`#${heading.id}`}
							className={cn(
								'block text-sm no-underline transition-colors',
								heading.level > 2 && 'pl-4',
								activeId === heading.id ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
							)}
						>
							{heading.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}

export { TableOfContents, useActiveHeading, type THeading }
