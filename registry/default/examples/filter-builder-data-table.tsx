'use client';

import { FilterIcon } from 'lucide-react';
import { useState } from 'react';

import { DataTable } from '@/components/ui-fragments/data-table/data-table';
import type { ColumnDef } from '@/components/ui-fragments/data-table/data-table-features';
import { FilterBuilder } from '@/components/ui-fragments/filter-builder/filter-builder';
import {
  countFilterConditions,
  createFilterGroup,
  filterMatches,
  type TFilterFields,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';

type TTransaction = {
  id: number;
  reference: string;
  source: string;
  destination: string;
  reverted: boolean;
  metadata: Record<string, string>;
};

const transactions: TTransaction[] = [
  {
    id: 12,
    reference: 'order-1001',
    source: 'world',
    destination: 'users:alice',
    reverted: false,
    metadata: { type: 'payment' },
  },
  {
    id: 48,
    reference: 'order-1002',
    source: 'world',
    destination: 'users:bob',
    reverted: true,
    metadata: { type: 'payment' },
  },
  {
    id: 73,
    reference: 'refund-17',
    source: 'users:alice',
    destination: 'world',
    reverted: false,
    metadata: { type: 'refund' },
  },
  {
    id: 104,
    reference: 'refund-18',
    source: 'users:bob',
    destination: 'world',
    reverted: false,
    metadata: { type: 'refund' },
  },
  {
    id: 131,
    reference: 'fee-3',
    source: 'users:alice',
    destination: 'platform:fees',
    reverted: false,
    metadata: { type: 'fee' },
  },
];

const fields: TFilterFields = {
  reference: { label: 'Reference', variant: 'text' },
  source: { label: 'Source', variant: 'text' },
  destination: { label: 'Destination', variant: 'text' },
  metadata: {
    label: 'Metadata',
    variant: 'metadata',
    operators: [
      { label: 'Match', value: 'eq' },
      { label: 'Is not', value: 'ne' },
      { label: 'Is any of', value: 'in' },
    ],
  },
  id: { label: 'ID', variant: 'number' },
  reverted: { label: 'Reverted', variant: 'boolean' },
};

const columns: ColumnDef<TTransaction>[] = [
  { accessorKey: 'id', header: 'ID', size: 80 },
  { accessorKey: 'reference', header: 'Reference' },
  { accessorKey: 'source', header: 'Source' },
  { accessorKey: 'destination', header: 'Destination' },
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.metadata.type}</Badge>
    ),
  },
  {
    accessorKey: 'reverted',
    header: 'Reverted',
    cell: ({ row }) => (row.original.reverted ? 'Yes' : 'No'),
  },
];

/** A transaction's value at a ledger path: `metadata[type]`, `reference`. */
const readTransaction =
  (transaction: TTransaction) =>
  (path: string): unknown => {
    const key = /^metadata\[(.+)\]$/.exec(path)?.[1];

    return key === undefined
      ? transaction[path as keyof TTransaction]
      : transaction.metadata[key];
  };

export default function FilterBuilderDataTable() {
  const [filter, setFilter] = useState(() => createFilterGroup());
  const count = countFilterConditions(filter);
  const rows = transactions.filter((transaction) =>
    filterMatches(filter, fields, readTransaction(transaction))
  );

  return (
    <DataTable
      columns={columns}
      data={rows}
      displayPagination={false}
      displayViewOptions={false}
      toolbarLeft={
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outlineDashed" size="md" className="gap-2">
              <FilterIcon className="size-4" />
              Filters
              {count > 0 && (
                <Badge size="sm" variant="secondary">
                  {count}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[min(56rem,90vw)]">
            <FilterBuilder
              fields={fields}
              value={filter}
              onChange={setFilter}
            />
          </PopoverContent>
        </Popover>
      }
    />
  );
}
