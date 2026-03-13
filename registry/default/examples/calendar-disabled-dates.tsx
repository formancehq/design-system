'use client';

import { useState } from 'react';

import { Calendar } from '@/registry/default/ui/calendar';

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const bookedDays = [
  addDays(new Date(), 1),
  addDays(new Date(), 3),
  addDays(new Date(), 5),
  addDays(new Date(), 8),
  addDays(new Date(), 12),
];

export default function CalendarDisabledDates() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={bookedDays}
      className="rounded-md border"
    />
  );
}
