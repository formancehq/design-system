'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { docsConfig } from '@/config/docs';
import { Eyebrow } from '@/registry/default/ui/eyebrow';

function NavigationItem({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center h-7 text-sm px-6 transition-all',
        'text-muted-foreground',
        !isActive && 'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-foreground'
      )}
    >
      <div
        className={cn(
          'absolute left-0 w-0.5 h-full bg-primary transition-opacity',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      />
      {title}
      {label && (
        <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-mono uppercase text-primary-foreground">
          {label}
        </span>
      )}
    </Link>
  );
}

export function SideNavigation() {
  return (
    <nav className="min-w-[220px] py-6 lg:py-8">
      {docsConfig.sidebarNav.map((section, i) => {
        const items =
          section.sortOrder === 'alphabetical'
            ? [...section.items].sort((a, b) =>
                a.priority && !b.priority
                  ? -1
                  : !a.priority && b.priority
                    ? 1
                    : a.title.localeCompare(b.title)
              )
            : section.items;

        return (
          <div key={`${section.title}-${i}`} className="pb-8 space-y-0.5">
            <Eyebrow variant="gold" size="sm" withSquare={false} className="mb-2 px-6 tracking-widest">
              {section.title}
            </Eyebrow>
            {items.map((item) => (
              <NavigationItem
                key={item.href}
                title={item.title}
                href={item.href}
                label={item.label}
              />
            ))}
          </div>
        );
      })}
    </nav>
  );
}
