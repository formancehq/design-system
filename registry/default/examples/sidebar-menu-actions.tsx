'use client';

import {
  BookOpenIcon,
  MoreHorizontalIcon,
  PlusIcon,
  WalletIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSectionLabel,
} from '@/registry/default/ui/sidebar';

const ledgers = ['main', 'payouts', 'testing'];

// Two kinds of affordance sit on a row: a badge, which is read-only data, and
// an action, which is a control. Only one of them can be on the right — the
// action wins, and `showOnHover` keeps it out of the way until the row is
// pointed at.
export default function SidebarMenuActions() {
  return (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarSectionLabel>Sandbox</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupLabel>Ledgers</SidebarGroupLabel>
            <SidebarGroupAction title="Create ledger">
              <PlusIcon />
              <span className="sr-only">Create ledger</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {ledgers.map((ledger) => (
                  <SidebarMenuItem key={ledger}>
                    <SidebarMenuButton
                      isActive={ledger === 'main'}
                      tooltip={ledger}
                    >
                      <BookOpenIcon />
                      <span>{ledger}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontalIcon />
                          <span className="sr-only">
                            More options for {ledger}
                          </span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Wallets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Wallets">
                    <WalletIcon />
                    <span>Wallets</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
