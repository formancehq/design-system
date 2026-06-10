import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetClipCodeHeight() {
  return (
    <div className="w-full">
      <ApiSnippet
        operation="v2CreateLedger"
        params={{ ledger: 'main' }}
        body={{
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
            'com.formance.tier': 'gold',
            'com.formance.cost-center': 'cc-4421',
            'com.formance.compliance': 'pci-dss',
            'com.formance.retention': '7y',
          },
        }}
        headers={{ Authorization: 'Bearer $AUTH_TOKEN' }}
        clipCodeHeight
      />
    </div>
  );
}
