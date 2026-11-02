'use client';

import { Code, Filter, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { DataTable } from '@/components/ui-fragments/data-table/data-table';
import type { ColumnDef } from '@/components/ui-fragments/data-table/data-table-features';
import { FilterBuilder } from '@/components/ui-fragments/filter-builder/filter-builder';
import {
  countFilterConditions,
  createFilterGroup,
  filterMatches,
  filterOfQuery,
  queryOfFilter,
  type TFilterFields,
  type TFilterGroup,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { CodeEditor } from '@/registry/default/ui/code/code-editor';
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

// Transactions not reverted, whose reference is either of two: a group under
// the root's `and`, so the table opens on what the flat filters cannot say.
const initialQuery = {
  $and: [
    { $match: { reverted: false } },
    {
      $or: [
        { $match: { reference: 'refund-17' } },
        { $match: { reference: 'fee-3' } },
      ],
    },
  ],
};

const textOf = (filter: TFilterGroup) =>
  JSON.stringify(queryOfFilter(filter, fields) ?? {}, null, 2);

/**
 * The filter a typed query is drawn as: `null` when the text is not a JSON
 * object, or when the builder cannot hold the query exactly.
 */
function readFilter(text: string): TFilterGroup | null {
  try {
    const parsed: unknown = JSON.parse(text);

    return typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
      ? filterOfQuery(parsed as Record<string, unknown>, fields)
      : null;
  } catch {
    return null;
  }
}

export default function FilterBuilderDataTablePopover() {
  // The toolbar of a Console table: Filters opens the builder, its badge
  // counts the conditions while it is closed, and Inspect query edits the same
  // filter as the JSON the ledger reads.
  const [filter, setFilter] = useState(
    () => filterOfQuery(initialQuery, fields) ?? createFilterGroup()
  );
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
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outlineDashed" className="gap-2">
                <Filter className="size-4" />
                Filters
                {count > 0 && <Badge variant="gold">{count}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-full max-w-(--radix-popover-content-available-width) p-4 sm:min-w-[560px]"
            >
              <FilterBuilder
                fields={fields}
                value={filter}
                onChange={setFilter}
              />
            </PopoverContent>
          </Popover>
          <InspectQuery filter={filter} onApply={setFilter} />
        </div>
      }
    />
  );
}

/**
 * The same filter as JSON, in an editor opened from the toolbar. Apply writes
 * it back when the builder can hold it; Clear empties the text.
 */
function InspectQuery({
  filter,
  onApply,
}: {
  filter: TFilterGroup;
  onApply: (filter: TFilterGroup) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const read = text.trim() === '' ? createFilterGroup() : readFilter(text);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        // Each open starts from the filter the table reads now.
        if (next) {
          setText(textOf(filter));
        }
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button type="button" variant="outlineDashed" className="gap-2">
          <Code className="size-4" />
          Inspect query
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-120 flex-col gap-3 p-4">
        <p className="text-sm font-medium">Query (JSON)</p>
        <CodeEditor
          aria-label="Query (JSON)"
          language="json"
          value={text}
          onChange={setText}
        />
        {read === null && (
          <p className="text-destructive text-sm">
            The builder cannot hold this query exactly.
          </p>
        )}
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={text === ''}
            onClick={() => setText('')}
          >
            <Trash2 className="size-4" />
            Clear
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={read === null}
            onClick={() => {
              if (read) {
                onApply(read);
                setOpen(false);
              }
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
