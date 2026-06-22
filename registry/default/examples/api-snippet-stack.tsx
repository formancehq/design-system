import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

/*
 * Stack API: `operation` resolves against the bundled stack operations index
 * (the default), so curl, HTTPie, the TypeScript SDK, and the fctl tab all
 * render.
 */
export default function ApiSnippetStack() {
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
        headers={{ Authorization: 'Bearer $AUTH_TOKEN' }}
        fctl="fctl ledger transactions num testing"
      />
    </div>
  );
}
