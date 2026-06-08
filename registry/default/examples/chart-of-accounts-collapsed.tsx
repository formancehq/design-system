import { ChartOfAccounts } from '@/registry/default/fragments/chart-of-accounts';

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
};

export default function ChartOfAccountsCollapsed() {
  return (
    <div className="w-full max-w-2xl">
      <ChartOfAccounts data={data} defaultOpenDepth={1} />
    </div>
  );
}
