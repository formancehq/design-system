import { ApiSnippet } from '@/components/ui-fragments/api-snippet';
import membershipOperationsData from '@/registry/default/lib/membership-operations.json';
import { type TStackOperationsIndex } from '@/components/ui-fragments/_api-snippet/generators';

/*
 * Membership/cloud API: pass the membership operations index via `operations`.
 * These operations declare no SDK, so the TypeScript tab is omitted — only
 * curl, HTTPie, and fctl render.
 */
const membershipOperations = (membershipOperationsData as TStackOperationsIndex)
  .operations;

export default function ApiSnippetMembership() {
  return (
    <div className="w-full">
      <ApiSnippet
        operation="getStack"
        operations={membershipOperations}
        params={{ organizationId: 'acme', stackId: 'sandbox' }}
        baseUrl="$MEMBERSHIP_API_URL"
        headers={{ Authorization: 'Bearer $TOKEN' }}
        fctl="fctl stack show sandbox --organization acme"
        tabs={['curl', 'httpie', 'fctl']}
      />
    </div>
  );
}
