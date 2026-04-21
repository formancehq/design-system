'use client';

import { useMemo, useState } from 'react';

import {
  CodeEditor,
  type TDiagnosticsConfig,
} from '@/registry/default/ui/code/code-editor';
import { createNumscriptValidator } from '@/registry/default/ui/code/numscript-validator';

// Intentional syntax error: "sendd" instead of "send"
const initialNumscript = `sendd [USD/2 10000] (
  source = @orders:1234
  destination = @merchants:6789
)`;

export default function CodeEditorValidator() {
  const [value, setValue] = useState(initialNumscript);

  const diagnostics: TDiagnosticsConfig = useMemo(
    () => ({
      validate: createNumscriptValidator(),
    }),
    []
  );

  return (
    <div className="w-full">
      <CodeEditor
        value={value}
        language="numscript"
        onChange={setValue}
        height={160}
        adaptiveHeight={false}
        diagnostics={diagnostics}
      />
    </div>
  );
}
