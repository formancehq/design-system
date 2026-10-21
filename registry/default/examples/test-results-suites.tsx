import {
  CheckIcon,
  CircleDashedIcon,
  FileCodeIcon,
  FlaskConicalIcon,
  XIcon,
} from 'lucide-react';

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

type TTest = {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
};

const suites: { name: string; tests: TTest[] }[] = [
  {
    name: 'posting_test.go',
    tests: [
      { name: 'TestPosting/deposit', status: 'passed' },
      { name: 'TestPosting/payout', status: 'passed' },
      { name: 'TestPosting/fee_split', status: 'passed' },
    ],
  },
  {
    name: 'api_test.go',
    tests: [
      { name: 'TestCreateLedger', status: 'passed' },
      {
        name: 'TestPostTransaction/idempotency_key',
        status: 'failed',
        error: `api_test.go:45: expected status 200, got 500
    a second request with the same Idempotency-Key created a new transaction`,
      },
      { name: 'TestRevertTransaction', status: 'skipped' },
    ],
  },
  {
    name: 'storage_test.go',
    tests: [
      { name: 'TestStore/connect', status: 'passed' },
      {
        name: 'TestStore/balances_at_scale',
        status: 'failed',
        error: `panic: test timed out after 5s
    storage_test.go:22: balances query on 1M accounts`,
      },
    ],
  },
];

function countTests(tests: TTest[]) {
  return {
    total: tests.length,
    failed: tests.filter((test) => test.status === 'failed').length,
    skipped: tests.filter((test) => test.status === 'skipped').length,
  };
}

function formatCounts({
  total,
  failed,
  skipped,
}: ReturnType<typeof countTests>) {
  return [
    `${total} tests`,
    failed > 0 && `${failed} failed`,
    skipped > 0 && `${skipped} skipped`,
  ]
    .filter(Boolean)
    .join(', ');
}

function TestRow({ test }: { test: TTest }) {
  if (test.status === 'failed') {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <XIcon />
            </TraceIcon>
            <TraceTitle>{test.name}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {test.error}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    );
  }

  return (
    <TraceLine>
      <TraceIcon>
        {test.status === 'skipped' ? <CircleDashedIcon /> : <CheckIcon />}
      </TraceIcon>
      <TraceTitle>
        {test.status === 'skipped' ? `Skipped ${test.name}` : test.name}
      </TraceTitle>
    </TraceLine>
  );
}

export default function TestResultsSuites() {
  const summary = countTests(suites.flatMap((suite) => suite.tests));

  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status={summary.failed > 0 ? 'error' : undefined}>
            <TraceIcon>
              <FlaskConicalIcon />
            </TraceIcon>
            <TraceTitle>Ran {formatCounts(summary)}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {suites.map((suite) => {
              const counts = countTests(suite.tests);

              return (
                <TraceCollapsible
                  key={suite.name}
                  defaultOpen={counts.failed > 0}
                >
                  <TraceCollapsibleTrigger>
                    <TraceLine status={counts.failed > 0 ? 'error' : undefined}>
                      <TraceIcon>
                        <FileCodeIcon />
                      </TraceIcon>
                      <TraceTitle>
                        {suite.name}, {formatCounts(counts)}
                      </TraceTitle>
                    </TraceLine>
                  </TraceCollapsibleTrigger>
                  <TraceCollapsibleContent>
                    <Trace>
                      {suite.tests.map((test) => (
                        <TestRow key={test.name} test={test} />
                      ))}
                    </Trace>
                  </TraceCollapsibleContent>
                </TraceCollapsible>
              );
            })}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
