export function UITokensGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {['background', 'foreground', 'primary', 'secondary', 'muted', 'accent', 'card', 'popover', 'border', 'input', 'ring'].map((token) => (
        <div key={token} className="flex items-center gap-2 rounded-md border p-2">
          <div
            className="h-6 w-6 shrink-0 rounded-md border"
            style={{ backgroundColor: `var(--${token})` }}
          />
          <span className="text-sm font-mono">{token}</span>
        </div>
      ))}
    </div>
  );
}
