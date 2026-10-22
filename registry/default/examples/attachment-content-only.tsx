import { XIcon } from 'lucide-react';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/registry/default/ui/attachment';

export default function AttachmentContentOnly() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Title
        </div>
        <div className="flex flex-col gap-3">
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>Ledger documentation</AttachmentTitle>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove Ledger documentation">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>Numscript reference</AttachmentTitle>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove Numscript reference">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment size="sm" className="w-48">
            <AttachmentContent>
              <AttachmentTitle>Formance Cloud</AttachmentTitle>
            </AttachmentContent>
            <AttachmentTrigger asChild>
              <a
                href="https://www.formance.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Formance Cloud"
              />
            </AttachmentTrigger>
          </Attachment>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Title and description
        </div>
        <div className="flex flex-col gap-3">
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>Accounts and addressing</AttachmentTitle>
              <AttachmentDescription>
                docs.formance.com · 6 min read
              </AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove Accounts and addressing">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>Numscript playground</AttachmentTitle>
              <AttachmentDescription>
                playground.numscript.org
              </AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove Numscript playground">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment size="sm" className="w-full max-w-80">
            <AttachmentContent>
              <AttachmentTitle>Postings and balances</AttachmentTitle>
              <AttachmentDescription>
                docs.formance.com/ledger
              </AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger asChild>
              <a
                href="https://docs.formance.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Postings and balances"
              />
            </AttachmentTrigger>
          </Attachment>
        </div>
      </div>
    </div>
  );
}
