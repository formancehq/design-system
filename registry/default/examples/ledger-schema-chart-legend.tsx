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
  },
};

export default function LedgerSchemaChartLegend() {
  return (
    <div className="w-full max-w-2xl">
      <LedgerSchema data={data} section="chart" legend />
    </div>
  );
}
