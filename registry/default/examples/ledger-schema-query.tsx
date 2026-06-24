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
  },
};

export default function LedgerSchemaQuery() {
  return (
    <div className="w-full max-w-2xl">
      <LedgerSchema data={data} query="CLIENT_BALANCE" />
    </div>
  );
}
