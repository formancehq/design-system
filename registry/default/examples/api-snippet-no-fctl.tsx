import { ApiSnippet } from '@/registry/default/fragments/api-snippet';

export default function ApiSnippetNoFctl() {
  return (
    <div className="w-full">
      <ApiSnippet
        operation="v2CreateTransaction"
        params={{ ledger: 'testing' }}
        body={{
          script: {
            plain: 'send [USD/2 100] (source = @world allocating to @alice)',
          },
        }}
      />
    </div>
  );
}
