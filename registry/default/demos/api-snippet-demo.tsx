import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetDemo() {
  return (
    <div className="w-full">
      <ApiSnippet
        operation="v2CreateLedger"
        params={{ ledger: 'testing' }}
        body={{ bucket: 'bucket0' }}
        fctl="fctl ledger create testing --bucket bucket0"
      />
    </div>
  );
}
