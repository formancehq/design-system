import {
  LedgerSchema,
  type TLedgerSchemaData,
} from '@/components/ui-fragments/ledger-schema';

const data: TLedgerSchemaData = {
  queries: {
    CLIENT_BALANCE: {
      description: "Get a specific client's balance",
      resource: 'accounts',
      body: { $match: { address: 'clients:${client_id}:main' } },
    },
    PENDING_SUSPENSE: {
      description: 'All unresolved suspense deposits',
      resource: 'volumes',
      body: { $match: { address: ':suspense:payin' } },
    },
    INFLIGHT_PAYOUTS: {
      description: 'All reserved but unsettled payouts',
      resource: 'volumes',
      body: { $match: { address: ':payout:' } },
    },
  },
};

export default function LedgerSchemaQueries() {
  return (
    <div className="w-full max-w-2xl">
      <LedgerSchema data={data} section="queries" />
    </div>
  );
}
