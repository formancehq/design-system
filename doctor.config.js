/**
 * React Doctor configuration.
 *
 * This is the counterpart of `platform-ui/doctor.config.js`. The registry
 * components are synced verbatim between the two repositories, so the same
 * source produces the same findings in both — and a suppression that is honest
 * there is honest here. The only difference is the path: what platform-ui sees
 * at `packages/ui/src/components/x.tsx`, this repo holds at
 * `registry/default/ui/x.tsx`. Keep the two files in step; a rule silenced on
 * one side and reported on the other just moves the noise.
 *
 * Two mechanisms, and they are not interchangeable:
 *
 * - `ignore.overrides` is rule-scoped but only filters *lint* diagnostics.
 * - `ignore.files` drops a path from the scan entirely, and is the only thing
 *   that suppresses the dead-code family (`unused-file`, `unused-export`,
 *   `unused-dependency`), which is computed outside the lint pipeline.
 */
export default {
  rules: {
    // Every `cva` variant recipe lives beside the component it styles
    // (`buttonVariants` next to `Button`, and so on) — the upstream shadcn/ui
    // layout this registry is built on. Splitting each recipe into its own
    // module to satisfy Fast Refresh would fork ~40 components away from
    // upstream for a dev-only ergonomic win.
    'react-doctor/only-export-components': 'off',

    // A registry is a published surface: every component is exported for
    // consumers that live in other repositories, so the dead-code pass — which
    // can only see this repo — reads the public API as unused. `Stepper`,
    // `Typography` and `DescriptionList` each export parts that platform-ui and
    // the docs site do compose. Turning this on here would mean deleting the
    // library to satisfy the tool.
    'deslop/unused-export': 'off',
    'deslop/unused-file': 'off',
  },
  ignore: {
    overrides: [
      {
        // `ui-fragments` are the composed, opinionated components — the layer
        // where callbacks hand data upward and where the app is expected to
        // wrap rather than edit. Each rule below is a real finding whose fix is
        // a breaking API change to a published component, so it is recorded
        // here rather than left on the board, and this list matches the
        // `ui-fragments` block in platform-ui one for one.
        files: ['registry/default/ui-fragments/**', '**/ui-fragments/**'],
        rules: [
          'react-doctor/click-events-have-key-events',
          'react-doctor/context-provider-value-from-unmemoized-local-literal',
          'react-doctor/control-has-associated-label',
          'react-doctor/interactive-supports-focus',
          'react-doctor/js-combine-iterations',
          'react-doctor/jsx-no-constructed-context-values',
          'react-doctor/no-array-index-as-key',
          'react-doctor/no-eager-new-in-use-state-initializer',
          'react-doctor/no-pass-data-to-parent',
          'react-doctor/no-pass-live-state-to-parent',
          'react-doctor/no-prop-callback-in-effect',
          'react-doctor/no-unknown-property',
          'react-doctor/nextjs-no-img-element',
          'react-doctor/prefer-use-effect-event',
        ],
      },

      {
        // Lists whose items carry no id of their own, so the position is the
        // only thing that separates two identical siblings. Both already use a
        // composite key, because the text alone repeats: one recharts series
        // can appear twice under a shared `nameKey`, and two validators can
        // reject a field with the same sentence. Deleting this block needs an
        // id on the payload, which is recharts' shape, and on `FieldError`,
        // which is React Hook Form's.
        files: [
          'registry/default/ui/chart.tsx',
          '**/ui/chart.tsx',
          'registry/default/ui/field.tsx',
          '**/ui/field.tsx',
        ],
        rules: ['react-doctor/no-array-index-as-key'],
      },

      {
        // `ItemGroup` keeps `role="list"` on a `div` deliberately: `Item` and
        // `ItemSeparator` both render divs, a `ul` may only contain `li`, and
        // browsers drop the list semantics of invalid markup — so the real tag
        // the rule asks for would lose the very thing it is asking for. `Item`
        // is also used standalone, where an `li` would be wrong outright.
        files: ['registry/default/ui/item.tsx', '**/ui/item.tsx'],
        rules: ['react-doctor/prefer-tag-over-role'],
      },

      {
        // Boolean prop combinations (the editor and snippet toggles). Real
        // advice — these are the props most likely to combine into untested
        // states — but collapsing them into a single `mode` union is a breaking
        // change to a published component, made on its own and released.
        files: [
          'registry/default/ui/code/code-editor.tsx',
          '**/ui/code/code-editor.tsx',
          'registry/default/ui/code/code-snippet.tsx',
          '**/ui/code/code-snippet.tsx',
        ],
        rules: ['react-doctor/no-many-boolean-props'],
      },

      {
        // `recharts` is imported as a namespace for both its types and its
        // values, so it cannot be lazily imported without splitting `chart.tsx`
        // into a type-only surface plus a lazy value surface. Worth doing once
        // the bundle win is measured — and it needs an SSR check, since
        // consumers render this on the server.
        files: ['registry/default/ui/chart.tsx', '**/ui/chart.tsx'],
        rules: ['react-doctor/prefer-dynamic-import'],
      },

      {
        // `Calendar` formats month and weekday names during render, which is
        // what a date picker is: the locale is the browser's, and deferring it
        // to an effect would render an empty grid first and shift it after
        // hydration. Deleting this block means taking a locale prop, which is
        // an API change for every consumer.
        files: ['registry/default/ui/calendar.tsx', '**/ui/calendar.tsx'],
        rules: ['react-doctor/no-locale-format-in-render'],
      },
    ],
  },
};
