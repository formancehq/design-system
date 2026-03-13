'use client';

import { Badge } from '@/registry/default/ui/badge';

export default function BadgeSemanticColors() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="red">Red</Badge>
      <Badge variant="orange">Orange</Badge>
      <Badge variant="amber">Amber</Badge>
      <Badge variant="yellow">Yellow</Badge>
      <Badge variant="lime">Lime</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="teal">Teal</Badge>
      <Badge variant="cyan">Cyan</Badge>
      <Badge variant="sky">Sky</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="indigo">Indigo</Badge>
      <Badge variant="violet">Violet</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="fuchsia">Fuchsia</Badge>
      <Badge variant="pink">Pink</Badge>
      <Badge variant="rose">Rose</Badge>
      <Badge variant="zinc">Zinc</Badge>
    </div>
  );
}
