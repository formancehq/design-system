'use client';

import { SsoButtonGroup } from '@/components/ui-fragments/sso-button';

export default function SsoButtonLabels() {
  return (
    <SsoButtonGroup
      className="w-full max-w-sm"
      providers={['google', 'github']}
      labels={{
        google: 'Login with Google',
        github: 'Login with GitHub',
      }}
    />
  );
}
