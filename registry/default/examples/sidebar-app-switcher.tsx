'use client';

import {
  BuildingIcon,
  CreditCardIcon,
  LandmarkIcon,
  LayersIcon,
  LayoutDashboardIcon,
  SparklesIcon,
} from 'lucide-react';
import { useState } from 'react';

import {
  SidebarAppSwitcher,
  type TSwitcherApp,
} from '@/registry/default/ui/sidebar-app-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSectionLabel,
  SidebarSeparator,
} from '@/registry/default/ui/sidebar';

// Fixed order across every surface that lists the apps: Portal, Console,
// Studio, Banking Bridge.
const apps: TSwitcherApp[] = [
  { name: 'Portal', href: '#', icon: BuildingIcon },
  { name: 'Console', href: '#', icon: LayoutDashboardIcon },
  { name: 'Studio', href: '#', icon: SparklesIcon, tag: 'Beta' },
  { name: 'Banking Bridge', href: '#', icon: LandmarkIcon, tag: 'Beta' },
];

const organizations = [
  { id: 'formance', name: 'Formance' },
  { id: 'acme-financial', name: 'Acme Financial' },
];

const navItems = [
  { title: 'Overview', icon: LayoutDashboardIcon },
  { title: 'Ledger', icon: LandmarkIcon },
  { title: 'Payments', icon: CreditCardIcon },
  { title: 'Stacks', icon: LayersIcon },
];

export default function SidebarAppSwitcherExample() {
  const [selectedOrganization, setSelectedOrganization] = useState('formance');

  return (
    <SidebarProvider className="min-h-115">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <SidebarAppSwitcher
            currentApp="Console"
            apps={apps}
            organizations={organizations}
            organizationId={selectedOrganization}
            onOrganizationChange={setSelectedOrganization}
            manageOrganizationsHref="#"
          />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarSectionLabel>Sandbox</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={item.title === 'Overview'}
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
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
