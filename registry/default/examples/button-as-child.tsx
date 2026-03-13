'use client';

import Link from 'next/link';

import { Button } from '@/registry/default/ui/button';

export default function ButtonAsChild() {
  return (
    <Button asChild>
      <Link href="/docs/components/button">As Link</Link>
    </Button>
  );
}
