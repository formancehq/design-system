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
  },
  breadcrumb: {
    component: lazy(() => import('@/registry/default/demos/breadcrumb-demo')),
    sourceFile: 'registry/default/demos/breadcrumb-demo.tsx',
  },
  button: {
    component: lazy(() => import('@/registry/default/demos/button-demo')),
    sourceFile: 'registry/default/demos/button-demo.tsx',
  },
  calendar: {
    component: lazy(() => import('@/registry/default/demos/calendar-demo')),
    sourceFile: 'registry/default/demos/calendar-demo.tsx',
    examples: [
      {
        title: 'Date Range',
        component: lazy(() => import('@/registry/default/examples/calendar-range')),
        sourceFile: 'registry/default/examples/calendar-range.tsx',
      },
      {
        title: 'Month & Year Dropdown',
        component: lazy(() => import('@/registry/default/examples/calendar-dropdown')),
        sourceFile: 'registry/default/examples/calendar-dropdown.tsx',
      },
      {
        title: 'With Presets',
        component: lazy(() => import('@/registry/default/examples/calendar-presets')),
        sourceFile: 'registry/default/examples/calendar-presets.tsx',
      },
      {
        title: 'Week Numbers',
        component: lazy(() => import('@/registry/default/examples/calendar-week-numbers')),
        sourceFile: 'registry/default/examples/calendar-week-numbers.tsx',
      },
      {
        title: 'Disabled Dates',
        component: lazy(() => import('@/registry/default/examples/calendar-disabled-dates')),
        sourceFile: 'registry/default/examples/calendar-disabled-dates.tsx',
      },
      {
        title: 'Disabled Date Range (Function)',
        component: lazy(() => import('@/registry/default/examples/calendar-disabled-function')),
        sourceFile: 'registry/default/examples/calendar-disabled-function.tsx',
      },
      {
        title: 'Default Month',
        component: lazy(() => import('@/registry/default/examples/calendar-default-month')),
        sourceFile: 'registry/default/examples/calendar-default-month.tsx',
      },
      {
        title: 'Responsive',
        component: lazy(() => import('@/registry/default/examples/calendar-responsive')),
        sourceFile: 'registry/default/examples/calendar-responsive.tsx',
      },
      {
        title: 'Date Picker',
        component: lazy(() => import('@/registry/default/examples/calendar-date-picker')),
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
  },
  collapsible: {
    component: lazy(() => import('@/registry/default/demos/collapsible-demo')),
    sourceFile: 'registry/default/demos/collapsible-demo.tsx',
  },
  command: {
    component: lazy(() => import('@/registry/default/demos/command-demo')),
    sourceFile: 'registry/default/demos/command-demo.tsx',
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
    component: lazy(() => import('@/registry/default/demos/dropdown-menu-demo')),
    sourceFile: 'registry/default/demos/dropdown-menu-demo.tsx',
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
  },
  'input-otp': {
    component: lazy(() => import('@/registry/default/demos/input-otp-demo')),
    sourceFile: 'registry/default/demos/input-otp-demo.tsx',
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
    component: lazy(() => import('@/registry/default/demos/navigation-menu-demo')),
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
  resizable: {
    component: lazy(() => import('@/registry/default/demos/resizable-demo')),
    sourceFile: 'registry/default/demos/resizable-demo.tsx',
  },
  'scroll-area': {
    component: lazy(() => import('@/registry/default/demos/scroll-area-demo')),
    sourceFile: 'registry/default/demos/scroll-area-demo.tsx',
  },
  select: {
    component: lazy(() => import('@/registry/default/demos/select-demo')),
    sourceFile: 'registry/default/demos/select-demo.tsx',
  },
  separator: {
    component: lazy(() => import('@/registry/default/demos/separator-demo')),
    sourceFile: 'registry/default/demos/separator-demo.tsx',
  },
  sheet: {
    component: lazy(() => import('@/registry/default/demos/sheet-demo')),
    sourceFile: 'registry/default/demos/sheet-demo.tsx',
  },
  skeleton: {
    component: lazy(() => import('@/registry/default/demos/skeleton-demo')),
    sourceFile: 'registry/default/demos/skeleton-demo.tsx',
  },
  slider: {
    component: lazy(() => import('@/registry/default/demos/slider-demo')),
    sourceFile: 'registry/default/demos/slider-demo.tsx',
  },
  spinner: {
    component: lazy(() => import('@/registry/default/demos/spinner-demo')),
    sourceFile: 'registry/default/demos/spinner-demo.tsx',
  },
  sonner: {
    component: lazy(() => import('@/registry/default/demos/sonner-demo')),
    sourceFile: 'registry/default/demos/sonner-demo.tsx',
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
  },
  toggle: {
    component: lazy(() => import('@/registry/default/demos/toggle-demo')),
    sourceFile: 'registry/default/demos/toggle-demo.tsx',
  },
  'toggle-group': {
    component: lazy(() => import('@/registry/default/demos/toggle-group-demo')),
    sourceFile: 'registry/default/demos/toggle-group-demo.tsx',
  },
  tooltip: {
    component: lazy(() => import('@/registry/default/demos/tooltip-demo')),
    sourceFile: 'registry/default/demos/tooltip-demo.tsx',
  },
  typography: {
    component: lazy(() => import('@/registry/default/demos/typography-demo')),
    sourceFile: 'registry/default/demos/typography-demo.tsx',
  },
  'table-of-contents': {
    component: lazy(() => import('@/registry/default/demos/table-of-contents-demo')),
    sourceFile: 'registry/default/demos/table-of-contents-demo.tsx',
  },
  'formance-logo': {
    component: lazy(() => import('@/registry/default/demos/formance-logo-demo')),
    sourceFile: 'registry/default/demos/formance-logo-demo.tsx',
  },
};
