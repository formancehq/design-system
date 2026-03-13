'use client';

import { useState } from 'react';

import { Calendar } from '@/registry/default/ui/calendar';

export default function CalendarDropdown() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      startMonth={new Date(2020, 0)}
      endMonth={new Date(2030, 11)}
      className="rounded-md border"
    />
  );
}
