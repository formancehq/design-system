'use client';

import {
  RadioGroupStacked,
  RadioGroupStackedItem,
} from '@/registry/default/ui/radio-group-stacked';

export default function RadioGroupStackedDemo() {
  return (
    <RadioGroupStacked defaultValue="sandbox">
      <RadioGroupStackedItem
        value="sandbox"
        id="r1"
        label="Sandbox"
        description="A safe environment for testing transactions and integrations."
      />
      <RadioGroupStackedItem
        value="staging"
        id="r2"
        label="Staging"
        description="Pre-production environment mirroring your live setup."
      />
      <RadioGroupStackedItem
        value="production"
        id="r3"
        label="Production"
        description="Your live environment processing real transactions."
      />
    </RadioGroupStacked>
  );
}
