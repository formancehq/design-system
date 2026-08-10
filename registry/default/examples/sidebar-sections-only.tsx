'use client';

import {
  type LucideIcon,
  ActivityIcon,
  BuildingIcon,
  CreditCardIcon,
  KeyRoundIcon,
  LandmarkIcon,
  LayersIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from 'lucide-react';
import { Fragment } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSectionLabel,
} from '@/registry/default/ui/sidebar';

const sections: {
  label: string;
  items: { title: string; icon: LucideIcon }[];
}[] = [
  {
    label: 'Organization',
    items: [
      { title: 'Overview', icon: LayoutDashboardIcon },
      { title: 'Stacks', icon: LayersIcon },
      { title: 'Members', icon: UsersIcon },
    ],
  },
  {
    label: 'Sandbox',
    items: [
      { title: 'Ledger', icon: LandmarkIcon },
      { title: 'Payments', icon: CreditCardIcon },
      { title: 'Activity', icon: ActivityIcon },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Profile', icon: BuildingIcon },
      { title: 'API keys', icon: KeyRoundIcon },
    ],
  },
];

// The flattest form of the hierarchy: one section label over one unlabelled
// group. Reach for a group label only once a section holds more than one group
// — a lone group has nothing to be told apart from.
export default function SidebarSectionsOnly() {
  return (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          {sections.map((section) => (
            <Fragment key={section.label}>
              <SidebarSectionLabel>{section.label}</SidebarSectionLabel>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={item.title === 'Ledger'}
                          tooltip={item.title}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </Fragment>
          ))}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
