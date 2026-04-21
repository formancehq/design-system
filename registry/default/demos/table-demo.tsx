'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/table';

export default function TableDemo() {
  return (
    <div className="w-full max-w-lg">
      <Table>
        <TableCaption>Recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>TXN001</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TXN002</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>$150.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TXN003</TableCell>
            <TableCell>Failed</TableCell>
            <TableCell>$350.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
