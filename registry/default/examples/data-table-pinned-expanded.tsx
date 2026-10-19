'use client';

import {
  createExpandColumn,
  DataTable,
} from '@/components/ui-fragments/data-table/data-table';
import { DataTableColumnHeader } from '@/components/ui-fragments/data-table/data-table-column-header';
import type { ColumnDef } from '@/components/ui-fragments/data-table/data-table-features';
import { Badge } from '@/registry/default/ui/badge';

type TPosting = {
  source: string;
  destination: string;
  amount: number;
  asset: string;
};

type TTransaction = {
  id: string;
  timestamp: string;
  reference: string;
  postings: TPosting[];
  reverted: boolean;
};

const data: TTransaction[] = [
  {
    id: '1042',
    timestamp: '2025-03-14 09:12:44',
    reference: 'payout-7781',
    reverted: false,
    postings: [
      {
        source: 'world',
        destination: 'users:alice:main',
        amount: 12500,
        asset: 'USD/2',
      },
      {
        source: 'users:alice:main',
        destination: 'platform:fees',
        amount: 250,
        asset: 'USD/2',
      },
    ],
  },
  {
    id: '1041',
    timestamp: '2025-03-14 08:57:02',
    reference: 'refund-1180',
    reverted: true,
    postings: [
      {
        source: 'merchants:acme:main',
        destination: 'users:bob:main',
        amount: 4999,
        asset: 'EUR/2',
      },
    ],
  },
  {
    id: '1040',
    timestamp: '2025-03-13 17:30:18',
    reference: 'topup-0912',
    reverted: false,
    postings: [
      {
        source: 'world',
        destination: 'users:carol:wallet',
        amount: 100000,
        asset: 'USD/2',
      },
    ],
  },
];

const formatAmount = (posting: TPosting) =>
  `${(posting.amount / 100).toFixed(2)} ${posting.asset.split('/')[0]}`;

const columns: ColumnDef<TTransaction>[] = [
  createExpandColumn<TTransaction>(),
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <span className="font-mono">{row.original.id}</span>,
    size: 90,
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{row.original.timestamp}</span>
    ),
    size: 200,
  },
  {
    accessorKey: 'reference',
    header: 'Reference',
    cell: ({ row }) => (
      <span className="font-mono">{row.original.reference}</span>
    ),
    size: 180,
  },
  {
    id: 'source',
    accessorFn: (transaction) => transaction.postings[0]?.source,
    header: 'Source',
    cell: ({ row }) => (
      <span className="font-mono">{row.original.postings[0]?.source}</span>
    ),
    size: 220,
  },
  {
    id: 'destination',
    accessorFn: (transaction) => transaction.postings[0]?.destination,
    header: 'Destination',
    cell: ({ row }) => (
      <span className="font-mono">{row.original.postings[0]?.destination}</span>
    ),
    size: 220,
  },
  {
    id: 'status',
    accessorFn: (transaction) => (transaction.reverted ? 'reverted' : 'ok'),
    header: 'Status',
    cell: ({ row }) =>
      row.original.reverted ? (
        <Badge variant="warning">Reverted</Badge>
      ) : (
        <Badge variant="valid">Committed</Badge>
      ),
    size: 120,
  },
];

function PostingsList({ postings }: { postings: TPosting[] }) {
  return (
    <ul className="space-y-1 bg-muted-lighter px-4 py-3 font-mono text-sm">
      {postings.map((posting) => (
        <li
          key={`${posting.source}-${posting.destination}-${posting.amount}-${posting.asset}`}
          className="flex flex-wrap gap-x-2"
        >
          <span>{posting.source}</span>
          <span className="text-muted-foreground">→</span>
          <span>{posting.destination}</span>
          <span className="ms-auto">{formatAmount(posting)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DataTablePinnedExpandedExample() {
  return (
    <div className="w-full max-w-2xl">
      <DataTable
        columns={columns}
        data={data}
        getRowId={(transaction) => transaction.id}
        getRowCanExpand={(row) => row.original.postings.length > 0}
        renderExpandedRow={(row) => (
          <PostingsList postings={row.original.postings} />
        )}
        initialState={{
          columnPinning: { start: ['expand', 'id'], end: ['status'] },
          expanded: { '1042': true },
        }}
        displayPagination={false}
      />
    </div>
  );
}
