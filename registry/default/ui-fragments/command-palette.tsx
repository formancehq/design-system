'use client';

import { SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { CommandInput, CommandItem } from '@/registry/default/ui/command';
import { Button } from '@/registry/default/ui/button';
import { Kbd, KbdGroup } from '@/registry/default/ui/kbd';
import { SidebarMenuButton } from '@/registry/default/ui/sidebar';

// The chrome every Formance palette shares, so an app writes only its own rows.
// The trigger, the `Esc` affordance, the row shape, the empty state and the hint
// bar were each hand-rolled per app; three copies of a search button is three
// chances for the control that opens search to look different in each product.

const DEFAULT_SHORTCUT = ['⌘', 'K'];

// Lives in a `SidebarMenu` — a `SidebarHeader` in the Portal, a
// `SidebarGroupContent` in the Console — so the wrapper stays with the app and
// only the control itself is shared.
function CommandPaletteTrigger({
  label = 'Search',
  shortcut = DEFAULT_SHORTCUT,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  label?: string;
  shortcut?: string[];
}) {
  return (
    <SidebarMenuButton
      asChild
      // The collapsed rail tooltips this button, and Radix duplicates a
      // trigger's children into a hidden a11y copy — hence an explicit label
      // rather than matching on the text.
      aria-label={label}
      tooltip={label}
    >
      <Button
        variant="outline"
        className={cn('w-full justify-start', className)}
        {...props}
      >
        <SearchIcon />
        {label}
        <KbdGroup className="ml-auto group-data-[collapsible=icon]:hidden">
          {shortcut.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </KbdGroup>
      </Button>
    </SidebarMenuButton>
  );
}

// The `Esc` mark is the palette's own way out, which is why the dialog that
// holds it hides the corner close button — the two land in the same spot.
function CommandPaletteInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandInput>) {
  return (
    <div className="relative">
      <CommandInput className={cn('pr-12', className)} {...props} />
      <Kbd className="absolute top-1/2 right-3 -translate-y-1/2">Esc</Kbd>
    </div>
  );
}

// A leading mark, the label, and — when a row needs to say where it lives — a
// trailing crumb trail. `icon` is a node rather than a component because the
// marks have nothing to normalise: a page row carries a lucide glyph sized by
// `CommandItem`, an entity row carries its own `ContextIcon` tile.
function CommandPaletteRow({
  icon,
  label,
  crumbs,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  icon?: ReactNode;
  label: string;
  crumbs?: string[];
}) {
  return (
    <CommandItem {...props}>
      {icon}
      <span>{label}</span>
      {crumbs && crumbs.length > 0 && (
        <span className="ml-auto truncate text-xs text-muted-foreground">
          {crumbs.join(' › ')}
        </span>
      )}
    </CommandItem>
  );
}

// Echoing the query back is what tells the user why nothing matched — usually a
// typo they can now see. Not `CommandEmpty`, which cannot hold the query.
function CommandPaletteEmpty({
  query,
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & { query: string }) {
  return (
    <div className={cn('px-4 py-6 text-center text-sm', className)} {...props}>
      <p>No match for “{query}”</p>
      {children && <p className="mt-1 text-muted-foreground">{children}</p>}
    </div>
  );
}

function CommandPaletteHints({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function CommandPaletteHint({
  keys,
  children,
  className,
  ...props
}: React.ComponentProps<'span'> & { keys: string[] }) {
  return (
    <span className={cn('flex items-center gap-1', className)} {...props}>
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
      {children}
    </span>
  );
}

export {
  CommandPaletteEmpty,
  CommandPaletteHint,
  CommandPaletteHints,
  CommandPaletteInput,
  CommandPaletteRow,
  CommandPaletteTrigger,
};
