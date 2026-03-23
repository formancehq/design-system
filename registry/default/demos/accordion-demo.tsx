'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/default/ui/accordion';

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="ledgers">
        <AccordionTrigger>What are Ledgers?</AccordionTrigger>
        <AccordionContent>
          Ledgers are the core building block of Formance. They store
          double-entry accounting transactions with guaranteed consistency.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="payments">
        <AccordionTrigger>How do Payments work?</AccordionTrigger>
        <AccordionContent>
          The Payments service connects to payment providers and normalizes
          transaction data into a unified format.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="wallets">
        <AccordionTrigger>What are Wallets?</AccordionTrigger>
        <AccordionContent>
          Wallets provide a high-level abstraction for managing user balances,
          holds, and disbursements on top of Ledgers.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
