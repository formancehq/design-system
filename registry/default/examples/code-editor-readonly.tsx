'use client';

import { CodeEditor } from '@/registry/default/ui/code-editor';

const yamlCode = `version: "2"
name: default

ledger:
  driver: postgres
  uri: "postgresql://localhost:5432/formance"

payments:
  enabled: true
  connectors:
    - name: stripe
      key: sk_live_xxxxx`;

export default function CodeEditorReadonly() {
  return (
    <div className="w-full">
      <CodeEditor
        value={yamlCode}
        language="yaml"
        isReadonly
        height={280}
        adaptiveHeight={false}
      />
    </div>
  );
}
