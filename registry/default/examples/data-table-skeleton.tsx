import { DataTableSkeleton } from '@/registry/default/ui/data-table';

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
