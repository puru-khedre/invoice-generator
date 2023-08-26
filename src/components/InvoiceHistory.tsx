import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useInvoiceHistory } from "./InvoiceHistoryProvider";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CurrencySelection from "./CurrencySelection";

interface InvoiceHistoryProps {}
const InvoiceHistory: FC<InvoiceHistoryProps> = () => {
  const { invoices, changeCurrentInvoice, createNewInvoice } =
    useInvoiceHistory();

  return (
    <>
      {invoices.length > 0 ? (
        <div className="rounded-md border border-border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-max">INo</TableHead>
                <TableHead className="w-full">Bill to</TableHead>
                <TableHead className="w-max text-center">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice, ind) => (
                <TableRow key={ind} onClick={() => changeCurrentInvoice(ind)}>
                  <TableCell className="w-max">
                    {invoice.headerData.format_invoice_number}
                  </TableCell>
                  <TableCell className="w-full">
                    {invoice.headerData.bill_to}
                  </TableCell>
                  <TableCell className="w-max text-center">
                    {formatCurrency(
                      invoice.amounts.due_amt,
                      undefined,
                      invoice.currency
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-4">
          <p>Empty</p>
        </div>
      )}
      <div className="mt-4 flex flex-row gap-3">
        <CurrencySelection />
        <Button onClick={createNewInvoice}>
          <Plus /> New
        </Button>
      </div>
    </>
  );
};

export default InvoiceHistory;
