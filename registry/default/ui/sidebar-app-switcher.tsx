'use client';

import {
  type LucideIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderCircleIcon,
} from 'lucide-react';

import { Badge } from '@/registry/default/ui/badge';
import { CONTEXT_TYPES, ContextIcon } from '@/registry/default/ui/context-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { FormanceIcon } from '@/registry/default/ui/formance-logo';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/registry/default/ui/sidebar';

type TSwitcherApp = {
  name: string;
  /** Apps are separate deployments, so a row is a link, not a selection. */
  href: string;
  icon?: LucideIcon;
  /** Free for anything but the app name — maturity, environment, whatever the product needs. */
  tag?: string;
};

type TSwitcherOrganization = {
  id: string;
  name: string;
};

type TSidebarAppSwitcherProps = {
  currentApp: string;
  apps: TSwitcherApp[];
  organizations?: TSwitcherOrganization[];
  organizationId?: string;
  onOrganizationChange?: (organizationId: string) => void;
  /**
   * "Manage organizations" row. An absolute href opens in a new tab, a relative
   * one stays in this tab. Omitting it leaves the row out.
   */
  manageOrganizationsHref?: string;
  /** A switch is in flight: the trigger says so instead of inviting another. */
  isSwitching?: boolean;
};

// One control for "where am I", rather than the header bar's row of icon-only
// chevrons: the trigger names the current app, and the menu switches app or
// organization. App names stay sans — they are names, not tags — so the badge is
// left free to mean something (e.g. Beta).
//
// Presentational only: every app is a link and every organization is a callback,
// so whatever a switch costs the product — a session, a round-trip — stays with
// the product.
function SidebarAppSwitcher({
  currentApp,
  apps,
  organizations = [],
  organizationId,
  onOrganizationChange,
  manageOrganizationsHref,
  isSwitching = false,
}: TSidebarAppSwitcherProps) {
  // Every app but the current one is a place to go; the current one is only a
  // check mark, so on its own it is not a menu.
  const hasApps = apps.some((app) => app.name !== currentApp);
  const hasOrganizations = organizations.length > 0;
  // A single-app, single-organization deployment has nothing to open: the
  // trigger states where you are and stops there.
  const hasMenu =
    hasApps || hasOrganizations || Boolean(manageOrganizationsHref);

  const trigger = (
    <SidebarMenuButton
      size="lg"
      variant="outline"
      className="gap-2.5"
      disabled={!hasMenu}
      data-testid="app-switcher-trigger"
    >
      <FormanceIcon size="md" className="shrink-0" />
      {/* The app name is the whole label, so it carries the row on its own
          rather than sitting above a smaller context line. */}
      <span className="flex-1 truncate text-xl font-medium font-heading">
        {currentApp}
      </span>
      {isSwitching ? (
        <LoaderCircleIcon className="ml-auto animate-spin text-muted-foreground" />
      ) : (
        hasMenu && <ChevronsUpDownIcon className="ml-auto" />
      )}
    </SidebarMenuButton>
  );

  if (!hasMenu) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>{trigger}</SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            sideOffset={4}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
          >
            {hasApps && (
              <>
                <DropdownMenuLabel>Explore</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {apps.map((app) => (
                    <DropdownMenuItem
                      key={app.name}
                      asChild
                      data-testid="app-picker-item"
                    >
                      <a href={app.href}>
                        {app.icon && <app.icon />}
                        {/* `flex-1` on the name pushes the tag and the check to
                            the right edge, so every row's trailing slot lines up
                            whichever of the two it holds. */}
                        <span className="flex-1 truncate">{app.name}</span>
                        {app.tag && (
                          <Badge variant="outline" size="sm">
                            {app.tag}
                          </Badge>
                        )}
                        {app.name === currentApp && <CheckIcon />}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {hasApps && hasOrganizations && <DropdownMenuSeparator />}

            {hasOrganizations && (
              <>
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {organizations.map((organization) => (
                    <DropdownMenuItem
                      key={organization.id}
                      disabled={isSwitching}
                      onSelect={() => onOrganizationChange?.(organization.id)}
                      data-testid="organizations-picker-item"
                      data-org-id={organization.id}
                    >
                      {/* The organization tile, not a line icon: an org is a
                          named entity, so it gets its own mark. `xs` matches
                          the lucide glyphs on the rows around it, so every
                          label in the menu shares one left edge — the same
                          trade the command palette makes. */}
                      <ContextIcon
                        type={CONTEXT_TYPES.ORGANIZATION}
                        size="xs"
                      />
                      <span className="flex-1 truncate">
                        {organization.name}
                      </span>
                      {organization.id === organizationId && <CheckIcon />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {manageOrganizationsHref && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href={manageOrganizationsHref}
                    {...(manageOrganizationsHref.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    data-testid="view-all-organizations-link"
                  >
                    <ArrowUpRightIcon />
                    Manage organizations
                  </a>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export {
  SidebarAppSwitcher,
  type TSidebarAppSwitcherProps,
  type TSwitcherApp,
  type TSwitcherOrganization,
};
