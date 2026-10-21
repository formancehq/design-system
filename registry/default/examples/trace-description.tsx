import { FilePenIcon, SearchIcon, TerminalIcon } from 'lucide-react';

import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function TraceDescriptionDemo() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <FilePenIcon />
        </TraceIcon>
        <TraceTitle>Edited schema/transactions/withdrawal.num</TraceTitle>
        <TraceDescription className="font-mono">+6 −2</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran the validation checks</TraceTitle>
        <TraceDescription>14s</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Searched for clients:$id:available</TraceTitle>
        <TraceDescription>8 results</TraceDescription>
      </TraceLine>
    </Trace>
  );
}
