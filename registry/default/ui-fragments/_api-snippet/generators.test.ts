import { execFileSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import {
  generateCurl,
  generateHttpie,
  generateSdk,
  resolveOperation,
  type TResolvedOperation,
} from './generators';

const listAccounts = resolveOperation(
  {
    method: 'GET',
    path: '/api/ledger/v2/{ledger}/accounts',
    pathParams: ['ledger'],
    sdk: { module: 'ledgerV2', method: 'listAccounts' },
  },
  {
    params: { ledger: 'main' },
    query: [
      ['pageSize', 15],
      ['filter', { $match: { address: 'users:' } }],
    ],
    headers: { Authorization: 'Bearer $AUTH_TOKEN' },
  }
);

const longFilter: TResolvedOperation = {
  method: 'GET',
  baseUrl: '$FORMANCE_API_URL',
  path: '/api/ledger/v2/main/accounts',
  query: [
    [
      'filter',
      {
        $and: [
          { $match: { address: 'users:' } },
          { $gte: { 'balance[USD/2]': 100 } },
        ],
      },
    ],
  ],
  headers: {},
};

const createTransaction = resolveOperation(
  {
    method: 'POST',
    path: '/api/ledger/v2/{ledger}/transactions',
    pathParams: ['ledger'],
    sdk: { module: 'ledgerV2', method: 'createTransaction' },
  },
  {
    params: { ledger: 'main' },
    body: { metadata: { note: "Alice's payment" } },
  }
);

const shellWords = (command: string): string[] =>
  JSON.parse(
    execFileSync(
      'sh',
      [
        '-c',
        `capture() { node -e 'console.log(JSON.stringify(process.argv.slice(1)))' -- "$@"; }; curl() { capture "$@"; }; http() { capture "$@"; }; ${command}`,
      ],
      { env: { ...process.env, FORMANCE_API_URL: '$FORMANCE_API_URL' } }
    ).toString()
  );

describe('generateCurl', () => {
  it('sends a GET with -G and one --data-urlencode per query parameter, in order', () => {
    expect(generateCurl(listAccounts)).toBe(
      [
        `curl -G "$FORMANCE_API_URL/api/ledger/v2/main/accounts" \\`,
        `  --data-urlencode 'pageSize=15' \\`,
        `  --data-urlencode 'filter={"$match":{"address":"users:"}}' \\`,
        `  -H "Authorization: Bearer $AUTH_TOKEN"`,
      ].join('\n')
    );
  });

  it('indents a JSON value that does not fit in 80 characters', () => {
    expect(generateCurl(longFilter)).toBe(
      [
        `curl -G "$FORMANCE_API_URL/api/ledger/v2/main/accounts" \\`,
        `  --data-urlencode 'filter={`,
        `    "$and": [`,
        `      {`,
        `        "$match": {`,
        `          "address": "users:"`,
        `        }`,
        `      },`,
        `      {`,
        `        "$gte": {`,
        `          "balance[USD/2]": 100`,
        `        }`,
        `      }`,
        `    ]`,
        `  }'`,
      ].join('\n')
    );
  });

  it('sends a body with -d and the JSON content type', () => {
    expect(generateCurl(createTransaction)).toBe(
      [
        `curl -X POST "$FORMANCE_API_URL/api/ledger/v2/main/transactions" \\`,
        `  -H "Content-Type: application/json" \\`,
        `  -d '{"metadata":{"note":"Alice'\\''s payment"}}'`,
      ].join('\n')
    );
  });

  it('escapes a single quote so the shell reads the original value back', () => {
    const command = generateCurl({
      ...listAccounts,
      query: [['filter', { $match: { name: "O'Brien" } }]],
      headers: {},
    });

    execFileSync('sh', ['-n', '-c', command]);
    expect(shellWords(command)).toEqual([
      '-G',
      '$FORMANCE_API_URL/api/ledger/v2/main/accounts',
      '--data-urlencode',
      `filter={"$match":{"name":"O'Brien"}}`,
    ]);
  });

  it('references a body file and appends raw args', () => {
    expect(
      generateCurl({
        ...createTransaction,
        bodyFile: "Alice's tx.json",
        rawArgs: '--fail-with-body',
      })
    ).toBe(
      [
        `curl -X POST "$FORMANCE_API_URL/api/ledger/v2/main/transactions" \\`,
        `  -H "Content-Type: application/json" \\`,
        `  -d @'Alice'\\''s tx.json' \\`,
        `  --fail-with-body`,
      ].join('\n')
    );
  });
});

describe('generateHttpie', () => {
  it('sends query parameters as name==value, in order', () => {
    expect(generateHttpie(listAccounts)).toBe(
      [
        `http "$FORMANCE_API_URL/api/ledger/v2/main/accounts" \\`,
        `  'pageSize==15' \\`,
        `  'filter=={"$match":{"address":"users:"}}' \\`,
        `  "Authorization:Bearer $AUTH_TOKEN"`,
      ].join('\n')
    );
  });

  it('indents a long JSON query value', () => {
    expect(generateHttpie(longFilter)).toContain(
      `  'filter=={\n    "$and": [\n`
    );
  });

  it('sends a body with --raw and escapes single quotes', () => {
    const command = generateHttpie(createTransaction);

    expect(command).toBe(
      [
        `http POST "$FORMANCE_API_URL/api/ledger/v2/main/transactions" \\`,
        `  --raw '{"metadata":{"note":"Alice'\\''s payment"}}'`,
      ].join('\n')
    );
    execFileSync('sh', ['-n', '-c', command]);
    expect(shellWords(command).at(-1)).toBe(
      `{"metadata":{"note":"Alice's payment"}}`
    );
  });
});

describe('generateSdk', () => {
  it('calls sdk.<module>.<version>.<method> of the public SDK', () => {
    expect(generateSdk(listAccounts)).toBe(
      [
        `import { SDK } from '@formance/formance-sdk';`,
        ``,
        `const sdk = new SDK({ serverURL: process.env.FORMANCE_API_URL });`,
        ``,
        `const result = await sdk.ledger.v2.listAccounts({`,
        `  "ledger": "main",`,
        `  "pageSize": 15,`,
        `  "filter": {`,
        `    "$match": {`,
        `      "address": "users:"`,
        `    }`,
        `  }`,
        `});`,
      ].join('\n')
    );
  });

  it('maps every versioned module to its namespace', () => {
    expect(
      generateSdk({
        ...createTransaction,
        sdk: { module: 'paymentsV3', method: 'listPayments' },
      })
    ).toContain('await sdk.payments.v3.listPayments(');
  });

  it('returns nothing for an operation without an SDK call', () => {
    expect(generateSdk({ ...listAccounts, sdk: undefined })).toBe('');
  });
});
