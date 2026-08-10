'use client';

import { Menu, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { SideNavigation } from '@/components/side-navigation';
import {
  ModeToggle,
  type TTheme,
} from '@/registry/default/ui-fragments/mode-toggle';
import { Button } from '@/registry/default/ui/button';
import { FormanceIcon } from '@/registry/default/ui/formance-logo';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/registry/default/ui/sheet';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function openSearch() {
    document.dispatchEvent(new CustomEvent('command-menu:open'));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="flex h-12 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-md"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <FormanceIcon />
            </Link>
            <span className="text-2xl font-medium text-foreground font-heading">
              Formance Design System
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Search lives in the sidebar header from `md` up, so the header bar
              keeps the icon-only trigger for the narrow widths where the
              sidebar is behind the menu sheet. */}
          <Button
            variant="ghost"
            size="icon-md"
            className="md:hidden"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
          <ModeToggle
            theme={(theme as TTheme) ?? 'system'}
            setTheme={setTheme}
          />
        </div>
      </nav>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="border-b px-6">
            <SheetTitle className="text-sm font-semibold">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-4rem)]">
            <SideNavigation />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
