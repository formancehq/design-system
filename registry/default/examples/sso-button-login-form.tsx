'use client';

import { useState } from 'react';

import {
  SsoButtonGroup,
  type TSsoProvider,
} from '@/components/ui-fragments/sso-button';
import { Button } from '@/registry/default/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/default/ui/card';
import { FormanceLogo } from '@/registry/default/ui/formance-logo';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';

export default function SsoButtonLoginForm() {
  const [pending, setPending] = useState<TSsoProvider | undefined>(undefined);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Card className="border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <span className="sr-only">Formance</span>
            <FormanceLogo />
          </CardTitle>
          <CardDescription className="pt-4">
            Login with your Google, GitHub, or Microsoft account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <SsoButtonGroup
              loadingProvider={pending}
              onProviderSelect={setPending}
              labels={{
                google: 'Login with Google',
                github: 'Login with GitHub',
                microsoft: 'Login with Microsoft',
              }}
            />
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with SSO
              </span>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sso-login-email">Email</Label>
              <Input
                id="sso-login-email"
                type="email"
                placeholder="m@example.com"
              />
              <Button type="button" className="w-full">
                Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
