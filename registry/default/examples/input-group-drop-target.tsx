'use client';

import { FileTextIcon, PaperclipIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import {
  Attachment,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from '@/registry/default/ui/attachment';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/registry/default/ui/input-group';

export default function InputGroupDropTarget() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setFiles((current) => [...current, ...Array.from(fileList)]);
  };

  return (
    <div className="w-full max-w-md">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        aria-label="Attach files"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = '';
        }}
      />
      <InputGroup
        data-drag-over={dragOver}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            event.currentTarget.contains(event.relatedTarget)
          )
            return;
          setDragOver(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        {files.length > 0 && (
          <InputGroupAddon align="block-start" className="flex-wrap">
            {files.map((file, index) => (
              <Attachment key={`${file.name}-${index}`} size="sm">
                <AttachmentMedia>
                  <FileTextIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                </AttachmentContent>
              </Attachment>
            ))}
          </InputGroupAddon>
        )}
        <InputGroupTextarea
          aria-label="Business description"
          placeholder="Describe the money flows. Drop files here to attach them."
          rows={4}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon />
            Attach
          </InputGroupButton>
          <InputGroupText className="ml-auto">
            {dragOver
              ? 'Release to attach'
              : `${files.length} ${files.length === 1 ? 'file' : 'files'}`}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
