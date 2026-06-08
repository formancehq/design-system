import { CopyPage } from '@/registry/default/fragments/copy-page';

const url = 'https://example.com/docs/api';

export default function CopyPageCustomPrompt() {
  return (
    <CopyPage
      content="# API reference\n\nSee below for the full reference."
      url={url}
      prompt={`I'm reading the API reference at ${url}. Help me write a TypeScript client that calls these endpoints.`}
    />
  );
}
