'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/formancehq.png" alt="Formance" />
        <AvatarFallback>FO</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
    </div>
  );
}
