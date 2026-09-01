import { FormanceLogo } from '@formance/design-system';

export function Lockup() {
  return (
    <div className="w-full max-w-xs">
      <FormanceLogo />
    </div>
  );
}

export function OnDarkSurface() {
  return (
    <div className="w-full max-w-sm bg-emerald-800 p-6">
      <FormanceLogo className="text-white" />
    </div>
  );
}

export function InAHeader() {
  return (
    <div className="flex w-full max-w-md items-center justify-between border-b pb-3">
      <FormanceLogo className="max-w-28" />
      <span className="font-mono text-xs uppercase text-muted-foreground">
        Console
      </span>
    </div>
  );
}
