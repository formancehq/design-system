'use client';

import {
  ActivityIcon,
  ChevronLeftIcon,
  KeyRoundIcon,
  LandmarkIcon,
  SettingsIcon,
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

// The pane pattern: a back link replaces the parent nav, and the section label
// names where the drill-in landed.
export default function SidebarDrillIn() {
  return (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup className="pb-0">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton variant="outline" tooltip="Back to Stacks">
                    <ChevronLeftIcon />
                    <span className="font-medium">Stacks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarSectionLabel>Sandbox</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupLabel>Services</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <LandmarkIcon />
                    <span>Ledger</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <ActivityIcon />
                    <span>Activity</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <UsersIcon />
                    <span>Members</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <KeyRoundIcon />
                    <span>API keys</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <SettingsIcon />
                    <span>Settings</span>
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
