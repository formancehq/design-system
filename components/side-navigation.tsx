'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { docsConfig } from '@/config/docs';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSectionLabel,
  SidebarSeparator,
} from '@/registry/default/ui/sidebar';

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

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === href}>
        <Link href={href}>
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
      {label && <SidebarMenuBadge>{label}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}

export function SideNavigation() {
  return (
    <SidebarProvider className="min-h-0 h-full">
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>
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
              <div key={section.title}>
                {i > 0 && <SidebarSeparator className="mb-2" />}
                <SidebarSectionLabel>{section.title}</SidebarSectionLabel>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item) => (
                        <NavigationItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                          label={item.label}
                        />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            );
          })}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
