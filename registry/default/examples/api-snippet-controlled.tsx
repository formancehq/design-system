'use client';

import { useState } from 'react';

import {
  ApiSnippet,
  ApiSnippetTab,
} from '@/components/ui-fragments/api-snippet';
import {
  generateCurl,
  generateHttpie,
  resolveOperation,
  type TStackOperationsIndex,
} from '@/components/ui-fragments/_api-snippet/generators';
import stackOperationsData from '@/registry/default/lib/stack-operations.json';

const { operations } = stackOperationsData as TStackOperationsIndex;

const requests = [
  resolveOperation(operations.v2CreateLedger!, {
    params: { ledger: 'testing' },
    body: { bucket: 'bucket0' },
  }),
  resolveOperation(operations.v2GetLedger!, { params: { ledger: 'testing' } }),
];

export default function ApiSnippetControlled() {
  const [tab, setTab] = useState('curl');

  return (
    <div className="flex w-full flex-col gap-4">
      {requests.map((request) => (
        <ApiSnippet
          key={request.path + request.method}
          value={tab}
          onValueChange={setTab}
        >
          <ApiSnippetTab
            value="curl"
            label="curl"
            language="bash"
            code={generateCurl(request)}
          />
          <ApiSnippetTab
            value="httpie"
            label="HTTPie"
            language="bash"
            code={generateHttpie(request)}
          />
        </ApiSnippet>
      ))}
    </div>
  );
}
