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

export default function ScrollFadeDemo() {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden border">
      <div className="h-72 scroll-fade scrollbar-none overflow-y-auto">
        <Accounts />
      </div>
    </div>
  );
}

function Accounts() {
  return (
    <div className="flex flex-col gap-1.5 p-1.5">
      {accounts.slice(0, 12).map((account) => (
        <div key={account} className="bg-muted px-3 py-2.5 font-mono text-xs">
          {account}
        </div>
      ))}
    </div>
  );
}
