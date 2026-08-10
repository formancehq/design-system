'use client';

import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  SettingsIcon,
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
  SidebarTrigger,
} from '@/registry/default/ui/sidebar';

const groups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', icon: LayoutDashboardIcon },
      { title: 'Settings', icon: SettingsIcon },
    ],
  },
  {
    label: 'Ledger',
    items: [
      { title: 'Ledgers', icon: BookOpenIcon },
      { title: 'Transactions', icon: ArrowLeftRightIcon },
      { title: 'Payments', icon: CreditCardIcon },
    ],
  },
];

// Collapse the rail with the trigger: both label levels hide — the section
// label outright, the group label by collapsing its own height — so only icons
// remain and every item falls back to its tooltip.
export default function SidebarIconRail() {
  return (
    // A collapsible sidebar is `fixed` to the viewport in a real app; the
    // `relative` box and `absolute` override keep it inside this preview.
    <div className="relative flex h-[420px] w-full overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-full">
        <Sidebar collapsible="icon" className="absolute h-full">
          <SidebarContent>
            <SidebarSectionLabel>Sandbox</SidebarSectionLabel>
            {groups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={item.title === 'Ledgers'}
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
        <div className="flex flex-1 items-start p-4">
          <SidebarTrigger />
        </div>
      </SidebarProvider>
    </div>
  );
}
