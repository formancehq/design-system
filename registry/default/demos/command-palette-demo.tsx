'use client';

import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  CreditCardIcon,
  LayersIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from 'lucide-react';
import { useState } from 'react';

import {
  CommandPaletteEmpty,
  CommandPaletteHint,
  CommandPaletteHints,
  CommandPaletteInput,
  CommandPaletteRow,
  CommandPaletteTrigger,
} from '@/registry/default/ui-fragments/command-palette';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from '@/registry/default/ui/command';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from '@/registry/default/ui/sidebar';

const rows = [
  {
    heading: 'Organization',
    items: [
      { label: 'Overview', icon: LayoutDashboardIcon, crumbs: ['Formance'] },
      { label: 'Members', icon: UsersIcon, crumbs: ['Formance'] },
      { label: 'Stacks', icon: LayersIcon, crumbs: ['Formance'] },
    ],
  },
  {
    heading: 'Stack',
    items: [
      { label: 'Ledgers', icon: BookOpenIcon, crumbs: ['Formance', 'Sandbox'] },
      {
        label: 'Transactions',
        icon: ArrowLeftRightIcon,
        crumbs: ['Formance', 'Sandbox'],
      },
      {
        label: 'Payments',
        icon: CreditCardIcon,
        crumbs: ['Formance', 'Sandbox'],
      },
    ],
  },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  function close() {
    setOpen(false);
    setQuery('');
  }

  return (
    <SidebarProvider className="min-h-72">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <CommandPaletteTrigger onClick={() => setOpen(true)} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent />
      </Sidebar>

      <CommandDialog
        open={open}
        onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}
        title="Search"
        description="Search pages, stacks and organizations"
        contentProps={{
          showCloseButton: false,
          // Escape clears a query first and only closes from an empty one.
          onEscapeKeyDown: (event) => {
            if (query === '') return;

            event.preventDefault();
            setQuery('');
          },
        }}
      >
        <CommandPaletteInput
          placeholder="Search pages, stacks, orgs…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {rows.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((item) => (
                <CommandPaletteRow
                  key={item.label}
                  value={item.label}
                  icon={<item.icon />}
                  label={item.label}
                  crumbs={item.crumbs}
                  onSelect={close}
                />
              ))}
            </CommandGroup>
          ))}
          <CommandEmpty className="py-0">
            <CommandPaletteEmpty query={query}>
              Esc to clear the search
            </CommandPaletteEmpty>
          </CommandEmpty>
        </CommandList>
        <CommandPaletteHints>
          <CommandPaletteHint keys={['↑', '↓']}>to navigate</CommandPaletteHint>
          <CommandPaletteHint keys={['↵']}>to select</CommandPaletteHint>
          <CommandPaletteHint keys={['esc']}>to close</CommandPaletteHint>
        </CommandPaletteHints>
      </CommandDialog>
    </SidebarProvider>
  );
}
