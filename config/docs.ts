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

export type TSource = 'shadcn' | 'custom';

export type TSubComponent = {
  name: string;
  description: string;
};

export type TComponentMeta = {
  registryName: string;
  description: string;
  sourceFile: string;
  source: TSource;
  hidePreview?: boolean;
  subComponents?: TSubComponent[];
};

export const componentMeta: Record<string, TComponentMeta> = {
  'components/accordion': {
    registryName: 'accordion',
    description: 'A vertically stacked set of interactive headings that reveal content.',
    sourceFile: 'registry/default/ui/accordion.tsx',
    source: 'shadcn',
  },
  'components/alert': {
    registryName: 'alert',
    description: 'Displays a callout for important messages.',
    sourceFile: 'registry/default/ui/alert.tsx',
    source: 'shadcn',
  },
  'components/alert-dialog': {
    registryName: 'alert-dialog',
    description: 'A modal dialog that interrupts the user for a critical action.',
    sourceFile: 'registry/default/ui/alert-dialog.tsx',
    source: 'shadcn',
  },
  'components/aspect-ratio': {
    registryName: 'aspect-ratio',
    description: 'Displays content within a desired ratio.',
    sourceFile: 'registry/default/ui/aspect-ratio.tsx',
    source: 'shadcn',
  },
  'components/avatar': {
    registryName: 'avatar',
    description: 'An image element with a fallback for user profiles.',
    sourceFile: 'registry/default/ui/avatar.tsx',
    source: 'shadcn',
  },
  'components/badge': {
    registryName: 'badge',
    description: 'Status badges with semantic color variants.',
    sourceFile: 'registry/default/ui/badge.tsx',
    source: 'shadcn',
  },
  'components/breadcrumb': {
    registryName: 'breadcrumb',
    description: 'Navigation breadcrumb showing the current page hierarchy.',
    sourceFile: 'registry/default/ui/breadcrumb.tsx',
    source: 'shadcn',
  },
  'components/button': {
    registryName: 'button',
    description: 'Brand-aware button with color and size variants.',
    sourceFile: 'registry/default/ui/button.tsx',
    source: 'shadcn',
  },
  'components/calendar': {
    registryName: 'calendar',
    description: 'A date picker calendar component.',
    sourceFile: 'registry/default/ui/calendar.tsx',
    source: 'shadcn',
  },
  'components/carousel': {
    registryName: 'carousel',
    description: 'A carousel for cycling through content.',
    sourceFile: 'registry/default/ui/carousel.tsx',
    source: 'shadcn',
  },
  'components/card': {
    registryName: 'card',
    description: 'Container component for grouping content with header, body, and footer.',
    sourceFile: 'registry/default/ui/card.tsx',
    source: 'shadcn',
  },
  'components/chart': {
    registryName: 'chart',
    description: 'Chart components built on Recharts.',
    sourceFile: 'registry/default/ui/chart.tsx',
    source: 'shadcn',
  },
  'components/checkbox': {
    registryName: 'checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    sourceFile: 'registry/default/ui/checkbox.tsx',
    source: 'shadcn',
  },
  'components/collapsible': {
    registryName: 'collapsible',
    description: 'An interactive component that expands and collapses content.',
    sourceFile: 'registry/default/ui/collapsible.tsx',
    source: 'shadcn',
  },
  'components/command': {
    registryName: 'command',
    description: 'A command palette for quick actions and search.',
    sourceFile: 'registry/default/ui/command.tsx',
    source: 'shadcn',
  },
  'components/context-menu': {
    registryName: 'context-menu',
    description: 'A menu triggered by right-clicking.',
    sourceFile: 'registry/default/ui/context-menu.tsx',
    source: 'shadcn',
  },
  'components/dialog': {
    registryName: 'dialog',
    description: 'A modal dialog that interrupts the user with important content.',
    sourceFile: 'registry/default/ui/dialog.tsx',
    source: 'shadcn',
  },
  'components/drawer': {
    registryName: 'drawer',
    description: 'A drawer component that slides in from the edge of the screen.',
    sourceFile: 'registry/default/ui/drawer.tsx',
    source: 'shadcn',
  },
  'components/dropdown-menu': {
    registryName: 'dropdown-menu',
    description: 'A menu displayed on trigger click.',
    sourceFile: 'registry/default/ui/dropdown-menu.tsx',
    source: 'shadcn',
  },
  'components/form': {
    registryName: 'form',
    description: 'React Hook Form integration with validation and error handling.',
    sourceFile: 'registry/default/ui/form.tsx',
    source: 'shadcn',
  },
  'components/hover-card': {
    registryName: 'hover-card',
    description: 'A card displayed on hover for previewing content.',
    sourceFile: 'registry/default/ui/hover-card.tsx',
    source: 'shadcn',
  },
  'components/input': {
    registryName: 'input',
    description: 'Text input with size variants.',
    sourceFile: 'registry/default/ui/input.tsx',
    source: 'shadcn',
  },
  'components/input-otp': {
    registryName: 'input-otp',
    description: 'One-time password input with individual slots.',
    sourceFile: 'registry/default/ui/input-otp.tsx',
    source: 'shadcn',
  },
  'components/label': {
    registryName: 'label',
    description: 'Renders an accessible label associated with controls.',
    sourceFile: 'registry/default/ui/label.tsx',
    source: 'shadcn',
  },
  'components/menubar': {
    registryName: 'menubar',
    description: 'A horizontal menu bar component.',
    sourceFile: 'registry/default/ui/menubar.tsx',
    source: 'shadcn',
  },
  'components/navigation-menu': {
    registryName: 'navigation-menu',
    description: 'A navigation menu with dropdown content.',
    sourceFile: 'registry/default/ui/navigation-menu.tsx',
    source: 'shadcn',
  },
  'components/pagination': {
    registryName: 'pagination',
    description: 'Pagination controls for navigating pages.',
    sourceFile: 'registry/default/ui/pagination.tsx',
    source: 'shadcn',
  },
  'components/popover': {
    registryName: 'popover',
    description: 'Displays rich content in a portal, triggered by a button.',
    sourceFile: 'registry/default/ui/popover.tsx',
    source: 'shadcn',
  },
  'components/progress': {
    registryName: 'progress',
    description: 'A progress bar indicator.',
    sourceFile: 'registry/default/ui/progress.tsx',
    source: 'shadcn',
  },
  'components/radio-group': {
    registryName: 'radio-group',
    description: 'A set of checkable buttons where only one can be checked at a time.',
    sourceFile: 'registry/default/ui/radio-group.tsx',
    source: 'shadcn',
  },
  'components/resizable': {
    registryName: 'resizable',
    description: 'Resizable panel groups with drag handles.',
    sourceFile: 'registry/default/ui/resizable.tsx',
    source: 'shadcn',
  },
  'components/scroll-area': {
    registryName: 'scroll-area',
    description: 'Custom scrollbar component built on Radix UI.',
    sourceFile: 'registry/default/ui/scroll-area.tsx',
    source: 'shadcn',
  },
  'components/select': {
    registryName: 'select',
    description: 'Dropdown select built on Radix UI with keyboard navigation.',
    sourceFile: 'registry/default/ui/select.tsx',
    source: 'shadcn',
  },
  'components/separator': {
    registryName: 'separator',
    description: 'Visually separates content.',
    sourceFile: 'registry/default/ui/separator.tsx',
    source: 'shadcn',
  },
  'components/sheet': {
    registryName: 'sheet',
    description: 'A panel that slides out from the edge of the screen.',
    sourceFile: 'registry/default/ui/sheet.tsx',
    source: 'shadcn',
  },
  'components/skeleton': {
    registryName: 'skeleton',
    description: 'A placeholder loading state for content.',
    sourceFile: 'registry/default/ui/skeleton.tsx',
    source: 'shadcn',
  },
  'components/slider': {
    registryName: 'slider',
    description: 'A range slider input.',
    sourceFile: 'registry/default/ui/slider.tsx',
    source: 'shadcn',
  },
  'components/spinner': {
    registryName: 'spinner',
    description: 'A loading spinner indicator.',
    sourceFile: 'registry/default/ui/spinner.tsx',
    source: 'custom',
  },
  'components/sonner': {
    registryName: 'sonner',
    description: 'Toast notification component.',
    sourceFile: 'registry/default/ui/sonner.tsx',
    source: 'shadcn',
  },
  'components/switch': {
    registryName: 'switch',
    description: 'A control that toggles between on and off.',
    sourceFile: 'registry/default/ui/switch.tsx',
    source: 'shadcn',
  },
  'components/table': {
    registryName: 'table',
    description: 'A table component for displaying data.',
    sourceFile: 'registry/default/ui/table.tsx',
    source: 'shadcn',
  },
  'components/tabs': {
    registryName: 'tabs',
    description: 'Tabbed navigation built on Radix UI.',
    sourceFile: 'registry/default/ui/tabs.tsx',
    source: 'shadcn',
  },
  'components/textarea': {
    registryName: 'textarea',
    description: 'A multi-line text input.',
    sourceFile: 'registry/default/ui/textarea.tsx',
    source: 'shadcn',
  },
  'components/toggle': {
    registryName: 'toggle',
    description: 'A two-state button that can be toggled on or off.',
    sourceFile: 'registry/default/ui/toggle.tsx',
    source: 'shadcn',
  },
  'components/toggle-group': {
    registryName: 'toggle-group',
    description: 'A group of toggle buttons.',
    sourceFile: 'registry/default/ui/toggle-group.tsx',
    source: 'shadcn',
  },
  'components/tooltip': {
    registryName: 'tooltip',
    description: 'A popup that displays information on hover or focus.',
    sourceFile: 'registry/default/ui/tooltip.tsx',
    source: 'shadcn',
  },
  'components/typography': {
    registryName: 'typography',
    description: 'Typography components for consistent text styling.',
    sourceFile: 'registry/default/ui/typography.tsx',
    source: 'custom',
  },
  'brand/formance-logo': {
    registryName: 'formance-logo',
    description: 'The Formance logo and icon components.',
    sourceFile: 'registry/default/ui/formance-logo.tsx',
    source: 'custom',
  },
  'components/eyebrow': {
    registryName: 'eyebrow',
    description: 'A small label component with a colored square indicator.',
    sourceFile: 'registry/default/ui/eyebrow.tsx',
    source: 'custom',
    hidePreview: true,
  },
  'components/empty': {
    registryName: 'empty',
    description: 'Empty state placeholder with media, title, and description.',
    sourceFile: 'registry/default/ui/empty.tsx',
    source: 'custom',
  },
  'components/badge-eyebrow': {
    registryName: 'badge-eyebrow',
    description: 'A badge eyebrow with brand color variants.',
    sourceFile: 'registry/default/ui/badge-eyebrow.tsx',
    source: 'custom',
  },
  'components/badge-status': {
    registryName: 'badge-status',
    description: 'A status badge with animated ping indicator.',
    sourceFile: 'registry/default/ui/badge-status.tsx',
    source: 'custom',
  },
  'components/button-group': {
    registryName: 'button-group',
    description: 'A group of buttons with separator.',
    sourceFile: 'registry/default/ui/button-group.tsx',
    source: 'custom',
  },
  'components/kbd': {
    registryName: 'kbd',
    description: 'Keyboard shortcut display component.',
    sourceFile: 'registry/default/ui/kbd.tsx',
    source: 'custom',
  },
  'components/description-list': {
    registryName: 'description-list',
    description: 'A description list and row layout for key-value pairs.',
    sourceFile: 'registry/default/ui/description-list.tsx',
    source: 'custom',
  },
  'components/combobox': {
    registryName: 'combobox',
    description: 'A combobox with search built on Command and Popover.',
    sourceFile: 'registry/default/ui/combobox.tsx',
    source: 'custom',
  },
  'components/input-password': {
    registryName: 'input-password',
    description: 'A password input with visibility toggle.',
    sourceFile: 'registry/default/ui/input-password.tsx',
    source: 'custom',
  },
  'components/loader': {
    registryName: 'loader',
    description: 'Loading skeleton placeholders.',
    sourceFile: 'registry/default/ui/loader.tsx',
    source: 'custom',
  },
  'components/mode-toggle': {
    registryName: 'mode-toggle',
    description: 'A theme toggle button for dark and light mode.',
    sourceFile: 'registry/default/ui/mode-toggle.tsx',
    source: 'custom',
  },
  'components/nav-tabs': {
    registryName: 'nav-tabs',
    description: 'Navigation tabs with pending state.',
    sourceFile: 'registry/default/ui/nav-tabs.tsx',
    source: 'custom',
  },
  'components/field': {
    registryName: 'field',
    description: 'A full form field system with labels, descriptions, and errors.',
    sourceFile: 'registry/default/ui/field.tsx',
    source: 'custom',
  },
  'components/input-group': {
    registryName: 'input-group',
    description: 'Grouped input with addons, buttons, and text.',
    sourceFile: 'registry/default/ui/input-group.tsx',
    source: 'custom',
  },
  'components/item': {
    registryName: 'item',
    description: 'A list item system with media, content, and actions.',
    sourceFile: 'registry/default/ui/item.tsx',
    source: 'custom',
  },
  'components/multi-select': {
    registryName: 'multi-select',
    description: 'A multi-select component with badges and search.',
    sourceFile: 'registry/default/ui/multi-select.tsx',
    source: 'custom',
  },
  'components/sidebar': {
    registryName: 'sidebar',
    description: 'A collapsible sidebar with mobile support.',
    sourceFile: 'registry/default/ui/sidebar.tsx',
    source: 'shadcn',
  },
  'components/stepper': {
    registryName: 'stepper',
    description: 'A multi-step wizard component with validation.',
    sourceFile: 'registry/default/ui/stepper.tsx',
    source: 'custom',
  },
  'fragments/page-container': {
    registryName: 'page-container',
    description: 'Responsive container with size variants for consistent page widths.',
    sourceFile: 'registry/default/ui/page-container.tsx',
    source: 'custom',
  },
  'fragments/page-header': {
    registryName: 'page-header',
    description: 'Compound page header with icon, title, description, breadcrumbs, and actions.',
    sourceFile: 'registry/default/ui/page-header.tsx',
    source: 'custom',
    subComponents: [
      { name: 'PageHeader', description: 'Root container. Accepts size, background, and border variants.' },
      { name: 'PageHeaderMeta', description: 'Wraps icon, summary, and aside in a responsive row.' },
      { name: 'PageHeaderIcon', description: 'Slot for a custom icon or SVG.' },
      { name: 'PageHeaderSummary', description: 'Groups eyebrow, title, and description.' },
      { name: 'PageHeaderEyebrow', description: 'Small label above the title. Defaults to gold variant.' },
      { name: 'PageHeaderTitle', description: 'Primary heading (h1).' },
      { name: 'PageHeaderDescription', description: 'Supporting text below the title.' },
      { name: 'PageHeaderAside', description: 'Container for action buttons, aligned to the right.' },
      { name: 'PageHeaderBreadcrumb', description: 'Breadcrumb navigation wrapper.' },
    ],
  },
  'fragments/page-section': {
    registryName: 'page-section',
    description: 'A compound component for organizing page content into distinct sections.',
    sourceFile: 'registry/default/ui/page-section.tsx',
    source: 'custom',
    subComponents: [
      { name: 'PageSection', description: 'Root container with orientation variants (vertical or horizontal).' },
      { name: 'PageSectionMeta', description: 'Wraps summary and aside in a responsive row.' },
      { name: 'PageSectionSummary', description: 'Groups title and description.' },
      { name: 'PageSectionTitle', description: 'Section heading (h2).' },
      { name: 'PageSectionDescription', description: 'Supporting text below the title.' },
      { name: 'PageSectionAside', description: 'Container for section-level action buttons.' },
      { name: 'PageSectionContent', description: 'Container for the main section content.' },
    ],
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
        { title: 'Introduction', href: '/docs/components/introduction', priority: true },
        { title: 'Accordion', href: '/docs/components/accordion' },
        { title: 'Alert', href: '/docs/components/alert' },
        { title: 'Alert Dialog', href: '/docs/components/alert-dialog' },
        { title: 'Aspect Ratio', href: '/docs/components/aspect-ratio' },
        { title: 'Avatar', href: '/docs/components/avatar' },
        { title: 'Badge', href: '/docs/components/badge' },
        { title: 'Badge Eyebrow', href: '/docs/components/badge-eyebrow' },
        { title: 'Badge Status', href: '/docs/components/badge-status' },
        { title: 'Breadcrumb', href: '/docs/components/breadcrumb' },
        { title: 'Button', href: '/docs/components/button' },
        { title: 'Button Group', href: '/docs/components/button-group' },
        { title: 'Calendar', href: '/docs/components/calendar' },
        { title: 'Card', href: '/docs/components/card' },
        { title: 'Carousel', href: '/docs/components/carousel' },
        { title: 'Chart', href: '/docs/components/chart' },
        { title: 'Checkbox', href: '/docs/components/checkbox' },
        { title: 'Collapsible', href: '/docs/components/collapsible' },
        { title: 'Combobox', href: '/docs/components/combobox' },
        { title: 'Command', href: '/docs/components/command' },
        { title: 'Context Menu', href: '/docs/components/context-menu' },
        { title: 'Description List', href: '/docs/components/description-list' },
        { title: 'Dialog', href: '/docs/components/dialog' },
        { title: 'Drawer', href: '/docs/components/drawer' },
        { title: 'Dropdown Menu', href: '/docs/components/dropdown-menu' },
        { title: 'Empty', href: '/docs/components/empty' },
        { title: 'Eyebrow', href: '/docs/components/eyebrow' },
        { title: 'Field', href: '/docs/components/field' },
        { title: 'Form', href: '/docs/components/form' },
        { title: 'Hover Card', href: '/docs/components/hover-card' },
        { title: 'Input', href: '/docs/components/input' },
        { title: 'Input Group', href: '/docs/components/input-group' },
        { title: 'Input OTP', href: '/docs/components/input-otp' },
        { title: 'Input Password', href: '/docs/components/input-password' },
        { title: 'Item', href: '/docs/components/item' },
        { title: 'Kbd', href: '/docs/components/kbd' },
        { title: 'Label', href: '/docs/components/label' },
        { title: 'Loader', href: '/docs/components/loader' },
        { title: 'Menubar', href: '/docs/components/menubar' },
        { title: 'Mode Toggle', href: '/docs/components/mode-toggle' },
        { title: 'Multi Select', href: '/docs/components/multi-select' },
        { title: 'Nav Tabs', href: '/docs/components/nav-tabs' },
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
        { title: 'Sidebar', href: '/docs/components/sidebar' },
        { title: 'Skeleton', href: '/docs/components/skeleton' },
        { title: 'Slider', href: '/docs/components/slider' },
        { title: 'Spinner', href: '/docs/components/spinner' },
        { title: 'Sonner', href: '/docs/components/sonner' },
        { title: 'Stepper', href: '/docs/components/stepper' },
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
        { title: 'Introduction', href: '/docs/fragments/introduction', priority: true },
        { title: 'Page Container', href: '/docs/fragments/page-container' },
        { title: 'Page Header', href: '/docs/fragments/page-header' },
        { title: 'Page Section', href: '/docs/fragments/page-section' },
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
