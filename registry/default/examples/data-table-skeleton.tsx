import { DataTableSkeleton } from '@/components/ui-fragments/data-table/data-table-skeleton';

export default function DataTableSkeletonExample() {
  return (
    <DataTableSkeleton
      columnCount={4}
      rowCount={6}
      searchableColumnCount={1}
      filterableColumnCount={1}
    />
  );
}
