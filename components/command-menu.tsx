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
  CommandPaletteEmpty,
  CommandPaletteHint,
  CommandPaletteHints,
  CommandPaletteInput,
  CommandPaletteRow,
} from '@/registry/default/ui-fragments/command-palette';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from '@/registry/default/ui/command';

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

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { setTheme } = useTheme();

  // Open-only, never a toggle: the hotkey answers from inside the palette's own
  // input too, so a toggle would close the palette on a `mod+k` typed by
  // someone reaching for the palette already in front of them. Escape is the
  // way out.
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
    <CommandDialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}
      title="Command Menu"
      description="Search documentation, components, and switch theme."
      contentProps={{
        // The input's own `Esc` mark says how to dismiss, and the corner close
        // button lands on top of it.
        showCloseButton: false,
        // Escape is progressive: it clears a query first and only closes from
        // an empty one. It has to be handled here — Radix listens for Escape on
        // `document`, so `stopPropagation` from the input's `onKeyDown` cannot
        // stop the dialog from closing too.
        onEscapeKeyDown: (event) => {
          if (query === '') return;

          event.preventDefault();
          setQuery('');
        },
      }}
    >
      <CommandPaletteInput
        placeholder="Search pages, components, commands…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {docsConfig.sidebarNav.map((section) => (
          <CommandGroup key={section.title} heading={section.title}>
            {section.items.map((item) => {
              const Icon =
                PAGE_ICONS[item.title] ??
                SECTION_ICONS[section.title] ??
                Package;

              return (
                <CommandPaletteRow
                  key={item.href}
                  // The section joins the value so "atoms input" finds the
                  // atom rather than only the pages literally named Input.
                  value={`${item.title} ${section.title}`}
                  icon={<Icon className="text-muted-foreground" />}
                  label={item.title}
                  onSelect={() => run(() => router.push(item.href))}
                />
              );
            })}
          </CommandGroup>
        ))}

        <CommandGroup heading="Theme">
          <CommandPaletteRow
            value="Light theme"
            icon={<Sun className="text-muted-foreground" />}
            label="Light"
            onSelect={() => run(() => setTheme('light'))}
          />
          <CommandPaletteRow
            value="Dark theme"
            icon={<Moon className="text-muted-foreground" />}
            label="Dark"
            onSelect={() => run(() => setTheme('dark'))}
          />
          <CommandPaletteRow
            value="System theme"
            icon={<Monitor className="text-muted-foreground" />}
            label="System"
            onSelect={() => run(() => setTheme('system'))}
          />
        </CommandGroup>

        {/* Inside `CommandEmpty` so cmdk decides when nothing matched; the
            fragment supplies the wording, which needs the query. */}
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
  );
}
