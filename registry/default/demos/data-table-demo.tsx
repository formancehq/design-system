'use client';

import { DataTable } from '@/components/ui-fragments/data-table/data-table';
import { DataTableColumnHeader } from '@/components/ui-fragments/data-table/data-table-column-header';
import type { ColumnDef } from '@/components/ui-fragments/data-table/data-table-features';
import { DataTableRowActions } from '@/components/ui-fragments/data-table/data-table-row-actions';
import { Badge } from '@/registry/default/ui/badge';
import { Checkbox } from '@/registry/default/ui/checkbox';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/registry/default/ui/dropdown-menu';

type TPayment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const data: TPayment[] = [
  {
    id: 'pay_m5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: 'pay_3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'abe45@gmail.com',
  },
  {
    id: 'pay_derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'monserrat44@gmail.com',
  },
  {
    id: 'pay_5kma53ae',
    amount: 874,
    status: 'success',
    email: 'silas22@gmail.com',
  },
  {
    id: 'pay_bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
  {
    id: 'pay_x8k2p1n3',
    amount: 150,
    status: 'pending',
    email: 'alex@example.com',
  },
  {
    id: 'pay_r4t7w9q2',
    amount: 499,
    status: 'processing',
    email: 'jordan@company.io',
  },
  {
    id: 'pay_l6m3v8j5',
    amount: 1200,
    status: 'success',
    email: 'taylor@startup.co',
  },
];

const statusVariant: Record<
  TPayment['status'],
  'valid' | 'info' | 'destructive' | 'warning'
> = {
  success: 'valid',
  processing: 'info',
  failed: 'destructive',
  pending: 'warning',
};

const columns: ColumnDef<TPayment>[] = [
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
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 47,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={statusVariant[row.getValue<TPayment['status']>('status')]}
      >
        {row.getValue<string>('status')}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.getValue<number>('amount'));

      return <div className="text-end font-mono font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    size: 56,
    enableHiding: false,
    enableResizing: false,
    cell: ({ row }) => (
      <DataTableRowActions>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View payment</DropdownMenuItem>
        </DropdownMenuContent>
      </DataTableRowActions>
    ),
  },
];

export default function DataTableDemo() {
  return (
    <DataTable
      columns={columns}
      data={data}
      initialState={{
        sorting: [{ id: 'amount', desc: true }],
        pagination: { pageSize: 5 },
      }}
      searchConfig={[{ placeholder: 'Filter emails...', columnKey: 'email' }]}
      filtersConfig={[
        {
          title: 'Status',
          column: 'status',
          options: [
            { label: 'Success', value: 'success', variant: 'valid' },
            { label: 'Processing', value: 'processing', variant: 'info' },
            { label: 'Failed', value: 'failed', variant: 'destructive' },
            { label: 'Pending', value: 'pending', variant: 'warning' },
          ],
        },
      ]}
    />
  );
}
