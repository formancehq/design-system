import { SectionLabel } from '@/registry/default/ui/section-label';

const SECTIONS = [
  { label: 'Getting Started', items: ['Introduction', 'Installation'] },
  { label: 'Atoms', items: ['Accordion', 'Badge', 'Button'] },
];

export default function SectionLabelDemo() {
  return (
    <nav className="flex w-56 flex-col gap-3">
      {SECTIONS.map((section) => (
        <section key={section.label} className="flex flex-col gap-1">
          <SectionLabel asChild className="px-2">
            <h3>{section.label}</h3>
          </SectionLabel>
          <ul className="flex flex-col text-sm">
            {section.items.map((item) => (
              <li key={item} className="rounded-md px-2 py-1.5 hover:bg-accent">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
