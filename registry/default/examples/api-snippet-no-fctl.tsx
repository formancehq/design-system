import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetNoFctl() {
  return (
    <div className="w-full">
      {/*
       * An fctl one-liner is provided, but `tabs` omits it — so only curl,
       * HTTPie, and the TypeScript SDK render. Restricting `tabs` is how you
       * hide a tab whose content is otherwise available.
       */}
      <ApiSnippet
        operation="v2CreateTransaction"
        params={{ ledger: 'testing' }}
        body={{
          script: {
            plain: 'send [USD/2 100] (source = @world allocating to @alice)',
          },
        }}
        fctl="fctl ledger transactions num script.num --ledger testing"
        tabs={['curl', 'httpie', 'sdk']}
      />
    </div>
  );
}
