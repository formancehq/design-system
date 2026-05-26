'use client';

import { useState } from 'react';

import { Calendar } from '@/registry/default/ui/calendar';

export default function CalendarWithTime() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      withTime
      className="rounded-md border"
    />
  );
}
