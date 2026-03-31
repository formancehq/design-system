'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/registry/default/ui/hover-card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/registry/default/ui/avatar';

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-sm underline underline-offset-4">
          @formance
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/formancehq.png" />
            <AvatarFallback>FO</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Formance</p>
            <p className="text-sm text-muted-foreground">
              Open-source financial infrastructure.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
