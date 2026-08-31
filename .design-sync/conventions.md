# Formance Design System — how to build with it

## Setup: no provider needed

Components read nothing from React context at the top level. Everything visual comes from
CSS custom properties on `:root`, so a plain tree works:

```jsx
import { Button, Card, CardHeader, CardTitle } from '@formance/design-system';

<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Create Ledger</CardTitle>
  </CardHeader>
</Card>;
```

Two exceptions to know:

- **Dark mode** is a class variant, not a provider: put `class="dark"` on an ancestor
  (usually `<html>`). Every token flips; no component prop is involved.
- **Tooltip** (not in this sync) needs `TooltipProvider` around it. Nothing else does.

If a component renders unstyled, the cause is the stylesheet, not a missing wrapper —
`styles.css` and its `@import` closure must be loaded.

## Styling idiom: Tailwind utilities bound to semantic tokens

Style your own layout with Tailwind v4 utility classes. **Always reach for the semantic
token utility, never a raw colour** — `bg-primary`, not `bg-teal-800`.

| Family   | Use these                                                                                  |
| -------- | ------------------------------------------------------------------------------------------ |
| Surfaces | `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-secondary`                       |
| Text     | `text-foreground`, `text-muted-foreground`, `text-primary`, `text-primary-foreground`      |
| Lines    | `border` (defaults to `--border`), `border-border`, `border-input`, `ring-ring`            |
| Actions  | `bg-primary` / `text-primary-foreground`, `bg-destructive`, `bg-accent`                    |
| Type     | `font-sans` (Polymath → Figtree), `font-mono` (Berkeley Mono), `font-heading`, `font-text` |

`font-heading` and `font-text` are Formance-specific utilities: they set Polymath's
optical size (`font-variation-settings: "opsz" …`), not a family. Use `font-heading` on
display type and `font-text` on body copy.

Brand ramps ship as full utility families for charts, illustration and brand surfaces:
`{bg,text,border,ring,fill,stroke}-{emerald,lilac,cobalt,gold,mint}-{100..900}` (emerald
also has `50`), plus the matching `--emerald-*` … `--mint-*` tokens. `Button`, `Badge` and
`FormanceIcon` also expose them as variants (`variant="lilac"`), which is the preferred way
to colour a component — reach for the raw utility only for surfaces you build yourself.

## Two brand rules that are easy to break

1. **`--radius` is `0rem`.** Square corners are deliberate. Do not add `rounded-lg` (or any
   `rounded-*`) to DS surfaces or to panels you build around them.
2. **Buttons, badges and tab triggers set their own type**: Berkeley Mono, uppercase, tight
   tracking. Don't override their `className` with a font or transform utility — pass the
   `variant` / `size` props instead.

## The brand mark

Two exports, and the difference matters:

- **`FormanceLogo`** — the full wordmark lockup (icon + "Formance"). Use it once per screen,
  in a header or a splash. It takes `currentColor`, so `className="text-white"` is how you
  put it on a dark surface, and `max-w-*` is how you size it.
- **`FormanceIcon`** — the mark alone. `variant="plain"` (default) takes the surrounding
  text colour; `emerald` / `slate` / `lilac` / `gold` / `cobalt` are **tiles**: the pattern
  centred in a full circle of that brand colour, with the pattern/circle pair already
  chosen for you. Sizes come in two ramps — `xs`–`3xl` is a display scale, and `icon-xs`–
  `icon-lg` match the `Button` sizes of the same name, so a mark beside a button lines up
  without anyone matching numbers.

```jsx
<FormanceIcon variant="emerald" size="icon-md" />   // beside a button
<FormanceLogo className="max-w-28" />               // in a header
```

Never rebuild the mark from SVG paths or reach for an image asset — both exports draw it.

## Where the truth lives

- `_ds/<folder>/styles.css` — the entry; it `@import`s `fonts/fonts.css` (Polymath and
  Berkeley Mono `@font-face`) and `_ds_bundle.css` (every token value plus all component
  CSS). Read `_ds_bundle.css` when you need an exact token value or class name.
- `components/<group>/<Name>/<Name>.d.ts` — the real prop contract. `<Name>Props` is
  authoritative; variant unions live there.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage notes, generated from
  the DS's own docs.

Prefer reading those files over guessing a class or prop name.

## One idiomatic snippet

Library components for the controls, DS utilities for your own glue:

```jsx
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@formance/design-system';

export function StackCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>sandbox-eu-west</CardTitle>
        <CardDescription>Region eu-west-1 · v2.4.1</CardDescription>
        <CardAction>
          <Badge variant="valid">Active</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Ledgers</dt>
          <dd className="font-mono">4</dd>
        </dl>
      </CardContent>
    </Card>
  );
}
```

Note the split: `text-muted-foreground` and `font-mono` for layout text, component props
(`variant="valid"`) for anything the DS already owns.
