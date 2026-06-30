'use client';

import Ajv, { type ErrorObject } from 'ajv';
import { useMemo, useState } from 'react';
import { parse as parseYaml } from 'yaml';

import {
  CodeEditor,
  type TDiagnostic,
  type TDiagnosticsConfig,
} from '@/registry/default/ui/code/code-editor';

// The canonical ledger schema, hosted by this design system. An external app
// would point at the absolute URL — https://ds.formance.com/schemas/ledger-schema.
const SCHEMA_URL = '/schemas/ledger-schema';

// Fetch the schema and compile it once, then reuse across keystrokes.
let validatePromise: Promise<(data: unknown) => ErrorObject[]> | null = null;

function getValidate() {
  validatePromise ??= fetch(SCHEMA_URL)
    .then((res) => res.json())
    .then((schema) => {
      const validate = new Ajv({ allErrors: true, strict: false }).compile(
        schema
      );

      return (data: unknown): ErrorObject[] =>
        validate(data) ? [] : (validate.errors ?? []);
    });

  return validatePromise;
}

function lineOf(yamlText: string, token: string | undefined): number {
  if (!token) return 1;
  const lines = yamlText.split('\n');
  const index = lines.findIndex((l) => l.trim().startsWith(`${token}:`));

  return index === -1 ? 1 : index + 1;
}

function errorToDiagnostic(error: ErrorObject, yamlText: string): TDiagnostic {
  const segments = error.instancePath.split('/').filter(Boolean);
  const token =
    error.keyword === 'additionalProperties'
      ? (error.params.additionalProperty as string)
      : segments.at(-1);
  const line = lineOf(yamlText, token);
  const lineContent = yamlText.split('\n')[line - 1] ?? '';

  return {
    startLineNumber: line,
    startColumn: 1,
    endLineNumber: line,
    endColumn: lineContent.length + 1,
    message: `${error.instancePath || '/'} ${error.message}`,
    severity: 'error',
  };
}

async function validateLedgerSchema(value: string): Promise<TDiagnostic[]> {
  if (!value.trim()) return [];

  let parsed: unknown;
  try {
    parsed = parseYaml(value);
  } catch (error) {
    return [
      {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
        message: error instanceof Error ? error.message : 'Invalid YAML',
        severity: 'error',
      },
    ];
  }

  const validate = await getValidate();

  return validate(parsed).map((error) => errorToDiagnostic(error, value));
}

// `.description` on an account is accepted; the invalid `resource` on
// CLIENT_BALANCE (should be one of transactions/accounts/logs/volumes) is flagged.
const initialSchema = `chart:
  clients:
    $client_id:
      .pattern: "^[a-zA-Z0-9_-]+$"
      main:
        .self: {}
        .description: Primary client account
transactions:
  CLIENT_DEPOSIT:
    description: Record a client deposit
    runtime: machine
    script: |
      send [USD/2 100] (
        source = @world
        destination = @clients:$client_id:main
      )
queries:
  CLIENT_BALANCE:
    resource: account
    body:
      $match:
        address: clients:$client_id:main
`;

export default function CodeEditorLedgerSchema() {
  const [value, setValue] = useState(initialSchema);

  const diagnostics: TDiagnosticsConfig = useMemo(
    () => ({ validate: validateLedgerSchema }),
    []
  );

  return (
    <div className="w-full">
      <CodeEditor
        value={value}
        language="yaml"
        onChange={setValue}
        height={320}
        adaptiveHeight={false}
        diagnostics={diagnostics}
      />
    </div>
  );
}
