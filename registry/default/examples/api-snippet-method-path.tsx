import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetMethodPath() {
  return (
    <div className="w-full">
      {/*
       * Document an endpoint that isn't in an operations index by passing
       * `method` and `path` directly. The path may include a query string —
       * HTTPie splits it into `==` params and the endpoint footer drops it.
       */}
      <ApiSnippet
        method="GET"
        path="/api/ledger/v2/{ledger}/volumes?endTime=2024-01-15T00:00:00Z"
        params={{ ledger: 'testing' }}
      />
    </div>
  );
}
