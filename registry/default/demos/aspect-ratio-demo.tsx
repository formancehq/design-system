'use client';

import { AspectRatio } from '@/registry/default/ui/aspect-ratio';

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm">
          16:9 Aspect Ratio
        </div>
      </AspectRatio>
    </div>
  );
}
