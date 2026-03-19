type TExampleMeta = {
  title: string;
  sourceFile: string;
};

export const registryExamples: Record<string, TExampleMeta[]> = {
  badge: [
    { title: 'States', sourceFile: 'registry/default/examples/badge-states.tsx' },
    { title: 'Brand Colors', sourceFile: 'registry/default/examples/badge-brand-colors.tsx' },
    { title: 'Semantic Colors', sourceFile: 'registry/default/examples/badge-semantic-colors.tsx' },
    { title: 'Outline', sourceFile: 'registry/default/examples/badge-outline.tsx' },
    { title: 'Sizes', sourceFile: 'registry/default/examples/badge-sizes.tsx' },
  ],
  button: [
    { title: 'Primary', sourceFile: 'registry/default/examples/button-primary.tsx' },
    { title: 'Secondary', sourceFile: 'registry/default/examples/button-secondary.tsx' },
    { title: 'Outline', sourceFile: 'registry/default/examples/button-outline.tsx' },
    { title: 'Ghost', sourceFile: 'registry/default/examples/button-ghost.tsx' },
    { title: 'Link', sourceFile: 'registry/default/examples/button-link.tsx' },
    { title: 'Destructive', sourceFile: 'registry/default/examples/button-destructive.tsx' },
    { title: 'Brand Colors', sourceFile: 'registry/default/examples/button-brand-colors.tsx' },
    { title: 'Sizes', sourceFile: 'registry/default/examples/button-sizes.tsx' },
    { title: 'With Icon', sourceFile: 'registry/default/examples/button-with-icon.tsx' },
    { title: 'Icon Only', sourceFile: 'registry/default/examples/button-icon.tsx' },
    { title: 'Loading', sourceFile: 'registry/default/examples/button-loading.tsx' },
    { title: 'As Child', sourceFile: 'registry/default/examples/button-as-child.tsx' },
  ],
  eyebrow: [
    { title: 'With Square', sourceFile: 'registry/default/examples/eyebrow-with-square.tsx' },
    { title: 'Underscore Prefix', sourceFile: 'registry/default/examples/eyebrow-underscore.tsx' },
    { title: 'Slash Suffix', sourceFile: 'registry/default/examples/eyebrow-slash.tsx' },
    { title: 'Underscore & Slash', sourceFile: 'registry/default/examples/eyebrow-variants.tsx' },
    { title: 'Sizes', sourceFile: 'registry/default/examples/eyebrow-sizes.tsx' },
    { title: 'With Content', sourceFile: 'registry/default/examples/eyebrow-with-content.tsx' },
  ],
  'dropdown-menu': [
    { title: 'With Icons & Shortcuts', sourceFile: 'registry/default/examples/dropdown-menu-with-icons.tsx' },
    { title: 'Checkboxes', sourceFile: 'registry/default/examples/dropdown-menu-checkboxes.tsx' },
    { title: 'Radio Group', sourceFile: 'registry/default/examples/dropdown-menu-radio-group.tsx' },
    { title: 'Submenu', sourceFile: 'registry/default/examples/dropdown-menu-submenu.tsx' },
  ],
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
  'page-section': [
    { title: 'Horizontal Orientation', sourceFile: 'registry/default/examples/page-section-horizontal.tsx' },
    { title: 'With Aside Actions', sourceFile: 'registry/default/examples/page-section-with-aside.tsx' },
  ],
  'page-header': [],
};
