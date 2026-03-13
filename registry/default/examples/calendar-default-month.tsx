'use client';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/registry/default/ui/calendar';

export default function CalendarDefaultMonth() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 11, 20),
    to: new Date(2026, 0, 5),
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={range?.from}
      numberOfMonths={2}
      className="rounded-md border"
    />
  );
}
