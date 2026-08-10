'use client';

import {
  type LucideIcon,
  ArrowLeftRightIcon,
  BookOpenIcon,
  BuildingIcon,
  CreditCardIcon,
  LayersIcon,
  LayoutDashboardIcon,
  PlugIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
} from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import { Kbd, KbdGroup } from '@/registry/default/ui/kbd';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSectionLabel,
  SidebarSeparator,
} from '@/registry/default/ui/sidebar';

type TNavItem = {
  title: string;
  icon: LucideIcon;
  badge?: string;
};

const organizationItems: TNavItem[] = [
  { title: 'Overview', icon: LayoutDashboardIcon },
  { title: 'Stacks', icon: LayersIcon },
  { title: 'Members', icon: UsersIcon },
  { title: 'Settings', icon: SettingsIcon },
];

const stackGroups: { label: string; items: TNavItem[] }[] = [
  {
    label: 'Ledger',
    items: [
      { title: 'Ledgers', icon: BookOpenIcon },
      { title: 'Transactions', icon: ArrowLeftRightIcon, badge: '128' },
      { title: 'Accounts', icon: WalletIcon },
    ],
  },
  {
    label: 'Payments',
    items: [
      { title: 'Payments', icon: CreditCardIcon, badge: '4' },
      { title: 'Connectors', icon: PlugIcon },
    ],
  },
];

export default function SidebarDemo() {
  return (
    <SidebarProvider className="min-h-[520px]">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild aria-label="Search" tooltip="Search">
                <Button variant="outline" className="w-full justify-start">
                  <SearchIcon />
                  Search
                  <KbdGroup className="ml-auto group-data-[collapsible=icon]:hidden">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSectionLabel>Organization</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {organizationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
          <SidebarSectionLabel className="flex items-center gap-1.5">
            <BuildingIcon className="size-3.5" />
            Sandbox
          </SidebarSectionLabel>
          {stackGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={item.title === 'Transactions'}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
