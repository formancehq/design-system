'use client';

import { CONTEXT_TYPES, ContextIcon } from '@/registry/default/ui/context-icon';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function ContextIconDemo() {
  return (
    <div className="flex flex-col gap-6">
      {Object.values(CONTEXT_TYPES).map((type) => (
        <div key={type} className="flex items-end gap-4">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <ContextIcon type={type} size={size} />
              <span className="text-muted-foreground font-mono text-xs uppercase">
                {size}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
