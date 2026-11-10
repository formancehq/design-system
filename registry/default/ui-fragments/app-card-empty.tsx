import { LucideIcon, SquareMinus } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import { Card, CardContent } from '@/registry/default/ui/card';
import { TypographyP } from '@/registry/default/ui/typography';

export type TAppCardEmptyProps = {
  title?: string;
  description?: string;
  appIcon?: LucideIcon;
} & React.ComponentProps<typeof Card>;

export function AppCardEmpty({
  title,
  description,
  appIcon,
  children,
  ...props
}: TAppCardEmptyProps) {
  const Icon = appIcon ?? SquareMinus;

  return (
    <Card variant="muted" {...props}>
      <CardContent className="text-center">
        {Icon && (
          <Button variant="outline" size="icon-xl" notClickable>
            <Icon />
          </Button>
        )}
        <h4 className="scroll-m-20 pt-3 pb-1 text-xl font-medium font-body">
          {title}
        </h4>
        <TypographyP className="max-w-lg mx-auto">{description}</TypographyP>
        {children && (
          <div className="flex justify-center gap-2 pt-3">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
