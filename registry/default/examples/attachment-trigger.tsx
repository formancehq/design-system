'use client';

import { CheckIcon, CopyIcon, FileSearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/registry/default/ui/attachment';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/default/ui/dialog';

const fileUrl = 'https://ds.formance.com/files/research-summary.pdf';

export default function AttachmentTriggerDemo() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <Attachment className="w-full max-w-sm">
        <AttachmentMedia>
          <FileSearchIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>research-summary.pdf</AttachmentTitle>
          <AttachmentDescription>Open preview dialog</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction
            aria-label={copied ? 'Link copied' : 'Copy link'}
            onClick={handleCopy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </AttachmentAction>
          <AttachmentAction aria-label="Remove research-summary.pdf">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
        <DialogTrigger asChild>
          <AttachmentTrigger aria-label="Preview research-summary.pdf" />
        </DialogTrigger>
      </Attachment>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>research-summary.pdf</DialogTitle>
          <DialogDescription>
            The attachment trigger fills the card and opens the dialog, while
            the actions stay independently clickable above it.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
