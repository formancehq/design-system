import { Kbd, KbdGroup } from '@/registry/default/ui/kbd';

export default function KbdDemo() {
  return (
    <div className="flex items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
      <Kbd>Esc</Kbd>
    </div>
  );
}
