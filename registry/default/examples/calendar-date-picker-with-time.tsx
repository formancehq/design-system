'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';
import { cn } from '@/lib/utils';

function formatDateTime(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function CalendarDatePickerWithTime() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? formatDateTime(date) : 'Pick a date and time'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          withTime
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
