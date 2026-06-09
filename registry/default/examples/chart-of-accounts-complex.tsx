import { ChartOfAccounts } from '@/components/ui-fragments/chart-of-accounts';

const data = {
  platform: {
    banks: {
      $bank_id: {
        '.pattern': '^[A-Za-z0-9_-]+$',
        fbo: {
          '.self': {},
          available: {},
          inTransit: {},
        },
        operating: {},
      },
    },
    custody: {
      '.self': {},
      hot: {
        retail: {},
        corporate: {},
        institutional: {},
      },
      cold: {
        etf: {
          $issuer_id: {
            '.pattern': '^[A-Za-z0-9_-]+$',
          },
        },
        retail: {},
        corporate: {},
        institutional: {},
      },
    },
    expense: {
      loanLoss: {},
      cardSpread: {},
      chargebacks: {},
      networkFees: {},
      customerYield: {},
    },
    revenue: {
      perp: { funding: {} },
      spread: { card: {}, conversion: {} },
      custody: { etf: {}, institutional: {} },
      lending: {
        '.self': {},
        fees: {},
        interest: {},
      },
      staking: { commission: {} },
      trading: { fees: {} },
      interest: { mmfShare: {} },
      interchange: {},
      subscription: {},
      stablecoinReserve: { share: {} },
    },
    suspense: {
      onchain: {},
      deposits: {},
      reconciliation: {},
    },
    treasury: {
      perp: {
        clearer: { nodalClear: {} },
      },
    },
  },
  customers: {
    retail: {
      $customer_id: {
        '.pattern': '^[0-9a-f-]{36}$',
        '.self': {},
        cash: {
          '.self': {},
          held: {},
          pending: {},
          available: {},
        },
        perp: {
          $position_id: {
            '.pattern': '^[0-9a-f-]{36}$',
            margin: {},
          },
        },
        borrow: {
          $loan_id: {
            '.pattern': '^[0-9a-f-]{36}$',
            fees: {
              paid: {},
              accrued: {},
              earnedNotCollected: {},
            },
            interest: {
              paid: {},
              accrued: {},
              earnedNotCollected: {},
            },
            principal: {
              paid: {},
              disbursed: {},
              outstanding: {},
            },
            collateral: {},
          },
        },
        wallet: {
          '.self': {},
          pending: {},
          available: {},
          withdrawing: {},
        },
        staking: {
          $validator_id: {
            '.pattern': '^[A-Za-z0-9_-]+$',
            bonded: {},
            rewards: { execution: {} },
            unbonding: {},
            activating: {},
            withdrawable: {},
          },
        },
      },
    },
    institutional: {
      $client_id: {
        '.pattern': '^[0-9a-f-]{36}$',
        '.self': {},
        cash: {
          '.self': {},
          held: {},
          pending: {},
          available: {},
        },
        perp: {
          $position_id: {
            '.pattern': '^[0-9a-f-]{36}$',
            margin: {},
          },
        },
        wallet: {
          '.self': {},
          pending: {},
          available: {},
          withdrawing: {},
        },
        lending: {
          $loan_id: {
            '.pattern': '^[0-9a-f-]{36}$',
            fees: {
              paid: {},
              accrued: {},
              earnedNotCollected: {},
            },
            interest: {
              paid: {},
              accrued: {},
              earnedNotCollected: {},
            },
            principal: {
              paid: {},
              disbursed: {},
              outstanding: {},
            },
            collateral: {},
          },
        },
        staking: {
          $validator_id: {
            '.pattern': '^[A-Za-z0-9_-]+$',
            bonded: {},
            rewards: { execution: {} },
            unbonding: {},
            activating: {},
            withdrawable: {},
          },
        },
      },
    },
  },
  exchanges: {
    conv: {
      '.self': {},
      $conversion_id: {
        '.pattern': '^[0-9a-f-]{36}$',
      },
    },
  },
  counterparties: {
    banks: {
      $bank_id: { '.pattern': '^[A-Za-z0-9_-]+$' },
    },
    circle: {},
    issuers: { pathward: {} },
    clearers: { nodalClear: {} },
    networks: { visa: {} },
    merchants: {
      $merchant_id: { '.pattern': '^[A-Za-z0-9_-]+$' },
    },
    etfIssuers: {
      $issuer_id: { '.pattern': '^[A-Za-z0-9_-]+$' },
    },
    processors: { marqeta: {} },
    validators: {
      '.self': {},
      $validator_id: { '.pattern': '^[A-Za-z0-9_-]+$' },
    },
    fxProviders: {
      $provider_id: { '.pattern': '^[A-Za-z0-9_-]+$' },
    },
    mmfManagers: {
      $manager_id: { '.pattern': '^[A-Za-z0-9_-]+$' },
    },
    liquidityProviders: {
      $provider_id: { '.pattern': '^[A-Za-z0-9_-]+$' },
    },
  },
};

export default function ChartOfAccountsComplex() {
  return (
    <div className="w-full max-w-3xl">
      <ChartOfAccounts data={data} defaultOpenDepth={2} />
    </div>
  );
}
