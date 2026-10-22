import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetGet() {
  return (
    <div className="w-full">
      <ApiSnippet
        operation="v2ReadStats"
        params={{ ledger: 'testing' }}
        fctl="fctl ledger stats --ledger testing"
      />
    </div>
  );
}
