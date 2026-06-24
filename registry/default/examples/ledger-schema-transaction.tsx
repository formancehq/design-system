import {
  LedgerSchema,
  type TLedgerSchemaData,
} from '@/components/ui-fragments/ledger-schema';

const data: TLedgerSchemaData = {
  transactions: {
    CLIENT_DEPOSIT: {
      description:
        'Record a deposit when funds arrive at your bank account with clear client identification.',
      script: `#![feature("experimental-account-interpolation")]
vars {
  asset $asset
  number $amount
  account $bank_id
  account $client_id
  string $reference
}
send [$asset $amount] (
  source = @banks:$bank_id:main allowing unbounded overdraft
  destination = @clients:$client_id:main
)
set_tx_meta("reference", $reference)`,
    },
  },
};

export default function LedgerSchemaTransaction() {
  return (
    <div className="w-full max-w-2xl">
      <LedgerSchema data={data} tx="CLIENT_DEPOSIT" />
    </div>
  );
}
