'use client';

import { useMemo, useState } from 'react';

import {
  CodeEditor,
  type TDiagnosticsConfig,
} from '@/registry/default/ui/code/code-editor';
import { createLedgerSchemaValidator } from '@/registry/default/ui/code/ledger-schema-validator';

// `diagnostics.validate` is editor-agnostic — here it wraps the canonical ledger
// schema validator (see `ledger-schema-validator`), which fetches the hosted
// schema, runs Ajv, and maps each error to a diagnostic. The `.description` on
// the client account is accepted; the invalid `resource` on CLIENT_BALANCE
// (must be one of transactions/accounts/logs/volumes) is flagged.
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
    () => ({ validate: createLedgerSchemaValidator() }),
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
