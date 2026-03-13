type TSidebarItem = {
  title: string;
  href: string;
  label?: string;
  priority?: boolean;
};

type TSidebarSection = {
  title: string;
  sortOrder?: 'manual' | 'alphabetical';
  items: TSidebarItem[];
};

export type TDocsConfig = {
  sidebarNav: TSidebarSection[];
};

export type TComponentMeta = {
  registryName: string;
  description: string;
  sourceFile: string;
};

export const componentMeta: Record<string, TComponentMeta> = {
  'components/accordion': {
    registryName: 'accordion',
    description: 'A vertically stacked set of interactive headings that reveal content.',
    sourceFile: 'registry/default/ui/accordion.tsx',
  },
  'components/alert': {
    registryName: 'alert',
    description: 'Displays a callout for important messages.',
    sourceFile: 'registry/default/ui/alert.tsx',
  },
  'components/alert-dialog': {
    registryName: 'alert-dialog',
    description: 'A modal dialog that interrupts the user for a critical action.',
    sourceFile: 'registry/default/ui/alert-dialog.tsx',
  },
  'components/aspect-ratio': {
    registryName: 'aspect-ratio',
    description: 'Displays content within a desired ratio.',
    sourceFile: 'registry/default/ui/aspect-ratio.tsx',
  },
  'components/avatar': {
    registryName: 'avatar',
    description: 'An image element with a fallback for user profiles.',
    sourceFile: 'registry/default/ui/avatar.tsx',
  },
  'components/badge': {
    registryName: 'badge',
    description: 'Status badges with semantic color variants.',
    sourceFile: 'registry/default/ui/badge.tsx',
  },
  'components/breadcrumb': {
    registryName: 'breadcrumb',
    description: 'Navigation breadcrumb showing the current page hierarchy.',
    sourceFile: 'registry/default/ui/breadcrumb.tsx',
  },
  'components/button': {
    registryName: 'button',
    description: 'Brand-aware button with color and size variants.',
    sourceFile: 'registry/default/ui/button.tsx',
  },
  'components/calendar': {
    registryName: 'calendar',
    description: 'A date picker calendar component.',
    sourceFile: 'registry/default/ui/calendar.tsx',
  },
  'components/carousel': {
    registryName: 'carousel',
    description: 'A carousel for cycling through content.',
    sourceFile: 'registry/default/ui/carousel.tsx',
  },
  'components/card': {
    registryName: 'card',
    description: 'Container component for grouping content with header, body, and footer.',
    sourceFile: 'registry/default/ui/card.tsx',
  },
  'components/chart': {
    registryName: 'chart',
    description: 'Chart components built on Recharts.',
    sourceFile: 'registry/default/ui/chart.tsx',
  },
  'components/checkbox': {
    registryName: 'checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    sourceFile: 'registry/default/ui/checkbox.tsx',
  },
  'components/collapsible': {
    registryName: 'collapsible',
    description: 'An interactive component that expands and collapses content.',
    sourceFile: 'registry/default/ui/collapsible.tsx',
  },
  'components/command': {
    registryName: 'command',
    description: 'A command palette for quick actions and search.',
    sourceFile: 'registry/default/ui/command.tsx',
  },
  'components/context-menu': {
    registryName: 'context-menu',
    description: 'A menu triggered by right-clicking.',
    sourceFile: 'registry/default/ui/context-menu.tsx',
  },
  'components/dialog': {
    registryName: 'dialog',
    description: 'A modal dialog that interrupts the user with important content.',
    sourceFile: 'registry/default/ui/dialog.tsx',
  },
  'components/drawer': {
    registryName: 'drawer',
    description: 'A drawer component that slides in from the edge of the screen.',
    sourceFile: 'registry/default/ui/drawer.tsx',
  },
  'components/dropdown-menu': {
    registryName: 'dropdown-menu',
    description: 'A menu displayed on trigger click.',
    sourceFile: 'registry/default/ui/dropdown-menu.tsx',
  },
  'components/form': {
    registryName: 'form',
    description: 'React Hook Form integration with validation and error handling.',
    sourceFile: 'registry/default/ui/form.tsx',
  },
  'components/hover-card': {
    registryName: 'hover-card',
    description: 'A card displayed on hover for previewing content.',
    sourceFile: 'registry/default/ui/hover-card.tsx',
  },
  'components/input': {
    registryName: 'input',
    description: 'Text input with size variants.',
    sourceFile: 'registry/default/ui/input.tsx',
  },
  'components/input-otp': {
    registryName: 'input-otp',
    description: 'One-time password input with individual slots.',
    sourceFile: 'registry/default/ui/input-otp.tsx',
  },
  'components/label': {
    registryName: 'label',
    description: 'Renders an accessible label associated with controls.',
    sourceFile: 'registry/default/ui/label.tsx',
  },
  'components/menubar': {
    registryName: 'menubar',
    description: 'A horizontal menu bar component.',
    sourceFile: 'registry/default/ui/menubar.tsx',
  },
  'components/navigation-menu': {
    registryName: 'navigation-menu',
    description: 'A navigation menu with dropdown content.',
    sourceFile: 'registry/default/ui/navigation-menu.tsx',
  },
  'components/pagination': {
    registryName: 'pagination',
    description: 'Pagination controls for navigating pages.',
    sourceFile: 'registry/default/ui/pagination.tsx',
  },
  'components/popover': {
    registryName: 'popover',
    description: 'Displays rich content in a portal, triggered by a button.',
    sourceFile: 'registry/default/ui/popover.tsx',
  },
  'components/progress': {
    registryName: 'progress',
    description: 'A progress bar indicator.',
    sourceFile: 'registry/default/ui/progress.tsx',
  },
  'components/radio-group': {
    registryName: 'radio-group',
    description: 'A set of checkable buttons where only one can be checked at a time.',
    sourceFile: 'registry/default/ui/radio-group.tsx',
  },
  'components/resizable': {
    registryName: 'resizable',
    description: 'Resizable panel groups with drag handles.',
    sourceFile: 'registry/default/ui/resizable.tsx',
  },
  'components/scroll-area': {
    registryName: 'scroll-area',
    description: 'Custom scrollbar component built on Radix UI.',
    sourceFile: 'registry/default/ui/scroll-area.tsx',
  },
  'components/select': {
    registryName: 'select',
    description: 'Dropdown select built on Radix UI with keyboard navigation.',
    sourceFile: 'registry/default/ui/select.tsx',
  },
  'components/separator': {
    registryName: 'separator',
    description: 'Visually separates content.',
    sourceFile: 'registry/default/ui/separator.tsx',
  },
  'components/sheet': {
    registryName: 'sheet',
    description: 'A panel that slides out from the edge of the screen.',
    sourceFile: 'registry/default/ui/sheet.tsx',
  },
  'components/skeleton': {
    registryName: 'skeleton',
    description: 'A placeholder loading state for content.',
    sourceFile: 'registry/default/ui/skeleton.tsx',
  },
  'components/slider': {
    registryName: 'slider',
    description: 'A range slider input.',
    sourceFile: 'registry/default/ui/slider.tsx',
  },
  'components/spinner': {
    registryName: 'spinner',
    description: 'A loading spinner indicator.',
    sourceFile: 'registry/default/ui/spinner.tsx',
  },
  'components/sonner': {
    registryName: 'sonner',
    description: 'Toast notification component.',
    sourceFile: 'registry/default/ui/sonner.tsx',
  },
  'components/switch': {
    registryName: 'switch',
    description: 'A control that toggles between on and off.',
    sourceFile: 'registry/default/ui/switch.tsx',
  },
  'components/table': {
    registryName: 'table',
    description: 'A table component for displaying data.',
    sourceFile: 'registry/default/ui/table.tsx',
  },
  'components/tabs': {
    registryName: 'tabs',
    description: 'Tabbed navigation built on Radix UI.',
    sourceFile: 'registry/default/ui/tabs.tsx',
  },
  'components/textarea': {
    registryName: 'textarea',
    description: 'A multi-line text input.',
    sourceFile: 'registry/default/ui/textarea.tsx',
  },
  'components/toggle': {
    registryName: 'toggle',
    description: 'A two-state button that can be toggled on or off.',
    sourceFile: 'registry/default/ui/toggle.tsx',
  },
  'components/toggle-group': {
    registryName: 'toggle-group',
    description: 'A group of toggle buttons.',
    sourceFile: 'registry/default/ui/toggle-group.tsx',
  },
  'components/tooltip': {
    registryName: 'tooltip',
    description: 'A popup that displays information on hover or focus.',
    sourceFile: 'registry/default/ui/tooltip.tsx',
  },
  'components/typography': {
    registryName: 'typography',
    description: 'Typography components for consistent text styling.',
    sourceFile: 'registry/default/ui/typography.tsx',
  },
  'brand/formance-logo': {
    registryName: 'formance-logo',
    description: 'The Formance logo and icon components.',
    sourceFile: 'registry/default/ui/formance-logo.tsx',
  },
  'fragments/table-of-contents': {
    registryName: 'table-of-contents',
    description: 'A sticky sidebar navigation that tracks the active section on the page.',
    sourceFile: 'registry/default/ui/table-of-contents.tsx',
  },
};

export const docsConfig: TDocsConfig = {
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        { title: 'Introduction', href: '/', priority: true },
        { title: 'Installation', href: '/docs/installation' },
        { title: 'Colors', href: '/docs/colors' },
        { title: 'Typography', href: '/docs/typography' },
        { title: 'Theming', href: '/docs/theming' },
      ],
    },
    {
      title: 'Atoms',
      sortOrder: 'alphabetical',
      items: [
        { title: 'Accordion', href: '/docs/components/accordion' },
        { title: 'Alert', href: '/docs/components/alert' },
        { title: 'Alert Dialog', href: '/docs/components/alert-dialog' },
        { title: 'Aspect Ratio', href: '/docs/components/aspect-ratio' },
        { title: 'Avatar', href: '/docs/components/avatar' },
        { title: 'Badge', href: '/docs/components/badge' },
        { title: 'Breadcrumb', href: '/docs/components/breadcrumb' },
        { title: 'Button', href: '/docs/components/button' },
        { title: 'Calendar', href: '/docs/components/calendar' },
        { title: 'Card', href: '/docs/components/card' },
        { title: 'Carousel', href: '/docs/components/carousel' },
        { title: 'Chart', href: '/docs/components/chart' },
        { title: 'Checkbox', href: '/docs/components/checkbox' },
        { title: 'Collapsible', href: '/docs/components/collapsible' },
        { title: 'Command', href: '/docs/components/command' },
        { title: 'Context Menu', href: '/docs/components/context-menu' },
        { title: 'Dialog', href: '/docs/components/dialog' },
        { title: 'Drawer', href: '/docs/components/drawer' },
        { title: 'Dropdown Menu', href: '/docs/components/dropdown-menu' },
        { title: 'Form', href: '/docs/components/form' },
        { title: 'Hover Card', href: '/docs/components/hover-card' },
        { title: 'Input', href: '/docs/components/input' },
        { title: 'Input OTP', href: '/docs/components/input-otp' },
        { title: 'Label', href: '/docs/components/label' },
        { title: 'Menubar', href: '/docs/components/menubar' },
        { title: 'Navigation Menu', href: '/docs/components/navigation-menu' },
        { title: 'Pagination', href: '/docs/components/pagination' },
        { title: 'Popover', href: '/docs/components/popover' },
        { title: 'Progress', href: '/docs/components/progress' },
        { title: 'Radio Group', href: '/docs/components/radio-group' },
        { title: 'Resizable', href: '/docs/components/resizable' },
        { title: 'Scroll Area', href: '/docs/components/scroll-area' },
        { title: 'Select', href: '/docs/components/select' },
        { title: 'Separator', href: '/docs/components/separator' },
        { title: 'Sheet', href: '/docs/components/sheet' },
        { title: 'Skeleton', href: '/docs/components/skeleton' },
        { title: 'Slider', href: '/docs/components/slider' },
        { title: 'Spinner', href: '/docs/components/spinner' },
        { title: 'Sonner', href: '/docs/components/sonner' },
        { title: 'Switch', href: '/docs/components/switch' },
        { title: 'Table', href: '/docs/components/table' },
        { title: 'Tabs', href: '/docs/components/tabs' },
        { title: 'Textarea', href: '/docs/components/textarea' },
        { title: 'Toggle', href: '/docs/components/toggle' },
        { title: 'Toggle Group', href: '/docs/components/toggle-group' },
        { title: 'Tooltip', href: '/docs/components/tooltip' },
        { title: 'Typography', href: '/docs/components/typography' },
      ],
    },
    {
      title: 'Fragments',
      sortOrder: 'alphabetical',
      items: [
        { title: 'Table of Contents', href: '/docs/fragments/table-of-contents' },
      ],
    },
    {
      title: 'Brand',
      items: [
        { title: 'Formance Logo', href: '/docs/brand/formance-logo' },
      ],
    },
  ],
};

type TFlatNavItem = {
  title: string;
  href: string;
  section: string;
};

export function flattenNav(): TFlatNavItem[] {
  const items: TFlatNavItem[] = [];

  for (const section of docsConfig.sidebarNav) {
    const sectionItems =
      section.sortOrder === 'alphabetical'
        ? [...section.items].sort((a, b) =>
            a.priority && !b.priority
              ? -1
              : !a.priority && b.priority
                ? 1
                : a.title.localeCompare(b.title)
          )
        : section.items;

    for (const item of sectionItems) {
      items.push({ title: item.title, href: item.href, section: section.title });
    }
  }

  return items;
}
