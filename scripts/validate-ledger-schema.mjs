/**
 * Validates the hosted ledger schema the same way Studio's editor will (AJV,
 * draft-07, strict: false). Run: `pnpm schemas:validate`.
 */
import Ajv from 'ajv';

import ledgerSchemaBase from '../app/schemas/ledger-schema/ledger-schema.json' with { type: 'json' };
import ledgerSchemaExtended from '../app/schemas/ledger-schema/ledger-schema.extended.json' with { type: 'json' };

const ajv = new Ajv({ allErrors: true, strict: false });
const validateBase = ajv.compile(ledgerSchemaBase);
const validateExtended = ajv.compile(ledgerSchemaExtended);

const validDocument = {
  chart: {
    clients: {
      $client_id: {
        '.pattern': '^[a-zA-Z0-9_-]+$',
        main: { '.self': {}, '.metadata': { type: { default: 'vostro' } } },
      },
    },
  },
  transactions: {
    CLIENT_DEPOSIT: { description: 'A deposit', script: 'send [USD 1] (...)' },
  },
  queries: {
    CLIENT_BALANCE: {
      resource: 'accounts',
      body: { $match: { address: 'clients:x:main' } },
    },
  },
};

const withAccountDescription = {
  chart: {
    clients: {
      $client_id: {
        main: { '.self': {}, '.description': 'Client main account' },
      },
    },
  },
};

const withMeta = {
  meta: {
    slug: 'demo',
    name: 'Demo',
    tags: ['a'],
    docsUrl: 'https://docs.formance.com/x',
  },
  chart: { platform: { revenue: { '.self': {} } } },
};

const withUnknownTopLevel = { chart: {}, bogus: true };

const cases = [
  {
    name: 'valid full document',
    data: validDocument,
    base: true,
    extended: true,
  },
  {
    name: 'account .description (the fix)',
    data: withAccountDescription,
    base: true,
    extended: true,
  },
  { name: 'top-level meta block', data: withMeta, base: false, extended: true },
  {
    name: 'unknown top-level key',
    data: withUnknownTopLevel,
    base: false,
    extended: false,
  },
];

let failed = false;
for (const c of cases) {
  const gotBase = validateBase(c.data) === true;
  const gotExtended = validateExtended(c.data) === true;
  const ok = gotBase === c.base && gotExtended === c.extended;
  if (!ok) failed = true;
  const mark = ok ? '✓' : '✗';
  console.log(
    `${mark} ${c.name} — base ${gotBase}/${c.base}, extended ${gotExtended}/${c.extended}`
  );
  if (!ok && gotBase !== c.base)
    console.log('   base errors:', validateBase.errors);
  if (!ok && gotExtended !== c.extended)
    console.log('   extended errors:', validateExtended.errors);
}

if (failed) {
  console.error('\nSchema validation expectations not met.');
  process.exit(1);
}
console.log('\nAll ledger-schema validation expectations met.');
