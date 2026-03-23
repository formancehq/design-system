'use client';

import {
  FormanceLogo,
  FormanceIcon,
} from '@/registry/default/ui/formance-logo';

export default function FormanceLogoDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <FormanceLogo />
      <div className="flex items-end gap-4">
        <FormanceIcon size="xs" />
        <FormanceIcon size="sm" />
        <FormanceIcon size="md" />
        <FormanceIcon size="lg" />
        <FormanceIcon size="xl" />
      </div>
    </div>
  );
}
