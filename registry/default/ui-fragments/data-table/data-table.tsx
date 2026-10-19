'use client';

import * as React from 'react';
import { useEffect, useEffectEvent, useMemo } from 'react';

import { RowData, useTable } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { DataTableContent } from '@/components/ui-fragments/data-table/data-table-content';
import {
  type ColumnDef,
  dataTableFeatures,
  type InitialTableState,
  type ReactTable,
  type Row,
  type TDataTableOptions,
} from '@/components/ui-fragments/data-table/data-table-features';
import { DataTablePagination } from '@/components/ui-fragments/data-table/data-table-pagination';
import {
  DataTableToolbar,
  type TDataTableToolbarProps,
} from '@/components/ui-fragments/data-table/data-table-toolbar';
import { Button } from '@/registry/default/ui/button';

export type TDataTableProps<TData extends RowData> = {
  columns: ColumnDef<TData>[];
  /** The rows. `undefined` reads as no row, while the data loads. */
  data: TData[] | undefined;
  /** The state the table starts from. Read once, on the first render. */
  initialState?: InitialTableState;
  emptyState?: React.ReactNode;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  /** The id of a row. Without it, the id is the row index. */
  getRowId?: (row: TData, index: number) => string;
  autoResetPageIndex?: boolean;
  autoResetExpanded?: boolean;
  /** Whether the pager is drawn under the table. Default `true`. */
  displayPagination?: boolean;
  /** Hides the toolbar whatever its other props say. Default `false`. */
  hideToolbar?: boolean;
  /**
   * Hands the table to the caller once, on mount, to drive it from outside
   * the toolbar. Its methods read the live state; to re-render on a change,
   * wrap the reader in `table.Subscribe`.
   */
  onTableReady?: (table: ReactTable<TData>) => void;
  /**
   * Any other TanStack option, passed to `useTable` as is: turn row selection
   * off, turn cell selection on, control a state slice, listen to a change.
   */
  tableOptions?: TDataTableOptions<TData>;
} & Pick<
  TDataTableToolbarProps<TData>,
  | 'searchConfig'
  | 'filtersConfig'
  | 'displayViewOptions'
  | 'toolbarLeft'
  | 'toolbarRight'
>;

export function DataTable<TData extends RowData>({
  columns,
  data,
  initialState,
  emptyState,
  renderExpandedRow,
  getRowCanExpand,
  getRowId,
  autoResetPageIndex,
  autoResetExpanded,
  displayPagination = true,
  hideToolbar = false,
  onTableReady,
  tableOptions,
  searchConfig,
  filtersConfig,
  displayViewOptions,
  toolbarLeft,
  toolbarRight,
}: TDataTableProps<TData>) {
  const rows = useMemo(() => data ?? [], [data]);

  const table = useTable({
    enableRowSelection: true,
    enableCellSelection: false,
    columnResizeMode: 'onChange',
    ...tableOptions,
    features: dataTableFeatures,
    data: rows,
    columns,
    initialState: {
      ...initialState,
      columnPinning: {
        start: initialState?.columnPinning?.start ?? [],
        end: initialState?.columnPinning?.end ?? [],
      },
      pagination: initialState?.pagination && {
        pageIndex: 0,
        ...initialState.pagination,
      },
    },
    autoResetPageIndex,
    autoResetExpanded,
    getRowCanExpand,
    getRowId,
  });

  const handOverTable = useEffectEvent(() => onTableReady?.(table));

  useEffect(() => {
    handOverTable();
  }, []);

  return (
    <div className="w-full space-y-4">
      {!hideToolbar && (
        <DataTableToolbar
          table={table}
          searchConfig={searchConfig}
          filtersConfig={filtersConfig}
          displayViewOptions={displayViewOptions}
          toolbarLeft={toolbarLeft}
          toolbarRight={toolbarRight}
        />
      )}
      <DataTableContent
        table={table}
        renderExpandedRow={renderExpandedRow}
        emptyState={emptyState}
      />
      {displayPagination && <DataTablePagination table={table} />}
    </div>
  );
}

export function createExpandColumn<TData extends RowData>(): ColumnDef<TData> {
  return {
    id: 'expand',
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => row.toggleExpanded()}
          aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          aria-expanded={row.getIsExpanded()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown />
          ) : (
            <ChevronRight className="rtl:rotate-180" />
          )}
        </Button>
      ) : null,
    size: 47,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  };
}
