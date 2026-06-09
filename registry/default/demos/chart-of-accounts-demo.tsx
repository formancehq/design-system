import { ChartOfAccounts } from '@/components/ui-fragments/chart-of-accounts';

const data = {
  cardholder: {
    $account_id: {
      '.pattern': '^[a-zA-Z0-9_-]+$',
      main: {
        '.self': {},
        '.metadata': { type: { default: 'cardholder' } },
      },
      hold: {
        $authorization_id: {
          '.self': {},
          '.metadata': { type: { default: 'authorization_hold' } },
        },
      },
      refund: {
        pending: {
          $refund_auth_id: {
            '.self': {},
            '.metadata': { type: { default: 'refund_pending' } },
          },
        },
      },
    },
  },
  banks: {
    $bank_id: {
      '.pattern': '^[a-zA-Z0-9_:-]+$',
      main: {
        '.self': {},
        '.metadata': { type: { default: 'nostro' } },
      },
    },
  },
  schemes: {
    $scheme_id: {
      '.pattern': '^[a-zA-Z0-9_-]+$',
      main: {
        '.self': {},
        '.metadata': { type: { default: 'scheme_liability' } },
      },
      chargeback: {
        '.self': {},
        '.metadata': { type: { default: 'scheme_chargeback' } },
      },
    },
  },
  platform: {
    $platform_name: {
      fees: { '.self': {} },
      revenue: { '.self': {} },
      chargeback_fees: { '.self': {} },
    },
    treasury: {
      '.self': {},
      '.metadata': { type: { default: 'operating_reserve' } },
    },
  },
};

export default function ChartOfAccountsDemo() {
  return (
    <div className="w-full max-w-2xl">
      <ChartOfAccounts data={data} />
    </div>
  );
}
