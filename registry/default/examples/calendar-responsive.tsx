'use client';

import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/registry/default/ui/calendar';

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function CalendarResponsive() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 960px)');
    const onChange = () => setIsSmallScreen(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={isSmallScreen ? 1 : 2}
      className="rounded-md border"
    />
  );
}
