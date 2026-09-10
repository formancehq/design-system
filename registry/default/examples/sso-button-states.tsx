'use client';

import { SsoButtonGroup } from '@/components/ui-fragments/sso-button';

export default function SsoButtonStates() {
  return (
    <div className="grid w-full max-w-2xl gap-8 sm:grid-cols-2">
      <div className="space-y-3">
        <p className="text-muted-foreground text-xs">Redirect in flight</p>
        <SsoButtonGroup loadingProvider="google" />
      </div>
      <div className="space-y-3">
        <p className="text-muted-foreground text-xs">Disabled</p>
        <SsoButtonGroup disabled />
      </div>
    </div>
  );
}
