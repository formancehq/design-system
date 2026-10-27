'use client';

import { lazy, type ComponentType } from 'react';

type TRegistryExample = {
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

const registryDemos: Record<string, TRegistryDemo> = {
  accordion: {
    component: lazy(() => import('@/registry/default/demos/accordion-demo')),
    sourceFile: 'registry/default/demos/accordion-demo.tsx',
  },
  alert: {
    component: lazy(() => import('@/registry/default/demos/alert-demo')),
    sourceFile: 'registry/default/demos/alert-demo.tsx',
    examples: [
      {
        title: 'With content',
        component: lazy(
          () => import('@/registry/default/examples/alert-with-content')
        ),
        sourceFile: 'registry/default/examples/alert-with-content.tsx',
      },
    ],
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
  attachment: {
    component: lazy(() => import('@/registry/default/demos/attachment-demo')),
    sourceFile: 'registry/default/demos/attachment-demo.tsx',
    examples: [
      {
        title: 'Image',
        component: lazy(
          () => import('@/registry/default/examples/attachment-image')
        ),
        sourceFile: 'registry/default/examples/attachment-image.tsx',
      },
      {
        title: 'States',
        component: lazy(
          () => import('@/registry/default/examples/attachment-upload-states')
        ),
        sourceFile: 'registry/default/examples/attachment-upload-states.tsx',
      },
      {
        title: 'Image states',
        component: lazy(
          () => import('@/registry/default/examples/attachment-image-states')
        ),
        sourceFile: 'registry/default/examples/attachment-image-states.tsx',
      },
      {
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/attachment-sizes')
        ),
        sourceFile: 'registry/default/examples/attachment-sizes.tsx',
      },
      {
        title: 'Group',
        component: lazy(
          () => import('@/registry/default/examples/attachment-group')
        ),
        sourceFile: 'registry/default/examples/attachment-group.tsx',
      },
      {
        title: 'Trigger',
        component: lazy(
          () => import('@/registry/default/examples/attachment-trigger')
        ),
        sourceFile: 'registry/default/examples/attachment-trigger.tsx',
      },
      {
        title: 'Content only',
        component: lazy(
          () => import('@/registry/default/examples/attachment-content-only')
        ),
        sourceFile: 'registry/default/examples/attachment-content-only.tsx',
      },
    ],
  },
  bubble: {
    component: lazy(() => import('@/registry/default/demos/bubble-demo')),
    sourceFile: 'registry/default/demos/bubble-demo.tsx',
    examples: [
      {
        title: 'Variants',
        component: lazy(
          () => import('@/registry/default/examples/bubble-variants')
        ),
        sourceFile: 'registry/default/examples/bubble-variants.tsx',
      },
      {
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/bubble-sizes')
        ),
        sourceFile: 'registry/default/examples/bubble-sizes.tsx',
      },
      {
        title: 'Alignment',
        component: lazy(
          () => import('@/registry/default/examples/bubble-alignment')
        ),
        sourceFile: 'registry/default/examples/bubble-alignment.tsx',
      },
      {
        title: 'Bubble group',
        component: lazy(
          () => import('@/registry/default/examples/bubble-group')
        ),
        sourceFile: 'registry/default/examples/bubble-group.tsx',
      },
      {
        title: 'Links and buttons',
        component: lazy(
          () => import('@/registry/default/examples/bubble-link-button')
        ),
        sourceFile: 'registry/default/examples/bubble-link-button.tsx',
      },
      {
        title: 'Reactions',
        component: lazy(
          () => import('@/registry/default/examples/bubble-reactions')
        ),
        sourceFile: 'registry/default/examples/bubble-reactions.tsx',
      },
      {
        title: 'Show more',
        component: lazy(
          () => import('@/registry/default/examples/bubble-collapsible')
        ),
        sourceFile: 'registry/default/examples/bubble-collapsible.tsx',
      },
      {
        title: 'Tooltip',
        component: lazy(
          () => import('@/registry/default/examples/bubble-tooltip')
        ),
        sourceFile: 'registry/default/examples/bubble-tooltip.tsx',
      },
      {
        title: 'Popover',
        component: lazy(
          () => import('@/registry/default/examples/bubble-popover')
        ),
        sourceFile: 'registry/default/examples/bubble-popover.tsx',
      },
      {
        title: 'Suggestions',
        component: lazy(
          () => import('@/registry/default/examples/bubble-suggestions')
        ),
        sourceFile: 'registry/default/examples/bubble-suggestions.tsx',
      },
      {
        title: 'Error',
        component: lazy(
          () => import('@/registry/default/examples/bubble-error')
        ),
        sourceFile: 'registry/default/examples/bubble-error.tsx',
      },
    ],
  },
  marker: {
    component: lazy(() => import('@/registry/default/demos/marker-demo')),
    sourceFile: 'registry/default/demos/marker-demo.tsx',
    examples: [
      {
        title: 'Variants',
        component: lazy(
          () => import('@/registry/default/examples/marker-variants')
        ),
        sourceFile: 'registry/default/examples/marker-variants.tsx',
      },
      {
        title: 'Status',
        component: lazy(
          () => import('@/registry/default/examples/marker-status')
        ),
        sourceFile: 'registry/default/examples/marker-status.tsx',
      },
      {
        title: 'Shimmer',
        component: lazy(
          () => import('@/registry/default/examples/marker-shimmer')
        ),
        sourceFile: 'registry/default/examples/marker-shimmer.tsx',
      },
      {
        title: 'Separator',
        component: lazy(
          () => import('@/registry/default/examples/marker-separator')
        ),
        sourceFile: 'registry/default/examples/marker-separator.tsx',
      },
      {
        title: 'Border',
        component: lazy(
          () => import('@/registry/default/examples/marker-border')
        ),
        sourceFile: 'registry/default/examples/marker-border.tsx',
      },
      {
        title: 'With icon',
        component: lazy(
          () => import('@/registry/default/examples/marker-icon')
        ),
        sourceFile: 'registry/default/examples/marker-icon.tsx',
      },
      {
        title: 'Links and buttons',
        component: lazy(
          () => import('@/registry/default/examples/marker-link-button')
        ),
        sourceFile: 'registry/default/examples/marker-link-button.tsx',
      },
      {
        title: 'Accordion',
        component: lazy(
          () => import('@/registry/default/examples/marker-accordion')
        ),
        sourceFile: 'registry/default/examples/marker-accordion.tsx',
      },
      {
        title: 'Drawer',
        component: lazy(
          () => import('@/registry/default/examples/marker-drawer')
        ),
        sourceFile: 'registry/default/examples/marker-drawer.tsx',
      },
    ],
  },
  message: {
    component: lazy(() => import('@/registry/default/demos/message-demo')),
    sourceFile: 'registry/default/demos/message-demo.tsx',
    examples: [
      {
        title: 'Group',
        component: lazy(
          () => import('@/registry/default/examples/message-group')
        ),
        sourceFile: 'registry/default/examples/message-group.tsx',
      },
      {
        title: 'Avatar',
        component: lazy(
          () => import('@/registry/default/examples/message-avatar')
        ),
        sourceFile: 'registry/default/examples/message-avatar.tsx',
      },
      {
        title: 'Header and footer',
        component: lazy(
          () => import('@/registry/default/examples/message-header-footer')
        ),
        sourceFile: 'registry/default/examples/message-header-footer.tsx',
      },
      {
        title: 'Actions',
        component: lazy(
          () => import('@/registry/default/examples/message-actions')
        ),
        sourceFile: 'registry/default/examples/message-actions.tsx',
      },
      {
        title: 'Attachment',
        component: lazy(
          () => import('@/registry/default/examples/message-attachment')
        ),
        sourceFile: 'registry/default/examples/message-attachment.tsx',
      },
      {
        title: 'Markdown',
        component: lazy(
          () => import('@/registry/default/examples/message-markdown')
        ),
        sourceFile: 'registry/default/examples/message-markdown.tsx',
      },
      {
        title: 'Pattern',
        component: lazy(
          () => import('@/registry/default/examples/message-pattern')
        ),
        sourceFile: 'registry/default/examples/message-pattern.tsx',
      },
    ],
  },
  'message-scroller': {
    component: lazy(
      () => import('@/registry/default/demos/message-scroller-demo')
    ),
    sourceFile: 'registry/default/demos/message-scroller-demo.tsx',
    examples: [
      {
        title: 'Jump to message',
        component: lazy(
          () => import('@/registry/default/examples/message-scroller-jump')
        ),
        sourceFile: 'registry/default/examples/message-scroller-jump.tsx',
      },
      {
        title: 'Anchoring turns',
        component: lazy(
          () => import('@/registry/default/examples/message-scroller-anchoring')
        ),
        sourceFile: 'registry/default/examples/message-scroller-anchoring.tsx',
      },
      {
        title: 'Group chat',
        component: lazy(
          () =>
            import('@/registry/default/examples/message-scroller-group-chat')
        ),
        sourceFile: 'registry/default/examples/message-scroller-group-chat.tsx',
      },
      {
        title: 'Keeping context visible',
        component: lazy(
          () =>
            import('@/registry/default/examples/message-scroller-previous-context')
        ),
        sourceFile:
          'registry/default/examples/message-scroller-previous-context.tsx',
      },
      {
        title: 'Following the live edge',
        component: lazy(
          () => import('@/registry/default/examples/message-scroller-streaming')
        ),
        sourceFile: 'registry/default/examples/message-scroller-streaming.tsx',
      },
      {
        title: 'Opening position',
        component: lazy(
          () =>
            import('@/registry/default/examples/message-scroller-opening-position')
        ),
        sourceFile:
          'registry/default/examples/message-scroller-opening-position.tsx',
      },
      {
        title: 'Loading earlier messages',
        component: lazy(
          () =>
            import('@/registry/default/examples/message-scroller-load-history')
        ),
        sourceFile:
          'registry/default/examples/message-scroller-load-history.tsx',
      },
      {
        title: 'Animating new messages',
        component: lazy(
          () => import('@/registry/default/examples/message-scroller-animation')
        ),
        sourceFile: 'registry/default/examples/message-scroller-animation.tsx',
      },
      {
        title: 'Tracking the position',
        component: lazy(
          () =>
            import('@/registry/default/examples/message-scroller-visibility')
        ),
        sourceFile: 'registry/default/examples/message-scroller-visibility.tsx',
      },
      {
        title: 'Reading scroll state',
        component: lazy(
          () =>
            import('@/registry/default/examples/message-scroller-scrollable')
        ),
        sourceFile: 'registry/default/examples/message-scroller-scrollable.tsx',
      },
    ],
  },
  trace: {
    component: lazy(() => import('@/registry/default/demos/trace-demo')),
    sourceFile: 'registry/default/demos/trace-demo.tsx',
    examples: [
      {
        title: 'Trace Line',
        component: lazy(
          () => import('@/registry/default/examples/trace-static')
        ),
        sourceFile: 'registry/default/examples/trace-static.tsx',
      },
      {
        title: 'Status',
        component: lazy(
          () => import('@/registry/default/examples/trace-status')
        ),
        sourceFile: 'registry/default/examples/trace-status.tsx',
      },
      {
        title: 'Description',
        component: lazy(
          () => import('@/registry/default/examples/trace-description')
        ),
        sourceFile: 'registry/default/examples/trace-description.tsx',
      },
      {
        title: 'Block Description',
        component: lazy(
          () => import('@/registry/default/examples/trace-description-block')
        ),
        sourceFile: 'registry/default/examples/trace-description-block.tsx',
      },
      {
        title: 'Collapsible',
        component: lazy(
          () => import('@/registry/default/examples/trace-collapsible')
        ),
        sourceFile: 'registry/default/examples/trace-collapsible.tsx',
      },
      {
        title: 'Open State',
        component: lazy(() => import('@/registry/default/examples/trace-open')),
        sourceFile: 'registry/default/examples/trace-open.tsx',
      },
      {
        title: 'Link',
        component: lazy(() => import('@/registry/default/examples/trace-link')),
        sourceFile: 'registry/default/examples/trace-link.tsx',
      },
      {
        title: 'Dialog',
        component: lazy(
          () => import('@/registry/default/examples/trace-dialog')
        ),
        sourceFile: 'registry/default/examples/trace-dialog.tsx',
      },
      {
        title: 'Sheet',
        component: lazy(
          () => import('@/registry/default/examples/trace-sheet')
        ),
        sourceFile: 'registry/default/examples/trace-sheet.tsx',
      },
      {
        title: 'Group',
        component: lazy(
          () => import('@/registry/default/examples/trace-group')
        ),
        sourceFile: 'registry/default/examples/trace-group.tsx',
      },
      {
        title: 'Sources',
        component: lazy(
          () => import('@/registry/default/examples/trace-sources')
        ),
        sourceFile: 'registry/default/examples/trace-sources.tsx',
      },
      {
        title: 'Chain of Thought',
        component: lazy(
          () => import('@/registry/default/examples/trace-steps')
        ),
        sourceFile: 'registry/default/examples/trace-steps.tsx',
      },
      {
        title: 'Commit',
        component: lazy(
          () => import('@/registry/default/examples/trace-commit')
        ),
        sourceFile: 'registry/default/examples/trace-commit.tsx',
      },
      {
        title: 'Whole Turn',
        component: lazy(() => import('@/registry/default/examples/trace-turn')),
        sourceFile: 'registry/default/examples/trace-turn.tsx',
      },
      {
        title: 'Reasoning',
        component: lazy(
          () => import('@/registry/default/examples/trace-thinking')
        ),
        sourceFile: 'registry/default/examples/trace-thinking.tsx',
      },
      {
        title: 'Tool',
        component: lazy(
          () => import('@/registry/default/examples/trace-tool-calls')
        ),
        sourceFile: 'registry/default/examples/trace-tool-calls.tsx',
      },
    ],
  },
  tool: {
    component: lazy(() => import('@/registry/default/demos/tool-demo')),
    sourceFile: 'registry/default/demos/tool-demo.tsx',
    examples: [
      {
        title: 'States',
        component: lazy(
          () => import('@/registry/default/examples/tool-states')
        ),
        sourceFile: 'registry/default/examples/tool-states.tsx',
      },
      {
        title: 'Output in a Sheet',
        component: lazy(() => import('@/registry/default/examples/tool-sheet')),
        sourceFile: 'registry/default/examples/tool-sheet.tsx',
      },
      {
        title: 'Approval',
        component: lazy(
          () => import('@/registry/default/examples/tool-approval')
        ),
        sourceFile: 'registry/default/examples/tool-approval.tsx',
      },
    ],
  },
  reasoning: {
    component: lazy(() => import('@/registry/default/demos/reasoning-demo')),
    sourceFile: 'registry/default/demos/reasoning-demo.tsx',
    examples: [
      {
        title: 'Duration',
        component: lazy(
          () => import('@/registry/default/examples/reasoning-duration')
        ),
        sourceFile: 'registry/default/examples/reasoning-duration.tsx',
      },
    ],
  },
  'chain-of-thought': {
    component: lazy(
      () => import('@/registry/default/demos/chain-of-thought-demo')
    ),
    sourceFile: 'registry/default/demos/chain-of-thought-demo.tsx',
  },
  task: {
    component: lazy(() => import('@/registry/default/demos/task-demo')),
    sourceFile: 'registry/default/demos/task-demo.tsx',
  },
  subagent: {
    component: lazy(() => import('@/registry/default/demos/subagent-demo')),
    sourceFile: 'registry/default/demos/subagent-demo.tsx',
    examples: [
      {
        title: 'Running',
        component: lazy(
          () => import('@/registry/default/examples/subagent-running')
        ),
        sourceFile: 'registry/default/examples/subagent-running.tsx',
      },
      {
        title: 'Details',
        component: lazy(
          () => import('@/registry/default/examples/subagent-details')
        ),
        sourceFile: 'registry/default/examples/subagent-details.tsx',
      },
    ],
  },
  plan: {
    component: lazy(() => import('@/registry/default/demos/plan-demo')),
    sourceFile: 'registry/default/demos/plan-demo.tsx',
    examples: [
      {
        title: 'Details',
        component: lazy(
          () => import('@/registry/default/examples/plan-description')
        ),
        sourceFile: 'registry/default/examples/plan-description.tsx',
      },
    ],
  },
  'code-block': {
    component: lazy(() => import('@/registry/default/demos/code-block-demo')),
    sourceFile: 'registry/default/demos/code-block-demo.tsx',
    examples: [
      {
        title: 'Basic',
        component: lazy(
          () => import('@/registry/default/examples/code-block-basic')
        ),
        sourceFile: 'registry/default/examples/code-block-basic.tsx',
      },
      {
        title: 'Header',
        component: lazy(
          () => import('@/registry/default/examples/code-block-header')
        ),
        sourceFile: 'registry/default/examples/code-block-header.tsx',
      },
      {
        title: 'Actions',
        component: lazy(
          () => import('@/registry/default/examples/code-block-actions')
        ),
        sourceFile: 'registry/default/examples/code-block-actions.tsx',
      },
      {
        title: 'Floating actions',
        component: lazy(
          () =>
            import('@/registry/default/examples/code-block-floating-actions')
        ),
        sourceFile: 'registry/default/examples/code-block-floating-actions.tsx',
      },
      {
        title: 'Line numbers',
        component: lazy(
          () => import('@/registry/default/examples/code-block-line-numbers')
        ),
        sourceFile: 'registry/default/examples/code-block-line-numbers.tsx',
      },
      {
        title: 'Start line',
        component: lazy(
          () => import('@/registry/default/examples/code-block-start-line')
        ),
        sourceFile: 'registry/default/examples/code-block-start-line.tsx',
      },
      {
        title: 'Wrap',
        component: lazy(
          () => import('@/registry/default/examples/code-block-wrap')
        ),
        sourceFile: 'registry/default/examples/code-block-wrap.tsx',
      },
      {
        title: 'Highlighted lines',
        component: lazy(
          () =>
            import('@/registry/default/examples/code-block-highlighted-lines')
        ),
        sourceFile:
          'registry/default/examples/code-block-highlighted-lines.tsx',
      },
      {
        title: 'Diff',
        component: lazy(
          () => import('@/registry/default/examples/code-block-diff')
        ),
        sourceFile: 'registry/default/examples/code-block-diff.tsx',
      },
      {
        title: 'Height',
        component: lazy(
          () => import('@/registry/default/examples/code-block-height')
        ),
        sourceFile: 'registry/default/examples/code-block-height.tsx',
      },
      {
        title: 'Show more',
        component: lazy(
          () => import('@/registry/default/examples/code-block-show-more')
        ),
        sourceFile: 'registry/default/examples/code-block-show-more.tsx',
      },
      {
        title: 'Show more with a maximum height',
        component: lazy(
          () =>
            import('@/registry/default/examples/code-block-show-more-scroll')
        ),
        sourceFile: 'registry/default/examples/code-block-show-more-scroll.tsx',
      },
      {
        title: 'Size',
        component: lazy(
          () => import('@/registry/default/examples/code-block-size')
        ),
        sourceFile: 'registry/default/examples/code-block-size.tsx',
      },
      {
        title: 'Destructive',
        component: lazy(
          () => import('@/registry/default/examples/code-block-destructive')
        ),
        sourceFile: 'registry/default/examples/code-block-destructive.tsx',
      },
      {
        title: 'Trace',
        component: lazy(
          () => import('@/registry/default/examples/code-block-trace')
        ),
        sourceFile: 'registry/default/examples/code-block-trace.tsx',
      },
      {
        title: 'Tabs',
        component: lazy(
          () => import('@/registry/default/examples/code-block-tabs')
        ),
        sourceFile: 'registry/default/examples/code-block-tabs.tsx',
      },
      {
        title: 'Message',
        component: lazy(
          () => import('@/registry/default/examples/code-block-chat')
        ),
        sourceFile: 'registry/default/examples/code-block-chat.tsx',
      },
      {
        title: 'Typeset',
        component: lazy(
          () => import('@/registry/default/examples/code-block-typeset')
        ),
        sourceFile: 'registry/default/examples/code-block-typeset.tsx',
      },
      {
        title: 'RTL',
        component: lazy(
          () => import('@/registry/default/examples/code-block-rtl')
        ),
        sourceFile: 'registry/default/examples/code-block-rtl.tsx',
      },
      {
        title: 'Syntax highlighting',
        component: lazy(
          () => import('@/registry/default/examples/code-block-highlighting')
        ),
        sourceFile: 'registry/default/examples/code-block-highlighting.tsx',
      },
      {
        title: 'Languages',
        component: lazy(
          () => import('@/registry/default/examples/code-block-languages')
        ),
        sourceFile: 'registry/default/examples/code-block-languages.tsx',
      },
      {
        title: 'Terminal output',
        component: lazy(
          () => import('@/registry/default/examples/code-block-ansi')
        ),
        sourceFile: 'registry/default/examples/code-block-ansi.tsx',
      },
      {
        title: 'Streaming',
        component: lazy(
          () => import('@/registry/default/examples/code-block-streaming')
        ),
        sourceFile: 'registry/default/examples/code-block-streaming.tsx',
      },
      {
        title: 'Markdown',
        component: lazy(
          () => import('@/registry/default/examples/code-block-markdown')
        ),
        sourceFile: 'registry/default/examples/code-block-markdown.tsx',
      },
    ],
  },
  terminal: {
    component: lazy(() => import('@/registry/default/demos/terminal-demo')),
    sourceFile: 'registry/default/demos/terminal-demo.tsx',
    examples: [
      {
        title: 'Exit code',
        component: lazy(
          () => import('@/registry/default/examples/terminal-error')
        ),
        sourceFile: 'registry/default/examples/terminal-error.tsx',
      },
    ],
  },
  'stack-trace': {
    component: lazy(() => import('@/registry/default/demos/stack-trace-demo')),
    sourceFile: 'registry/default/demos/stack-trace-demo.tsx',
    examples: [
      {
        title: 'Frame links',
        component: lazy(
          () => import('@/registry/default/examples/stack-trace-frames')
        ),
        sourceFile: 'registry/default/examples/stack-trace-frames.tsx',
      },
    ],
  },
  'test-results': {
    component: lazy(() => import('@/registry/default/demos/test-results-demo')),
    sourceFile: 'registry/default/demos/test-results-demo.tsx',
    examples: [
      {
        title: 'Suites',
        component: lazy(
          () => import('@/registry/default/examples/test-results-suites')
        ),
        sourceFile: 'registry/default/examples/test-results-suites.tsx',
      },
    ],
  },
  questionnaire: {
    component: lazy(
      () => import('@/registry/default/demos/questionnaire-demo')
    ),
    sourceFile: 'registry/default/demos/questionnaire-demo.tsx',
    examples: [
      {
        title: 'Multiple selection',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-multiple')
        ),
        sourceFile: 'registry/default/examples/questionnaire-multiple.tsx',
      },
      {
        title: 'Freeform answer',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-freeform')
        ),
        sourceFile: 'registry/default/examples/questionnaire-freeform.tsx',
      },
      {
        title: 'Explicit skip',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-skip')
        ),
        sourceFile: 'registry/default/examples/questionnaire-skip.tsx',
      },
      {
        title: 'Shortcuts',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-shortcuts')
        ),
        sourceFile: 'registry/default/examples/questionnaire-shortcuts.tsx',
      },
      {
        title: 'Custom validation',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-validation')
        ),
        sourceFile: 'registry/default/examples/questionnaire-validation.tsx',
      },
      {
        title: 'Controlled',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-controlled')
        ),
        sourceFile: 'registry/default/examples/questionnaire-controlled.tsx',
      },
      {
        title: 'Resume',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-resume')
        ),
        sourceFile: 'registry/default/examples/questionnaire-resume.tsx',
      },
      {
        title: 'Conditional items',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-conditional')
        ),
        sourceFile: 'registry/default/examples/questionnaire-conditional.tsx',
      },
      {
        title: 'Navigation state',
        component: lazy(
          () =>
            import('@/registry/default/examples/questionnaire-navigation-state')
        ),
        sourceFile:
          'registry/default/examples/questionnaire-navigation-state.tsx',
      },
      {
        title: 'Custom progress',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-progress')
        ),
        sourceFile: 'registry/default/examples/questionnaire-progress.tsx',
      },
      {
        title: 'Animated items',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-animated')
        ),
        sourceFile: 'registry/default/examples/questionnaire-animated.tsx',
      },
      {
        title: 'Card',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-card')
        ),
        sourceFile: 'registry/default/examples/questionnaire-card.tsx',
      },
      {
        title: 'Dialog',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-dialog')
        ),
        sourceFile: 'registry/default/examples/questionnaire-dialog.tsx',
      },
      {
        title: 'Disabled choice',
        component: lazy(
          () => import('@/registry/default/examples/questionnaire-disabled')
        ),
        sourceFile: 'registry/default/examples/questionnaire-disabled.tsx',
      },
      {
        title: 'No description',
        component: lazy(
          () =>
            import('@/registry/default/examples/questionnaire-no-description')
        ),
        sourceFile:
          'registry/default/examples/questionnaire-no-description.tsx',
      },
    ],
  },
  confirmation: {
    component: lazy(() => import('@/registry/default/demos/confirmation-demo')),
    sourceFile: 'registry/default/demos/confirmation-demo.tsx',
  },
  checkpoint: {
    component: lazy(() => import('@/registry/default/demos/checkpoint-demo')),
    sourceFile: 'registry/default/demos/checkpoint-demo.tsx',
  },
  suggestion: {
    component: lazy(() => import('@/registry/default/demos/suggestion-demo')),
    sourceFile: 'registry/default/demos/suggestion-demo.tsx',
  },
  queue: {
    component: lazy(() => import('@/registry/default/demos/queue-demo')),
    sourceFile: 'registry/default/demos/queue-demo.tsx',
    examples: [
      {
        title: 'Descriptions',
        component: lazy(
          () => import('@/registry/default/examples/queue-descriptions')
        ),
        sourceFile: 'registry/default/examples/queue-descriptions.tsx',
      },
    ],
  },
  context: {
    component: lazy(() => import('@/registry/default/demos/context-demo')),
    sourceFile: 'registry/default/demos/context-demo.tsx',
  },
  chat: {
    component: lazy(() => import('@/registry/default/demos/chat-demo')),
    sourceFile: 'registry/default/demos/chat-demo.tsx',
    examples: [
      {
        title: 'Edit mode',
        component: lazy(
          () => import('@/registry/default/examples/chat-edit-mode')
        ),
        sourceFile: 'registry/default/examples/chat-edit-mode.tsx',
      },
      {
        title: 'Files',
        component: lazy(() => import('@/registry/default/examples/chat-files')),
        sourceFile: 'registry/default/examples/chat-files.tsx',
      },
    ],
  },
  'prompt-input': {
    component: lazy(() => import('@/registry/default/demos/prompt-input-demo')),
    sourceFile: 'registry/default/demos/prompt-input-demo.tsx',
  },
  sources: {
    component: lazy(() => import('@/registry/default/demos/sources-demo')),
    sourceFile: 'registry/default/demos/sources-demo.tsx',
    examples: [
      {
        title: 'Basic',
        component: lazy(
          () => import('@/registry/default/examples/sources-basic')
        ),
        sourceFile: 'registry/default/examples/sources-basic.tsx',
      },
    ],
  },
  'inline-citation': {
    component: lazy(
      () => import('@/registry/default/demos/inline-citation-demo')
    ),
    sourceFile: 'registry/default/demos/inline-citation-demo.tsx',
  },
  'model-selector': {
    component: lazy(
      () => import('@/registry/default/demos/model-selector-demo')
    ),
    sourceFile: 'registry/default/demos/model-selector-demo.tsx',
  },
  'file-tree': {
    component: lazy(() => import('@/registry/default/demos/file-tree-demo')),
    sourceFile: 'registry/default/demos/file-tree-demo.tsx',
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
        title: 'Outline Dashed',
        component: lazy(
          () => import('@/registry/default/examples/button-outline-dashed')
        ),
        sourceFile: 'registry/default/examples/button-outline-dashed.tsx',
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
      {
        title: 'With Time',
        component: lazy(
          () => import('@/registry/default/examples/calendar-with-time')
        ),
        sourceFile: 'registry/default/examples/calendar-with-time.tsx',
      },
      {
        title: 'Range With Time',
        component: lazy(
          () => import('@/registry/default/examples/calendar-range-with-time')
        ),
        sourceFile: 'registry/default/examples/calendar-range-with-time.tsx',
      },
      {
        title: 'Range With Presets',
        component: lazy(
          () => import('@/registry/default/examples/calendar-range-presets')
        ),
        sourceFile: 'registry/default/examples/calendar-range-presets.tsx',
      },
      {
        title: 'Date Picker With Time',
        component: lazy(
          () =>
            import('@/registry/default/examples/calendar-date-picker-with-time')
        ),
        sourceFile:
          'registry/default/examples/calendar-date-picker-with-time.tsx',
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
  'context-icon': {
    component: lazy(() => import('@/registry/default/demos/context-icon-demo')),
    sourceFile: 'registry/default/demos/context-icon-demo.tsx',
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
      {
        title: 'Mono Font',
        component: lazy(
          () => import('@/registry/default/examples/input-font-mono')
        ),
        sourceFile: 'registry/default/examples/input-font-mono.tsx',
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
            import('@/registry/default/examples/radio-group-stacked-with-action')
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
  'scroll-fade': {
    component: lazy(() => import('@/registry/default/demos/scroll-fade-demo')),
    sourceFile: 'registry/default/demos/scroll-fade-demo.tsx',
    examples: [
      {
        title: 'No overflow',
        component: lazy(
          () => import('@/registry/default/examples/scroll-fade-overflow')
        ),
        sourceFile: 'registry/default/examples/scroll-fade-overflow.tsx',
      },
      {
        title: 'Horizontal',
        component: lazy(
          () => import('@/registry/default/examples/scroll-fade-horizontal')
        ),
        sourceFile: 'registry/default/examples/scroll-fade-horizontal.tsx',
      },
      {
        title: 'Edge fades',
        component: lazy(
          () => import('@/registry/default/examples/scroll-fade-edge')
        ),
        sourceFile: 'registry/default/examples/scroll-fade-edge.tsx',
      },
      {
        title: 'Fade size',
        component: lazy(
          () => import('@/registry/default/examples/scroll-fade-size')
        ),
        sourceFile: 'registry/default/examples/scroll-fade-size.tsx',
      },
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/scroll-fade-none')
        ),
        sourceFile: 'registry/default/examples/scroll-fade-none.tsx',
      },
      {
        title: 'RTL',
        component: lazy(
          () => import('@/registry/default/examples/scroll-fade-rtl')
        ),
        sourceFile: 'registry/default/examples/scroll-fade-rtl.tsx',
      },
    ],
  },
  shimmer: {
    component: lazy(() => import('@/registry/default/demos/shimmer-demo')),
    sourceFile: 'registry/default/demos/shimmer-demo.tsx',
    examples: [
      {
        title: 'Color',
        component: lazy(
          () => import('@/registry/default/examples/shimmer-color')
        ),
        sourceFile: 'registry/default/examples/shimmer-color.tsx',
      },
      {
        title: 'Duration',
        component: lazy(
          () => import('@/registry/default/examples/shimmer-duration')
        ),
        sourceFile: 'registry/default/examples/shimmer-duration.tsx',
      },
      {
        title: 'Spread',
        component: lazy(
          () => import('@/registry/default/examples/shimmer-spread')
        ),
        sourceFile: 'registry/default/examples/shimmer-spread.tsx',
      },
      {
        title: 'Angle',
        component: lazy(
          () => import('@/registry/default/examples/shimmer-angle')
        ),
        sourceFile: 'registry/default/examples/shimmer-angle.tsx',
      },
      {
        title: 'Play once',
        component: lazy(
          () => import('@/registry/default/examples/shimmer-once')
        ),
        sourceFile: 'registry/default/examples/shimmer-once.tsx',
      },
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/shimmer-none')
        ),
        sourceFile: 'registry/default/examples/shimmer-none.tsx',
      },
      {
        title: 'RTL',
        component: lazy(
          () => import('@/registry/default/examples/shimmer-rtl')
        ),
        sourceFile: 'registry/default/examples/shimmer-rtl.tsx',
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
    examples: [
      {
        title: 'Line',
        component: lazy(() => import('@/registry/default/examples/tabs-line')),
        sourceFile: 'registry/default/examples/tabs-line.tsx',
      },
      {
        title: 'Vertical',
        component: lazy(
          () => import('@/registry/default/examples/tabs-vertical')
        ),
        sourceFile: 'registry/default/examples/tabs-vertical.tsx',
      },
    ],
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
    examples: [
      {
        title: 'Side',
        component: lazy(
          () => import('@/registry/default/examples/tooltip-side')
        ),
        sourceFile: 'registry/default/examples/tooltip-side.tsx',
      },
      {
        title: 'Icon Button',
        component: lazy(
          () => import('@/registry/default/examples/tooltip-icon-button')
        ),
        sourceFile: 'registry/default/examples/tooltip-icon-button.tsx',
      },
      {
        title: 'Disabled Button',
        component: lazy(
          () => import('@/registry/default/examples/tooltip-disabled-button')
        ),
        sourceFile: 'registry/default/examples/tooltip-disabled-button.tsx',
      },
    ],
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
      {
        title: 'Pinned and expanded',
        component: lazy(
          () => import('@/registry/default/examples/data-table-pinned-expanded')
        ),
        sourceFile: 'registry/default/examples/data-table-pinned-expanded.tsx',
      },
      {
        title: 'Cell selection',
        component: lazy(
          () => import('@/registry/default/examples/data-table-cell-selection')
        ),
        sourceFile: 'registry/default/examples/data-table-cell-selection.tsx',
      },
      {
        title: 'Row selection',
        component: lazy(
          () => import('@/registry/default/examples/data-table-row-selection')
        ),
        sourceFile: 'registry/default/examples/data-table-row-selection.tsx',
      },
      {
        title: 'External controls',
        component: lazy(
          () =>
            import('@/registry/default/examples/data-table-external-controls')
        ),
        sourceFile:
          'registry/default/examples/data-table-external-controls.tsx',
      },
      {
        title: 'Cursor pager',
        component: lazy(
          () => import('@/registry/default/examples/data-table-cursor-pager')
        ),
        sourceFile: 'registry/default/examples/data-table-cursor-pager.tsx',
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
    examples: [
      {
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/page-header-sizes')
        ),
        sourceFile: 'registry/default/examples/page-header-sizes.tsx',
      },
    ],
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
    examples: [
      {
        title: 'Colors',
        component: lazy(
          () => import('@/registry/default/examples/formance-icon-colors')
        ),
        sourceFile: 'registry/default/examples/formance-icon-colors.tsx',
      },
    ],
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
    examples: [
      {
        title: 'Colors',
        component: lazy(
          () => import('@/registry/default/examples/badge-eyebrow-colors')
        ),
        sourceFile: 'registry/default/examples/badge-eyebrow-colors.tsx',
      },
      {
        title: 'Prefix & Suffix',
        component: lazy(
          () => import('@/registry/default/examples/badge-eyebrow-sizes')
        ),
        sourceFile: 'registry/default/examples/badge-eyebrow-sizes.tsx',
      },
    ],
  },
  'badge-status': {
    component: lazy(() => import('@/registry/default/demos/badge-status-demo')),
    sourceFile: 'registry/default/demos/badge-status-demo.tsx',
    examples: [
      {
        title: 'Variants',
        component: lazy(
          () => import('@/registry/default/examples/badge-status-variants')
        ),
        sourceFile: 'registry/default/examples/badge-status-variants.tsx',
      },
      {
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/badge-status-sizes')
        ),
        sourceFile: 'registry/default/examples/badge-status-sizes.tsx',
      },
    ],
  },
  endpoint: {
    component: lazy(() => import('@/registry/default/demos/endpoint-demo')),
    sourceFile: 'registry/default/demos/endpoint-demo.tsx',
    examples: [
      {
        title: 'API Routes',
        component: lazy(
          () => import('@/registry/default/examples/endpoint-list')
        ),
        sourceFile: 'registry/default/examples/endpoint-list.tsx',
      },
      {
        title: 'States',
        component: lazy(
          () => import('@/registry/default/examples/endpoint-states')
        ),
        sourceFile: 'registry/default/examples/endpoint-states.tsx',
      },
    ],
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
  'copy-button': {
    component: lazy(() => import('@/registry/default/demos/copy-button-demo')),
    sourceFile: 'registry/default/demos/copy-button-demo.tsx',
    examples: [
      {
        title: 'With label',
        component: lazy(
          () => import('@/registry/default/examples/copy-button-with-label')
        ),
        sourceFile: 'registry/default/examples/copy-button-with-label.tsx',
      },
      {
        title: 'In a header row',
        component: lazy(
          () => import('@/registry/default/examples/copy-button-in-header')
        ),
        sourceFile: 'registry/default/examples/copy-button-in-header.tsx',
      },
    ],
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
    examples: [
      {
        title: 'Sections and groups',
        component: lazy(
          () =>
            import('@/registry/default/examples/sidebar-sections-and-groups')
        ),
        sourceFile: 'registry/default/examples/sidebar-sections-and-groups.tsx',
      },
      {
        title: 'Sections only',
        component: lazy(
          () => import('@/registry/default/examples/sidebar-sections-only')
        ),
        sourceFile: 'registry/default/examples/sidebar-sections-only.tsx',
      },
      {
        title: 'Groups only',
        component: lazy(
          () => import('@/registry/default/examples/sidebar-groups-only')
        ),
        sourceFile: 'registry/default/examples/sidebar-groups-only.tsx',
      },
      {
        title: 'Nested items',
        component: lazy(
          () => import('@/registry/default/examples/sidebar-nested-items')
        ),
        sourceFile: 'registry/default/examples/sidebar-nested-items.tsx',
      },
      {
        title: 'Badges and actions',
        component: lazy(
          () => import('@/registry/default/examples/sidebar-menu-actions')
        ),
        sourceFile: 'registry/default/examples/sidebar-menu-actions.tsx',
      },
      {
        title: 'Loading',
        component: lazy(
          () => import('@/registry/default/examples/sidebar-loading')
        ),
        sourceFile: 'registry/default/examples/sidebar-loading.tsx',
      },
      {
        title: 'Drill-in pane',
        component: lazy(
          () => import('@/registry/default/examples/sidebar-drill-in')
        ),
        sourceFile: 'registry/default/examples/sidebar-drill-in.tsx',
      },
      {
        title: 'Icon rail',
        component: lazy(
          () => import('@/registry/default/examples/sidebar-icon-rail')
        ),
        sourceFile: 'registry/default/examples/sidebar-icon-rail.tsx',
      },
    ],
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
  'api-snippet': {
    component: lazy(() => import('@/registry/default/demos/api-snippet-demo')),
    sourceFile: 'registry/default/demos/api-snippet-demo.tsx',
    examples: [
      {
        title: 'GET request',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-get')
        ),
        sourceFile: 'registry/default/examples/api-snippet-get.tsx',
      },
      {
        title: 'Without fctl tab',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-no-fctl')
        ),
        sourceFile: 'registry/default/examples/api-snippet-no-fctl.tsx',
      },
      {
        title: 'Custom tabs',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-tabs')
        ),
        sourceFile: 'registry/default/examples/api-snippet-tabs.tsx',
      },
      {
        title: 'Stack API',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-stack')
        ),
        sourceFile: 'registry/default/examples/api-snippet-stack.tsx',
      },
      {
        title: 'Membership API',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-membership')
        ),
        sourceFile: 'registry/default/examples/api-snippet-membership.tsx',
      },
      {
        title: 'fctl only',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-fctl-only')
        ),
        sourceFile: 'registry/default/examples/api-snippet-fctl-only.tsx',
      },
      {
        title: 'SDK as default tab',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-sdk-default')
        ),
        sourceFile: 'registry/default/examples/api-snippet-sdk-default.tsx',
      },
      {
        title: 'Clipped code height',
        component: lazy(
          () =>
            import('@/registry/default/examples/api-snippet-clip-code-height')
        ),
        sourceFile:
          'registry/default/examples/api-snippet-clip-code-height.tsx',
      },
      {
        title: 'Method and path',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-method-path')
        ),
        sourceFile: 'registry/default/examples/api-snippet-method-path.tsx',
      },
      {
        title: 'Body from a file',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-body-file')
        ),
        sourceFile: 'registry/default/examples/api-snippet-body-file.tsx',
      },
      {
        title: 'Raw args',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-raw-args')
        ),
        sourceFile: 'registry/default/examples/api-snippet-raw-args.tsx',
      },
      {
        title: 'Controlled tabs',
        component: lazy(
          () => import('@/registry/default/examples/api-snippet-controlled')
        ),
        sourceFile: 'registry/default/examples/api-snippet-controlled.tsx',
      },
    ],
  },
  markdown: {
    component: lazy(() => import('@/registry/default/demos/markdown-demo')),
    sourceFile: 'registry/default/demos/markdown-demo.tsx',
    examples: [
      {
        title: 'GitHub Flavored Markdown',
        component: lazy(
          () => import('@/registry/default/examples/markdown-gfm')
        ),
        sourceFile: 'registry/default/examples/markdown-gfm.tsx',
      },
      {
        title: 'Code blocks',
        component: lazy(
          () => import('@/registry/default/examples/markdown-code')
        ),
        sourceFile: 'registry/default/examples/markdown-code.tsx',
      },
      {
        title: 'Extending the component map',
        component: lazy(
          () => import('@/registry/default/examples/markdown-extend')
        ),
        sourceFile: 'registry/default/examples/markdown-extend.tsx',
      },
      {
        title: 'Math (KaTeX)',
        component: lazy(
          () => import('@/registry/default/examples/markdown-math')
        ),
        sourceFile: 'registry/default/examples/markdown-math.tsx',
      },
      {
        title: 'Mermaid diagrams',
        component: lazy(
          () => import('@/registry/default/examples/markdown-mermaid')
        ),
        sourceFile: 'registry/default/examples/markdown-mermaid.tsx',
      },
    ],
  },
  'ledger-schema-editor': {
    component: lazy(
      () => import('@/registry/default/demos/ledger-schema-editor-demo')
    ),
    sourceFile: 'registry/default/demos/ledger-schema-editor-demo.tsx',
  },
  'ledger-schema': {
    component: lazy(
      () => import('@/registry/default/demos/ledger-schema-demo')
    ),
    sourceFile: 'registry/default/demos/ledger-schema-demo.tsx',
    examples: [
      {
        title: 'Chart only',
        component: lazy(
          () => import('@/registry/default/examples/ledger-schema-chart')
        ),
        sourceFile: 'registry/default/examples/ledger-schema-chart.tsx',
      },
      {
        title: 'Chart with legend',
        component: lazy(
          () => import('@/registry/default/examples/ledger-schema-chart-legend')
        ),
        sourceFile: 'registry/default/examples/ledger-schema-chart-legend.tsx',
      },
      {
        title: 'Transactions',
        component: lazy(
          () => import('@/registry/default/examples/ledger-schema-transactions')
        ),
        sourceFile: 'registry/default/examples/ledger-schema-transactions.tsx',
      },
      {
        title: 'Single transaction',
        component: lazy(
          () => import('@/registry/default/examples/ledger-schema-transaction')
        ),
        sourceFile: 'registry/default/examples/ledger-schema-transaction.tsx',
      },
      {
        title: 'Queries',
        component: lazy(
          () => import('@/registry/default/examples/ledger-schema-queries')
        ),
        sourceFile: 'registry/default/examples/ledger-schema-queries.tsx',
      },
      {
        title: 'Single query',
        component: lazy(
          () => import('@/registry/default/examples/ledger-schema-query')
        ),
        sourceFile: 'registry/default/examples/ledger-schema-query.tsx',
      },
    ],
  },
  'app-card': {
    component: lazy(() => import('@/registry/default/demos/app-card-demo')),
    sourceFile: 'registry/default/demos/app-card-demo.tsx',
    examples: [
      {
        title: 'With Footer',
        component: lazy(
          () => import('@/registry/default/examples/app-card-with-footer')
        ),
        sourceFile: 'registry/default/examples/app-card-with-footer.tsx',
      },
      {
        title: 'With Empty State',
        component: lazy(
          () => import('@/registry/default/examples/app-card-with-empty')
        ),
        sourceFile: 'registry/default/examples/app-card-with-empty.tsx',
      },
      {
        title: 'With Data Table',
        component: lazy(
          () => import('@/registry/default/examples/app-card-with-data-table')
        ),
        sourceFile: 'registry/default/examples/app-card-with-data-table.tsx',
      },
    ],
  },
  'copy-page': {
    component: lazy(() => import('@/registry/default/demos/copy-page-demo')),
    sourceFile: 'registry/default/demos/copy-page-demo.tsx',
    examples: [
      {
        title: 'Custom label',
        component: lazy(
          () => import('@/registry/default/examples/copy-page-custom-label')
        ),
        sourceFile: 'registry/default/examples/copy-page-custom-label.tsx',
      },
      {
        title: 'Custom AI prompt',
        component: lazy(
          () => import('@/registry/default/examples/copy-page-custom-prompt')
        ),
        sourceFile: 'registry/default/examples/copy-page-custom-prompt.tsx',
      },
      {
        title: 'Custom Markdown URL',
        component: lazy(
          () => import('@/registry/default/examples/copy-page-custom-markdown')
        ),
        sourceFile: 'registry/default/examples/copy-page-custom-markdown.tsx',
      },
    ],
  },
  'app-card-empty': {
    component: lazy(
      () => import('@/registry/default/demos/app-card-empty-demo')
    ),
    sourceFile: 'registry/default/demos/app-card-empty-demo.tsx',
    examples: [
      {
        title: 'Default',
        component: lazy(
          () => import('@/registry/default/examples/app-card-empty-default')
        ),
        sourceFile: 'registry/default/examples/app-card-empty-default.tsx',
      },
      {
        title: 'With Actions',
        component: lazy(
          () =>
            import('@/registry/default/examples/app-card-empty-with-actions')
        ),
        sourceFile: 'registry/default/examples/app-card-empty-with-actions.tsx',
      },
      {
        title: 'Inside an App Card',
        component: lazy(
          () => import('@/registry/default/examples/app-card-empty-nested')
        ),
        sourceFile: 'registry/default/examples/app-card-empty-nested.tsx',
      },
    ],
  },
  'sso-button': {
    component: lazy(() => import('@/registry/default/demos/sso-button-demo')),
    sourceFile: 'registry/default/demos/sso-button-demo.tsx',
    examples: [
      {
        title: 'Providers',
        component: lazy(
          () => import('@/registry/default/examples/sso-button-single')
        ),
        sourceFile: 'registry/default/examples/sso-button-single.tsx',
      },
      {
        title: 'Custom labels',
        component: lazy(
          () => import('@/registry/default/examples/sso-button-labels')
        ),
        sourceFile: 'registry/default/examples/sso-button-labels.tsx',
      },
      {
        title: 'Loading and disabled',
        component: lazy(
          () => import('@/registry/default/examples/sso-button-states')
        ),
        sourceFile: 'registry/default/examples/sso-button-states.tsx',
      },
      {
        title: 'Login form',
        component: lazy(
          () => import('@/registry/default/examples/sso-button-login-form')
        ),
        sourceFile: 'registry/default/examples/sso-button-login-form.tsx',
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
        title: 'Sizes',
        component: lazy(
          () => import('@/registry/default/examples/key-value-input-sizes')
        ),
        sourceFile: 'registry/default/examples/key-value-input-sizes.tsx',
      },
      {
        title: 'Disabled',
        component: lazy(
          () => import('@/registry/default/examples/key-value-input-disabled')
        ),
        sourceFile: 'registry/default/examples/key-value-input-disabled.tsx',
      },
      {
        title: 'Not Sortable',
        component: lazy(
          () =>
            import('@/registry/default/examples/key-value-input-not-sortable')
        ),
        sourceFile:
          'registry/default/examples/key-value-input-not-sortable.tsx',
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
    component: lazy(() => import('@/registry/default/demos/code-snippet-demo')),
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
        title: 'Numscript playground',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-playground')
        ),
        sourceFile: 'registry/default/examples/code-snippet-playground.tsx',
      },
      {
        title: 'Dark Theme',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-dark')
        ),
        sourceFile: 'registry/default/examples/code-snippet-dark.tsx',
      },
      {
        title: 'Light Theme',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-light')
        ),
        sourceFile: 'registry/default/examples/code-snippet-light.tsx',
      },
      {
        title: 'fctl Commands',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-fctl')
        ),
        sourceFile: 'registry/default/examples/code-snippet-fctl.tsx',
      },
      {
        title: 'Borderless',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-borderless')
        ),
        sourceFile: 'registry/default/examples/code-snippet-borderless.tsx',
      },
      {
        title: 'Single Line',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-single-line')
        ),
        sourceFile: 'registry/default/examples/code-snippet-single-line.tsx',
      },
      {
        title: 'Header bar',
        component: lazy(
          () => import('@/registry/default/examples/code-snippet-header')
        ),
        sourceFile: 'registry/default/examples/code-snippet-header.tsx',
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
    component: lazy(() => import('@/registry/default/demos/code-editor-demo')),
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
      {
        title: 'Numscript Validator',
        component: lazy(
          () => import('@/registry/default/examples/code-editor-validator')
        ),
        sourceFile: 'registry/default/examples/code-editor-validator.tsx',
      },
      {
        title: 'Ledger Schema Validator',
        component: lazy(
          () => import('@/registry/default/examples/code-editor-ledger-schema')
        ),
        sourceFile: 'registry/default/examples/code-editor-ledger-schema.tsx',
      },
      {
        title: 'Navigator',
        component: lazy(
          () => import('@/registry/default/examples/code-editor-navigator')
        ),
        sourceFile: 'registry/default/examples/code-editor-navigator.tsx',
      },
    ],
  },
};
