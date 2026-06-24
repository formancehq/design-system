import {
  LedgerSchema,
  type TLedgerSchemaData,
} from '@/components/ui-fragments/ledger-schema';

const data: TLedgerSchemaData = {
  chart: {
    banks: {
      $bank_id: {
        '.pattern': '^[a-zA-Z0-9_:-]+$',
        main: {
          '.self': {},
          '.metadata': { type: { default: 'nostro' } },
        },
        payout: {
          $payout_ref: { '.self': {} },
        },
      },
    },
    clients: {
      $client_id: {
        '.pattern': '^[a-zA-Z0-9_-]+$',
        main: {
          '.self': {},
          '.metadata': { type: { default: 'vostro' } },
        },
      },
    },
    platform: {
      $platform_name: {
        suspense: { payin: { '.self': {} } },
        revenue: { fees: { '.self': {} } },
      },
    },
  },
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
  },
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
  },
};

// The original source the schema was authored in. Passed through so the full
// view can offer a "YAML" tab alongside the auto-derived "JSON" tab.
const yaml = `chart:
  banks:
    $bank_id:
      .pattern: '^[a-zA-Z0-9_:-]+$'
      main:
        .self: {}
        .metadata:
          type:
            default: nostro
      payout:
        $payout_ref:
          .self: {}
  clients:
    $client_id:
      .pattern: '^[a-zA-Z0-9_-]+$'
      main:
        .self: {}
        .metadata:
          type:
            default: vostro
  platform:
    $platform_name:
      suspense:
        payin:
          .self: {}
      revenue:
        fees:
          .self: {}

transactions:
  CLIENT_DEPOSIT:
    description: >
      Record a deposit when funds arrive at your bank account with clear
      client identification.
    script: |
      #![feature("experimental-account-interpolation")]
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
      set_tx_meta("reference", $reference)
  PAYOUT_RESERVE:
    description: >
      Reserve funds for a client withdrawal, moving them to a payout
      staging account.
    script: |
      #![feature("experimental-account-interpolation")]
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
      set_tx_meta("payout_ref", $payout_ref)

queries:
  CLIENT_BALANCE:
    description: Get a specific client's balance
    resource: accounts
    body:
      $match:
        address: 'clients:\${client_id}:main'
  PENDING_SUSPENSE:
    description: All unresolved suspense deposits
    resource: volumes
    body:
      $match:
        address: ':suspense:payin'`;

export default function LedgerSchemaDemo() {
  return (
    <div className="w-full max-w-2xl">
      <LedgerSchema data={data} yaml={yaml} />
    </div>
  );
}
