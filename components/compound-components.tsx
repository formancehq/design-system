import { TypographyMono } from '@/registry/default/ui/typography';
import type { TSubComponent } from '@/config/docs';

function CompoundComponents({
  subComponents,
}: {
  subComponents: TSubComponent[];
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Compose the pieces you need:
      </p>
      <div className="grid gap-3">
        {subComponents.map((sub) => (
          <div
            key={sub.name}
            className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-3"
          >
            <code
              className={`shrink-0 text-sm font-semibold text-foreground ${TypographyMono()}`}
            >
              {`<${sub.name} />`}
            </code>
            <span className="text-sm text-muted-foreground">
              {sub.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CompoundComponents };
