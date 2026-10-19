'use client';

import * as React from 'react';

import { RowData } from '@tanstack/react-table';

import type {
  ReactTable,
  Row,
} from '@/components/ui-fragments/data-table/data-table-features';
import { getCommonPinningStyles } from '@/components/ui-fragments/data-table/data-table-pinning';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/table';

export type TDataTableContentProps<TData extends RowData> = {
  table: ReactTable<TData>;
  /** Drawn under an expanded row, across all its cells. */
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  /**
   * Drawn instead of the table when the data has no row. A filter that leaves
   * no row shows "No results." in the table instead.
   */
  emptyState?: React.ReactNode;
};

function DataTableHeader<TData extends RowData>({
  table,
  hasStartPinnedColumns,
  withResizeHandles,
}: {
  table: ReactTable<TData>;
  hasStartPinnedColumns: boolean;
  withResizeHandles: boolean;
}) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className="relative whitespace-nowrap"
              style={getCommonPinningStyles(
                header.column,
                false,
                hasStartPinnedColumns
              )}
            >
              {header.isPlaceholder ? null : (
                <table.FlexRender header={header} />
              )}
              {withResizeHandles && header.column.getCanResize() && (
                <div
                  onDoubleClick={() => header.column.resetSize()}
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  role="separator"
                  tabIndex={-1}
                  aria-label="Resize column"
                  aria-hidden="true"
                  aria-orientation="vertical"
                  data-resizing={header.column.getIsResizing()}
                  className="absolute inset-y-0 end-0 w-[5px] cursor-col-resize touch-none select-none bg-transparent opacity-0 transition-opacity duration-200 hover:opacity-50 data-[resizing=true]:bg-primary data-[resizing=true]:opacity-100"
                />
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export function DataTableContent<TData extends RowData>({
  table,
  renderExpandedRow,
  emptyState,
}: TDataTableContentProps<TData>) {
  const rows = table.getRowModel().rows;
  const hasData = table.getCoreRowModel().rows.length > 0;
  const hasStartPinnedColumns = table.state.columnPinning.start.length > 0;
  const selectsCells = table.options.enableCellSelection !== false;

  if (!hasData) {
    if (emptyState) {
      return emptyState;
    }

    return (
      <div className="overflow-hidden rounded-md border border-border [&_[data-slot=table-container]]:rounded-none [&_[data-slot=table-container]]:border-0">
        <Table className="border-separate border-spacing-0">
          <DataTableHeader
            table={table}
            hasStartPinnedColumns={hasStartPinnedColumns}
            withResizeHandles={false}
          />
        </Table>
        <div className="flex h-24 items-center justify-center bg-card text-center">
          No results.
        </div>
      </div>
    );
  }

  return (
    <Table className="border-separate border-spacing-0">
      <DataTableHeader
        table={table}
        hasStartPinnedColumns={hasStartPinnedColumns}
        withResizeHandles
      />
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={table.getVisibleLeafColumns().length}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
        {rows.map((row, rowIndex) => {
          const isLastRow = rowIndex === rows.length - 1;
          const showsExpandedRow =
            row.getIsExpanded() && renderExpandedRow !== undefined;

          return (
            <React.Fragment key={row.id}>
              <TableRow data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    {...(selectsCells &&
                      cell.getCanSelect() && {
                        'data-selected': cell.getIsSelected(),
                        onMouseDown: cell.getSelectionStartHandler(),
                        onMouseEnter: cell.getSelectionExtendHandler(),
                      })}
                    className={
                      selectsCells
                        ? 'select-none data-[selected=true]:bg-accent'
                        : undefined
                    }
                    style={getCommonPinningStyles(
                      cell.column,
                      isLastRow && !showsExpandedRow,
                      hasStartPinnedColumns
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
              {showsExpandedRow && (
                <TableRow>
                  <TableCell
                    colSpan={row.getVisibleCells().length}
                    className="p-0"
                    style={{
                      borderBlockEnd: isLastRow
                        ? undefined
                        : '1px solid var(--border)',
                    }}
                  >
                    {renderExpandedRow(row)}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
