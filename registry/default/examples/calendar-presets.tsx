'use client';

import { useState } from 'react';

import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const presets = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In a week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
];

export default function CalendarPresets() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex gap-4 rounded-md border p-4">
      <div className="flex flex-col gap-1">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => setDate(addDays(new Date(), preset.days))}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    </div>
  );
}
