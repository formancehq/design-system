const accounts = [
  'bank:omnibus',
  'clients:001:available',
  'clients:002:available',
  'clients:003:available',
  'clients:004:available',
  'clients:005:available',
  'clients:006:available',
  'clients:007:available',
  'fees:payments',
  'treasury:interest',
  'world',
  'psp:stripe:main',
];

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

export default function ScrollFadeEdge() {
  return (
    <div className="mx-auto flex w-full max-w-xs min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden border">
          <div className="h-36 scroll-fade-t scrollbar-none overflow-y-auto">
            <Accounts />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-t
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden border">
          <div className="h-36 scroll-fade-b scrollbar-none overflow-y-auto">
            <Accounts />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-b
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden border">
          <div className="scroll-fade-s scrollbar-none overflow-x-auto">
            <Modules />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-s
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden border">
          <div className="scroll-fade-e scrollbar-none overflow-x-auto">
            <Modules />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-e
        </p>
      </div>
    </div>
  );
}

function Accounts() {
  return (
    <div className="flex flex-col gap-1.5 p-1.5">
      {accounts.slice(0, 6).map((account) => (
        <div key={account} className="bg-muted px-3 py-2.5 font-mono text-xs">
          {account}
        </div>
      ))}
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
