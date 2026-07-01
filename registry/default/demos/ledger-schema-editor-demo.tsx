'use client';

import { useState } from 'react';

import { LedgerSchemaEditor } from '@/registry/default/ui/code/ledger-schema-editor';

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
    resource: accounts
    body:
      $match:
        address: clients:$client_id:main
`;

export default function LedgerSchemaEditorDemo() {
  const [value, setValue] = useState(initialSchema);

  return (
    <div className="w-full">
      <LedgerSchemaEditor value={value} onChange={setValue} height={360} />
    </div>
  );
}
