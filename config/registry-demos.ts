'use client';

import { lazy, type ComponentType } from 'react';

export type TRegistryExample = {
  title: string;
  component: React.LazyExoticComponent<ComponentType>;
  sourceFile: string;
};

type TRegistryDemo = {
  component: React.LazyExoticComponent<ComponentType>;
  sourceFile: string;
  examples?: TRegistryExample[];
};

type TDemoEntry = {
  component: React.LazyExoticComponent<ComponentType>;
  sourceFile: string;
};

/** Pre-built index of all demos and examples by name slug. Built once at module load. */
let _index: Map<string, TDemoEntry> | null = null;

function buildIndex(): Map<string, TDemoEntry> {
  const map = new Map<string, TDemoEntry>();
  for (const [key, demo] of Object.entries(registryDemos)) {
    map.set(key, demo);
    for (const ex of demo.examples ?? []) {
      const slug = ex.sourceFile
        .replace('registry/default/examples/', '')
        .replace('.tsx', '');
      map.set(slug, ex);
    }
  }

  return map;
}

/** Look up a demo or example by name. O(1) after first call. */
export function findDemo(name: string): TDemoEntry | undefined {
  _index ??= buildIndex();

  return _index.get(name);
}

export const registryDemos: Record<string, TRegistryDemo> = {
  accordion: {
    component: lazy(() => import('@/registry/default/demos/accordion-demo')),
    sourceFile: 'registry/default/demos/accordion-demo.tsx',
  },
  alert: {
    component: lazy(() => import('@/registry/default/demos/alert-demo')),
    sourceFile: 'registry/default/demos/alert-demo.tsx',
  },
  'alert-dialog': {
    component: lazy(() => import('@/registry/default/demos/alert-dialog-demo')),
    sourceFile: 'registry/default/demos/alert-dialog-demo.tsx',
    examples: [
      {
        title: 'Destructive',
        component: lazy(
          () => import('@/registry/default/examples/alert-dialog-destructive')
        ),
        sourceFile: 'registry/default/examples/alert-dialog-destructive.tsx',
      },
    ],
  },
  'aspect-ratio': {
    component: lazy(() => import('@/registry/default/demos/aspect-ratio-demo')),
    sourceFile: 'registry/default/demos/aspect-ratio-demo.tsx',
  },
  avatar: {
    component: lazy(() => import('@/registry/default/demos/avatar-demo')),
    sourceFile: 'registry/default/demos/avatar-demo.tsx',
  },
  badge: {
    component: lazy(() => import('@/registry/default/demos/badge-demo')),
    sourceFile: 'registry/default/demos/badge-demo.tsx',
    examples: [
      {
        title: 'States',
        component: lazy(
          () => import('@/registry/default/examples/badge-states')
        ),
        sourceFile: 'registry/default/examples/badge-states.tsx',
      },
      {
        title: 'Brand Colors',
        component: lazy(
          () => import('@/registry/default/examples/badge-brand-colors')
        ),
        sourceFile: 'registry/default/examples/badge-brand-colors.tsx',
      },
      {
        title: 'Semantic Colors',
        component: lazy(
          () => import('@/registry/default/examples/badge-semantic-colors')
        ),
        sourceFile: 'registry/default/examples/badge-semantic-colors.tsx',
      },
      {
        title: 'Outline',
        component: lazy(
          () => import('@/registry/default/examples/badge-outline')
        ),
        sourceFile: 'registry/default/examples/badge-outline.tsx',
      },
      {
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/badge-sizes')
        ),
        sourceFile: 'registry/default/examples/badge-sizes.tsx',
      },
    ],
  },
  breadcrumb: {
    component: lazy(() => import('@/registry/default/demos/breadcrumb-demo')),
    sourceFile: 'registry/default/demos/breadcrumb-demo.tsx',
  },
  button: {
    component: lazy(() => import('@/registry/default/demos/button-demo')),
    sourceFile: 'registry/default/demos/button-demo.tsx',
    examples: [
      {
        title: 'Primary',
        component: lazy(
          () => import('@/registry/default/examples/button-primary')
        ),
        sourceFile: 'registry/default/examples/button-primary.tsx',
      },
      {
        title: 'Secondary',
        component: lazy(
          () => import('@/registry/default/examples/button-secondary')
        ),
        sourceFile: 'registry/default/examples/button-secondary.tsx',
      },
      {
        title: 'Outline',
        component: lazy(
          () => import('@/registry/default/examples/button-outline')
        ),
        sourceFile: 'registry/default/examples/button-outline.tsx',
      },
      {
        title: 'Ghost',
        component: lazy(
          () => import('@/registry/default/examples/button-ghost')
        ),
        sourceFile: 'registry/default/examples/button-ghost.tsx',
      },
      {
        title: 'Link',
        component: lazy(
          () => import('@/registry/default/examples/button-link')
        ),
        sourceFile: 'registry/default/examples/button-link.tsx',
      },
      {
        title: 'Destructive',
        component: lazy(
          () => import('@/registry/default/examples/button-destructive')
        ),
        sourceFile: 'registry/default/examples/button-destructive.tsx',
      },
      {
        title: 'Brand Colors',
        component: lazy(
          () => import('@/registry/default/examples/button-brand-colors')
        ),
        sourceFile: 'registry/default/examples/button-brand-colors.tsx',
      },
      {
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/button-sizes')
        ),
        sourceFile: 'registry/default/examples/button-sizes.tsx',
      },
      {
        title: 'With Icon',
        component: lazy(
          () => import('@/registry/default/examples/button-with-icon')
        ),
        sourceFile: 'registry/default/examples/button-with-icon.tsx',
      },
      {
        title: 'Icon Only',
        component: lazy(
          () => import('@/registry/default/examples/button-icon')
        ),
        sourceFile: 'registry/default/examples/button-icon.tsx',
      },
      {
        title: 'Loading',
        component: lazy(
          () => import('@/registry/default/examples/button-loading')
        ),
        sourceFile: 'registry/default/examples/button-loading.tsx',
      },
      {
        title: 'As Child',
        component: lazy(
          () => import('@/registry/default/examples/button-as-child')
        ),
        sourceFile: 'registry/default/examples/button-as-child.tsx',
      },
    ],
  },
  calendar: {
    component: lazy(() => import('@/registry/default/demos/calendar-demo')),
    sourceFile: 'registry/default/demos/calendar-demo.tsx',
    examples: [
      {
        title: 'Date Range',
        component: lazy(
          () => import('@/registry/default/examples/calendar-range')
        ),
        sourceFile: 'registry/default/examples/calendar-range.tsx',
      },
      {
        title: 'Month & Year Dropdown',
        component: lazy(
          () => import('@/registry/default/examples/calendar-dropdown')
        ),
        sourceFile: 'registry/default/examples/calendar-dropdown.tsx',
      },
      {
        title: 'With Presets',
        component: lazy(
          () => import('@/registry/default/examples/calendar-presets')
        ),
        sourceFile: 'registry/default/examples/calendar-presets.tsx',
      },
      {
        title: 'Week Numbers',
        component: lazy(
          () => import('@/registry/default/examples/calendar-week-numbers')
        ),
        sourceFile: 'registry/default/examples/calendar-week-numbers.tsx',
      },
      {
        title: 'Disabled Dates',
        component: lazy(
          () => import('@/registry/default/examples/calendar-disabled-dates')
        ),
        sourceFile: 'registry/default/examples/calendar-disabled-dates.tsx',
      },
      {
        title: 'Disabled Date Range (Function)',
        component: lazy(
          () => import('@/registry/default/examples/calendar-disabled-function')
        ),
        sourceFile: 'registry/default/examples/calendar-disabled-function.tsx',
      },
      {
        title: 'Default Month',
        component: lazy(
          () => import('@/registry/default/examples/calendar-default-month')
        ),
        sourceFile: 'registry/default/examples/calendar-default-month.tsx',
      },
      {
        title: 'Responsive',
        component: lazy(
          () => import('@/registry/default/examples/calendar-responsive')
        ),
        sourceFile: 'registry/default/examples/calendar-responsive.tsx',
      },
      {
        title: 'Date Picker',
        component: lazy(
          () => import('@/registry/default/examples/calendar-date-picker')
        ),
        sourceFile: 'registry/default/examples/calendar-date-picker.tsx',
      },
    ],
  },
  carousel: {
    component: lazy(() => import('@/registry/default/demos/carousel-demo')),
    sourceFile: 'registry/default/demos/carousel-demo.tsx',
  },
  chart: {
    component: lazy(() => import('@/registry/default/demos/chart-demo')),
    sourceFile: 'registry/default/demos/chart-demo.tsx',
  },
  card: {
    component: lazy(() => import('@/registry/default/demos/card-demo')),
    sourceFile: 'registry/default/demos/card-demo.tsx',
  },
  checkbox: {
    component: lazy(() => import('@/registry/default/demos/checkbox-demo')),
    sourceFile: 'registry/default/demos/checkbox-demo.tsx',
    examples: [
      {
        title: 'With Text',
        component: lazy(
          () => import('@/registry/default/examples/checkbox-with-text')
        ),
        sourceFile: 'registry/default/examples/checkbox-with-text.tsx',
      },
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/checkbox-disabled')
        ),
        sourceFile: 'registry/default/examples/checkbox-disabled.tsx',
      },
    ],
  },
  collapsible: {
    component: lazy(() => import('@/registry/default/demos/collapsible-demo')),
    sourceFile: 'registry/default/demos/collapsible-demo.tsx',
  },
  command: {
    component: lazy(() => import('@/registry/default/demos/command-demo')),
    sourceFile: 'registry/default/demos/command-demo.tsx',
    examples: [
      {
        title: 'Dialog',
        component: lazy(
          () => import('@/registry/default/examples/command-dialog')
        ),
        sourceFile: 'registry/default/examples/command-dialog.tsx',
      },
    ],
  },
  'context-menu': {
    component: lazy(() => import('@/registry/default/demos/context-menu-demo')),
    sourceFile: 'registry/default/demos/context-menu-demo.tsx',
  },
  dialog: {
    component: lazy(() => import('@/registry/default/demos/dialog-demo')),
    sourceFile: 'registry/default/demos/dialog-demo.tsx',
  },
  drawer: {
    component: lazy(() => import('@/registry/default/demos/drawer-demo')),
    sourceFile: 'registry/default/demos/drawer-demo.tsx',
  },
  'dropdown-menu': {
    component: lazy(
      () => import('@/registry/default/demos/dropdown-menu-demo')
    ),
    sourceFile: 'registry/default/demos/dropdown-menu-demo.tsx',
    examples: [
      {
        title: 'With Icons & Shortcuts',
        component: lazy(
          () => import('@/registry/default/examples/dropdown-menu-with-icons')
        ),
        sourceFile: 'registry/default/examples/dropdown-menu-with-icons.tsx',
      },
      {
        title: 'Checkboxes',
        component: lazy(
          () => import('@/registry/default/examples/dropdown-menu-checkboxes')
        ),
        sourceFile: 'registry/default/examples/dropdown-menu-checkboxes.tsx',
      },
      {
        title: 'Radio Group',
        component: lazy(
          () => import('@/registry/default/examples/dropdown-menu-radio-group')
        ),
        sourceFile: 'registry/default/examples/dropdown-menu-radio-group.tsx',
      },
      {
        title: 'Submenu',
        component: lazy(
          () => import('@/registry/default/examples/dropdown-menu-submenu')
        ),
        sourceFile: 'registry/default/examples/dropdown-menu-submenu.tsx',
      },
    ],
  },
  eyebrow: {
    component: lazy(() => import('@/registry/default/demos/eyebrow-demo')),
    sourceFile: 'registry/default/demos/eyebrow-demo.tsx',
    examples: [
      {
        title: 'Underscore Prefix',
        component: lazy(
          () => import('@/registry/default/examples/eyebrow-underscore')
        ),
        sourceFile: 'registry/default/examples/eyebrow-underscore.tsx',
      },
      {
        title: 'Slash Suffix',
        component: lazy(
          () => import('@/registry/default/examples/eyebrow-slash')
        ),
        sourceFile: 'registry/default/examples/eyebrow-slash.tsx',
      },
      {
        title: 'Underscore & Slash',
        component: lazy(
          () => import('@/registry/default/examples/eyebrow-variants')
        ),
        sourceFile: 'registry/default/examples/eyebrow-variants.tsx',
      },
      {
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/eyebrow-sizes')
        ),
        sourceFile: 'registry/default/examples/eyebrow-sizes.tsx',
      },
      {
        title: 'With Content',
        component: lazy(
          () => import('@/registry/default/examples/eyebrow-with-content')
        ),
        sourceFile: 'registry/default/examples/eyebrow-with-content.tsx',
      },
    ],
  },
  form: {
    component: lazy(() => import('@/registry/default/demos/form-demo')),
    sourceFile: 'registry/default/demos/form-demo.tsx',
  },
  'hover-card': {
    component: lazy(() => import('@/registry/default/demos/hover-card-demo')),
    sourceFile: 'registry/default/demos/hover-card-demo.tsx',
  },
  input: {
    component: lazy(() => import('@/registry/default/demos/input-demo')),
    sourceFile: 'registry/default/demos/input-demo.tsx',
    examples: [
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/input-disabled')
        ),
        sourceFile: 'registry/default/examples/input-disabled.tsx',
      },
      {
        title: 'With Label',
        component: lazy(
          () => import('@/registry/default/examples/input-with-label')
        ),
        sourceFile: 'registry/default/examples/input-with-label.tsx',
      },
      {
        title: 'With Button',
        component: lazy(
          () => import('@/registry/default/examples/input-with-button')
        ),
        sourceFile: 'registry/default/examples/input-with-button.tsx',
      },
    ],
  },
  'input-otp': {
    component: lazy(() => import('@/registry/default/demos/input-otp-demo')),
    sourceFile: 'registry/default/demos/input-otp-demo.tsx',
    examples: [
      {
        title: 'With Separator',
        component: lazy(
          () => import('@/registry/default/examples/input-otp-separator')
        ),
        sourceFile: 'registry/default/examples/input-otp-separator.tsx',
      },
      {
        title: 'Pattern',
        component: lazy(
          () => import('@/registry/default/examples/input-otp-pattern')
        ),
        sourceFile: 'registry/default/examples/input-otp-pattern.tsx',
      },
    ],
  },
  label: {
    component: lazy(() => import('@/registry/default/demos/label-demo')),
    sourceFile: 'registry/default/demos/label-demo.tsx',
  },
  menubar: {
    component: lazy(() => import('@/registry/default/demos/menubar-demo')),
    sourceFile: 'registry/default/demos/menubar-demo.tsx',
  },
  'navigation-menu': {
    component: lazy(
      () => import('@/registry/default/demos/navigation-menu-demo')
    ),
    sourceFile: 'registry/default/demos/navigation-menu-demo.tsx',
  },
  pagination: {
    component: lazy(() => import('@/registry/default/demos/pagination-demo')),
    sourceFile: 'registry/default/demos/pagination-demo.tsx',
  },
  popover: {
    component: lazy(() => import('@/registry/default/demos/popover-demo')),
    sourceFile: 'registry/default/demos/popover-demo.tsx',
  },
  progress: {
    component: lazy(() => import('@/registry/default/demos/progress-demo')),
    sourceFile: 'registry/default/demos/progress-demo.tsx',
  },
  'radio-group': {
    component: lazy(() => import('@/registry/default/demos/radio-group-demo')),
    sourceFile: 'registry/default/demos/radio-group-demo.tsx',
  },
  'radio-group-card': {
    component: lazy(
      () => import('@/registry/default/demos/radio-group-card-demo')
    ),
    sourceFile: 'registry/default/demos/radio-group-card-demo.tsx',
    examples: [
      {
        title: 'With Children',
        component: lazy(
          () =>
            import('@/registry/default/examples/radio-group-card-with-children')
        ),
        sourceFile:
          'registry/default/examples/radio-group-card-with-children.tsx',
      },
    ],
  },
  'radio-group-stacked': {
    component: lazy(
      () => import('@/registry/default/demos/radio-group-stacked-demo')
    ),
    sourceFile: 'registry/default/demos/radio-group-stacked-demo.tsx',
    examples: [
      {
        title: 'With Action',
        component: lazy(
          () =>
            import(
              '@/registry/default/examples/radio-group-stacked-with-action'
            )
        ),
        sourceFile:
          'registry/default/examples/radio-group-stacked-with-action.tsx',
      },
    ],
  },
  resizable: {
    component: lazy(() => import('@/registry/default/demos/resizable-demo')),
    sourceFile: 'registry/default/demos/resizable-demo.tsx',
    examples: [
      {
        title: 'With Handle',
        component: lazy(
          () => import('@/registry/default/examples/resizable-with-handle')
        ),
        sourceFile: 'registry/default/examples/resizable-with-handle.tsx',
      },
      {
        title: 'Vertical',
        component: lazy(
          () => import('@/registry/default/examples/resizable-vertical')
        ),
        sourceFile: 'registry/default/examples/resizable-vertical.tsx',
      },
    ],
  },
  'scroll-area': {
    component: lazy(() => import('@/registry/default/demos/scroll-area-demo')),
    sourceFile: 'registry/default/demos/scroll-area-demo.tsx',
    examples: [
      {
        title: 'Horizontal',
        component: lazy(
          () => import('@/registry/default/examples/scroll-area-horizontal')
        ),
        sourceFile: 'registry/default/examples/scroll-area-horizontal.tsx',
      },
    ],
  },
  select: {
    component: lazy(() => import('@/registry/default/demos/select-demo')),
    sourceFile: 'registry/default/demos/select-demo.tsx',
    examples: [
      {
        title: 'Scrollable',
        component: lazy(
          () => import('@/registry/default/examples/select-scrollable')
        ),
        sourceFile: 'registry/default/examples/select-scrollable.tsx',
      },
    ],
  },
  separator: {
    component: lazy(() => import('@/registry/default/demos/separator-demo')),
    sourceFile: 'registry/default/demos/separator-demo.tsx',
  },
  sheet: {
    component: lazy(() => import('@/registry/default/demos/sheet-demo')),
    sourceFile: 'registry/default/demos/sheet-demo.tsx',
    examples: [
      {
        title: 'Side Variants',
        component: lazy(() => import('@/registry/default/examples/sheet-side')),
        sourceFile: 'registry/default/examples/sheet-side.tsx',
      },
    ],
  },
  skeleton: {
    component: lazy(() => import('@/registry/default/demos/skeleton-demo')),
    sourceFile: 'registry/default/demos/skeleton-demo.tsx',
    examples: [
      {
        title: 'Card',
        component: lazy(
          () => import('@/registry/default/examples/skeleton-card')
        ),
        sourceFile: 'registry/default/examples/skeleton-card.tsx',
      },
    ],
  },
  slider: {
    component: lazy(() => import('@/registry/default/demos/slider-demo')),
    sourceFile: 'registry/default/demos/slider-demo.tsx',
    examples: [
      {
        title: 'Range',
        component: lazy(
          () => import('@/registry/default/examples/slider-range')
        ),
        sourceFile: 'registry/default/examples/slider-range.tsx',
      },
    ],
  },
  spinner: {
    component: lazy(() => import('@/registry/default/demos/spinner-demo')),
    sourceFile: 'registry/default/demos/spinner-demo.tsx',
  },
  sonner: {
    component: lazy(() => import('@/registry/default/demos/sonner-demo')),
    sourceFile: 'registry/default/demos/sonner-demo.tsx',
    examples: [
      {
        title: 'Types',
        component: lazy(
          () => import('@/registry/default/examples/sonner-types')
        ),
        sourceFile: 'registry/default/examples/sonner-types.tsx',
      },
    ],
  },
  switch: {
    component: lazy(() => import('@/registry/default/demos/switch-demo')),
    sourceFile: 'registry/default/demos/switch-demo.tsx',
  },
  table: {
    component: lazy(() => import('@/registry/default/demos/table-demo')),
    sourceFile: 'registry/default/demos/table-demo.tsx',
  },
  tabs: {
    component: lazy(() => import('@/registry/default/demos/tabs-demo')),
    sourceFile: 'registry/default/demos/tabs-demo.tsx',
  },
  textarea: {
    component: lazy(() => import('@/registry/default/demos/textarea-demo')),
    sourceFile: 'registry/default/demos/textarea-demo.tsx',
    examples: [
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/textarea-disabled')
        ),
        sourceFile: 'registry/default/examples/textarea-disabled.tsx',
      },
      {
        title: 'With Label',
        component: lazy(
          () => import('@/registry/default/examples/textarea-with-label')
        ),
        sourceFile: 'registry/default/examples/textarea-with-label.tsx',
      },
      {
        title: 'With Button',
        component: lazy(
          () => import('@/registry/default/examples/textarea-with-button')
        ),
        sourceFile: 'registry/default/examples/textarea-with-button.tsx',
      },
    ],
  },
  toggle: {
    component: lazy(() => import('@/registry/default/demos/toggle-demo')),
    sourceFile: 'registry/default/demos/toggle-demo.tsx',
    examples: [
      {
        title: 'Outline',
        component: lazy(
          () => import('@/registry/default/examples/toggle-outline')
        ),
        sourceFile: 'registry/default/examples/toggle-outline.tsx',
      },
      {
        title: 'With Text',
        component: lazy(
          () => import('@/registry/default/examples/toggle-with-text')
        ),
        sourceFile: 'registry/default/examples/toggle-with-text.tsx',
      },
      {
        title: 'Small',
        component: lazy(() => import('@/registry/default/examples/toggle-sm')),
        sourceFile: 'registry/default/examples/toggle-sm.tsx',
      },
      {
        title: 'Large',
        component: lazy(() => import('@/registry/default/examples/toggle-lg')),
        sourceFile: 'registry/default/examples/toggle-lg.tsx',
      },
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/toggle-disabled')
        ),
        sourceFile: 'registry/default/examples/toggle-disabled.tsx',
      },
    ],
  },
  'toggle-group': {
    component: lazy(() => import('@/registry/default/demos/toggle-group-demo')),
    sourceFile: 'registry/default/demos/toggle-group-demo.tsx',
    examples: [
      {
        title: 'Outline',
        component: lazy(
          () => import('@/registry/default/examples/toggle-group-outline')
        ),
        sourceFile: 'registry/default/examples/toggle-group-outline.tsx',
      },
      {
        title: 'Single',
        component: lazy(
          () => import('@/registry/default/examples/toggle-group-single')
        ),
        sourceFile: 'registry/default/examples/toggle-group-single.tsx',
      },
      {
        title: 'Small',
        component: lazy(
          () => import('@/registry/default/examples/toggle-group-sm')
        ),
        sourceFile: 'registry/default/examples/toggle-group-sm.tsx',
      },
      {
        title: 'Large',
        component: lazy(
          () => import('@/registry/default/examples/toggle-group-lg')
        ),
        sourceFile: 'registry/default/examples/toggle-group-lg.tsx',
      },
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/toggle-group-disabled')
        ),
        sourceFile: 'registry/default/examples/toggle-group-disabled.tsx',
      },
    ],
  },
  tooltip: {
    component: lazy(() => import('@/registry/default/demos/tooltip-demo')),
    sourceFile: 'registry/default/demos/tooltip-demo.tsx',
  },
  typography: {
    component: lazy(() => import('@/registry/default/demos/typography-demo')),
    sourceFile: 'registry/default/demos/typography-demo.tsx',
    examples: [
      {
        title: 'h1',
        component: lazy(
          () => import('@/registry/default/examples/typography-h1')
        ),
        sourceFile: 'registry/default/examples/typography-h1.tsx',
      },
      {
        title: 'h2',
        component: lazy(
          () => import('@/registry/default/examples/typography-h2')
        ),
        sourceFile: 'registry/default/examples/typography-h2.tsx',
      },
      {
        title: 'h3',
        component: lazy(
          () => import('@/registry/default/examples/typography-h3')
        ),
        sourceFile: 'registry/default/examples/typography-h3.tsx',
      },
      {
        title: 'h4',
        component: lazy(
          () => import('@/registry/default/examples/typography-h4')
        ),
        sourceFile: 'registry/default/examples/typography-h4.tsx',
      },
      {
        title: 'Paragraph',
        component: lazy(
          () => import('@/registry/default/examples/typography-p')
        ),
        sourceFile: 'registry/default/examples/typography-p.tsx',
      },
      {
        title: 'Blockquote',
        component: lazy(
          () => import('@/registry/default/examples/typography-blockquote')
        ),
        sourceFile: 'registry/default/examples/typography-blockquote.tsx',
      },
      {
        title: 'List',
        component: lazy(
          () => import('@/registry/default/examples/typography-list')
        ),
        sourceFile: 'registry/default/examples/typography-list.tsx',
      },
      {
        title: 'Inline Code',
        component: lazy(
          () => import('@/registry/default/examples/typography-inline-code')
        ),
        sourceFile: 'registry/default/examples/typography-inline-code.tsx',
      },
      {
        title: 'Lead',
        component: lazy(
          () => import('@/registry/default/examples/typography-lead')
        ),
        sourceFile: 'registry/default/examples/typography-lead.tsx',
      },
      {
        title: 'Large',
        component: lazy(
          () => import('@/registry/default/examples/typography-large')
        ),
        sourceFile: 'registry/default/examples/typography-large.tsx',
      },
      {
        title: 'Small',
        component: lazy(
          () => import('@/registry/default/examples/typography-small')
        ),
        sourceFile: 'registry/default/examples/typography-small.tsx',
      },
      {
        title: 'Muted',
        component: lazy(
          () => import('@/registry/default/examples/typography-muted')
        ),
        sourceFile: 'registry/default/examples/typography-muted.tsx',
      },
    ],
  },
  'form-patterns': {
    component: lazy(
      () => import('@/registry/default/demos/form-patterns-demo')
    ),
    sourceFile: 'registry/default/demos/form-patterns-demo.tsx',
    examples: [
      {
        title: 'Page Layout',
        component: lazy(
          () => import('@/registry/default/examples/form-patterns-page-layout')
        ),
        sourceFile: 'registry/default/examples/form-patterns-page-layout.tsx',
      },
      {
        title: 'With Validation',
        component: lazy(
          () =>
            import('@/registry/default/examples/form-patterns-with-validation')
        ),
        sourceFile:
          'registry/default/examples/form-patterns-with-validation.tsx',
      },
    ],
  },
  'data-table': {
    component: lazy(() => import('@/registry/default/demos/data-table-demo')),
    sourceFile: 'registry/default/demos/data-table-demo.tsx',
    examples: [
      {
        title: 'Skeleton',
        component: lazy(
          () => import('@/registry/default/examples/data-table-skeleton')
        ),
        sourceFile: 'registry/default/examples/data-table-skeleton.tsx',
      },
    ],
  },
  'page-container': {
    component: lazy(
      () => import('@/registry/default/demos/page-container-demo')
    ),
    sourceFile: 'registry/default/demos/page-container-demo.tsx',
  },
  'page-header': {
    component: lazy(() => import('@/registry/default/demos/page-header-demo')),
    sourceFile: 'registry/default/demos/page-header-demo.tsx',
  },
  'page-section': {
    component: lazy(() => import('@/registry/default/demos/page-section-demo')),
    sourceFile: 'registry/default/demos/page-section-demo.tsx',
    examples: [
      {
        title: 'Horizontal Orientation',
        component: lazy(
          () => import('@/registry/default/examples/page-section-horizontal')
        ),
        sourceFile: 'registry/default/examples/page-section-horizontal.tsx',
      },
      {
        title: 'With Aside Actions',
        component: lazy(
          () => import('@/registry/default/examples/page-section-with-aside')
        ),
        sourceFile: 'registry/default/examples/page-section-with-aside.tsx',
      },
    ],
  },
  'formance-logo': {
    component: lazy(
      () => import('@/registry/default/demos/formance-logo-demo')
    ),
    sourceFile: 'registry/default/demos/formance-logo-demo.tsx',
  },
  empty: {
    component: lazy(() => import('@/registry/default/demos/empty-demo')),
    sourceFile: 'registry/default/demos/empty-demo.tsx',
  },
  'badge-eyebrow': {
    component: lazy(
      () => import('@/registry/default/demos/badge-eyebrow-demo')
    ),
    sourceFile: 'registry/default/demos/badge-eyebrow-demo.tsx',
  },
  'badge-status': {
    component: lazy(() => import('@/registry/default/demos/badge-status-demo')),
    sourceFile: 'registry/default/demos/badge-status-demo.tsx',
  },
  'button-group': {
    component: lazy(() => import('@/registry/default/demos/button-group-demo')),
    sourceFile: 'registry/default/demos/button-group-demo.tsx',
  },
  kbd: {
    component: lazy(() => import('@/registry/default/demos/kbd-demo')),
    sourceFile: 'registry/default/demos/kbd-demo.tsx',
  },
  'description-list': {
    component: lazy(
      () => import('@/registry/default/demos/description-list-demo')
    ),
    sourceFile: 'registry/default/demos/description-list-demo.tsx',
  },
  combobox: {
    component: lazy(() => import('@/registry/default/demos/combobox-demo')),
    sourceFile: 'registry/default/demos/combobox-demo.tsx',
  },
  'input-password': {
    component: lazy(
      () => import('@/registry/default/demos/input-password-demo')
    ),
    sourceFile: 'registry/default/demos/input-password-demo.tsx',
  },
  loader: {
    component: lazy(() => import('@/registry/default/demos/loader-demo')),
    sourceFile: 'registry/default/demos/loader-demo.tsx',
  },
  'mode-toggle': {
    component: lazy(() => import('@/registry/default/demos/mode-toggle-demo')),
    sourceFile: 'registry/default/demos/mode-toggle-demo.tsx',
  },
  'nav-tabs': {
    component: lazy(() => import('@/registry/default/demos/nav-tabs-demo')),
    sourceFile: 'registry/default/demos/nav-tabs-demo.tsx',
  },
  field: {
    component: lazy(() => import('@/registry/default/demos/field-demo')),
    sourceFile: 'registry/default/demos/field-demo.tsx',
  },
  'input-group': {
    component: lazy(() => import('@/registry/default/demos/input-group-demo')),
    sourceFile: 'registry/default/demos/input-group-demo.tsx',
  },
  item: {
    component: lazy(() => import('@/registry/default/demos/item-demo')),
    sourceFile: 'registry/default/demos/item-demo.tsx',
  },
  'multi-select': {
    component: lazy(() => import('@/registry/default/demos/multi-select-demo')),
    sourceFile: 'registry/default/demos/multi-select-demo.tsx',
    examples: [
      {
        title: 'Controlled',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-controlled')
        ),
        sourceFile: 'registry/default/examples/multi-select-controlled.tsx',
      },
      {
        title: 'With Search',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-search')
        ),
        sourceFile: 'registry/default/examples/multi-select-search.tsx',
      },
      {
        title: 'No Search',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-no-search')
        ),
        sourceFile: 'registry/default/examples/multi-select-no-search.tsx',
      },
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-disabled')
        ),
        sourceFile: 'registry/default/examples/multi-select-disabled.tsx',
      },
      {
        title: 'Creatable',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-creatable')
        ),
        sourceFile: 'registry/default/examples/multi-select-creatable.tsx',
      },
      {
        title: 'Overflow Wrap',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-overflow-wrap')
        ),
        sourceFile: 'registry/default/examples/multi-select-overflow-wrap.tsx',
      },
      {
        title: 'Overflow Cutoff',
        component: lazy(
          () =>
            import('@/registry/default/examples/multi-select-overflow-cutoff')
        ),
        sourceFile:
          'registry/default/examples/multi-select-overflow-cutoff.tsx',
      },
      {
        title: 'Badge Label',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-badge-label')
        ),
        sourceFile: 'registry/default/examples/multi-select-badge-label.tsx',
      },
      {
        title: 'Groups',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-groups')
        ),
        sourceFile: 'registry/default/examples/multi-select-groups.tsx',
      },
      {
        title: 'Inline',
        component: lazy(
          () => import('@/registry/default/examples/multi-select-inline')
        ),
        sourceFile: 'registry/default/examples/multi-select-inline.tsx',
      },
      {
        title: 'Inline Creatable',
        component: lazy(
          () =>
            import('@/registry/default/examples/multi-select-inline-creatable')
        ),
        sourceFile:
          'registry/default/examples/multi-select-inline-creatable.tsx',
      },
    ],
  },
  sidebar: {
    component: lazy(() => import('@/registry/default/demos/sidebar-demo')),
    sourceFile: 'registry/default/demos/sidebar-demo.tsx',
  },
  stepper: {
    component: lazy(() => import('@/registry/default/demos/stepper-demo')),
    sourceFile: 'registry/default/demos/stepper-demo.tsx',
  },
  sortable: {
    component: lazy(() => import('@/registry/default/demos/sortable-demo')),
    sourceFile: 'registry/default/demos/sortable-demo.tsx',
    examples: [
      {
        title: 'Horizontal',
        component: lazy(
          () => import('@/registry/default/examples/sortable-horizontal')
        ),
        sourceFile: 'registry/default/examples/sortable-horizontal.tsx',
      },
    ],
  },
  'key-value-input': {
    component: lazy(
      () => import('@/registry/default/demos/key-value-input-demo')
    ),
    sourceFile: 'registry/default/demos/key-value-input-demo.tsx',
    examples: [
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/key-value-input-disabled')
        ),
        sourceFile: 'registry/default/examples/key-value-input-disabled.tsx',
      },
      {
        title: 'Metadata',
        component: lazy(
          () => import('@/registry/default/examples/key-value-input-metadata')
        ),
        sourceFile: 'registry/default/examples/key-value-input-metadata.tsx',
      },
    ],
  },
  'code-snippet': {
    component: lazy(
      () => import('@/registry/default/demos/code-snippet-demo')
    ),
    sourceFile: 'registry/default/demos/code-snippet-demo.tsx',
    examples: [
      {
        title: 'Numscript',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-numscript')
        ),
        sourceFile: 'registry/default/examples/code-snippet-numscript.tsx',
      },
      {
        title: 'Dark Theme',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-dark')
        ),
        sourceFile: 'registry/default/examples/code-snippet-dark.tsx',
      },
    ],
  },
  'code-preview-edit': {
    component: lazy(
      () => import('@/registry/default/demos/code-preview-edit-demo')
    ),
    sourceFile: 'registry/default/demos/code-preview-edit-demo.tsx',
  },
  'code-editor': {
    component: lazy(
      () => import('@/registry/default/demos/code-editor-demo')
    ),
    sourceFile: 'registry/default/demos/code-editor-demo.tsx',
    examples: [
      {
        title: 'Numscript',
        component: lazy(
          () => import('@/registry/default/examples/code-editor-numscript')
        ),
        sourceFile: 'registry/default/examples/code-editor-numscript.tsx',
      },
      {
        title: 'Readonly',
        component: lazy(
          () => import('@/registry/default/examples/code-editor-readonly')
        ),
        sourceFile: 'registry/default/examples/code-editor-readonly.tsx',
      },
    ],
  },
};
