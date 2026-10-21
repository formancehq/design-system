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
    description:
      'A vertically stacked set of interactive headings that reveal content.',
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
    description:
      'A modal dialog that interrupts the user for a critical action.',
    sourceFile: 'registry/default/ui/alert-dialog.tsx',
    source: 'shadcn',
  },
  'components/aspect-ratio': {
    registryName: 'aspect-ratio',
    description: 'Displays content within a desired ratio.',
    sourceFile: 'registry/default/ui/aspect-ratio.tsx',
    source: 'shadcn',
  },
  'ai-elements/attachment': {
    registryName: 'attachment',
    description:
      'Displays a file or image attachment with media, metadata, upload state, and actions.',
    sourceFile: 'registry/default/ui/attachment.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'Attachment',
        description:
          'Root container with size, orientation, and upload-state variants.',
      },
      {
        name: 'AttachmentGroup',
        description: 'Horizontal scroller for laying out multiple attachments.',
      },
      {
        name: 'AttachmentMedia',
        description: 'Media slot for an icon or image thumbnail.',
      },
      {
        name: 'AttachmentContent',
        description: 'Wraps the title and description.',
      },
      {
        name: 'AttachmentTitle',
        description: 'File name; shimmers while uploading or processing.',
      },
      {
        name: 'AttachmentDescription',
        description: 'Secondary metadata line (type, size, progress).',
      },
      {
        name: 'AttachmentActions',
        description: 'Container for action buttons.',
      },
      {
        name: 'AttachmentAction',
        description: 'A single icon button action (e.g. remove or cancel).',
      },
      {
        name: 'AttachmentTrigger',
        description:
          'Full-surface trigger for making the attachment clickable.',
      },
    ],
  },
  'ai-elements/bubble': {
    registryName: 'bubble',
    description:
      'The surface of a chat message, with variants, alignment, and reactions.',
    sourceFile: 'registry/default/ui/bubble.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'Bubble',
        description: 'Root with the variant and alignment of the surface.',
      },
      {
        name: 'BubbleContent',
        description:
          'The visible surface. Use asChild to render it as a button or a link.',
      },
      {
        name: 'BubbleGroup',
        description: 'Stacks consecutive bubbles from the same sender.',
      },
      {
        name: 'BubbleReactions',
        description: 'Pill of reactions pinned to an edge of the bubble.',
      },
    ],
  },
  'ai-elements/marker': {
    registryName: 'marker',
    description:
      'An inline status row for a conversation: system notes, tool activity, and labeled separators.',
    sourceFile: 'registry/default/ui/marker.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'Marker',
        description: 'Root row with the default, separator, or border variant.',
      },
      {
        name: 'MarkerIcon',
        description: 'Decorative icon slot at the start of the row.',
      },
      {
        name: 'MarkerContent',
        description: 'The text of the row. Add shimmer for a pending state.',
      },
    ],
  },
  'ai-elements/message': {
    registryName: 'message',
    description:
      'A conversation row with avatar, alignment, header, content, and footer.',
    sourceFile: 'registry/default/ui/message.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'Message',
        description: 'Root row. Set align="end" for the current user.',
      },
      {
        name: 'MessageAvatar',
        description: 'Avatar slot, aligned to the last line of the message.',
      },
      {
        name: 'MessageContent',
        description: 'Column that holds the header, bubbles, and footer.',
      },
      {
        name: 'MessageHeader',
        description: 'Sender name or metadata above the content.',
      },
      {
        name: 'MessageFooter',
        description: 'Status or metadata below the content.',
      },
      {
        name: 'MessageGroup',
        description: 'Stacks consecutive messages.',
      },
    ],
  },
  'ai-elements/message-scroller': {
    registryName: 'message-scroller',
    description:
      'A scroll container for a conversation, with anchored turns, streamed replies, and a jump-to-latest button.',
    sourceFile: 'registry/default/ui/message-scroller.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'MessageScrollerProvider',
        description:
          'Holds the scroll state. Set autoScroll to follow streamed replies.',
      },
      {
        name: 'MessageScroller',
        description: 'Root that positions the viewport and the scroll button.',
      },
      {
        name: 'MessageScrollerViewport',
        description: 'The scrolling element, with a bottom edge fade.',
      },
      {
        name: 'MessageScrollerContent',
        description: 'The log of items. Has role="log" by default.',
      },
      {
        name: 'MessageScrollerItem',
        description:
          'One turn. Set scrollAnchor to settle a new turn near the top.',
      },
      {
        name: 'MessageScrollerButton',
        description: 'Jumps to the start or end when content is out of view.',
      },
    ],
  },
  'ai-elements/trace': {
    registryName: 'trace',
    description:
      'The building block for agent steps: reasoning, tool calls, sources, and more.',
    sourceFile: 'registry/default/ui/trace.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'Trace',
        description:
          'A list of rows. It also styles each trigger or link that holds a TraceLine.',
      },
      {
        name: 'TraceLine',
        description:
          'One line: an icon and a title, with an optional status (running, error, pending).',
      },
      {
        name: 'TraceIcon',
        description:
          'Decorative icon slot. Before the title it names the action, after the title it is the indicator.',
      },
      {
        name: 'TraceTitle',
        description:
          'One sentence on one line. It truncates, and it shimmers while the line runs.',
      },
      {
        name: 'TraceDescription',
        description:
          'Secondary text after the title, for example a count or a duration.',
      },
      {
        name: 'TraceCollapsible',
        description:
          'A row that expands. Takes the Collapsible props, except asChild.',
      },
      {
        name: 'TraceCollapsibleTrigger',
        description:
          'The button that opens and closes the row. Adds a chevron after the line.',
      },
      {
        name: 'TraceCollapsibleContent',
        description: 'The detail of a row that expands.',
      },
    ],
  },
  'ai-elements/code-block': {
    registryName: 'code-block',
    description:
      'Displays code, terminal output, and diffs with an optional header, line numbers, and a copy button.',
    sourceFile: 'registry/default/ui/code-block.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'CodeBlock',
        description:
          'The surface, with the default or destructive variant and the default or sm size.',
      },
      {
        name: 'CodeBlockHeader',
        description: 'A row above the content for a title and actions.',
      },
      {
        name: 'CodeBlockTitle',
        description:
          'A file name or a label, with an optional icon. It truncates.',
      },
      {
        name: 'CodeBlockActions',
        description:
          'Buttons at the end of the header. As a direct child of CodeBlock, it floats.',
      },
      {
        name: 'CodeBlockCopyButton',
        description: 'A ghost icon button that copies its value.',
      },
      {
        name: 'CodeBlockContent',
        description:
          'The pre that scrolls or wraps, with optional line numbers.',
      },
      {
        name: 'CodeBlockLine',
        description:
          'One line, with the default, added, removed, or highlighted variant.',
      },
      {
        name: 'CodeBlockFooter',
        description:
          'A row below the content, for example for a Show More button.',
      },
    ],
  },
  'ai-elements/questionnaire': {
    registryName: 'questionnaire',
    description:
      'A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.',
    sourceFile: 'registry/default/ui/questionnaire.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'Questionnaire',
        description:
          'Root form. Holds the ordered items, the active item, the answers, the validation, and the navigation.',
      },
      {
        name: 'QuestionnaireItem',
        description:
          'One question, rendered as a fieldset. Set multiple, required, or disabled.',
      },
      {
        name: 'QuestionnaireTitle',
        description: 'The question, rendered as the legend of the item.',
      },
      {
        name: 'QuestionnaireDescription',
        description: 'Help text linked to the item.',
      },
      {
        name: 'QuestionnaireChoices',
        description: 'Container for the answers of the item.',
      },
      {
        name: 'QuestionnaireChoice',
        description: 'One fixed answer, with a native radio or checkbox.',
      },
      {
        name: 'QuestionnaireChoiceDescription',
        description: 'Secondary text inside a choice.',
      },
      {
        name: 'QuestionnaireInput',
        description:
          'Freeform answer next to the fixed choices. Needs an accessible name.',
      },
      {
        name: 'QuestionnaireError',
        description: 'The validation error of the active item.',
      },
      {
        name: 'QuestionnaireProgress',
        description:
          'Progress bar. Accepts a render prop for a custom indicator.',
      },
      {
        name: 'QuestionnaireActions',
        description: 'Layout for the navigation buttons.',
      },
      {
        name: 'QuestionnairePrevious',
        description:
          'Goes to the previous item. Accepts Button size and variant.',
      },
      {
        name: 'QuestionnaireSkip',
        description: 'Leaves an optional item without an answer.',
      },
      {
        name: 'QuestionnaireNext',
        description: 'Validates the item and goes to the next one.',
      },
      {
        name: 'QuestionnaireSubmit',
        description: 'Submits the form on the last item.',
      },
    ],
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
    description:
      'Container component for grouping content with header, body, and footer.',
    sourceFile: 'registry/default/ui/card.tsx',
    source: 'shadcn',
  },
  'components/code-snippet': {
    registryName: 'code-snippet',
    description:
      'A read-only syntax-highlighted code viewer powered by Shiki with CSS variable theming.',
    sourceFile: 'registry/default/ui/code-snippet.tsx',
    source: 'custom',
  },
  'components/code-editor': {
    registryName: 'code-editor',
    description:
      'An editable Monaco code editor with Shiki tokenization and CSS variable theming.',
    sourceFile: 'registry/default/ui/code-editor.tsx',
    source: 'custom',
  },
  'fragments/ledger-schema-editor': {
    registryName: 'ledger-schema-editor',
    description:
      'A ledger schema editor: a Monaco CodeEditor with a YAML/JSON toggle, live validation against the hosted canonical schema, and a valid / error status.',
    sourceFile: 'registry/default/ui-fragments/ledger-schema-editor.tsx',
    source: 'custom',
  },
  'components/chart': {
    registryName: 'chart',
    description: 'Chart components built on Recharts.',
    sourceFile: 'registry/default/ui/chart.tsx',
    source: 'shadcn',
  },
  'components/checkbox': {
    registryName: 'checkbox',
    description:
      'A control that allows the user to toggle between checked and not checked.',
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
  'components/context-icon': {
    registryName: 'context-icon',
    description:
      'Octilinear tile identifying an organization or a stack. Ships the SVG art alongside the component.',
    sourceFile: 'registry/default/ui/context-icon.tsx',
    source: 'custom',
  },
  'components/context-menu': {
    registryName: 'context-menu',
    description: 'Opens a menu on right-click.',
    sourceFile: 'registry/default/ui/context-menu.tsx',
    source: 'shadcn',
  },
  'components/dialog': {
    registryName: 'dialog',
    description:
      'A modal dialog that interrupts the user with important content.',
    sourceFile: 'registry/default/ui/dialog.tsx',
    source: 'shadcn',
  },
  'components/drawer': {
    registryName: 'drawer',
    description:
      'A drawer component that slides in from the edge of the screen.',
    sourceFile: 'registry/default/ui/drawer.tsx',
    source: 'shadcn',
  },
  'components/dropdown-menu': {
    registryName: 'dropdown-menu',
    description: 'Opens a menu when the user clicks a trigger.',
    sourceFile: 'registry/default/ui/dropdown-menu.tsx',
    source: 'shadcn',
  },
  'components/form': {
    registryName: 'form',
    description:
      'React Hook Form integration with validation and error handling.',
    sourceFile: 'registry/default/ui/form.tsx',
    source: 'shadcn',
  },
  'components/hover-card': {
    registryName: 'hover-card',
    description: 'Previews content in a floating card on hover.',
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
    description:
      'A set of checkable buttons where only one can be checked at a time.',
    sourceFile: 'registry/default/ui/radio-group.tsx',
    source: 'shadcn',
  },
  'components/radio-group-card': {
    registryName: 'radio-group-card',
    description:
      'A card-style radio group for visual selection with optional children content.',
    sourceFile: 'registry/default/ui/radio-group-card.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'RadioGroupCard',
        description: 'Root container wrapping radio card items.',
      },
      {
        name: 'RadioGroupCardItem',
        description:
          'Individual card with label, indicator, and optional children.',
      },
    ],
  },
  'components/radio-group-stacked': {
    registryName: 'radio-group-stacked',
    description:
      'A stacked radio group with labels and descriptions for form selections.',
    sourceFile: 'registry/default/ui/radio-group-stacked.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'RadioGroupStacked',
        description: 'Root container with stacked layout and negative spacing.',
      },
      {
        name: 'RadioGroupStackedItem',
        description:
          'Individual stacked item with label, description, and indicator.',
      },
    ],
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
  'components/endpoint': {
    registryName: 'endpoint',
    description:
      'API endpoint pill combining HTTP method, response status code, and route path.',
    sourceFile: 'registry/default/ui/endpoint.tsx',
    source: 'custom',
  },
  'components/button-group': {
    registryName: 'button-group',
    description: 'A group of buttons with separator.',
    sourceFile: 'registry/default/ui/button-group.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'ButtonGroup',
        description: 'Root container with horizontal or vertical orientation.',
      },
      {
        name: 'ButtonGroupText',
        description: 'Muted text segment between buttons.',
      },
      {
        name: 'ButtonGroupSeparator',
        description: 'Visual separator between grouped buttons.',
      },
    ],
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
    subComponents: [
      {
        name: 'DescriptionList',
        description: 'Root grid container for term/detail pairs.',
      },
      {
        name: 'DescriptionTerm',
        description: 'The label (dt) for a key-value pair.',
      },
      {
        name: 'DescriptionTermDescription',
        description:
          'Secondary helper text nested inside a term, for when the label alone is not enough.',
      },
      {
        name: 'DescriptionDetails',
        description: 'The value (dd) for a key-value pair.',
      },
      {
        name: 'DescriptionRow',
        description: 'Horizontal row layout for inline pairs.',
      },
      {
        name: 'DescriptionRowGroup',
        description: 'Vertical group of stacked rows.',
      },
      {
        name: 'DescriptionRowSeparator',
        description: 'Vertical separator between row groups.',
      },
    ],
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
  'fragments/mode-toggle': {
    registryName: 'mode-toggle',
    description: 'A theme toggle button for dark and light mode.',
    sourceFile: 'registry/default/ui-fragments/mode-toggle.tsx',
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
    description:
      'A full form field system with labels, descriptions, and errors.',
    sourceFile: 'registry/default/ui/field.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'Field',
        description:
          'Root wrapper with orientation variants (vertical, horizontal, responsive).',
      },
      {
        name: 'FieldLabel',
        description: 'Accessible label tied to the field control.',
      },
      {
        name: 'FieldTitle',
        description: 'Non-label heading for a field (e.g. checkbox groups).',
      },
      {
        name: 'FieldContent',
        description: 'Wraps the control, description, and error.',
      },
      {
        name: 'FieldDescription',
        description: 'Helper text below the control.',
      },
      {
        name: 'FieldError',
        description: 'Validation error message with alert role.',
      },
      { name: 'FieldGroup', description: 'Groups multiple fields vertically.' },
      {
        name: 'FieldSet',
        description: 'Semantic fieldset for grouped controls.',
      },
      {
        name: 'FieldLegend',
        description: 'Legend for a fieldset with legend or label styling.',
      },
      {
        name: 'FieldSeparator',
        description:
          'Horizontal separator between fields, optionally with text.',
      },
    ],
  },
  'components/input-group': {
    registryName: 'input-group',
    description: 'Grouped input with addons, buttons, and text.',
    sourceFile: 'registry/default/ui/input-group.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'InputGroup',
        description: 'Root container that groups an input with addons.',
      },
      {
        name: 'InputGroupInput',
        description:
          'The text input control (borderless, inherits group focus).',
      },
      {
        name: 'InputGroupTextarea',
        description: 'A textarea control variant.',
      },
      {
        name: 'InputGroupAddon',
        description:
          'Slot for icons, badges, or buttons (inline-start, inline-end, block-start, block-end).',
      },
      {
        name: 'InputGroupButton',
        description: 'A small button inside the addon area.',
      },
      {
        name: 'InputGroupText',
        description: 'Static text or icon label inside an addon.',
      },
    ],
  },
  'components/item': {
    registryName: 'item',
    description: 'A list item system with media, content, and actions.',
    sourceFile: 'registry/default/ui/item.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'Item',
        description:
          'Root container with variant (default, outline, muted) and size.',
      },
      {
        name: 'ItemMedia',
        description:
          'Leading slot for icons or images (default, icon, image variants).',
      },
      {
        name: 'ItemContent',
        description: 'Flex column for title and description.',
      },
      { name: 'ItemTitle', description: 'Primary text label.' },
      {
        name: 'ItemDescription',
        description: 'Secondary muted text, line-clamped to 2 lines.',
      },
      { name: 'ItemActions', description: 'Trailing slot for action buttons.' },
      {
        name: 'ItemHeader',
        description: 'Full-width row above the item body.',
      },
      {
        name: 'ItemFooter',
        description: 'Full-width row below the item body.',
      },
      {
        name: 'ItemGroup',
        description: 'Vertical list container for multiple items.',
      },
      {
        name: 'ItemSeparator',
        description: 'Horizontal separator between items.',
      },
    ],
  },
  'fragments/multi-select': {
    registryName: 'multi-select',
    description: 'A multi-select component with badges and search.',
    sourceFile: 'registry/default/ui-fragments/multi-select.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'MultiSelect',
        description:
          'Root provider with controlled/uncontrolled values and popover or inline mode.',
      },
      {
        name: 'MultiSelectTrigger',
        description:
          'Button that opens the dropdown and displays selected badges.',
      },
      {
        name: 'MultiSelectInput',
        description: 'Search input inside the trigger for filtering options.',
      },
      {
        name: 'MultiSelectValue',
        description: 'Renders selected values as badges with remove buttons.',
      },
      {
        name: 'MultiSelectContent',
        description: 'Dropdown content with command list.',
      },
      {
        name: 'MultiSelectItem',
        description: 'Selectable option with checkbox indicator.',
      },
      {
        name: 'MultiSelectGroup',
        description: 'Groups related items under a heading.',
      },
      {
        name: 'MultiSelectSeparator',
        description: 'Visual separator between groups.',
      },
    ],
  },
  'components/sidebar': {
    registryName: 'sidebar',
    description: 'A collapsible sidebar with mobile support.',
    sourceFile: 'registry/default/ui/sidebar.tsx',
    source: 'shadcn',
    subComponents: [
      {
        name: 'SidebarSectionLabel',
        description:
          'Gold eyebrow naming a product area that spans several groups. Sits directly in SidebarContent and hides when the sidebar collapses to icons.',
      },
      {
        name: 'SidebarGroupLabel',
        description:
          'Mono uppercase label for a group of items inside a section. Collapses its own height on the icon rail.',
      },
      {
        name: 'SidebarMenuButton',
        description:
          'Nav item in sans with an icon, isActive state, and a tooltip used once the rail is collapsed.',
      },
    ],
  },
  'components/sortable': {
    registryName: 'sortable',
    description:
      'Drag-and-drop sortable list built on dnd-kit with keyboard and screen reader support.',
    sourceFile: 'registry/default/ui/sortable.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'Sortable',
        description:
          'Root provider with value, onValueChange, orientation, and flatCursor.',
      },
      {
        name: 'SortableContent',
        description: 'Wraps the sortable list items with SortableContext.',
      },
      {
        name: 'SortableItem',
        description: 'Individual draggable item with transform and transition.',
      },
      {
        name: 'SortableItemHandle',
        description: 'Drag handle trigger for a sortable item.',
      },
      {
        name: 'SortableOverlay',
        description: 'Drag overlay rendered in a portal during drag.',
      },
    ],
  },
  'fragments/sso-button': {
    registryName: 'sso-button',
    description:
      "An outline button carrying an identity provider's brand mark, plus a group that renders one per provider.",
    sourceFile: 'registry/default/ui-fragments/sso-button.tsx',
    source: 'custom',
  },
  'fragments/key-value-input': {
    registryName: 'key-value-input',
    description:
      'A dynamic key-value pair input with drag-to-reorder, add, and remove rows.',
    sourceFile: 'registry/default/ui-fragments/key-value-input.tsx',
    source: 'custom',
  },
  'fragments/app-card': {
    registryName: 'app-card',
    description:
      'A card layout for app sections with optional icon, header action, separator, and footer.',
    sourceFile: 'registry/default/ui-fragments/app-card.tsx',
    source: 'custom',
  },
  'fragments/app-card-empty': {
    registryName: 'app-card-empty',
    description:
      'Muted empty-state card with centered icon, title, description, and optional actions.',
    sourceFile: 'registry/default/ui-fragments/app-card-empty.tsx',
    source: 'custom',
  },
  'components/stepper': {
    registryName: 'stepper',
    description: 'A multi-step wizard component with validation.',
    sourceFile: 'registry/default/ui/stepper.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'Stepper',
        description: 'Root provider with value, orientation, and validation.',
      },
      {
        name: 'StepperList',
        description: 'Tab list container for step triggers.',
      },
      {
        name: 'StepperItem',
        description:
          'Individual step with value, completed, and disabled state.',
      },
      { name: 'StepperTrigger', description: 'Clickable trigger for a step.' },
      {
        name: 'StepperIndicator',
        description: 'Step number or check icon, styled by state.',
      },
      { name: 'StepperTitle', description: 'Label text for a step.' },
      {
        name: 'StepperDescription',
        description: 'Secondary text below the step title.',
      },
      {
        name: 'StepperSeparator',
        description: 'Line between steps, colored by completion state.',
      },
      {
        name: 'StepperContent',
        description: 'Panel content shown for the active step.',
      },
      {
        name: 'StepperPrevTrigger',
        description: 'Button to navigate to the previous step.',
      },
      {
        name: 'StepperNextTrigger',
        description: 'Button to navigate to the next step (runs validation).',
      },
    ],
  },
  'examples/code': {
    registryName: 'code-themes',
    description:
      'Shared Shiki singleton, preview+edit pattern, and CSS variable theming.',
    sourceFile: 'registry/default/demos/code-preview-edit-demo.tsx',
    source: 'custom',
  },
  'examples/forms': {
    registryName: 'form-patterns',
    description: 'Common form patterns used in settings pages and side panels.',
    sourceFile: 'registry/default/demos/form-patterns-demo.tsx',
    source: 'custom',
  },
  'fragments/api-snippet': {
    registryName: 'api-snippet',
    description:
      'Tabbed API call reference (curl, HTTPie, TypeScript SDK, optional fctl) rendered from a Formance stack OpenAPI operationId.',
    sourceFile: 'registry/default/ui-fragments/api-snippet.tsx',
    source: 'custom',
  },
  'fragments/ledger-schema': {
    registryName: 'ledger-schema',
    description:
      'Interactive viewer for a Formance ledger schema — chart of accounts, transactions (Numscript), and queries — with a tabbed full view and props to show a single section, transaction, or chart subtree.',
    sourceFile: 'registry/default/ui-fragments/ledger-schema.tsx',
    source: 'custom',
  },
  'fragments/markdown': {
    registryName: 'markdown',
    description:
      'Formance-styled markdown renderer (GFM, code blocks, tables, math, mermaid) with an overridable component map.',
    sourceFile: 'registry/default/ui-fragments/markdown.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'Markdown',
        description:
          'Renders a markdown string with Formance styling. Accepts a `components` prop merged over the defaults.',
      },
      {
        name: 'markdownComponents',
        description:
          'The reusable element→component map (links, task-list inputs, code blocks). Spread it into react-markdown or streamdown and wrap the output in `typeset typeset-docs` for the same typography.',
      },
    ],
  },
  'fragments/copy-button': {
    registryName: 'copy-button',
    description:
      'An outline icon button that copies text to the clipboard and confirms with a check. Used by ApiSnippet and LedgerSchema.',
    sourceFile: 'registry/default/ui-fragments/copy-button.tsx',
    source: 'custom',
  },
  'fragments/copy-page': {
    registryName: 'copy-page',
    description:
      'A copy-to-clipboard button with a dropdown to view the page as Markdown or open it in ChatGPT / Claude.',
    sourceFile: 'registry/default/ui-fragments/copy-page.tsx',
    source: 'custom',
  },
  'fragments/data-table': {
    registryName: 'data-table',
    description:
      'A client-side data table built on TanStack Table with sorting, filtering, pagination, column visibility, pinning, resizing and expandable rows.',
    sourceFile: 'registry/default/ui-fragments/data-table/data-table.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'DataTable',
        description:
          'Client-side table: toolbar, content and pagination over one useTable.',
      },
      {
        name: 'DataTableContent',
        description:
          'The table itself: header, rows, resize handles, pinned columns, expanded rows and the empty placeholder. Render it with your own useTable to build a custom table.',
      },
      {
        name: 'DataTableColumnHeader',
        description: 'Sortable column header with dropdown sort controls.',
      },
      {
        name: 'DataTablePagination',
        description: 'Pagination controls with page size selector.',
      },
      {
        name: 'DataTableToolbar',
        description: 'Toolbar with search, faceted filters, and view options.',
      },
      {
        name: 'DataTableViewOptions',
        description: 'Column visibility toggle dropdown.',
      },
      {
        name: 'DataTableFacetedFilter',
        description: 'Faceted filter popover for column filtering.',
      },
      {
        name: 'DataTableRowActions',
        description: 'Row-level action dropdown menu.',
      },
      {
        name: 'DataTableSkeleton',
        description: 'Loading skeleton placeholder for the data table.',
      },
    ],
  },
  'fragments/page-container': {
    registryName: 'page-container',
    description:
      'Responsive container with size variants for consistent page widths.',
    sourceFile: 'registry/default/ui-fragments/page-container.tsx',
    source: 'custom',
  },
  'fragments/page-header': {
    registryName: 'page-header',
    description:
      'Compound page header with icon, title, description, breadcrumbs, and actions.',
    sourceFile: 'registry/default/ui-fragments/page-header.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'PageHeader',
        description:
          'Root container. Accepts size, background, and border variants.',
      },
      {
        name: 'PageHeaderMeta',
        description: 'Wraps icon, summary, and aside in a responsive row.',
      },
      { name: 'PageHeaderIcon', description: 'Slot for a custom icon or SVG.' },
      {
        name: 'PageHeaderSummary',
        description: 'Groups eyebrow, title, and description.',
      },
      {
        name: 'PageHeaderEyebrow',
        description: 'Small label above the title. Defaults to gold variant.',
      },
      { name: 'PageHeaderTitle', description: 'Primary heading (h1).' },
      {
        name: 'PageHeaderDescription',
        description: 'Supporting text below the title.',
      },
      {
        name: 'PageHeaderAside',
        description: 'Container for action buttons, aligned to the right.',
      },
      {
        name: 'PageHeaderBreadcrumb',
        description: 'Breadcrumb navigation wrapper.',
      },
    ],
  },
  'fragments/page-section': {
    registryName: 'page-section',
    description:
      'A compound component for organizing page content into distinct sections.',
    sourceFile: 'registry/default/ui-fragments/page-section.tsx',
    source: 'custom',
    subComponents: [
      {
        name: 'PageSection',
        description:
          'Root container with orientation variants (vertical or horizontal).',
      },
      {
        name: 'PageSectionMeta',
        description: 'Wraps summary and aside in a responsive row.',
      },
      {
        name: 'PageSectionSummary',
        description: 'Groups title and description.',
      },
      { name: 'PageSectionTitle', description: 'Section heading (h2).' },
      {
        name: 'PageSectionDescription',
        description: 'Supporting text below the title.',
      },
      {
        name: 'PageSectionAside',
        description: 'Container for section-level action buttons.',
      },
      {
        name: 'PageSectionContent',
        description: 'Container for the main section content.',
      },
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
        {
          title: 'Introduction',
          href: '/docs/components/introduction',
          priority: true,
        },
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
        { title: 'Code Editor', href: '/docs/components/code-editor' },
        { title: 'Code Snippet', href: '/docs/components/code-snippet' },
        { title: 'Collapsible', href: '/docs/components/collapsible' },
        { title: 'Combobox', href: '/docs/components/combobox' },
        { title: 'Command', href: '/docs/components/command' },
        { title: 'Context Icon', href: '/docs/components/context-icon' },
        { title: 'Context Menu', href: '/docs/components/context-menu' },
        {
          title: 'Description List',
          href: '/docs/components/description-list',
        },
        { title: 'Dialog', href: '/docs/components/dialog' },
        { title: 'Drawer', href: '/docs/components/drawer' },
        { title: 'Dropdown Menu', href: '/docs/components/dropdown-menu' },
        { title: 'Empty', href: '/docs/components/empty' },
        { title: 'Endpoint', href: '/docs/components/endpoint' },
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
        { title: 'Nav Tabs', href: '/docs/components/nav-tabs' },
        { title: 'Navigation Menu', href: '/docs/components/navigation-menu' },
        { title: 'Pagination', href: '/docs/components/pagination' },
        { title: 'Popover', href: '/docs/components/popover' },
        { title: 'Progress', href: '/docs/components/progress' },
        { title: 'Radio Group', href: '/docs/components/radio-group' },
        {
          title: 'Radio Group Card',
          href: '/docs/components/radio-group-card',
        },
        {
          title: 'Radio Group Stacked',
          href: '/docs/components/radio-group-stacked',
        },
        { title: 'Resizable', href: '/docs/components/resizable' },
        { title: 'Scroll Area', href: '/docs/components/scroll-area' },
        { title: 'Select', href: '/docs/components/select' },
        { title: 'Separator', href: '/docs/components/separator' },
        { title: 'Sheet', href: '/docs/components/sheet' },
        { title: 'Sidebar', href: '/docs/components/sidebar' },
        { title: 'Skeleton', href: '/docs/components/skeleton' },
        { title: 'Slider', href: '/docs/components/slider' },
        { title: 'Sortable', href: '/docs/components/sortable' },
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
        {
          title: 'Introduction',
          href: '/docs/fragments/introduction',
          priority: true,
        },
        { title: 'API Snippet', href: '/docs/fragments/api-snippet' },
        { title: 'App Card', href: '/docs/fragments/app-card' },
        {
          title: 'Ledger Schema',
          href: '/docs/fragments/ledger-schema',
        },
        {
          title: 'Ledger Schema Editor',
          href: '/docs/fragments/ledger-schema-editor',
        },
        { title: 'App Card Empty', href: '/docs/fragments/app-card-empty' },
        { title: 'Copy Button', href: '/docs/fragments/copy-button' },
        { title: 'Copy Page', href: '/docs/fragments/copy-page' },
        { title: 'Data Table', href: '/docs/fragments/data-table' },
        { title: 'Markdown', href: '/docs/fragments/markdown' },
        { title: 'Mode Toggle', href: '/docs/fragments/mode-toggle' },
        { title: 'Multi Select', href: '/docs/fragments/multi-select' },
        { title: 'Page Container', href: '/docs/fragments/page-container' },
        { title: 'Page Header', href: '/docs/fragments/page-header' },
        {
          title: 'Key Value Input',
          href: '/docs/fragments/key-value-input',
        },
        { title: 'Page Section', href: '/docs/fragments/page-section' },
        { title: 'SSO Button', href: '/docs/fragments/sso-button' },
      ],
    },
    {
      title: 'AI Elements',
      sortOrder: 'alphabetical',
      items: [
        {
          title: 'Introduction',
          href: '/docs/ai-elements/introduction',
          priority: true,
        },
        { title: 'Attachment', href: '/docs/ai-elements/attachment' },
        { title: 'Bubble', href: '/docs/ai-elements/bubble' },
        { title: 'Marker', href: '/docs/ai-elements/marker' },
        {
          title: 'Chain of Thought',
          href: '/docs/ai-elements/chain-of-thought',
        },
        { title: 'Chat', href: '/docs/ai-elements/chat' },
        { title: 'Checkpoint', href: '/docs/ai-elements/checkpoint' },
        { title: 'Code Block', href: '/docs/ai-elements/code-block' },
        { title: 'Confirmation', href: '/docs/ai-elements/confirmation' },
        { title: 'Context', href: '/docs/ai-elements/context' },
        { title: 'File Tree', href: '/docs/ai-elements/file-tree' },
        { title: 'Inline Citation', href: '/docs/ai-elements/inline-citation' },
        { title: 'Model Selector', href: '/docs/ai-elements/model-selector' },
        { title: 'Plan', href: '/docs/ai-elements/plan' },
        { title: 'Prompt Input', href: '/docs/ai-elements/prompt-input' },
        { title: 'Queue', href: '/docs/ai-elements/queue' },
        { title: 'Questionnaire', href: '/docs/ai-elements/questionnaire' },
        { title: 'Reasoning', href: '/docs/ai-elements/reasoning' },
        { title: 'Sources', href: '/docs/ai-elements/sources' },
        { title: 'Stack Trace', href: '/docs/ai-elements/stack-trace' },
        { title: 'Subagent', href: '/docs/ai-elements/subagent' },
        { title: 'Suggestion', href: '/docs/ai-elements/suggestion' },
        { title: 'Task', href: '/docs/ai-elements/task' },
        { title: 'Terminal', href: '/docs/ai-elements/terminal' },
        { title: 'Test Results', href: '/docs/ai-elements/test-results' },
        { title: 'Tool', href: '/docs/ai-elements/tool' },
        { title: 'Trace', href: '/docs/ai-elements/trace' },
        { title: 'Message', href: '/docs/ai-elements/message' },
        {
          title: 'Message Scroller',
          href: '/docs/ai-elements/message-scroller',
        },
      ],
    },
    {
      title: 'Examples',
      sortOrder: 'alphabetical',
      items: [
        { title: 'Code', href: '/docs/examples/code' },
        { title: 'Forms', href: '/docs/examples/forms' },
      ],
    },
    {
      title: 'Brand',
      items: [{ title: 'Formance Logo', href: '/docs/brand/formance-logo' }],
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
      items.push({
        title: item.title,
        href: item.href,
        section: section.title,
      });
    }
  }

  return items;
}
