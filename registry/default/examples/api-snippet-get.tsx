import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetGet() {
  return (
    <div className="w-full">
      <ApiSnippet
        operation="v2GetLedger"
        params={{ ledger: 'testing' }}
        fctl="fctl ledger show testing"
      />
    </div>
  );
}
