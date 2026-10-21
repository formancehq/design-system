import {
  CircleCheckIcon,
  CircleIcon,
  ListChecksIcon,
  ListTodoIcon,
} from 'lucide-react';

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

const todos: { title: string; description?: string; done: boolean }[] = [
  {
    title: 'Map the chart of accounts',
    description: 'One account per client balance, bank account, and fee.',
    done: true,
  },
  { title: 'Pick the omnibus template', done: true },
  {
    title: 'Fix the withdrawal transaction',
    description: 'It posts from world instead of the client account.',
    done: false,
  },
  { title: 'Add a balance query per client', done: false },
  {
    title: 'Run the validation checks',
    description: 'The same checks as a design run.',
    done: false,
  },
];

function TodoRow({ todo }: { todo: (typeof todos)[number] }) {
  const line = (
    <TraceLine>
      <TraceIcon>{todo.done ? <CircleCheckIcon /> : <CircleIcon />}</TraceIcon>
      <TraceTitle>{todo.title}</TraceTitle>
    </TraceLine>
  );

  if (!todo.description) {
    return line;
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{todo.description}</TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

export default function QueueDescriptions() {
  const pending = todos.filter((todo) => !todo.done);
  const completed = todos.filter((todo) => todo.done);

  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <ListTodoIcon />
            </TraceIcon>
            <TraceTitle>{pending.length} to do</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {pending.map((todo) => (
              <TodoRow key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <ListChecksIcon />
            </TraceIcon>
            <TraceTitle>{completed.length} completed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {completed.map((todo) => (
              <TodoRow key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
