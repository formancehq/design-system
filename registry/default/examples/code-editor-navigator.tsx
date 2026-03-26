'use client';

import { CodeEditor } from '@/registry/default/ui/code/code-editor';

const yamlCode = `version: "2"
name: default

ledger:
  driver: postgres
  uri: "postgresql://localhost:5432/formance"

payments:
  enabled: true
  connectors:
    - name: stripe
      key: sk_live_xxxxx
      webhooks:
        enabled: true
    - name: wise
      key: wk_live_xxxxx

wallets:
  enabled: true
  settings:
    auto_create: true

orchestration:
  enabled: true
  workflows:
    - name: payment-routing
      trigger: payments.created
    - name: reconciliation
      trigger: ledger.committed`;

export default function CodeEditorNavigator() {
  return (
    <div className="w-full">
      <CodeEditor
        value={yamlCode}
        language="yaml"
        isReadonly
        height={300}
        adaptiveHeight={false}
        withNavigator
      />
    </div>
  );
}
