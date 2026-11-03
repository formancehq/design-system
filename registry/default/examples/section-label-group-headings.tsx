'use client';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

export default function SectionLabelGroupHeadings() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <Command className="w-56 rounded-lg border">
        <CommandList>
          <CommandGroup heading="Ledgers">
            <CommandItem>Main Ledger</CommandItem>
            <CommandItem>Sandbox Ledger</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Connectors">
            <CommandItem>Stripe</CommandItem>
            <CommandItem>Wise</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Select>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ledgers</SelectLabel>
            <SelectItem value="main">Main Ledger</SelectItem>
            <SelectItem value="sandbox">Sandbox Ledger</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Connectors</SelectLabel>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="wise">Wise</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
