'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

const transaction = `send [USD/2 10000] (
  source = @orders:1234
  destination = {
    remaining to @merchants:6789
  }
)`;

const split = `send [USD/2 10000] (
  source = @orders:1234
  destination = {
    15% to {
      20% to @platform:commission:sales_tax
      remaining to @platform:commission:revenue
    }
    10% to {
      // user gets 10% cashback up to $5 for participating merchants
      max [USD/2 500] to @users:1234:cashback
      remaining to @merchants:6789
    }
    remaining to @merchants:6789
  }
)`;

const variables = `vars {
  account $order
  monetary $amount = balance($order, USD/2)
}

send $amount (
  source = {
    $order
    @world
  }
  destination = @payments:merchant
)

set_tx_meta("ref", $order)`;

export default function CodePreviewEditDemo() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-mono text-muted-foreground">
          Simple transaction
        </p>
        <CodeSnippet code={transaction} language="numscript" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-mono text-muted-foreground">
          Complex split destinations
        </p>
        <CodeSnippet code={split} language="numscript" showLineNumbers />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-mono text-muted-foreground">
          Variables and metadata
        </p>
        <CodeSnippet code={variables} language="numscript" showLineNumbers />
      </div>
    </div>
  );
}
