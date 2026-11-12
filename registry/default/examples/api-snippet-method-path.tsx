import {
  ApiSnippet,
  ApiSnippetTab,
} from '@/components/ui-fragments/api-snippet';
import {
  generateCurl,
  generateHttpie,
  type TResolvedOperation,
} from '@/components/ui-fragments/_api-snippet/generators';
import { Endpoint } from '@/registry/default/ui/endpoint';

const request: TResolvedOperation = {
  method: 'GET',
  baseUrl: '$FORMANCE_API_URL',
  path: '/api/ledger/v2/testing/volumes',
  query: [
    ['endTime', '2024-01-15T00:00:00Z'],
    [
      'filter',
      {
        $and: [
          { $match: { account: 'users:' } },
          { $gte: { 'balance[USD/2]': 0 } },
        ],
      },
    ],
  ],
  headers: {},
};

export default function ApiSnippetMethodPath() {
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
