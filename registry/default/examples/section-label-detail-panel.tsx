import { SectionLabel } from '@/registry/default/ui/section-label';

const SECTIONS = [
  {
    label: 'Entry',
    rows: [
      ['ID', 'log_01J9X2'],
      ['Type', 'NEW_TRANSACTION'],
      ['Date', '2026-11-03 09:42'],
    ],
  },
  {
    label: 'Applied logs',
    rows: [
      ['Ledger', 'main'],
      ['Postings', '2'],
    ],
  },
];

export default function SectionLabelDetailPanel() {
  return (
    <div className="flex w-72 flex-col gap-6 rounded-lg border p-4">
      {SECTIONS.map((section) => (
        <section key={section.label} className="flex flex-col gap-3">
          <SectionLabel asChild>
            <h4>{section.label}</h4>
          </SectionLabel>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {section.rows.map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="font-mono">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
