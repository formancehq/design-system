'use client';

import { useState } from 'react';

import { CodeEditor } from '@/registry/default/ui/code-editor';

const initialCode = `{
  "ledger": "default",
  "postings": [
    {
      "source": "world",
      "destination": "orders:1234",
      "asset": "USD/2",
      "amount": 1500
    }
  ]
}`;

export default function CodeEditorDemo() {
  const [value, setValue] = useState(initialCode);

  return (
    <div className="w-full">
      <CodeEditor
        value={value}
        language="json"
        onChange={setValue}
        height={280}
        adaptiveHeight={false}
      />
    </div>
  );
}
