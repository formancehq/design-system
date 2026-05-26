'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/registry/default/ui/command';
import {
  Moon,
  Sun,
  Monitor,
  FileText,
  Palette,
  Type,
  Paintbrush,
  Package,
  Shapes,
} from 'lucide-react';

import { docsConfig } from '@/config/docs';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    let lastToggle = 0;
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        e.stopImmediatePropagation();
        const now = Date.now();
        if (now - lastToggle < 200) return;
        lastToggle = now;
        setOpen((prev) => !prev);
      }
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
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

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Menu"
      description="Search documentation, components, and switch theme."
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {docsConfig.sidebarNav.map((section) => (
          <CommandGroup key={section.title} heading={section.title}>
            {section.items.map((item) => {
              const Icon =
                section.title === 'Components'
                  ? Package
                  : item.title === 'Colors'
                    ? Palette
                    : item.title === 'Typography'
                      ? Type
                      : item.title === 'Theming'
                        ? Paintbrush
                        : item.title === 'Formance Logo'
                          ? Shapes
                          : FileText;

              return (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => runCommand(() => router.push(item.href))}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {item.title}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}

        <CommandGroup heading="Theme">
          <CommandItem
            value="Light theme"
            onSelect={() => runCommand(() => setTheme('light'))}
          >
            <Sun className="h-4 w-4 text-muted-foreground" />
            Light
          </CommandItem>
          <CommandItem
            value="Dark theme"
            onSelect={() => runCommand(() => setTheme('dark'))}
          >
            <Moon className="h-4 w-4 text-muted-foreground" />
            Dark
          </CommandItem>
          <CommandItem
            value="System theme"
            onSelect={() => runCommand(() => setTheme('system'))}
          >
            <Monitor className="h-4 w-4 text-muted-foreground" />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
