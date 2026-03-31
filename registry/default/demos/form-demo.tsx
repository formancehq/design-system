'use client';

import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { Button } from '@/registry/default/ui/button';

export default function FormDemo() {
  return (
    <form
      className="w-full max-w-sm space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-2">
        <Label htmlFor="form-email">Email</Label>
        <Input id="form-email" type="email" placeholder="you@formance.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="form-password">Password</Label>
        <Input id="form-password" type="password" placeholder="••••••••" />
      </div>
      <Button variant="primary" size="md" type="submit">
        Sign In
      </Button>
    </form>
  );
}
