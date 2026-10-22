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

export default function ScrollFadeSize() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden border">
          <div className="h-48 scroll-fade scrollbar-none overflow-y-auto scroll-fade-4">
            <Accounts />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-4
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden border">
          <div className="h-48 scroll-fade scrollbar-none overflow-y-auto scroll-fade-24">
            <Accounts />
          </div>
        </div>
        <p className="text-center font-mono text-xs text-muted-foreground">
          scroll-fade-24
        </p>
      </div>
    </div>
  );
}

function Accounts() {
  return (
    <div className="flex flex-col gap-1.5 p-1.5">
      {accounts.slice(0, 8).map((account) => (
        <div key={account} className="bg-muted px-3 py-2.5 font-mono text-xs">
          {account}
        </div>
      ))}
    </div>
  );
}
