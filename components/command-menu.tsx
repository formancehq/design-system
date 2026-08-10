'use client';

import {
  type LucideIcon,
  FileText,
  Monitor,
  Moon,
  Package,
  Paintbrush,
  Palette,
  Shapes,
  Sun,
  Type,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { docsConfig } from '@/config/docs';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/registry/default/ui/dialog';
import { Kbd } from '@/registry/default/ui/kbd';

const PAGE_ICONS: Record<string, LucideIcon> = {
  Colors: Palette,
  Typography: Type,
  Theming: Paintbrush,
  'Formance Logo': Shapes,
};

// Every section but Getting Started lists components, so its rows take the
// package mark unless the page names itself above.
const SECTION_ICONS: Record<string, LucideIcon> = {
  'Getting Started': FileText,
};

const HINTS = [
  { keys: ['↑', '↓'], label: 'to navigate' },
  { keys: ['↵'], label: 'to select' },
  { keys: ['esc'], label: 'to close' },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { setTheme } = useTheme();

  // Open-only, never a toggle: the hotkey answers from inside the input too, so
  // a toggle would close the menu on a `mod+k` typed by someone reaching for
  // the menu already in front of them. Escape is the way out.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setOpen(true);
      }

      if (
        event.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)
      ) {
        event.preventDefault();
        setOpen(true);
      }
    }

    function onOpen() {
      setOpen(true);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('command-menu:open', onOpen);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('command-menu:open', onOpen);
    };
  }, []);

  function close() {
    setOpen(false);
    setQuery('');
  }

  function run(command: () => void) {
    close();
    command();
  }

  return (
    // Not `CommandDialog`: this menu shows its own `Esc` mark in place of the
    // corner close button, and Escape clears a query before it closes — which
    // Radix only lets `DialogContent` decide.
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}
    >
      <DialogContent
        className="overflow-hidden p-0"
        showCloseButton={false}
        onEscapeKeyDown={(event) => {
          if (query === '') return;

          event.preventDefault();
          setQuery('');
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Command Menu</DialogTitle>
          <DialogDescription>
            Search documentation, components, and switch theme.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <div className="relative">
            <CommandInput
              placeholder="Search pages, components, commands…"
              value={query}
              onValueChange={setQuery}
              className="pr-12"
            />
            <Kbd className="absolute top-1/2 right-3 -translate-y-1/2">Esc</Kbd>
          </div>
          <CommandList>
            {docsConfig.sidebarNav.map((section) => (
              <CommandGroup key={section.title} heading={section.title}>
                {section.items.map((item) => {
                  const Icon =
                    PAGE_ICONS[item.title] ??
                    SECTION_ICONS[section.title] ??
                    Package;

                  return (
                    <CommandItem
                      key={item.href}
                      // The section joins the value so "atoms input" finds the
                      // atom rather than only the pages literally named Input.
                      value={`${item.title} ${section.title}`}
                      onSelect={() => run(() => router.push(item.href))}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}

            <CommandGroup heading="Theme">
              <CommandItem
                value="Light theme"
                onSelect={() => run(() => setTheme('light'))}
              >
                <Sun />
                <span>Light</span>
              </CommandItem>
              <CommandItem
                value="Dark theme"
                onSelect={() => run(() => setTheme('dark'))}
              >
                <Moon />
                <span>Dark</span>
              </CommandItem>
              <CommandItem
                value="System theme"
                onSelect={() => run(() => setTheme('system'))}
              >
                <Monitor />
                <span>System</span>
              </CommandItem>
            </CommandGroup>

            <CommandEmpty>
              <p>No match for “{query}”</p>
              <p className="mt-1 text-muted-foreground">
                Esc to clear the search
              </p>
            </CommandEmpty>
          </CommandList>

          <div className="flex items-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground">
            {HINTS.map((hint) => (
              <span key={hint.label} className="flex items-center gap-1">
                {hint.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
                {hint.label}
              </span>
            ))}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
