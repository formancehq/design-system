import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetSdkDefault() {
  return (
    <div className="w-full">
      <ApiSnippet
        operation="v2CreateLedger"
        params={{ ledger: 'testing' }}
        body={{ bucket: 'bucket0' }}
        defaultTab="sdk"
      />
    </div>
  );
}
