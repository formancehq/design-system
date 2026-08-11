'use client';

import { FormanceIcon } from '@/registry/default/ui/formance-logo';

const variants = ['emerald', 'slate', 'lilac', 'gold', 'cobalt'] as const;

export default function FormanceIconColors() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <FormanceIcon variant={variant} size="xl" />
          <span className="text-muted-foreground font-mono text-xs uppercase">
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}
