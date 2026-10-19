'use client';

import { RowData } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import type { ReactTable } from '@/components/ui-fragments/data-table/data-table-features';
import { Button } from '@/registry/default/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';

export type TDataTableViewOptionsProps<TData extends RowData> = {
  table: ReactTable<TData>;
};

export function DataTableViewOptions<TData extends RowData>({
  table,
}: TDataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="md" className="ms-auto flex gap-2">
          <Settings2 className="size-4" />
          All columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table.getAllColumns().flatMap((column) =>
          typeof column.accessorFn !== 'undefined' && column.getCanHide()
            ? [
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className={column.columnDef.meta?.label ? '' : 'capitalize'}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.meta?.label ?? column.id}
                </DropdownMenuCheckboxItem>,
              ]
            : []
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
