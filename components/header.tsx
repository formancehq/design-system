'use client';

import { Menu, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { SideNavigation } from '@/components/side-navigation';
import { BadgeEyebrow } from '@/registry/default/ui/badge-eyebrow';
import { Button } from '@/registry/default/ui/button';
import { FormanceLogo } from '@/registry/default/ui/formance-logo';
import { Kbd, KbdGroup } from '@/registry/default/ui/kbd';
import {
  ModeToggle,
  type TTheme,
} from '@/registry/default/ui-fragments/mode-toggle';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
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
          <div className="flex items-center gap-3">
            <Link href="/">
              <FormanceLogo />
            </Link>
            <BadgeEyebrow variant="cobalt">Design System</BadgeEyebrow>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={openSearch}
            className="hidden sm:flex w-56 justify-start items-center gap-2"
          >
            <Search className="size-4" />
            <span>Search</span>
            <KbdGroup className="ml-auto">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
          <Button
            variant="ghost"
            size="icon-md"
            className="sm:hidden"
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
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <SideNavigation />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
}
