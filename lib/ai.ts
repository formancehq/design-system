import type { UIMessage } from 'ai';

// The text of an AI SDK message, joined from its text parts. Used by the
// AI Elements demos, which script their conversations with @shadcn/helpers.
export function getMessageText(message: Pick<UIMessage, 'parts'>) {
  return message.parts.reduce(
    (text, part) => (part.type === 'text' ? text + part.text : text),
    ''
  );
}
