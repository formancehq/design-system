'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Eyebrow } from '@/registry/default/ui/eyebrow';

type THeading = {
  id: string;
  title: string;
  level: number;
};

// The band is the top fifth of the viewport, the same slice the observer's
// `rootMargin` cuts out.
const ACTIVE_BAND_RATIO = 0.2;

function useActiveHeading(headings: THeading[]) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    // The observer says which headings crossed the band, not which one the
    // reader is under: several can sit in the band at once, entry order is not
    // document order, and a heading scrolled back below the band reports
    // nothing at all. So the observer only triggers the read, and the answer
    // comes from every heading's position — the last one above the band.
    function syncActiveHeading() {
      const band = window.innerHeight * ACTIVE_BAND_RATIO;
      const passed = elements.filter(
        (element) => element.getBoundingClientRect().top <= band
      );

      setActiveId((passed.at(-1) ?? elements[0])?.id ?? '');
    }

    syncActiveHeading();

    const observer = new IntersectionObserver(syncActiveHeading, {
      rootMargin: `0% 0% -${(1 - ACTIVE_BAND_RATIO) * 100}% 0%`,
    });

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

function TableOfContents({ headings }: { headings: THeading[] }) {
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-2" aria-label="Table of contents">
      {/* `pl-3.5` puts the label's text on the same vertical line as the item
          text, which the rail and its padding push 14px in. */}
      <Eyebrow variant="gold" size="sm" className="pl-3.5">
        On This Page
      </Eyebrow>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                // A rail rather than the sidebar's filled row: the same
                // "you are here" mark, quiet enough to sit beside prose.
                'block border-l-2 pl-3 text-sm no-underline transition-colors',
                heading.level > 2 && 'pl-6',
                activeId === heading.id
                  ? 'border-primary font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { TableOfContents };
