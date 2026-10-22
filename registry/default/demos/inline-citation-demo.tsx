'use client';

import { Button } from '@/registry/default/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/registry/default/ui/hover-card';

type TSource = {
  url: string;
  title: string;
  description: string;
};

const sources = {
  ledger: {
    url: 'https://docs.formance.com/ledger',
    title: 'Ledger',
    description: 'A programmable, double-entry ledger for money movements.',
  },
  numscript: {
    url: 'https://github.com/formancehq/numscript',
    title: 'Numscript',
    description: 'A language to describe how money moves between accounts.',
  },
  repository: {
    url: 'https://github.com/formancehq/ledger',
    title: 'formancehq/ledger',
    description: 'The source code of the Formance Ledger.',
  },
  fctl: {
    url: 'https://github.com/formancehq/fctl',
    title: 'fctl',
    description: 'The Formance CLI to manage stacks and modules.',
  },
  payments: {
    url: 'https://github.com/formancehq/payments',
    title: 'formancehq/payments',
    description: 'Connectors that move money with payment providers.',
  },
} satisfies Record<string, TSource>;

function hostname(url: string) {
  return new URL(url).hostname.replace(/^www\./, '');
}

function Citation({ source }: { source: TSource }) {
  const host = hostname(source.url);

  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="secondary" size="sm" caseSensitive>
          {host}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-1">
        <div className="font-medium">{source.title}</div>
        <p className="text-muted-foreground">{source.description}</p>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          {host}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function InlineCitationDemo() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 py-6 text-sm leading-relaxed">
      <p>
        The ledger records every movement of money as a double-entry
        transaction. <Citation source={sources.ledger} />
      </p>
      <p>
        You describe a movement in Numscript. The script names the source and
        the destination accounts, and the ledger refuses a posting that would
        make a balance go below zero. <Citation source={sources.numscript} />{' '}
        The ledger is open source, so you can read how it commits the postings.{' '}
        <Citation source={sources.repository} />
      </p>
      <p>
        Use fctl to send a script from the terminal.{' '}
        <Citation source={sources.fctl} /> To move money outside the ledger,
        connect a payment provider. <Citation source={sources.payments} />
      </p>
    </div>
  );
}
