'use client';

import { RowData } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { ReactTable } from '@/components/ui-fragments/data-table/data-table-features';
import { Button } from '@/registry/default/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

const PAGE_SIZES = [2, 5, 10, 15, 20, 30, 40, 50];

export type TDataTablePageSizeSelectProps = {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
};

/** The "Rows per page" select, for a custom pager. */
export function DataTablePageSizeSelect({
  value,
  onValueChange,
  disabled,
}: TDataTablePageSizeSelectProps) {
  return (
    <div className="me-2 flex items-center gap-x-2">
      <p className="text-sm font-medium">Rows per page</p>
      <Select
        disabled={disabled}
        value={`${value}`}
        onValueChange={(size) => onValueChange(Number(size))}
      >
        <SelectTrigger
          className="w-[70px]"
          aria-label="Rows per page"
          data-testid="datatable-page-size-selector"
        >
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent side="top">
          {PAGE_SIZES.map((size) => (
            <SelectItem
              key={size}
              value={`${size}`}
              data-testid={`datatable-page-size-${size}`}
            >
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type TDataTablePaginationProps<TData extends RowData> = {
  table: ReactTable<TData>;
};

export function DataTablePagination<TData extends RowData>({
  table,
}: TDataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;

  return (
    <div
      className="flex flex-wrap items-center justify-end gap-y-2 px-2"
      data-testid="datatable-pagination"
    >
      <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 lg:gap-x-8">
        <DataTablePageSizeSelect
          value={pageSize}
          onValueChange={(size) => table.setPageSize(size)}
        />

        <div className="me-2 flex items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            type="button"
            aria-label="Go to previous page"
            data-testid="datatable-previous-page"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
            Previous
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            type="button"
            aria-label="Go to next page"
            data-testid="datatable-next-page"
          >
            Next
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
