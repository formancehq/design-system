#!/usr/bin/env tsx
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SPEC_DIR = resolve(ROOT, '../openapi/membership');
const OUT_FILE = resolve(
  ROOT,
  'registry/default/lib/membership-operations.json'
);

type THttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

// No `sdk` field: the membership/cloud API has no public TypeScript SDK, so the
// generated snippets only cover curl / HTTPie / fctl.
type TMembershipOperation = {
  method: THttpMethod;
  path: string;
  pathParams: string[];
  summary?: string;
  tags?: string[];
};

function pickLatestSpec(): string {
  const files = readdirSync(SPEC_DIR).filter((f) =>
    /^v\d+\.\d+\.\d+\.yaml$/.test(f)
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

function main() {
  const specFile = pickLatestSpec();
  const spec = parse(readFileSync(join(SPEC_DIR, specFile), 'utf8'));
  const specVersion = specFile.slice(1, -5);

  const out: Record<string, TMembershipOperation> = {};
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
        summary: op.summary,
        tags: op.tags,
      };
    }
  }

  const sortedKeys = Object.keys(out).sort();
  const sorted: Record<string, TMembershipOperation> = {};
  for (const k of sortedKeys) {
    const v = out[k];
    if (v) sorted[k] = v;
  }

  const payload = {
    _meta: { specVersion, specFile, generatedFrom: 'openapi/membership' },
    operations: sorted,
  };

  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n');

  console.log(
    `✓ Extracted ${sortedKeys.length} operations from ${specFile} → ${OUT_FILE.replace(ROOT + '/', '')}`
  );
}

main();
