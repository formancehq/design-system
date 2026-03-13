'use client';

import {
  BookOpenIcon,
  HomeIcon,
  SettingsIcon,
  WalletIcon,
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
} from '@/registry/default/ui/sidebar';

const items = [
  { title: 'Dashboard', icon: HomeIcon },
  { title: 'Ledgers', icon: BookOpenIcon },
  { title: 'Wallets', icon: WalletIcon },
  { title: 'Settings', icon: SettingsIcon },
];

export default function SidebarDemo() {
  return (
    <SidebarProvider className="min-h-[300px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.title === 'Ledgers'}>
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
