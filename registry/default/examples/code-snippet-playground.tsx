'use client';

import { Play } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

const numscriptCode = `send [USD/2 2500] (
  source = @world
  destination = {
    80% to @merchant:acme
    remaining to @platform:fees
  }
)`;

// Pass any node to `headerActions` to render extra controls next to the copy
// button — here, an "open in playground" affordance for a Numscript snippet.
// Rendering the anchor as a Button (asChild) keeps the design consistent with
// the built-in copy button while preserving real link semantics.
export default function CodeSnippetPlayground() {
  return (
    <CodeSnippet
      code={numscriptCode}
      language="numscript"
      showHeader
      headerActions={
        <Button
          asChild
          variant="outline"
          size="icon-sm"
          aria-label="Open in Numscript playground"
        >
          <a
            href="https://playground.numscript.org/?run=1"
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Numscript playground"
          >
            <Play aria-hidden />
          </a>
        </Button>
      }
    />
  );
}
