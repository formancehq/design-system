const SEMANTIC_COLORS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'zinc',
];

export function SemanticColorsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {SEMANTIC_COLORS.map((color) => (
        <div key={color} className="flex items-center gap-2 rounded-md border p-2">
          <div
            className="h-8 w-8 shrink-0 rounded-md"
            style={{ backgroundColor: `var(--${color}-background)` }}
          />
          <div>
            <span className="text-sm font-medium capitalize">{color}</span>
            <div
              className="text-[10px] font-mono"
              style={{ color: `var(--${color}-foreground)` }}
            >
              foreground
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
