'use client';

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectBadgeLabel() {
  return (
    <MultiSelect defaultValues={['us-east-1']}>
      <MultiSelectTrigger className="w-[320px]">
        <MultiSelectValue placeholder="Select regions..." />
      </MultiSelectTrigger>
      <MultiSelectContent search={{ placeholder: 'Search regions...' }}>
        <MultiSelectGroup>
          <MultiSelectItem value="us-east-1" badgeLabel="US East">
            US East (N. Virginia)
          </MultiSelectItem>
          <MultiSelectItem value="us-west-2" badgeLabel="US West">
            US West (Oregon)
          </MultiSelectItem>
          <MultiSelectItem value="eu-west-1" badgeLabel="EU West">
            EU West (Ireland)
          </MultiSelectItem>
          <MultiSelectItem value="eu-central-1" badgeLabel="EU Central">
            EU Central (Frankfurt)
          </MultiSelectItem>
          <MultiSelectItem value="ap-southeast-1" badgeLabel="AP Southeast">
            AP Southeast (Singapore)
          </MultiSelectItem>
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
