#!/usr/bin/env tsx
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SPEC_DIR = resolve(ROOT, '../openapi/stack');
const OUT_FILE = resolve(ROOT, 'registry/default/lib/stack-operations.json');
const SDK_DIR = resolve(
  ROOT,
  '../platform-ui/packages/sdks/stack/formance/src/sdk'
);

type THttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

type TStackOperation = {
  method: THttpMethod;
  path: string;
  pathParams: string[];
  sdk: { module: string; method: string };
  summary?: string;
  tags?: string[];
};

function pickLatestSpec(): string {
  const files = readdirSync(SPEC_DIR).filter((f) =>
    /^v\d+\.\d+\.\d+\.json$/.test(f)
  );
  files.sort((a, b) => {
    const pa = a.slice(1, -5).split('.').map(Number);
    const pb = b.slice(1, -5).split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const av = pa[i] ?? 0;
      const bv = pb[i] ?? 0;
      if (av !== bv) return av - bv;
    }

    return 0;
  });
  const latest = files[files.length - 1];
  if (!latest) throw new Error(`No spec files found in ${SPEC_DIR}`);

  return latest;
}

function tagToModule(tag: string): string {
  const parts = tag.split('.');
  const last = parts[parts.length - 1] ?? '';
  if (/^v\d+$/i.test(last)) {
    const base = parts.slice(0, -1).join('');

    return `${base}V${last.slice(1)}`;
  }

  return parts.join('');
}

function operationIdToMethod(operationId: string): string {
  const stripped = operationId.replace(/^v\d+/, '');
  if (!stripped) return operationId;

  return stripped.charAt(0).toLowerCase() + stripped.slice(1);
}

function moduleFilenames(module: string): string[] {
  // ledgerV2 -> ledger-v2.ts
  const kebab = module.replace(/V(\d+)$/, '-v$1').toLowerCase();

  return [`${kebab}.ts`];
}

function main() {
  const specFile = pickLatestSpec();
  const spec = JSON.parse(readFileSync(join(SPEC_DIR, specFile), 'utf8'));
  const specVersion = specFile.slice(1, -5);

  const sdkFiles = existsSync(SDK_DIR) ? new Set(readdirSync(SDK_DIR)) : null;
  const warnings: string[] = [];

  const out: Record<string, TStackOperation> = {};
  const HTTP_METHODS: THttpMethod[] = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS',
  ];

  for (const [path, item] of Object.entries(
    spec.paths as Record<string, Record<string, unknown>>
  )) {
    for (const method of HTTP_METHODS) {
      const lower = method.toLowerCase();
      const op = item[lower] as
        | {
            operationId?: string;
            summary?: string;
            tags?: string[];
            parameters?: { name: string; in: string }[];
          }
        | undefined;
      if (!op || !op.operationId) continue;

      const tag = op.tags?.[0] ?? '';
      const sdkModule = tagToModule(tag);
      const sdkMethod = operationIdToMethod(op.operationId);

      if (sdkFiles && sdkModule) {
        const expected = moduleFilenames(sdkModule);
        if (!expected.some((f) => sdkFiles.has(f))) {
          warnings.push(
            `[${op.operationId}] SDK module file not found for "${sdkModule}" (tried ${expected.join(', ')})`
          );
        }
      }

      const pathLevelParams = ((
        item as { parameters?: { name: string; in: string }[] }
      ).parameters ?? []) as { name: string; in: string }[];
      const pathParams = [
        ...pathLevelParams.filter((p) => p.in === 'path').map((p) => p.name),
        ...(op.parameters ?? [])
          .filter((p) => p.in === 'path')
          .map((p) => p.name),
      ];

      out[op.operationId] = {
        method,
        path,
        pathParams,
        sdk: { module: sdkModule, method: sdkMethod },
        summary: op.summary,
        tags: op.tags,
      };
    }
  }

  const sortedKeys = Object.keys(out).sort();
  const sorted: Record<string, TStackOperation> = {};
  for (const k of sortedKeys) {
    const v = out[k];
    if (v) sorted[k] = v;
  }

  const payload = {
    _meta: { specVersion, specFile, generatedFrom: 'openapi/stack' },
    operations: sorted,
  };

  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n');

  const opCount = sortedKeys.length;
  console.log(
    `✓ Extracted ${opCount} operations from ${specFile} → ${OUT_FILE.replace(ROOT + '/', '')}`
  );

  if (warnings.length) {
    console.log(`\n⚠ ${warnings.length} SDK mismatches:`);
    for (const w of warnings.slice(0, 20)) console.log(`  ${w}`);
    if (warnings.length > 20)
      console.log(`  …and ${warnings.length - 20} more`);
  }
}

main();
