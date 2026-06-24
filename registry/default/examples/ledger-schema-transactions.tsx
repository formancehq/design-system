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
    PAYOUT_RESERVE: {
      description:
        'Reserve funds for a client withdrawal, moving them to a payout staging account.',
      script: `#![feature("experimental-account-interpolation")]
vars {
  asset $asset
  number $amount
  account $client_id
  account $bank_id
  string $payout_ref
}
send [$asset $amount] (
  source = @clients:$client_id:main
  destination = @banks:$bank_id:payout:$payout_ref
)
set_tx_meta("payout_ref", $payout_ref)`,
    },
    PAYOUT_SETTLEMENT: {
      description:
        'Confirm a payout has settled at the bank, moving funds out of the staging account.',
      script: `#![feature("experimental-account-interpolation")]
vars {
  asset $asset
  number $amount
  account $bank_id
  string $payout_ref
}
send [$asset $amount] (
  source = @banks:$bank_id:payout:$payout_ref
  destination = @banks:$bank_id:main
)
set_tx_meta("status", "settled")`,
    },
  },
};

export default function LedgerSchemaTransactions() {
  return (
    <div className="w-full max-w-2xl">
      <LedgerSchema data={data} section="transactions" />
    </div>
  );
}
