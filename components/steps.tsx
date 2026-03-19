import { cn } from '@/lib/utils';

export function Steps({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'steps mt-4 mb-12 ml-4 border-l pl-8 [counter-reset:step] [&>.step+*]:mt-3',
        className,
      )}
      {...props}
    />
  );
}

export function Step({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'step relative mt-8 first:mt-0 scroll-m-20 text-base font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  );
}
