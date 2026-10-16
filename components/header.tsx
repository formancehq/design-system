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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/registry/default/ui/input-group';
import { Kbd, KbdGroup } from '@/registry/default/ui/kbd';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/registry/default/ui/sheet';

/**
 * Looks like an input, as in the Console header, and opens the command menu:
 * a click, Enter or Space. It is read only, because the command menu's own
 * input is where the query is typed. Below `md` it is a magnifier only.
 */
function SearchTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <>
      <InputGroup
        className="hidden w-52 cursor-pointer md:flex"
        onClick={onOpen}
      >
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          readOnly
          aria-label="Search"
          aria-haspopup="dialog"
          placeholder="Search..."
          className="cursor-pointer"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpen();
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
      <Button
        variant="ghost"
        size="icon-md"
        className="md:hidden"
        aria-label="Search"
        aria-haspopup="dialog"
        onClick={onOpen}
      >
        <Search className="h-4 w-4" />
      </Button>
    </>
  );
}

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
          <Link href="/" className="flex items-center gap-2.5">
            <FormanceIcon />
            <span className="text-2xl font-medium text-foreground font-heading">
              Formance Design System
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <SearchTrigger onOpen={openSearch} />
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
