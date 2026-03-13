type TExampleMeta = {
  title: string;
  sourceFile: string;
};

export const registryExamples: Record<string, TExampleMeta[]> = {
  calendar: [
    {
      title: 'Date Range',
      sourceFile: 'registry/default/examples/calendar-range.tsx',
    },
    {
      title: 'Month & Year Dropdown',
      sourceFile: 'registry/default/examples/calendar-dropdown.tsx',
    },
    {
      title: 'With Presets',
      sourceFile: 'registry/default/examples/calendar-presets.tsx',
    },
    {
      title: 'Week Numbers',
      sourceFile: 'registry/default/examples/calendar-week-numbers.tsx',
    },
    {
      title: 'Disabled Dates',
      sourceFile: 'registry/default/examples/calendar-disabled-dates.tsx',
    },
    {
      title: 'Disabled Date Range (Function)',
      sourceFile: 'registry/default/examples/calendar-disabled-function.tsx',
    },
    {
      title: 'Default Month',
      sourceFile: 'registry/default/examples/calendar-default-month.tsx',
    },
    {
      title: 'Responsive',
      sourceFile: 'registry/default/examples/calendar-responsive.tsx',
    },
    {
      title: 'Date Picker',
      sourceFile: 'registry/default/examples/calendar-date-picker.tsx',
    },
  ],
};
