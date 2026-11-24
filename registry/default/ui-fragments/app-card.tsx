import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, TButtonProps } from '@/registry/default/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/default/ui/card';

export type TAppCardProps = {
  title?: string;
  description?: string;
  iconVariant?: TButtonProps['variant'];
  appIcon?: LucideIcon;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  headerContent?: React.ReactNode;
  isEmpty?: boolean;
  contentAlign?: 'start' | 'end';
} & React.ComponentProps<typeof Card>;

export function AppCard({
  title,
  description,
  appIcon,
  iconVariant,
  children,
  footer,
  headerAction,
  headerContent,
  isEmpty,
  contentAlign = 'start',
  className,
  ...cardProps
}: TAppCardProps) {
  const Icon = appIcon;
  const hasHeader =
    title || description || appIcon || headerAction || headerContent;

  return (
    <Card
      className={cn(contentAlign === 'end' && 'flex flex-col', className)}
      {...cardProps}
    >
      {hasHeader && (
        <CardHeader>
          <div className="flex items-center gap-2">
            {Icon && (
              <Button variant={iconVariant} size="icon-md" notClickable>
                <Icon />
              </Button>
            )}
            <div className="flex items-center gap-3 flex-1">
              <CardTitle>{title}</CardTitle>
              {headerContent}
            </div>
          </div>
          <CardDescription>{description}</CardDescription>
          {headerAction && !isEmpty && <CardAction>{headerAction}</CardAction>}
        </CardHeader>
      )}
      <CardContent className={cn(contentAlign === 'end' && 'mt-auto')}>
        {children}
      </CardContent>
      {footer}
    </Card>
  );
}
