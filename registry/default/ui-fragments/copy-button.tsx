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
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';

export type TCopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, label, className }: TCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size={label ? 'sm' : 'icon-sm'}
      aria-label="Copy"
      className={cn(
        'text-muted-foreground',
        label && 'gap-1.5 [&>svg]:size-3.5',
        className
      )}
      onClick={async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(text.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check /> : <Copy />}
      {label && <span>{copied ? 'Copied' : label}</span>}
    </Button>
  );
}
