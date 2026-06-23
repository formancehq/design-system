'use client';

import { useState } from 'react';

import {
  ApiSnippet,
  type TApiSnippetTab,
} from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetControlled() {
  // Both snippets share one tab state via `value` + `onValueChange`, so
  // switching curl/HTTPie on one switches the other too. This is how a host
  // can persist the reader's HTTP-client choice across a whole page.
  const [tab, setTab] = useState<TApiSnippetTab>('curl');

  return (
    <div className="flex w-full flex-col gap-4">
      <ApiSnippet
        operation="v2CreateLedger"
        params={{ ledger: 'testing' }}
        value={tab}
        onValueChange={setTab}
      />
      <ApiSnippet
        operation="v2GetLedger"
        params={{ ledger: 'testing' }}
        value={tab}
        onValueChange={setTab}
      />
    </div>
  );
}
