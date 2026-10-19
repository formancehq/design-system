import * as React from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/registry/default/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/table';

export type TDataTableSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The number of columns in the table. */
  columnCount: number;
  /**
   * The total number of rows in the table. With `withColumnsOptions` it
   * includes the header row; without, it counts the body rows only.
   * @default 10
   */
  rowCount?: number;
  /** The number of search inputs in the toolbar. @default 0 */
  searchableColumnCount?: number;
  /** The number of faceted filters in the toolbar. @default 0 */
  filterableColumnCount?: number;
  /** Whether the toolbar shows the view options control. @default true */
  showViewOptions?: boolean;
  /**
   * The width of each cell, one CSS width per column.
   * @default ['auto']
   */
  cellWidths?: string[];
  /** Whether the header row is drawn. @default true */
  withColumnsOptions?: boolean;
  /** Whether the pagination bar is drawn. @default true */
  withPagination?: boolean;
  /** Whether the cells keep their width instead of shrinking. @default false */
  shrinkZero?: boolean;
};

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = true,
  cellWidths = ['auto'],
  withColumnsOptions = true,
  withPagination = true,
  shrinkZero = false,
  className,
  ...props
}: TDataTableSkeletonProps) {
  const bodyRowCount = withColumnsOptions
    ? Math.max(0, rowCount - 1)
    : rowCount;
  const cellStyle = (index: number): React.CSSProperties => ({
    width: cellWidths[index],
    minWidth: shrinkZero ? cellWidths[index] : 'auto',
  });

  return (
    <div
      className={cn('w-full space-y-2.5 overflow-auto', className)}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-x-2 overflow-auto p-1">
        <div className="flex flex-1 items-center gap-x-2">
          {Array.from({ length: searchableColumnCount }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-40 lg:w-60" />
          ))}
          {Array.from({ length: filterableColumnCount }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-[4.5rem] border-dashed" />
          ))}
        </div>
        {showViewOptions && (
          <Skeleton className="ms-auto hidden h-7 w-[4.5rem] lg:flex" />
        )}
      </div>
      <Table>
        {withColumnsOptions && (
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableHead key={j} style={cellStyle(j)}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: bodyRowCount }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableCell key={j} style={cellStyle(j)}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {withPagination && (
        <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
          <Skeleton className="h-7 w-40 shrink-0" />
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-[4.5rem]" />
            </div>
            <Skeleton className="h-7 w-20" />
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
