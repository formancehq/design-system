import React from 'react';

import { Skeleton } from '@/registry/default/ui/skeleton';
import { cn } from '@/lib/utils';

export type LoaderProps = {
  fullscreen?: boolean;
  va?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Loader: React.FC<LoaderProps> = ({
  children,
  className,
}: LoaderProps) => (
  <div className={cn('', className)}>
    <div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[230px]" />
          <Skeleton className="h-4 w-[220px]" />
          <Skeleton className="h-4 w-[210px]" />
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  </div>
);

export type LoaderTableProps = LoaderProps & {
  columns?: number;
  rows?: number;
  hasToolbar?: boolean;
  hasPagination?: boolean;
};

const LoaderDataTable = ({
  className,
  columns = 3,
  rows = 3,
  hasToolbar = true,
  hasPagination = true,
}: LoaderTableProps) => (
  <div className={cn('w-full min-w-96', className)}>
    {/* Toolbar */}
    {hasToolbar && (
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40 lg:w-56" />
        <Skeleton className="h-6 w-20" />
      </div>
    )}

    <div className="py-4">
      <Skeleton className="h-8 w-full " />
    </div>

    <div className="flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-10 flex-1"
            />
          ))}
        </div>
      ))}
    </div>

    {hasPagination && (
      <div className="flex justify-end mt-6">
        <Skeleton className="h-6 w-40 lg:w-72" />
      </div>
    )}
  </div>
);

export { Loader, LoaderDataTable };
