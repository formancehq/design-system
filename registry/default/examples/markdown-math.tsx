'use client';

import { Markdown } from '@/registry/default/ui-fragments/markdown';

const SOURCE = `## Math (KaTeX)

Inline math renders with \`$…$\`: the present value is $PV = \\frac{FV}{(1 + r)^n}$.

Block math uses \`$$…$$\`:

$$
\\text{balance}(a, t) = \\sum_{p \\,\\in\\, P_t} \\bigl(\\mathbb{1}[p.\\text{dst} = a] - \\mathbb{1}[p.\\text{src} = a]\\bigr) \\cdot p.\\text{amount}
$$

Powered by \`remark-math\` + \`rehype-katex\`.`;

export default function MarkdownMath() {
  return (
    <div className="w-full max-w-2xl">
      <Markdown>{SOURCE}</Markdown>
    </div>
  );
}
