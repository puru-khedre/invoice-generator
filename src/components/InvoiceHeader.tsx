import { ChangeEvent } from "react";
import { Input } from "./ui/input";
import { HashIcon } from "lucide-react";
import LabeledInput from "./LabeledInput";
import { useInvoice } from "./InvoiceProvider";
import { formatCurrency, formatDateToInputStyle } from "@/lib/utils";

const InvoiceHeader = () => {
  const {
    headerData,
    setHeader,
    amounts: { due_amt },
  } = useInvoice();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, type } = e.target;
    if (type === "number") {
      setHeader((prev) => ({ ...prev, [name]: +value }));
    } else if (type === "date") {
      setHeader((prev) => ({ ...prev, [name]: new Date(value) }));
    } else {
      setHeader((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="grid grid-cols-5 pb-2">
      <div className="col-span-3 space-y-2 flex flex-col justify-between items-start">
        <div>
          <img src="/Ep_Logo.png" className="w-36" />
          <h2 className="font-bold text-4xl">EverPeak IT Solution</h2>
          <address>
            123 Temporary Street, Suite 456, Temporaryville, TX 12345, United
            States
          </address>
          <div className="mt-2">
            <strong>GST:</strong> 12423423535354646
          </div>
        </div>

        <div className="w-full flex flex-row justify-stretch items-center gap-2">
          <>
            <div className="w-full print:hidden">
              <label htmlFor="bill_to">Bill To:</label>
              <Input
                type="text"
                className="mt-2"
                id="bill_to"
                placeholder="who is this invoice to? (required)"
                required
                value={headerData.bill_to}
                onChange={handleChange}
                name="bill_to"
              />
            </div>
            <div className="w-full hidden print:block">
              <strong>Bill To:</strong>
              <p>{headerData.bill_to}</p>
            </div>
          </>

          <>
            <div className="w-full print:hidden">
              <label htmlFor="ship_to">Ship To:</label>
              <Input
                type="text"
                className="mt-2"
                placeholder="(optional)"
                id="ship_to"
                value={headerData.ship_to || ""}
                onChange={handleChange}
                name="ship_to"
              />
            </div>
            <div
              className={`w-full hidden print:${
                !headerData.ship_to ? "hidden" : "block"
              }`}
            >
              <strong>Ship To:</strong>
              <p>{headerData.ship_to}</p>
            </div>
          </>
        </div>
      </div>

      <div className="col-span-2 text-end flex flex-col items-end h-full justify-between space-y-2">
        <div className="space-y-2 flex flex-col items-end w-full">
          <h2 className="font-medium text-6xl text-gray-600 uppercase">
            Invoice
          </h2>
          <LabeledInput
            Icon={HashIcon}
            className="print:hidden w-3/5"
            isIconLeft={true}
            labelFor="invoice_number"
          >
            <Input
              type="number"
              className="flex-grow border-none rounded-l-none"
              placeholder="invoice number"
              id="invoice_number"
              value={headerData.invoice_number}
              onChange={handleChange}
              name="invoice_number"
            />
          </LabeledInput>

          <div className="hidden print:block">
            <span>Invoice number: </span>#{headerData.invoice_number}
          </div>
        </div>

        <div className="space-y-2 w-full hidden print:block">
          <div className="">
            <span>Date: </span>
            {new Date(headerData.date ?? new Date()).toLocaleDateString(
              undefined
            )}
          </div>
          <div className="">
            <span>Due date: </span>
            {new Date(headerData.due_date).toLocaleDateString(undefined)}
          </div>
          <div className={!headerData.payment_terms ? "hidden" : ""}>
            <span>Payment terms: </span>
            {headerData.payment_terms}
          </div>
          <div className="bg-gray-100 font-semibold text-2xl p-1">
            <h3>Balance Due: {formatCurrency(due_amt)}</h3>
          </div>
        </div>

        <div className="space-y-2 w-full print:hidden">
          <div className="flex flex-row gap-2 items-center justify-end">
            <label htmlFor="date">Date</label>
            <Input
              id="date"
              placeholder="date"
              className="w-3/5"
              type="date"
              value={formatDateToInputStyle(headerData.date ?? new Date())}
              onChange={handleChange}
              name="date"
            />
          </div>

          <div className="flex flex-row gap-2 items-center justify-end">
            <label htmlFor="payment_terms">Payment terms</label>
            <Input
              id="payment_terms"
              placeholder="payment terms"
              className="w-3/5"
              value={headerData.payment_terms}
              onChange={handleChange}
              name="payment_terms"
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-end">
            <label htmlFor="due_date">Due date</label>
            <Input
              id="due_date"
              placeholder="due date"
              className="w-3/5"
              type="date"
              value={formatDateToInputStyle(headerData.due_date ?? new Date())}
              onChange={handleChange}
              name="due_date"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
