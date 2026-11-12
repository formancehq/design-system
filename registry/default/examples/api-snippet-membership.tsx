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
import membershipOperationsData from '@/registry/default/lib/membership-operations.json';
import { Endpoint } from '@/registry/default/ui/endpoint';

const { operations } = membershipOperationsData as TStackOperationsIndex;

const request = resolveOperation(operations.getStack!, {
  params: { organizationId: 'acme', stackId: 'sandbox' },
  baseUrl: '$MEMBERSHIP_API_URL',
  headers: { Authorization: 'Bearer $TOKEN' },
});

export default function ApiSnippetMembership() {
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
        <ApiSnippetTab
          value="fctl"
          label="fctl"
          language="bash"
          code="fctl stack show sandbox --organization acme"
        />
      </ApiSnippet>
    </div>
  );
}
