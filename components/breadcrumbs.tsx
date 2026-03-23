'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { docsConfig } from '@/config/docs';

function resolveTitle(segment: string): string {
  for (const section of docsConfig.sidebarNav) {
    const sectionSlug = section.title.toLowerCase().replace(/\s+/g, '-');
    if (sectionSlug === segment) {
      return section.title;
    }
    for (const item of section.items) {
      const parts = item.href.split('/').filter(Boolean);
      if (parts[parts.length - 1] === segment) {
        return item.title;
      }
    }
  }

  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const title = segment === 'docs' ? 'Docs' : resolveTitle(segment);
    const isLast = i === segments.length - 1;

    return (
      <li key={href} className="flex items-center gap-1.5">
        {i > 0 && (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        {isLast ? (
          <span className="text-foreground">{title}</span>
        ) : (
          <Link
            href={href}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {title}
          </Link>
        )}
      </li>
    );
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">{crumbs}</ol>
    </nav>
  );
}
