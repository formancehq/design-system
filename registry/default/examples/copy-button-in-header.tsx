import { CopyButton } from '@/registry/default/ui-fragments/copy-button';
import { Endpoint } from '@/registry/default/ui/endpoint';

const body = `{
  "metadata": { "reference": "ORD-4417" }
}`;

export default function CopyButtonInHeader() {
  return (
    <div className="w-full rounded-md border">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Endpoint method="POST" path="/api/ledger/v2/{ledger}/transactions" />
        <CopyButton text={body} className="ml-auto" />
      </div>
      <pre className="px-3 py-2 font-mono text-xs text-muted-foreground">
        {body}
      </pre>
    </div>
  );
}
