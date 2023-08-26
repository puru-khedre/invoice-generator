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
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface InvoiceItemsListProps {}

const InvoiceItemsList: FC<InvoiceItemsListProps> = () => {
  const { items, currency } = useInvoice();

  const { toast } = useToast();
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
                    {formatCurrency(+item.rate, undefined, currency)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(item.total_amt ?? 0, undefined, currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="print:hidden">
        {items.length < 5 ? (
          <AddItemDialog />
        ) : (
          <Button
            onClick={() => {
              toast({
                description: "You can't able to add more than 5 items.",
                className: "border-2",
              });
            }}
            variant="secondary"
          >
            Add more Items
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoiceItemsList;
