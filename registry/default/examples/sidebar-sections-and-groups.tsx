'use client';

import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  PlugIcon,
  UsersIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSectionLabel,
  SidebarSeparator,
} from '@/registry/default/ui/sidebar';

// Three levels, three type recipes: the section is a gold `Eyebrow`, the group
// label is mono uppercase, the item is sans — so a scan reads area → group →
// destination without any of the three competing.
export default function SidebarSectionsAndGroups() {
  return (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarSectionLabel>Organization</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LayoutDashboardIcon />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <UsersIcon />
                    <span>Members</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarSectionLabel>Sandbox</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupLabel>Ledger</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <BookOpenIcon />
                    <span>Ledgers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <ArrowLeftRightIcon />
                    <span>Transactions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Payments</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <CreditCardIcon />
                    <span>Payments</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <PlugIcon />
                    <span>Connectors</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
