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

const request = resolveOperation(operations.v2ListAccounts!, {
  params: { ledger: 'testing' },
  query: [
    ['pageSize', 15],
    ['filter', { $match: { address: 'users:' } }],
  ],
});

export default function ApiSnippetGet() {
  return (
    <div className="w-full">
      <ApiSnippet
        footer={<Endpoint method={request.method} path={request.path} />}
      >
        <ApiSnippetTab
          value="fctl"
          label="fctl"
          language="bash"
          code="fctl ledger accounts list --ledger testing"
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
