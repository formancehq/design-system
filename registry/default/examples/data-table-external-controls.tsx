'use client';

import { useState } from 'react';

import { DataTable } from '@/components/ui-fragments/data-table/data-table';
import { DataTableColumnHeader } from '@/components/ui-fragments/data-table/data-table-column-header';
import type {
  ColumnDef,
  ReactTable,
} from '@/components/ui-fragments/data-table/data-table-features';
import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';

type TTransaction = {
  id: number;
  reference: string;
  amount: number;
};

const data: TTransaction[] = [
  { id: 1045, reference: 'payout-7790', amount: 2300 },
  { id: 1044, reference: 'refund-1181', amount: 450 },
  { id: 1043, reference: 'topup-0913', amount: 10000 },
  { id: 1042, reference: 'payout-7781', amount: 12500 },
  { id: 1041, reference: 'refund-1180', amount: 4999 },
];

const columns: ColumnDef<TTransaction>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    size: 90,
  },
  {
    accessorKey: 'reference',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{row.original.reference}</span>
    ),
    size: 200,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div className="text-end font-mono">{row.original.amount}</div>
    ),
    size: 120,
  },
];

export default function DataTableExternalControlsExample() {
  const [table, setTable] = useState<ReactTable<TTransaction>>();

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="w-56"
          placeholder="Search references..."
          aria-label="Search references"
          onChange={(event) =>
            table?.getColumn('reference')?.setFilterValue(event.target.value)
          }
        />
        <Button
          variant="outline"
          size="md"
          onClick={() => table?.setSorting([{ id: 'amount', desc: true }])}
        >
          Largest first
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => table?.resetSorting(true)}
        >
          Reset order
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        hideToolbar
        displayPagination={false}
        onTableReady={setTable}
      />
    </div>
  );
}
