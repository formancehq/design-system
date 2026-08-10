'use client';

import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  CreditCardIcon,
  KeyRoundIcon,
  PlugIcon,
  UsersIcon,
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

const groups = [
  {
    label: 'Ledger',
    items: [
      { title: 'Ledgers', icon: BookOpenIcon },
      { title: 'Transactions', icon: ArrowLeftRightIcon },
      { title: 'Accounts', icon: WalletIcon },
    ],
  },
  {
    label: 'Payments',
    items: [
      { title: 'Payments', icon: CreditCardIcon },
      { title: 'Connectors', icon: PlugIcon },
    ],
  },
  {
    label: 'Administration',
    items: [
      { title: 'Members', icon: UsersIcon },
      { title: 'API keys', icon: KeyRoundIcon },
    ],
  },
];

// A single-context app has nothing to name at the section level, so it starts
// at the group label. Adding a section label here would label the whole nav
// twice.
export default function SidebarGroupsOnly() {
  return (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          {groups.map((group) => (
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
