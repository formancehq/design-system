'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye, Server } from 'lucide-react';

import { AppCard } from '@/components/ui-fragments/app-card';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { DataTable } from '@/components/ui-fragments/data-table';

type TLedger = {
  name: string;
  bucket: string;
  addedAt: string;
  status: 'active' | 'archived';
};

const data: TLedger[] = [
  { name: 'main', bucket: '_default', addedAt: '2024-09-12', status: 'active' },
  {
    name: 'payments-eu',
    bucket: '_default',
    addedAt: '2024-10-04',
    status: 'active',
  },
  {
    name: 'rewards',
    bucket: 'rewards',
    addedAt: '2024-11-21',
    status: 'archived',
  },
  {
    name: 'treasury',
    bucket: '_default',
    addedAt: '2025-01-08',
    status: 'active',
  },
];

const columns: ColumnDef<TLedger>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.name}</span>
    ),
  },
  { accessorKey: 'bucket', header: 'Bucket' },
  { accessorKey: 'addedAt', header: 'Added At' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'valid' : 'slate'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: () => (
      <div className="text-right">
        <Button variant="secondary" size="icon-md">
          <Eye />
        </Button>
      </div>
    ),
  },
];

export default function AppCardWithDataTableExample() {
  return (
    <div className="w-full max-w-3xl">
      <AppCard
        title="Ledgers"
        appIcon={Server}
        iconVariant="cobalt"
        headerAction={<Button size="sm">Create ledger</Button>}
      >
        <DataTable
          columns={columns}
          data={data}
          searchConfig={[
            { placeholder: 'Search ledgers...', columnKey: 'name' },
          ]}
        />
      </AppCard>
    </div>
  );
}
