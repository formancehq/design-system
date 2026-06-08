import { ChartOfAccounts } from '@/registry/default/fragments/chart-of-accounts';

const data = {
  world: { '.self': {} },
  users: {
    $userID: {
      '.pattern': '^[a-zA-Z0-9_-]+$',
      '.self': {},
      '.metadata': { type: { default: 'user' } },
      wallets: {
        $wallet_id: {
          '.self': {},
          '.metadata': { type: { default: 'wallet' } },
        },
      },
    },
  },
};

export default function ChartOfAccountsSmall() {
  return (
    <div className="w-full max-w-md">
      <ChartOfAccounts data={data} />
    </div>
  );
}
