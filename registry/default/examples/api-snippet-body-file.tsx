import {
  ApiSnippet,
  ApiSnippetTab,
} from '@/components/ui-fragments/api-snippet';
import {
  generateCurl,
  generateHttpie,
  resolveOperation,
  type TStackOperationsIndex,
} from '@/components/ui-fragments/_api-snippet/generators';
import stackOperationsData from '@/registry/default/lib/stack-operations.json';
import { Endpoint } from '@/registry/default/ui/endpoint';

const { operations } = stackOperationsData as TStackOperationsIndex;

const request = resolveOperation(operations.v2CreateTransaction!, {
  params: { ledger: 'testing' },
  bodyFile: 'transaction.json',
});

export default function ApiSnippetBodyFile() {
  return (
    <div className="w-full">
      <ApiSnippet
        footer={<Endpoint method={request.method} path={request.path} />}
      >
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
      </ApiSnippet>
    </div>
  );
}
