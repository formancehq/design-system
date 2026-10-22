const modules = [
  'Ledger',
  'Payments',
  'Wallets',
  'Flows',
  'Reconciliation',
  'Webhooks',
  'Auth',
  'Connectivity',
  'Numscript',
  'Studio',
  'Console',
  'Portal',
];

export default function ScrollFadeHorizontal() {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden border">
      <div className="scroll-fade-x scrollbar-none overflow-x-auto">
        <Modules />
      </div>
    </div>
  );
}

function Modules() {
  return (
    <div className="flex w-max gap-1.5 p-1.5">
      {modules.map((module) => (
        <div key={module} className="shrink-0 bg-muted px-3 py-2.5 text-sm">
          {module}
        </div>
      ))}
    </div>
  );
}
