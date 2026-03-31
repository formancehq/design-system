'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

export default function CodeSnippetFctl() {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <CodeSnippet
        code="fctl stack create <stack-name> --organization <organization-id>"
        language="bash"
        isSingleLine
        canCopy
      />
      <CodeSnippet
        code="fctl ledger accounts list --ledger <ledger> --organization <organization-id>"
        language="bash"
        isSingleLine
        canCopy
      />
      <CodeSnippet
        code="fctl wallets credit 10 USD/2 --id <wallet-id> --organization <organization-id>"
        language="bash"
        isSingleLine
        canCopy
        isDark={false}
      />
      <CodeSnippet
        code="fctl payments connectors install <connector> config.json --organization <organization-id>"
        language="bash"
        isSingleLine
        canCopy
        isDark={false}
      />
    </div>
  );
}
