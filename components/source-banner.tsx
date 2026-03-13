import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

import { FormanceIcon } from '@/registry/default/ui/formance-logo';
import { cn } from '@/lib/utils';

type TSource = 'shadcn' | 'custom';

function ShadcnIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn('size-5', className)}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}

const sourceConfig: Record<
  TSource,
  {
    icon: React.ReactNode;
    label: string;
    description: string;
    href: string;
  }
> = {
  shadcn: {
    icon: <ShadcnIcon />,
    label: 'shadcn/ui',
    description: 'Based on shadcn/ui with Formance brand styling.',
    href: 'https://ui.shadcn.com',
  },
  custom: {
    icon: <FormanceIcon size="xs" className="text-muted-foreground" />,
    label: 'Formance',
    description: 'Custom component built for Formance products.',
    href: 'https://formance.com',
  },
};

function SourceBanner({ source }: { source: TSource }) {
  const config = sourceConfig[source];

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{config.icon}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{config.label}</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {config.description}
          </span>
        </div>
      </div>
      <Link
        href={config.href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Docs
        <ExternalLinkIcon className="size-3" />
      </Link>
    </div>
  );
}

export { SourceBanner, type TSource };
