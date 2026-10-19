'use client';

import * as React from 'react';

import { RowData } from '@tanstack/react-table';
import { X } from 'lucide-react';

import {
  DataTableFacetedFilter,
  type TFacetedFilterOption,
} from '@/components/ui-fragments/data-table/data-table-faceted-filter';
import type { ReactTable } from '@/components/ui-fragments/data-table/data-table-features';
import { DataTableViewOptions } from '@/components/ui-fragments/data-table/data-table-view-options';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';

export type TDataTableSearchConfig = {
  placeholder: string;
  columnKey: string;
  size?: 'sm' | 'md' | 'lg';
};

export type TDataTableFilterConfig = {
  title: string;
  column: string;
  options: TFacetedFilterOption[];
  /** What the trigger says once something is picked. Default `badges`. */
  selectionDisplay?: 'badges' | 'count';
};

export type TDataTableToolbarProps<TData extends RowData> = {
  table: ReactTable<TData>;
  searchConfig?: TDataTableSearchConfig[];
  filtersConfig?: TDataTableFilterConfig[];
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  /** Whether the "All columns" control is shown. Default `true`. */
  displayViewOptions?: boolean;
};

export function DataTableToolbar<TData extends RowData>({
  table,
  searchConfig,
  filtersConfig,
  toolbarLeft,
  toolbarRight,
  displayViewOptions = true,
}: TDataTableToolbarProps<TData>) {
  const isFiltered = table.state.columnFilters.length > 0;
  const isEmpty =
    !displayViewOptions &&
    !searchConfig &&
    !filtersConfig &&
    !toolbarLeft &&
    !toolbarRight &&
    !isFiltered;

  if (isEmpty) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div
        className="flex flex-wrap items-center gap-2 *:flex-wrap"
        data-testid="datatable-toolbar-left"
      >
        {toolbarLeft}
        {searchConfig?.map((search, index) => (
          <Input
            key={search.columnKey}
            placeholder={search.placeholder}
            data-testid={`datatable-search-${index}`}
            value={
              (table.getColumn(search.columnKey)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn(search.columnKey)
                ?.setFilterValue(event.target.value)
            }
            className={cn({
              'w-28': search.size === 'sm',
              'w-40 lg:w-52': search.size === 'md' || !search.size,
              'w-56': search.size === 'lg',
            })}
          />
        ))}
        {filtersConfig?.map((filter) => {
          const column = table.getColumn(filter.column);

          return column ? (
            <DataTableFacetedFilter
              key={filter.column}
              column={column}
              title={filter.title}
              options={filter.options}
              selectionDisplay={filter.selectionDisplay}
            />
          ) : null;
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.setColumnFilters([])}
            size="md"
            className="ms-3 gap-2 px-2 lg:px-3"
          >
            Reset
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div
        className="flex flex-wrap items-center gap-2 *:flex-wrap sm:ms-auto sm:justify-end"
        data-testid="datatable-toolbar-right"
      >
        {toolbarRight}
        {displayViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
