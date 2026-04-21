'use client';

import { Slider } from '@/registry/default/ui/slider';

export default function SliderRangeExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Transaction amount range</p>
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>
    </div>
  );
}
