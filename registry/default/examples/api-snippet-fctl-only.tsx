import { ApiSnippet } from '@/components/ui-fragments/api-snippet';

/*
 * fctl-only: no operation is provided, just an fctl one-liner with
 * tabs={['fctl']}. Renders a standalone fctl card with no generated request
 * and no endpoint footer — useful for CLI-only snippet lists.
 */
export default function ApiSnippetFctlOnly() {
  return (
    <div className="w-full">
      <ApiSnippet fctl="fctl stack list --organization acme" tabs={['fctl']} />
    </div>
  );
}
