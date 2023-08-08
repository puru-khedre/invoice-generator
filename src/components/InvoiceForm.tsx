import { FC } from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemsList from "./InvoiceItemsList";
import InvoiceFooter from "./InvoiceFooter";
import { useInvoice } from "./InvoiceProvider";

interface InvoiceFormProps {}
const InvoiceForm: FC<InvoiceFormProps> = () => {
  const { printRef } = useInvoice();
  return (
    <>
      <div ref={printRef} className="print:p-10">
        <InvoiceHeader />
        <InvoiceItemsList />
        <InvoiceFooter />
      </div>
    </>
  );
};

export default InvoiceForm;
