import { TypographyP } from '@/registry/default/ui/typography';

export function FragmentsIntroduction() {
  return (
    <div className="space-y-4">
      <TypographyP>
        Fragments are pre-built composite components that combine multiple atoms
        to create reusable interface elements. Unlike atoms (basic building
        blocks like buttons and inputs) or patterns (guidelines for structuring
        entire sections), fragments are ready-to-use solutions for specific
        interface needs.
      </TypographyP>
      <TypographyP>
        These components help maintain consistency across Formance products by
        providing standardized implementations for common interface patterns like
        data tables, date pickers, filter sidebars, and navigation elements.
      </TypographyP>
      <TypographyP>
        Fragments are distributed via the Formance registry and can be installed
        directly into your project. They encapsulate common combinations of atom
        components, reducing boilerplate and ensuring consistent behavior across
        similar features.
      </TypographyP>
    </div>
  );
}
