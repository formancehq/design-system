'use client';

/**
 * CopyButton — outline icon button that copies text to the clipboard and
 * confirms with a check for 1.5s.
 *
 *   <CopyButton text={code} />                  icon only
 *   <CopyButton text={yaml} label="Copy" />     icon + label, swaps to "Copied"
 *
 * Used by ApiSnippet and LedgerSchema so copy / play actions read consistently
 * across fragments. Clicks are stopped from propagating, so the button is safe
 * inside a clickable row or card header.
 */

import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';

export type TCopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, label, className }: TCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // The timer outlives the click that started it: a second click within 1.5s
  // would otherwise let the first one reset the state while the button still
  // reads "Copied", and an unmount would leave it pending.
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  return (
    <Button
      variant="outline"
      size={label ? 'sm' : 'icon-sm'}
      // A visible label is already the accessible name — naming the button
      // again here would override it, and with the wrong word once copied.
      aria-label={label ? undefined : copied ? 'Copied' : 'Copy'}
      className={cn(
        'text-muted-foreground',
        label && 'gap-1.5 [&>svg]:size-3.5',
        className
      )}
      onClick={async (e) => {
        e.stopPropagation();
        // Confirm after the write resolves, never before: a denied clipboard
        // permission must not show a check for text that was not copied.
        await navigator.clipboard.writeText(text.trim());
        setCopied(true);
        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check /> : <Copy />}
      {label && <span>{copied ? 'Copied' : label}</span>}
    </Button>
  );
}
