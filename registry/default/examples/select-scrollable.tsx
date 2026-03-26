'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

export default function SelectScrollableExample() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Select a ledger" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Core Services</SelectLabel>
          <SelectItem value="ledger-main">Main Ledger</SelectItem>
          <SelectItem value="ledger-sandbox">Sandbox Ledger</SelectItem>
          <SelectItem value="ledger-staging">Staging Ledger</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Payment Connectors</SelectLabel>
          <SelectItem value="stripe">Stripe</SelectItem>
          <SelectItem value="wise">Wise</SelectItem>
          <SelectItem value="modulr">Modulr</SelectItem>
          <SelectItem value="currencycloud">CurrencyCloud</SelectItem>
          <SelectItem value="mangopay">MangoPay</SelectItem>
          <SelectItem value="adyen">Adyen</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Regions</SelectLabel>
          <SelectItem value="us-east">US East</SelectItem>
          <SelectItem value="us-west">US West</SelectItem>
          <SelectItem value="eu-west">EU West</SelectItem>
          <SelectItem value="eu-central">EU Central</SelectItem>
          <SelectItem value="ap-south">AP South</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
