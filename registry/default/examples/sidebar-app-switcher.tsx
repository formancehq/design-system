'use client';

import {
  type LucideIcon,
  ArrowUpRightIcon,
  BuildingIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LandmarkIcon,
  LayersIcon,
  LayoutDashboardIcon,
  SparklesIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/registry/default/ui/badge';
import { CONTEXT_TYPES, ContextIcon } from '@/registry/default/ui/context-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { FormanceIcon } from '@/registry/default/ui/formance-logo';
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

type TApp = {
  name: string;
  icon: LucideIcon;
  tag?: string;
};

// Fixed order across every surface that lists the apps: Portal, Console,
// Studio, Banking Bridge.
const apps: TApp[] = [
  { name: 'Portal', icon: BuildingIcon },
  { name: 'Console', icon: LayoutDashboardIcon },
  { name: 'Studio', icon: SparklesIcon, tag: 'Beta' },
  { name: 'Banking Bridge', icon: LandmarkIcon, tag: 'Beta' },
];

const organizations = ['Formance', 'Acme Financial'];

const navItems = [
  { title: 'Overview', icon: LayoutDashboardIcon },
  { title: 'Ledger', icon: LandmarkIcon },
  { title: 'Payments', icon: CreditCardIcon },
  { title: 'Stacks', icon: LayersIcon },
];

// One control for "where am I", rather than the header bar's row of icon-only
// chevrons: the trigger names the current app, and the menu switches app or
// organization. App names stay sans — they are names, not tags — so the badge is
// left free to mean something (here, Beta).
export default function SidebarAppSwitcher() {
  const [selectedApp, setSelectedApp] = useState('Console');
  const [selectedOrganization, setSelectedOrganization] = useState('Formance');

  return (
    <SidebarProvider className="min-h-115">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    variant="outline"
                    className="gap-2.5"
                  >
                    <FormanceIcon size="md" className="shrink-0" />
                    {/* The app name is the whole label, so it carries the row on
                        its own rather than sitting above a smaller context
                        line. */}
                    <span className="flex-1 truncate text-xl font-medium font-heading">
                      {selectedApp}
                    </span>
                    <ChevronsUpDownIcon className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                >
                  <DropdownMenuGroup>
                    {apps.map((app) => (
                      <DropdownMenuItem
                        key={app.name}
                        onSelect={() => setSelectedApp(app.name)}
                      >
                        <app.icon />
                        {/* `flex-1` on the name pushes the tag and the check to
                            the right edge, so every row's trailing slot lines
                            up whichever of the two it holds. */}
                        <span className="flex-1 truncate">{app.name}</span>
                        {app.tag && (
                          <Badge variant="outline" size="sm">
                            {app.tag}
                          </Badge>
                        )}
                        {app.name === selectedApp && <CheckIcon />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {organizations.map((organization) => (
                      <DropdownMenuItem
                        key={organization}
                        onSelect={() => setSelectedOrganization(organization)}
                      >
                        {/* The organization tile, not a line icon: an org is a
                            named entity, so it gets its own mark. */}
                        <ContextIcon
                          type={CONTEXT_TYPES.ORGANIZATION}
                          size="sm"
                        />
                        <span className="flex-1 truncate">{organization}</span>
                        {organization === selectedOrganization && <CheckIcon />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ArrowUpRightIcon />
                    Manage organizations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator className="mx-0" />
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
