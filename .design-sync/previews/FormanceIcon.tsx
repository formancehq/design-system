import { FormanceIcon } from '@formance/design-system';

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <FormanceIcon size="xs" />
      <FormanceIcon size="sm" />
      <FormanceIcon size="md" />
      <FormanceIcon size="lg" />
      <FormanceIcon size="xl" />
      <FormanceIcon size="2xl" />
    </div>
  );
}

export function TileColors() {
  const variants = ['emerald', 'slate', 'lilac', 'gold', 'cobalt'] as const;
  
return (
    <div className="flex flex-wrap items-end gap-5">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <FormanceIcon variant={variant} size="xl" />
          <span className="font-mono text-xs uppercase text-muted-foreground">
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PlainInline() {
  return (
    <p className="flex max-w-md items-center gap-2 text-sm">
      <FormanceIcon size="icon-sm" />
      <span>
        The plain variant takes the surrounding text colour, which is what a
        header or a line of copy wants.
      </span>
    </p>
  );
}

export function MatchingButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FormanceIcon variant="emerald" size="icon-xs" />
      <FormanceIcon variant="emerald" size="icon-sm" />
      <FormanceIcon variant="emerald" size="icon-md" />
      <FormanceIcon variant="emerald" size="icon-lg" />
    </div>
  );
}
