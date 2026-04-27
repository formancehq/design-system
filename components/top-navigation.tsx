'use client';

import { Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { SideNavigation } from '@/components/side-navigation';
import { Button } from '@/registry/default/ui/button';
import { Kbd } from '@/registry/default/ui/kbd';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/registry/default/ui/sheet';
import { h3Variants } from '@/registry/default/ui/typography';

export function TopNavigation() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function openSearch() {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="flex h-12 items-center justify-between px-6">
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
          <Link href="/" className="flex items-center gap-3">
            <span className={h3Variants({})}>Formance Design System</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={openSearch}
            className="hidden sm:inline-flex gap-2"
          >
            <Search className="size-3.5" />
            <span>Search...</span>
            <Kbd>⌘K</Kbd>
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
          <Button
            variant="outline"
            size="icon-md"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
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
