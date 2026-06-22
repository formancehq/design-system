import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetTabs() {
  return (
    <div className="w-full">
      {/*
       * `tabs` controls which tabs render and in what order. Here only fctl and
       * curl are shown, with fctl first and selected by default.
       */}
      <ApiSnippet
        operation="v2GetLedger"
        params={{ ledger: 'testing' }}
        fctl="fctl ledger show testing"
        tabs={['fctl', 'curl']}
        defaultTab="fctl"
      />
    </div>
  );
}
