'use client';

import { useState } from 'react';

import { useTable } from '@tanstack/react-table';

import { DataTableContent } from '@/components/ui-fragments/data-table/data-table-content';
import {
  type ColumnDef,
  dataTableFeatures,
} from '@/components/ui-fragments/data-table/data-table-features';
import { DataTablePageSizeSelect } from '@/components/ui-fragments/data-table/data-table-pagination';
import { DataTableToolbar } from '@/components/ui-fragments/data-table/data-table-toolbar';
import { Button } from '@/registry/default/ui/button';

type TLog = {
  id: number;
  type: string;
};

const LOGS: TLog[] = Array.from({ length: 23 }, (_, index) => ({
  id: 23 - index,
  type: index % 3 === 0 ? 'NEW_TRANSACTION' : 'SET_METADATA',
}));

const readPage = (cursor: number, pageSize: number) => ({
  data: LOGS.slice(cursor, cursor + pageSize),
  next: cursor + pageSize < LOGS.length ? cursor + pageSize : undefined,
});

const columns: ColumnDef<TLog>[] = [
  { accessorKey: 'id', header: 'ID', size: 80 },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <span className="font-mono">{row.original.type}</span>,
    size: 220,
  },
];

export default function DataTableCursorPagerExample() {
  const [pageSize, setPageSize] = useState(5);
  const [cursors, setCursors] = useState([0]);
  const page = readPage(cursors.at(-1) ?? 0, pageSize);
  const nextCursor = page.next;

  const table = useTable({
    features: dataTableFeatures,
    data: page.data,
    columns,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: -1,
  });

  return (
    <div className="w-full max-w-2xl space-y-4">
      <DataTableToolbar table={table} toolbarLeft="Logs" />
      <DataTableContent table={table} />
      <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <DataTablePageSizeSelect
          value={pageSize}
          onValueChange={(size) => {
            setPageSize(size);
            setCursors([0]);
          }}
        />
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            size="md"
            disabled={cursors.length === 1}
            onClick={() => setCursors((current) => current.slice(0, -1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="md"
            disabled={nextCursor === undefined}
            onClick={() =>
              nextCursor !== undefined &&
              setCursors((current) => [...current, nextCursor])
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
