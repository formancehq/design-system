'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { docsConfig } from '@/config/docs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/registry/default/ui/breadcrumb';
import { PageContainer } from '@/registry/default/ui/page-container';

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

  return (
    <Breadcrumb className="border-b bg-background">
      <PageContainer size="large" className="flex h-12 items-center">
        <BreadcrumbList>
          {segments.map((segment, i) => {
            const href = '/' + segments.slice(0, i + 1).join('/');
            const title = segment === 'docs' ? 'Docs' : resolveTitle(segment);
            const isLast = i === segments.length - 1;

            return (
              <React.Fragment key={href}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{title}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </PageContainer>
    </Breadcrumb>
  );
}
