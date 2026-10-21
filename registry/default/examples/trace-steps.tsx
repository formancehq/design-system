import { ChevronRightIcon, FileTextIcon, SearchIcon } from 'lucide-react';

import { Badge } from '@/registry/default/ui/badge';
import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function TraceSteps() {
  return (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceTitle>Looking into the failed deposit</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <SearchIcon />
                  </TraceIcon>
                  <TraceTitle>Searched the deploy log for errors</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">docs.formance.com</Badge>
                <Badge variant="secondary">github.com</Badge>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <a href="#steps">
              <TraceLine>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Read the last twelve transactions</TraceTitle>
                <TraceIcon>
                  <ChevronRightIcon />
                </TraceIcon>
              </TraceLine>
            </a>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine status="running">
                  <TraceIcon>
                    <SearchIcon />
                  </TraceIcon>
                  <TraceTitle>Searching for the source account</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    source account deposit.num
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  );
}
