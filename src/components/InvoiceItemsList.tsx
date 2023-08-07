import { FC } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddItemDialog } from "./AddItemDialog";
import { useInvoice } from "./InvoiceProvider";

interface InvoiceItemsListProps {}

const InvoiceItemsList: FC<InvoiceItemsListProps> = () => {
  const { items } = useInvoice();
  return (
    <div className="py-2 space-y-2">
      {items.length !== 0 && (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="print:bg-gray-700">
                <TableHead className="print:text-white w-2/5">
                  Item name
                </TableHead>
                <TableHead className="print:text-white text-center">
                  Quantity
                </TableHead>
                <TableHead className="print:text-white text-center">
                  Rate
                </TableHead>
                <TableHead className="print:text-white text-center">
                  Total amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">
                    {item.rate} &#x20B9;
                  </TableCell>
                  <TableCell className="text-center">
                    {item.total_amt} &#x20B9;
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="print:hidden">
        <AddItemDialog />
      </div>
    </div>
  );
};

export default InvoiceItemsList;
