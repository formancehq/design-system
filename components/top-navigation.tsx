'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/registry/default/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/registry/default/ui/sheet';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { SideNavigation } from '@/components/side-navigation';

export function TopNavigation() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function openSearch() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-12 items-center justify-between px-6 max-w-[1400px] mx-auto">
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
            <span className="text-lg font-semibold tracking-tight font-sans">
              Formance Design System
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openSearch}
            className="hidden sm:inline-flex gap-2 text-muted-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono sm:inline-block">
              ⌘K
            </kbd>
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
            variant="ghost"
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
            <SheetTitle className="text-sm font-semibold">Navigation</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <SideNavigation />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
}
