'use client';

import * as React from 'react';

import { RowData } from '@tanstack/react-table';
import { Check, CirclePlus } from 'lucide-react';

import type { Column } from '@/components/ui-fragments/data-table/data-table-features';
import { cn } from '@/lib/utils';
import { Badge, type TBadgeProps } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/registry/default/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';
import { Separator } from '@/registry/default/ui/separator';

export type TFacetedFilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: TBadgeProps['variant'];
};

export type TDataTableFacetedFilterProps<TData extends RowData, TValue> = {
  column?: Column<TData, TValue>;
  title?: string;
  options: TFacetedFilterOption[];
  /**
   * What the trigger shows once something is picked: `badges` names up to two
   * picks, then a count; `count` always shows a count (for long labels).
   */
  selectionDisplay?: 'badges' | 'count';
};

export function DataTableFacetedFilter<TData extends RowData, TValue>({
  column,
  title,
  options,
  selectionDisplay = 'badges',
}: TDataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outlineDashed"
          className="gap-2"
          data-testid={`datatable-filter-${title?.toLowerCase()}`}
        >
          <CirclePlus className="size-4" />

          <span>{title}</span>

          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="flex gap-x-1">
                {selectionDisplay === 'count' || selectedValues.size > 2 ? (
                  <Badge variant="secondary">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options.flatMap((option) =>
                    selectedValues.has(option.value)
                      ? [
                          <Badge
                            variant={option.variant ?? 'primary'}
                            key={option.value}
                          >
                            {option.label}
                          </Badge>,
                        ]
                      : []
                  )
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto min-w-[200px] max-w-xs p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    data-testid={`datatable-filters-${option.label.toLowerCase()}`}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        'me-2 flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? "bg-primary text-primary-foreground! [&_svg:not([class*='text-'])]:text-primary-foreground"
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      {isSelected && <Check className="size-4" />}
                    </div>
                    {option.icon && (
                      <option.icon className="me-2 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 truncate">{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ms-auto flex size-4 shrink-0 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
