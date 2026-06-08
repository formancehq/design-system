import { cn } from '@/lib/utils';

export type TEndpointProps = {
  method?: string;
  statusCode?: number | string;
  path?: string;
  className?: string;
};

function getStatusColor(
  value?: number | string,
  method?: string
): Record<'text' | 'bg' | 'border', string> {
  if (!method && value !== undefined) {
    const statusNum = Number(value);
    const isValidHttpStatus =
      !isNaN(statusNum) && statusNum >= 100 && statusNum < 600;

    if (!isValidHttpStatus) {
      return {
        text: 'text-muted-foreground',
        bg: 'bg-muted',
        border: 'border-border',
      };
    }
  }

  const normalized =
    typeof value === 'number'
      ? value < 100
        ? String(value)
        : String(Math.floor(value / 100))
      : typeof value === 'string' && /^\d+$/.test(value) && value.length >= 3
        ? String(Math.floor(Number(value) / 100))
        : value;

  switch (normalized) {
    case '1':
    case '2':
    case '3':
    case 'info':
    case 'success':
    case undefined:
      return {
        text: 'text-muted-foreground',
        bg: 'bg-muted',
        border: 'border-emerald-400',
      };
    case '4':
    case 'warning':
    case 'redirect':
      return {
        text: 'text-warning-foreground',
        bg: 'bg-warning',
        border: 'border-warning-foreground/30',
      };
    case '5':
    case 'error':
      return {
        text: 'text-destructive-foreground',
        bg: 'bg-destructive',
        border: 'border-destructive-foreground/30',
      };
    default:
      return {
        text: 'text-muted-foreground',
        bg: 'bg-muted',
        border: 'border-border',
      };
  }
}

function Endpoint({ method, statusCode, path, className }: TEndpointProps) {
  const colors = getStatusColor(statusCode, method);
  const hasStatus = statusCode !== undefined;
  const hasPath = path !== undefined && path !== '';
  const hasMethod = !!method;

  const methodIsLast = hasMethod && !hasStatus && !hasPath;
  const statusIsLast = hasStatus && !hasPath;

  return (
    <span
      data-slot="endpoint"
      className={cn(
        'inline-flex items-center text-xs font-mono tabular-nums',
        className
      )}
    >
      {hasMethod && (
        <span
          className={cn(
            'inline-flex items-center select-text leading-none py-1 px-2 rounded-l-xs bg-emerald-50 text-foreground border uppercase tracking-wide',
            methodIsLast ? 'rounded-r-xs' : 'border-r-0'
          )}
        >
          {method}
        </span>
      )}
      {hasStatus && (
        <span
          className={cn(
            'inline-flex items-center leading-none py-1 px-2 border',
            !hasMethod && 'rounded-l-xs',
            statusIsLast && 'rounded-r-xs',
            colors.text,
            colors.bg,
            colors.border
          )}
        >
          {statusCode}
        </span>
      )}
      {hasPath && (
        <span
          className={cn(
            'inline-flex items-center select-text leading-none py-1 px-2 rounded-r-xs bg-muted/40 text-foreground border truncate',
            hasStatus && 'border-l-0',
            hasMethod && !hasStatus && 'border-l-emerald-400',
            !hasMethod && !hasStatus && 'rounded-l-xs'
          )}
        >
          {path}
        </span>
      )}
    </span>
  );
}

export { Endpoint };
