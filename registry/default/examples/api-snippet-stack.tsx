import {
  ApiSnippet,
  ApiSnippetTab,
} from '@/components/ui-fragments/api-snippet';
import {
  generateCurl,
  generateHttpie,
  generateSdk,
  resolveOperation,
  type TStackOperationsIndex,
} from '@/components/ui-fragments/_api-snippet/generators';
import stackOperationsData from '@/registry/default/lib/stack-operations.json';
import { Endpoint } from '@/registry/default/ui/endpoint';

const { operations } = stackOperationsData as TStackOperationsIndex;

const request = resolveOperation(operations.v2CreateTransaction!, {
  params: { ledger: 'testing' },
  body: {
    script: {
      plain: 'send [USD/2 100] (source = @world allocating to @alice)',
    },
  },
  headers: { Authorization: 'Bearer $AUTH_TOKEN' },
});

export default function ApiSnippetStack() {
  return (
    <div className="w-full">
      <ApiSnippet
        footer={<Endpoint method={request.method} path={request.path} />}
        header={
          <span className="text-sm font-medium">Create a transaction</span>
        }
      >
        <ApiSnippetTab
          value="fctl"
          label="fctl"
          language="bash"
          code="fctl ledger transactions num script.num --ledger testing"
        />
        <ApiSnippetTab
          value="curl"
          label="curl"
          language="bash"
          code={generateCurl(request)}
        />
        <ApiSnippetTab
          value="httpie"
          label="HTTPie"
          language="bash"
          code={generateHttpie(request)}
        />
        <ApiSnippetTab
          value="sdk"
          label="TypeScript"
          language="typescript"
          code={generateSdk(request)}
        />
      </ApiSnippet>
    </div>
  );
}
