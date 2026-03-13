'use client';

import { useState } from 'react';

import { Calendar } from '@/registry/default/ui/calendar';

export default function CalendarDisabledFunction() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={(day) => day > new Date() || day < new Date('1900-01-01')}
      className="rounded-md border"
    />
  );
}
