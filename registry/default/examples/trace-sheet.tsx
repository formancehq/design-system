import { ChevronRightIcon, FolderSearchIcon } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui/sheet';
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function TraceSheet() {
  return (
    <Trace className="max-w-sm">
      <Sheet>
        <SheetTrigger>
          <TraceLine>
            <TraceIcon>
              <FolderSearchIcon />
            </TraceIcon>
            <TraceTitle>Explored 4 files</TraceTitle>
            <TraceIcon>
              <ChevronRightIcon />
            </TraceIcon>
          </TraceLine>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Explored 4 files</SheetTitle>
            <SheetDescription>
              Files read while preparing the response.
            </SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col gap-2 px-6 font-mono text-xs">
            <li>schema/accounts.yaml</li>
            <li>schema/transactions/deposit.num</li>
            <li>schema/transactions/withdrawal.num</li>
            <li>schema/queries/balances.yaml</li>
          </ul>
        </SheetContent>
      </Sheet>
    </Trace>
  );
}
