import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetBodyFile() {
  return (
    <div className="w-full">
      {/*
       * `bodyFile` references the request body from a file instead of inlining
       * it — curl renders `-d @file`, HTTPie renders `< file`. Useful when the
       * body is large or lives next to the snippet.
       */}
      <ApiSnippet
        operation="v2CreateTransaction"
        params={{ ledger: 'testing' }}
        bodyFile="transaction.json"
        tabs={['curl', 'httpie']}
      />
    </div>
  );
}
