// Emits the .d.ts tree the converter reads for prop contracts (`dist/types/**`).
//
// Synth-entry mode parses zero .d.ts files, so without this every `<Name>Props`
// is `{[key: string]: unknown}` — valid TS, so `validate` reports nothing and the
// design agent silently gets no prop names. Run before every sync.
//
//   node .design-sync/scripts/prepare-types.mjs
//
// The entry barrel is generated from `pilot.json`, the same list the lib fork
// filters on, so widening the sync cannot leave the barrel behind.

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const syncDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const { modules } = JSON.parse(
  readFileSync(join(syncDir, 'pilot.json'), 'utf8')
);

execFileSync('npx', ['tsc', '-p', join(syncDir, 'tsconfig.dts.json')], {
  stdio: 'inherit',
  cwd: join(syncDir, '..'),
});

// `findTypesRoot` picks `dist/types` over `lib`, then reads this barrel to scope
// which components the tree exports. tsc cannot emit it: an entry that re-exports
// through the `@/*` alias lands under its own source path, not at the root.
const barrel = [...modules]
  .sort()
  .map((m) => `export * from './registry/default/ui/${m}';`)
  .join('\n');

const typesDir = join(syncDir, '../dist/types');
mkdirSync(typesDir, { recursive: true });
writeFileSync(join(typesDir, 'index.d.ts'), `${barrel}\n`);

console.log(`[DTS] dist/types/** emitted for ${modules.length} pilot modules`);
