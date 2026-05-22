'use client';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfQuarter(date: Date) {
  const quarter = Math.floor(date.getMonth() / 3);

  return new Date(date.getFullYear(), quarter * 3, 1);
}

const presets: { label: string; getRange: () => DateRange }[] = [
  {
    label: 'Today',
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
  {
    label: 'Yesterday',
    getRange: () => ({
      from: addDays(new Date(), -1),
      to: addDays(new Date(), -1),
    }),
  },
  {
    label: 'Last 7 days',
    getRange: () => ({ from: addDays(new Date(), -6), to: new Date() }),
  },
  {
    label: 'Last 30 days',
    getRange: () => ({ from: addDays(new Date(), -29), to: new Date() }),
  },
  {
    label: 'This month',
    getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
  {
    label: 'Last month',
    getRange: () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    },
  },
  {
    label: 'This quarter',
    getRange: () => ({ from: startOfQuarter(new Date()), to: new Date() }),
  },
];

export default function CalendarRangePresets() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -6),
    to: new Date(),
  });

  return (
    <div className="flex flex-col md:flex-row md:divide-x divide-y md:divide-y-0 rounded-md border w-fit">
      <div className="flex flex-col gap-1 p-3 md:w-40">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => setRange(preset.getRange())}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
      />
    </div>
  );
}
