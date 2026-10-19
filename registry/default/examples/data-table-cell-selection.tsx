'use client';

import { useState } from 'react';

import { DataTable } from '@/components/ui-fragments/data-table/data-table';
import type {
  ColumnDef,
  ReactTable,
} from '@/components/ui-fragments/data-table/data-table-features';

type TBalance = {
  account: string;
  asset: string;
  input: number;
  output: number;
};

const data: TBalance[] = [
  { account: 'users:alice:main', asset: 'USD/2', input: 12500, output: 250 },
  { account: 'users:bob:main', asset: 'EUR/2', input: 4999, output: 0 },
  { account: 'users:carol:wallet', asset: 'USD/2', input: 100000, output: 0 },
  { account: 'platform:fees', asset: 'USD/2', input: 250, output: 0 },
];

const columns: ColumnDef<TBalance>[] = [
  {
    accessorKey: 'account',
    header: 'Account',
    cell: ({ row }) => (
      <span className="font-mono">{row.original.account}</span>
    ),
    size: 200,
  },
  { accessorKey: 'asset', header: 'Asset', size: 100 },
  { accessorKey: 'input', header: 'Input', size: 120 },
  { accessorKey: 'output', header: 'Output', size: 120 },
];

export default function DataTableCellSelectionExample() {
  const [table, setTable] = useState<ReactTable<TBalance>>();

  return (
    <div className="w-full max-w-2xl space-y-2">
      <DataTable
        columns={columns}
        data={data}
        getRowId={(balance) => balance.account}
        displayPagination={false}
        onTableReady={setTable}
        tableOptions={{
          enableRowSelection: false,
          enableCellSelection: true,
        }}
      />
      <p className="text-sm text-muted-foreground">
        {table && (
          <table.Subscribe source={table.atoms.cellSelection}>
            {() => <>{table.getSelectedCellCount()} cells selected. </>}
          </table.Subscribe>
        )}
        Drag to select a range; hold Shift to extend it, Ctrl or Cmd to add
        another.
      </p>
    </div>
  );
}
