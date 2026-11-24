'use client';

import { FormanceThinkingLogo } from '@/registry/default/ui/formance-thinking-logo';

export default function FormanceThinkingLogoDemo() {
  return (
    <div className="flex items-end gap-8">
      <FormanceThinkingLogo size={24} />
      <FormanceThinkingLogo size={32} />
      <FormanceThinkingLogo size={64} />
      <FormanceThinkingLogo size={128} />
    </div>
  );
}
