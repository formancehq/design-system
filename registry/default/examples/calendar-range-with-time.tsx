'use client';

import { useId, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/registry/default/ui/calendar';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

function toTimeString(date: Date | undefined) {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

function applyTimeString(base: Date | undefined, time: string) {
  const [h = 0, m = 0, s = 0] = time.split(':').map(Number);
  const next = base ? new Date(base) : new Date();
  next.setHours(Number.isFinite(h) ? h : 0);
  next.setMinutes(Number.isFinite(m) ? m : 0);
  next.setSeconds(Number.isFinite(s) ? s : 0);
  next.setMilliseconds(0);

  return next;
}

export default function CalendarRangeWithTime() {
  const initialFrom = new Date();
  const initialTo = addDays(new Date(), 7);

  const [range, setRange] = useState<DateRange | undefined>({
    from: initialFrom,
    to: initialTo,
  });
  const [fromMonth, setFromMonth] = useState<Date>(initialFrom);
  const [toMonth, setToMonth] = useState<Date>(initialTo);
  const fromId = useId();
  const toId = useId();

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row md:divide-x divide-y md:divide-y-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          month={fromMonth}
          onMonthChange={setFromMonth}
          captionLayout="dropdown"
        />
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          month={toMonth}
          onMonthChange={setToMonth}
          captionLayout="dropdown"
        />
      </div>
      <div className="flex flex-col md:flex-row md:divide-x divide-y md:divide-y-0 border-t">
        <div className="flex items-center gap-2 p-3 md:flex-1">
          <Label htmlFor={fromId} className="text-xs">
            Start
          </Label>
          <Input
            id={fromId}
            type="time"
            step={1}
            size="sm"
            disabled={!range?.from}
            value={toTimeString(range?.from)}
            onChange={(e) =>
              setRange({
                from: applyTimeString(range?.from, e.target.value),
                to: range?.to,
              })
            }
          />
        </div>
        <div className="flex items-center gap-2 p-3 md:flex-1">
          <Label htmlFor={toId} className="text-xs">
            End
          </Label>
          <Input
            id={toId}
            type="time"
            step={1}
            size="sm"
            disabled={!range?.to}
            value={toTimeString(range?.to)}
            onChange={(e) =>
              setRange({
                from: range?.from,
                to: applyTimeString(range?.to, e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
