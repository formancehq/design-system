import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@formance/design-system';

export function Closed() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Select a service" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ledger">Ledger</SelectItem>
        <SelectItem value="payments">Payments</SelectItem>
        <SelectItem value="wallets">Wallets</SelectItem>
        <SelectItem value="webhooks">Webhooks</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function WithValue() {
  return (
    <Select defaultValue="payments">
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Core</SelectLabel>
          <SelectItem value="ledger">Ledger</SelectItem>
          <SelectItem value="payments">Payments</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Modules</SelectLabel>
          <SelectItem value="wallets">Wallets</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function Disabled() {
  return (
    <Select disabled>
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Unavailable in this region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ledger">Ledger</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function Open() {
  return (
    <div className="h-72 w-full max-w-xs">
      <Select defaultOpen defaultValue="payments">
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Core</SelectLabel>
            <SelectItem value="ledger">Ledger</SelectItem>
            <SelectItem value="payments">Payments</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Modules</SelectLabel>
            <SelectItem value="wallets">Wallets</SelectItem>
            <SelectItem value="webhooks">Webhooks</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
