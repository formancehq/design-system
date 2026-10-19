import {
  ColumnDef as TanStackColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
  Column as TanStackColumn,
  ExpandedState,
  PaginationState,
  ReactTable as TanStackReactTable,
  Row as TanStackRow,
  RowData,
  RowModel as TanStackRowModel,
  SortingState,
  TableOptions as TanStackTableOptions,
  cellSelectionFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_weakEquals,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table';

export type TDataTableColumnMeta = {
  /**
   * The column's name in the "All columns" picker, for a column whose header
   * is drawn by a function (a tooltip, an icon). Without it the picker falls
   * back to the column id.
   */
  label?: string;
};

export const dataTableFeatures = tableFeatures({
  cellSelectionFeature,
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnVisibilityFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    arrIncludes: filterFn_arrIncludes,
    equals: filterFn_equals,
    inDateRange: filterFn_inDateRange,
    inNumberRange: filterFn_inNumberRange,
    includesString: filterFn_includesString,
    weakEquals: filterFn_weakEquals,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: metaHelper<TDataTableColumnMeta>(),
});

export type TDataTableFeatures = typeof dataTableFeatures;

export type ColumnDef<
  TData extends RowData,
  TValue = unknown,
> = TanStackColumnDef<TDataTableFeatures, TData, TValue>;
export type Column<TData extends RowData, TValue = unknown> = TanStackColumn<
  TDataTableFeatures,
  TData,
  TValue
>;
export type Row<TData extends RowData> = TanStackRow<TDataTableFeatures, TData>;
export type RowModel<TData extends RowData> = TanStackRowModel<
  TDataTableFeatures,
  TData
>;
export type ReactTable<TData extends RowData> = TanStackReactTable<
  TDataTableFeatures,
  TData
>;
export type TableOptions<TData extends RowData> = TanStackTableOptions<
  TDataTableFeatures,
  TData
>;

/**
 * TanStack options passed to `useTable` as is. The table sets `features`,
 * `data` and `columns`; the options that have their own prop are omitted.
 */
export type TDataTableOptions<TData extends RowData> = Omit<
  Partial<TableOptions<TData>>,
  | 'features'
  | 'data'
  | 'columns'
  | 'initialState'
  | 'getRowId'
  | 'getRowCanExpand'
  | 'autoResetPageIndex'
  | 'autoResetExpanded'
>;

/** The state slices a table can start from. Each slice may be partial. */
export type InitialTableState = {
  columnFilters?: ColumnFiltersState;
  columnPinning?: Partial<ColumnPinningState>;
  columnSizing?: ColumnSizingState;
  columnVisibility?: ColumnVisibilityState;
  expanded?: ExpandedState;
  pagination?: Omit<PaginationState, 'pageIndex'> & { pageIndex?: number };
  sorting?: SortingState;
};
