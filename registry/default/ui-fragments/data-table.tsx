'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnVisibilityFeature,
  ColumnFiltersState,
  ColumnVisibilityState,
  Column as TanStackColumn,
  ColumnDef as TanStackColumnDef,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  PaginationState,
  ReactTable,
  RowData,
  Row as TanStackRow,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  SortingState,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Ellipsis,
  EyeOff,
  Settings2,
  X,
} from 'lucide-react';

import { CSSProperties } from 'react';

import { cn } from '@/lib/utils';
import { Badge, type TBadgeProps } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/registry/default/ui/command';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { Input } from '@/registry/default/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
import { Separator } from '@/registry/default/ui/separator';
import { Skeleton } from '@/registry/default/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/table';

// v9 registers features per table instead of bundling every one of them. This
// fragment filters, sorts, paginates, selects rows, toggles column visibility
// and reads facets — nothing else, so nothing else is registered, and the rest
// of TanStack Table tree-shakes away.
const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  // Registered for `getIsFirstColumn`, which the cell-border helper calls — v9
  // moved it onto the ordering feature. Nothing here reorders columns.
  columnOrderingFeature,
  columnVisibilityFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

// v9 threads the registered feature set through every table type. Binding it
// once here keeps the declarations below reading as they did on v8.
type Column<TData extends RowData, TValue = unknown> = TanStackColumn<
  typeof dataTableFeatures,
  TData,
  TValue
>;
type ColumnDef<TData extends RowData, TValue = unknown> = TanStackColumnDef<
  typeof dataTableFeatures,
  TData,
  TValue
>;
type Row<TData extends RowData> = TanStackRow<typeof dataTableFeatures, TData>;
type TanstackTable<TData extends RowData> = ReactTable<
  typeof dataTableFeatures,
  TData
>;

// v9 dropped `InitialTableState` and made each state slice fully required, so
// these are the slices a caller may seed, with the fields it actually sets.
type InitialTableState = {
  columnFilters?: ColumnFiltersState;
  columnVisibility?: ColumnVisibilityState;
  pagination?: Omit<PaginationState, 'pageIndex'> & { pageIndex?: number };
  sorting?: SortingState;
};

// ---------------------------------------------------------------------------
// Cell border styles (matches platform-ui column/row separators)
// ---------------------------------------------------------------------------

function getCellBorderStyles<TData extends RowData>(
  column: Column<TData>,
  isLastRow: boolean
): CSSProperties {
  const isFirstColumn = column.getIsFirstColumn();

  return {
    borderLeft: !isFirstColumn ? '1px solid var(--border)' : undefined,
    borderBottom: !isLastRow ? '1px solid var(--border)' : undefined,
  };
}

// ---------------------------------------------------------------------------
// DataTableColumnHeader
// ---------------------------------------------------------------------------

type TDataTableColumnHeaderProps<
  TData extends RowData,
  TValue,
> = React.HTMLAttributes<HTMLDivElement> & {
  column: Column<TData, TValue>;
  title: string;
};

function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: TDataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTableFacetedFilter
// ---------------------------------------------------------------------------

type TFacetedFilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: TBadgeProps['variant'];
};

type TDataTableFacetedFilterProps<TData extends RowData, TValue> = {
  column?: Column<TData, TValue>;
  title?: string;
  options: TFacetedFilterOption[];
};

function DataTableFacetedFilter<TData extends RowData, TValue>({
  column,
  title,
  options,
}: TDataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outlineDashed"
          data-testid={`datatable-filter-${title?.toLowerCase()}`}
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          <span>{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="space-x-1 flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant={option.variant ?? 'primary'}
                        key={option.value}
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? "bg-primary text-primary-foreground! [&_svg:not([class*='text-'])]:text-primary-foreground"
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      {isSelected && <Check className={cn('h-4 w-4')} />}
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// DataTableViewOptions
// ---------------------------------------------------------------------------

type TDataTableViewOptionsProps<TData extends RowData> = {
  table: TanstackTable<TData>;
};

function DataTableViewOptions<TData extends RowData>({
  table,
}: TDataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 flex">
          <Settings2 className="mr-2 h-4 w-4" />
          All columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// DataTableToolbar
// ---------------------------------------------------------------------------

type TDataTableToolbarProps<TData extends RowData> = {
  table: TanstackTable<TData>;
  searchConfig?: {
    placeholder: string;
    columnKey: string;
    size?: 'sm' | 'md' | 'lg';
  }[];
  filtersConfig?: {
    title: string;
    column: string;
    options: TFacetedFilterOption[];
  }[];
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
};

function DataTableToolbar<TData extends RowData>({
  table,
  searchConfig,
  filtersConfig,
  toolbarLeft,
  toolbarRight,
}: TDataTableToolbarProps<TData>) {
  const isFiltered = table.state.columnFilters.length > 0;

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        {toolbarLeft}
        {searchConfig?.map((search, index) => (
          <Input
            key={index}
            placeholder={search.placeholder}
            value={
              (table.getColumn(search.columnKey)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn(search.columnKey)
                ?.setFilterValue(event.target.value)
            }
            className={cn('', {
              'w-28': search.size === 'sm',
              'w-40 lg:w-52': search.size === 'md' || !search.size,
              'w-56': search.size === 'lg',
            })}
          />
        ))}
        {filtersConfig?.map((filter, index) => {
          const col = table.getColumn(filter.column);
          if (!col) return null;

          return (
            <DataTableFacetedFilter
              key={index}
              column={col}
              title={filter.title}
              options={filter.options}
            />
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.setColumnFilters([])}
            className="h-8 px-2 lg:px-3 ml-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {toolbarRight}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTablePagination
// ---------------------------------------------------------------------------

type TDataTablePaginationProps<TData extends RowData> = {
  table: TanstackTable<TData>;
};

function DataTablePagination<TData extends RowData>({
  table,
}: TDataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2 mr-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.state.pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 15, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium mr-2">
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTableRowActions
// ---------------------------------------------------------------------------

type TDataTableRowActionsProps = {
  children: React.ReactNode;
};

function DataTableRowActions({ children }: TDataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// DataTableSkeleton
// ---------------------------------------------------------------------------

type TDataTableSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  columnCount: number;
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  showViewOptions?: boolean;
  cellWidths?: string[];
  withHeader?: boolean;
  withPagination?: boolean;
  shrinkZero?: boolean;
};

function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = true,
  cellWidths = ['auto'],
  withHeader = true,
  withPagination = true,
  shrinkZero = false,
  className,
  ...props
}: TDataTableSkeletonProps) {
  return (
    <div
      className={cn('w-full space-y-2.5 overflow-auto', className)}
      {...props}
    >
      <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumnCount > 0
            ? Array.from({ length: searchableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-40 lg:w-60" />
              ))
            : null}
          {filterableColumnCount > 0
            ? Array.from({ length: filterableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-[4.5rem] border-dashed" />
              ))
            : null}
        </div>
        {showViewOptions ? (
          <Skeleton className="ml-auto hidden h-7 w-[4.5rem] lg:flex" />
        ) : null}
      </div>
      <div className="rounded-md border border-border">
        <Table>
          {withHeader && (
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({
              length: withHeader ? Math.max(0, rowCount - 1) : rowCount,
            }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
          <Skeleton className="h-7 w-40 shrink-0" />
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-[4.5rem]" />
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------

type TDataTableProps<TData extends RowData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  initialState?: InitialTableState;
  displayPagination?: boolean;
  emptyState?: React.ReactNode;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  // Passthrough to TanStack. Left `undefined` (its defaults) unless a consumer
  // opts out — e.g. to silence the StrictMode "update on a not-yet-mounted
  // component" dev warning caused by TanStack's microtask-queued auto-resets.
  autoResetPageIndex?: boolean;
  autoResetExpanded?: boolean;
  searchConfig?: TDataTableToolbarProps<TData>['searchConfig'];
  filtersConfig?: TDataTableToolbarProps<TData>['filtersConfig'];
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  hideToolbar?: boolean;
  onTableReady?: (table: TanstackTable<TData>) => void;
};

function DataTable<TData extends RowData>({
  columns,
  data,
  searchConfig,
  filtersConfig,
  initialState,
  displayPagination = true,
  toolbarRight,
  toolbarLeft,
  emptyState,
  autoResetPageIndex,
  autoResetExpanded,
  hideToolbar = false,
  onTableReady,
}: TDataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>(initialState?.columnVisibility ?? {});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? []
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    // v9 wants a whole slice wherever a slice appears, while a caller seeds
    // only the field it cares about — most often `pagination.pageSize`.
    initialState: initialState && {
      ...initialState,
      pagination: initialState.pagination && {
        pageIndex: 0,
        ...initialState.pagination,
      },
    },
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    enableRowSelection: true,
    autoResetPageIndex,
    autoResetExpanded,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const hasData = data.length > 0;

  useEffect(() => {
    onTableReady?.(table);
  }, [onTableReady, table]);

  return (
    <div className="space-y-4 w-full">
      {!hideToolbar && (
        <DataTableToolbar
          table={table}
          filtersConfig={filtersConfig}
          searchConfig={searchConfig}
          toolbarRight={toolbarRight}
          toolbarLeft={toolbarLeft}
        />
      )}

      {hasData ? (
        <div className="rounded-md border border-border">
          <Table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="whitespace-nowrap"
                      style={getCellBorderStyles(header.column, false)}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => {
                  const isLastRow =
                    rowIndex === table.getRowModel().rows.length - 1;

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={getCellBorderStyles(cell.column, isLastRow)}
                        >
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : emptyState ? (
        emptyState
      ) : (
        <div className="rounded-md border border-border">
          <Table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="whitespace-nowrap"
                      style={getCellBorderStyles(header.column, false)}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {displayPagination && <DataTablePagination table={table} />}
    </div>
  );
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableRowActions,
  DataTableSkeleton,
  DataTableToolbar,
  DataTableViewOptions,
};

export type {
  ColumnDef,
  TDataTableColumnHeaderProps,
  TDataTablePaginationProps,
  TDataTableProps,
  TDataTableRowActionsProps,
  TDataTableSkeletonProps,
  TDataTableToolbarProps,
  TDataTableViewOptionsProps,
  TFacetedFilterOption,
};
