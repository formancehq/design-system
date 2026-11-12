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

const request = resolveOperation(operations.v2CreateLedger!, {
  params: { ledger: 'main' },
  body: {
    bucket: 'bucket0',
    features: {
      ACCOUNT_METADATA_HISTORY: 'SYNC',
      TRANSACTION_METADATA_HISTORY: 'SYNC',
      HASH_LOGS: 'SYNC',
      INDEX_ADDRESS_SEGMENTS: 'ON',
      INDEX_TRANSACTION_ACCOUNTS: 'ON',
      MOVES_HISTORY: 'ON',
      MOVES_HISTORY_POST_COMMIT_EFFECTIVE_VOLUMES: 'SYNC',
      MOVES_HISTORY_POST_COMMIT_VOLUMES: 'SYNC',
      POST_COMMIT_VOLUMES: 'SYNC',
    },
    metadata: {
      'com.formance.product': 'banking',
      'com.formance.environment': 'production',
      'com.formance.team': 'core-platform',
      'com.formance.owner': 'treasury',
      'com.formance.region': 'eu-west-1',
    },
  },
  headers: { Authorization: 'Bearer $AUTH_TOKEN' },
});

export default function ApiSnippetClipCodeHeight() {
  return (
    <div className="w-full">
      <ApiSnippet
        footer={<Endpoint method={request.method} path={request.path} />}
        clipCodeHeight
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
          value="sdk"
          label="TypeScript"
          language="typescript"
          code={generateSdk(request)}
        />
      </ApiSnippet>
    </div>
  );
}
