'use client';

import { Label } from '@/registry/default/ui/label';
import { Switch } from '@/registry/default/ui/switch';

export default function SwitchDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="webhooks" />
        <Label htmlFor="webhooks">Enable webhooks</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled" className="opacity-50">
          Disabled
        </Label>
      </div>
    </div>
  );
}
