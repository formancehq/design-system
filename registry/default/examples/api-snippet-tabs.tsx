import {
  ApiSnippet,
  ApiSnippetTab,
} from '@/components/ui-fragments/api-snippet';
import {
  generateCurl,
  resolveOperation,
  type TStackOperationsIndex,
} from '@/components/ui-fragments/_api-snippet/generators';
import stackOperationsData from '@/registry/default/lib/stack-operations.json';
import { Endpoint } from '@/registry/default/ui/endpoint';

const { operations } = stackOperationsData as TStackOperationsIndex;

const request = resolveOperation(operations.v2ReadStats!, {
  params: { ledger: 'testing' },
});

export default function ApiSnippetTabs() {
  return (
    <div className="w-full">
      <ApiSnippet
        footer={<Endpoint method={request.method} path={request.path} />}
        defaultValue="fctl"
      >
        <ApiSnippetTab
          value="fctl"
          label="fctl"
          language="bash"
          code="fctl ledger stats --ledger testing"
        />
        <ApiSnippetTab
          value="curl"
          label="curl"
          language="bash"
          code={generateCurl(request)}
        />
      </ApiSnippet>
    </div>
  );
}
