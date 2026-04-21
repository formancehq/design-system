'use client';

import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';

export default function InputWithButtonExample() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input placeholder="Search transactions..." />
      <Button type="submit">Search</Button>
    </div>
  );
}
