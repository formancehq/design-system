import {
  ApiSnippet,
  ApiSnippetTab,
} from '@/components/ui-fragments/api-snippet';

export default function ApiSnippetFctlOnly() {
  return (
    <div className="w-full">
      <ApiSnippet>
        <ApiSnippetTab
          value="fctl"
          label="fctl"
          language="bash"
          code="fctl stack list --organization acme"
        />
      </ApiSnippet>
    </div>
  );
}
