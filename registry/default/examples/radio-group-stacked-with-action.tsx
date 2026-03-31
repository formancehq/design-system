'use client';

import { Badge } from '@/registry/default/ui/badge';
import {
  RadioGroupStacked,
  RadioGroupStackedItem,
} from '@/registry/default/ui/radio-group-stacked';

export default function RadioGroupStackedWithAction() {
  return (
    <RadioGroupStacked defaultValue="sandbox">
      <RadioGroupStackedItem
        value="sandbox"
        id="r1"
        label="Sandbox"
        description="A safe environment for testing transactions and integrations."
        action={
          <Badge variant="emerald" size="sm">
            Free
          </Badge>
        }
      />
      <RadioGroupStackedItem
        value="staging"
        id="r2"
        label="Staging"
        description="Pre-production environment mirroring your live setup."
        action={
          <Badge variant="cobalt" size="sm">
            Pro
          </Badge>
        }
      />
      <RadioGroupStackedItem
        value="production"
        id="r3"
        label="Production"
        description="Your live environment processing real transactions."
        action={
          <Badge variant="lilac" size="sm">
            Enterprise
          </Badge>
        }
      />
    </RadioGroupStacked>
  );
}
