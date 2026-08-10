'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarSectionLabel,
} from '@/registry/default/ui/sidebar';

// Uneven widths so the rows read as labels of different lengths. They are
// fixed values, not random ones: `SidebarMenuSkeleton` takes the width as a
// prop precisely so a server-rendered sidebar hydrates without a mismatch.
const ledgerWidths = ['68%', '82%', '54%'];
const paymentWidths = ['74%', '60%'];

// Labels are known before the items are, so they render straight away and only
// the rows are skeletons — the nav keeps its shape instead of collapsing to a
// blank column while the modules load.
export default function SidebarLoading() {
  return (
    <SidebarProvider className="min-h-[420px]">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarSectionLabel>Sandbox</SidebarSectionLabel>
          <SidebarGroup>
            <SidebarGroupLabel>Ledger</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ledgerWidths.map((width) => (
                  <SidebarMenuItem key={width}>
                    <SidebarMenuSkeleton showIcon width={width} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Payments</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {paymentWidths.map((width) => (
                  <SidebarMenuItem key={width}>
                    <SidebarMenuSkeleton showIcon width={width} />
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
