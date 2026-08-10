'use client';

import {
  ChevronRightIcon,
  CreditCardIcon,
  LandmarkIcon,
  WalletIcon,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/default/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSectionLabel,
} from '@/registry/default/ui/sidebar';

const modules = [
  {
    name: 'Ledger',
    icon: LandmarkIcon,
    defaultOpen: true,
    items: ['Ledgers', 'Transactions', 'Accounts', 'Volumes'],
  },
  {
    name: 'Payments',
    icon: CreditCardIcon,
    defaultOpen: false,
    items: ['Payments', 'Connectors', 'Bank accounts'],
  },
  {
    name: 'Wallets',
    icon: WalletIcon,
    defaultOpen: false,
    items: ['Wallets', 'Holds'],
  },
];

// A module is a collapsible item, not a group label: it is a destination as
// well as a container, so it keeps the item recipe and the group label above it
// stays the section's only mono label.
export default function SidebarNestedItems() {
  return (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarSectionLabel>Sandbox</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupLabel>Modules</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {modules.map((module) => (
                  <Collapsible
                    key={module.name}
                    defaultOpen={module.defaultOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={module.name}>
                          <module.icon />
                          <span>{module.name}</span>
                          <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        <SidebarMenuSub>
                          {module.items.map((item) => (
                            <SidebarMenuSubItem key={item}>
                              <SidebarMenuSubButton
                                isActive={item === 'Transactions'}
                              >
                                <span>{item}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
