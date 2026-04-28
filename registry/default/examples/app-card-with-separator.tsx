import { KeyRound } from 'lucide-react';

import { AppCard } from '@/registry/default/fragments/app-card';
import { Button } from '@/registry/default/ui/button';
import { TypographyP } from '@/registry/default/ui/typography';

export default function AppCardWithSeparatorExample() {
  return (
    <div className="w-full max-w-2xl">
      <AppCard
        title="API Keys"
        description="Manage credentials used to authenticate against the stack."
        appIcon={KeyRound}
        iconVariant="lilac"
        headerAction={<Button size="sm">Create key</Button>}
        withSeparator
      >
        <TypographyP>
          Keys are scoped per stack. Rotate them periodically and revoke any
          that are unused.
        </TypographyP>
      </AppCard>
    </div>
  );
}
