'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Command } from 'cmdk';
import { Moon, Sun, Monitor, FileText, Palette, Type, Paintbrush, Package, Shapes } from 'lucide-react';

import { docsConfig, flattenNav } from '@/config/docs';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  const navItems = flattenNav();

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className="fixed inset-0 z-50"
    >
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="fixed top-[20%] left-1/2 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-popover text-popover-foreground shadow-lg">
        <Command.Input
          placeholder="Type a command or search..."
          className="h-12 w-full border-b bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          {docsConfig.sidebarNav.map((section) => (
            <Command.Group
              key={section.title}
              heading={section.title}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {section.items.map((item) => {
                const Icon = section.title === 'Components' ? Package
                  : item.title === 'Colors' ? Palette
                  : item.title === 'Typography' ? Type
                  : item.title === 'Theming' ? Paintbrush
                  : item.title === 'Formance Logo' ? Shapes
                  : FileText;

                return (
                  <Command.Item
                    key={item.href}
                    value={item.title}
                    onSelect={() => runCommand(() => router.push(item.href))}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {item.title}
                  </Command.Item>
                );
              })}
            </Command.Group>
          ))}

          <Command.Group
            heading="Theme"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <Command.Item
              value="Light theme"
              onSelect={() => runCommand(() => setTheme('light'))}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Sun className="h-4 w-4 text-muted-foreground" />
              Light
            </Command.Item>
            <Command.Item
              value="Dark theme"
              onSelect={() => runCommand(() => setTheme('dark'))}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Moon className="h-4 w-4 text-muted-foreground" />
              Dark
            </Command.Item>
            <Command.Item
              value="System theme"
              onSelect={() => runCommand(() => setTheme('system'))}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Monitor className="h-4 w-4 text-muted-foreground" />
              System
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
