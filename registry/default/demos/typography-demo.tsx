'use client';

import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLead,
  TypographyInlineCode,
  TypographySmall,
} from '@/registry/default/ui/typography';

export default function TypographyDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <TypographyH1>Heading 1</TypographyH1>
      <TypographyH2>Heading 2</TypographyH2>
      <TypographyH3>Heading 3</TypographyH3>
      <TypographyH4>Heading 4</TypographyH4>
      <TypographyLead>This is a lead paragraph.</TypographyLead>
      <TypographyP>
        This is a standard paragraph with{' '}
        <TypographyInlineCode>inline code</TypographyInlineCode>.
      </TypographyP>
      <TypographySmall>This is small text.</TypographySmall>
    </div>
  );
}
