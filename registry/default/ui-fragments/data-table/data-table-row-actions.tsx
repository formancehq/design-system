'use client';

import * as React from 'react';

import { Ellipsis } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';

export type TDataTableRowActionsProps = {
  /** The menu itself: a `DropdownMenuContent` with its items. */
  children: React.ReactNode;
};

export function DataTableRowActions({ children }: TDataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  );
}
