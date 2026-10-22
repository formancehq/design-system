import { ClockIcon } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/default/ui/accordion';
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from '@/registry/default/ui/marker';

export default function MarkerAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-sm">
      <AccordionItem value="run">
        <AccordionTrigger>
          <Marker>
            <MarkerIcon>
              <ClockIcon />
            </MarkerIcon>
            <MarkerContent>Worked for 42s</MarkerContent>
          </Marker>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">
            The agent listed the accounts of the sandbox ledger, checked the
            omnibus balance, and drafted the interest accrual transaction.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
