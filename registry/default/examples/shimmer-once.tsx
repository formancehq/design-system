'use client';

import * as React from 'react';

import { Button } from '@/registry/default/ui/button';

export default function ShimmerOnce() {
  const [key, setKey] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <p
        key={key}
        className="shimmer shimmer-duration-1100 shimmer-once text-sm text-muted-foreground"
      >
        Schema v2 inserted.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setKey((value) => value + 1)}
      >
        Replay
      </Button>
    </div>
  );
}
