'use client';

import { TableOfContents } from '@/registry/default/ui/table-of-contents';

const headings = [
  { id: 'demo-introduction', title: 'Introduction', level: 2 },
  { id: 'demo-key-concepts', title: 'Key Concepts', level: 2 },
  { id: 'demo-ledgers', title: 'Ledgers', level: 3 },
  { id: 'demo-transactions', title: 'Transactions', level: 3 },
  { id: 'demo-best-practices', title: 'Best Practices', level: 2 },
  { id: 'demo-security', title: 'Security', level: 3 },
  { id: 'demo-conclusion', title: 'Conclusion', level: 2 },
];

function Section({ id, title, children }: { id: string; title: string; children: string }) {
  const Tag = headings.find((h) => h.id === id)?.level === 3 ? 'h3' : 'h2';
  return (
    <div>
      <Tag id={id} className="scroll-m-20 font-semibold tracking-tight text-foreground">
        {title}
      </Tag>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export default function TableOfContentsDemo() {
  return (
    <div className="grid grid-cols-[1fr_180px] gap-6 max-h-[500px] rounded-lg p-6">
      <div className="space-y-8 overflow-y-auto max-h-[452px] pr-4">
        <Section id="demo-introduction" title="Introduction">
          Financial infrastructure requires precise tracking of every monetary movement. This guide covers the fundamental concepts behind programmable money movement.
        </Section>
        <Section id="demo-key-concepts" title="Key Concepts">
          Before working with financial APIs, understand the core primitives that make programmable finance possible.
        </Section>
        <Section id="demo-ledgers" title="Ledgers">
          A ledger is a record of all financial transactions. Double-entry bookkeeping ensures every credit has a corresponding debit, maintaining balance integrity.
        </Section>
        <Section id="demo-transactions" title="Transactions">
          Transactions are atomic operations that move funds between accounts. They are immutable once committed and provide a complete audit trail.
        </Section>
        <Section id="demo-best-practices" title="Best Practices">
          Following best practices ensures your financial infrastructure remains reliable, auditable, and compliant.
        </Section>
        <Section id="demo-security" title="Security">
          Implement proper authentication, encryption, and access controls. Financial data requires the highest level of protection.
        </Section>
        <Section id="demo-conclusion" title="Conclusion">
          Programmable finance continues to evolve, enabling new possibilities for businesses to automate and scale their financial operations.
        </Section>
      </div>
      <div className="sticky top-0 border-l pl-4">
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}
