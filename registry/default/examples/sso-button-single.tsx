'use client';

import { SsoButton } from '@/components/ui-fragments/sso-button';

export default function SsoButtonSingle() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SsoButton provider="google" />
      <SsoButton provider="github" />
      <SsoButton provider="microsoft" />
    </div>
  );
}
