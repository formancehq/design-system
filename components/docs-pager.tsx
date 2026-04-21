'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { flattenNav } from '@/config/docs';

export function DocsPager() {
  const pathname = usePathname();
  const items = flattenNav();
  const currentIndex = items.findIndex((item) => item.href === pathname);

  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return (
    <nav
      className="flex items-center justify-between pt-8"
      aria-label="Pagination"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{prev.section}</div>
            <div className="font-medium">{prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="text-left">
            <div className="text-xs text-muted-foreground">{next.section}</div>
            <div className="font-medium">{next.title}</div>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
