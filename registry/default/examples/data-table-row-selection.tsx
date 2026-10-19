'use client';

import { useState } from 'react';

import type { RowSelectionState } from '@tanstack/react-table';

import { DataTable } from '@/components/ui-fragments/data-table/data-table';
import type { ColumnDef } from '@/components/ui-fragments/data-table/data-table-features';
import { Badge } from '@/registry/default/ui/badge';
import { Checkbox } from '@/registry/default/ui/checkbox';

type TAccount = {
  address: string;
  asset: string;
  balance: number;
  locked: boolean;
};

const data: TAccount[] = [
  {
    address: 'users:alice:main',
    asset: 'USD/2',
    balance: 12250,
    locked: false,
  },
  { address: 'users:bob:main', asset: 'EUR/2', balance: 4999, locked: false },
  { address: 'world', asset: 'USD/2', balance: -112750, locked: true },
  { address: 'platform:fees', asset: 'USD/2', balance: 250, locked: true },
  {
    address: 'users:carol:wallet',
    asset: 'USD/2',
    balance: 100000,
    locked: false,
  },
];

const columns: ColumnDef<TAccount>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.address}`}
      />
    ),
    size: 47,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => (
      <span className="font-mono">{row.original.address}</span>
    ),
    size: 200,
  },
  { accessorKey: 'asset', header: 'Asset', size: 100 },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => (
      <div className="text-end font-mono">{row.original.balance}</div>
    ),
    size: 120,
  },
  {
    id: 'locked',
    header: 'Selectable',
    cell: ({ row }) =>
      row.original.locked ? (
        <Badge variant="warning">Locked</Badge>
      ) : (
        <Badge variant="valid">Yes</Badge>
      ),
    size: 120,
  },
];

export default function DataTableRowSelectionExample() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedAddresses = Object.keys(rowSelection);

  return (
    <div className="w-full max-w-2xl space-y-2">
      <DataTable
        columns={columns}
        data={data}
        getRowId={(account) => account.address}
        displayPagination={false}
        tableOptions={{
          enableRowSelection: (row) => !row.original.locked,
          state: { rowSelection },
          onRowSelectionChange: setRowSelection,
        }}
      />
      <p className="text-sm text-muted-foreground">
        {selectedAddresses.length > 0
          ? `Selected: ${selectedAddresses.join(', ')}`
          : 'No account selected. Locked accounts cannot be selected.'}
      </p>
    </div>
  );
}
