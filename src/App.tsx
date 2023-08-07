import { useReactToPrint } from "react-to-print";
import "./App.css";
import InvoiceFooter from "./components/InvoiceFooter";
import InvoiceHeader from "./components/InvoiceHeader";
import InvoiceItemsList from "./components/InvoiceItemsList";
import InvoiceProvider, { useInvoice } from "./components/InvoiceProvider";
import { Button } from "./components/ui/button";
import InvoiceHistoryProvider from "./components/InvoiceHistoryProvider";

function App() {
  const { printRef } = useInvoice();

  const handlePrint = useReactToPrint({
    content() {
      return printRef.current;
    },
  });
  return (
    <InvoiceHistoryProvider>
      <InvoiceProvider>
        <div className="flex flex-row gap-4 m-4">
          <div className="border border-purple-400 rounded-lg divide-y-2 grow-1 p-4">
            <div ref={printRef} className="print:p-10">
              <InvoiceHeader />
              <InvoiceItemsList />
              <InvoiceFooter
                printBtn={<Button onClick={handlePrint}>Print</Button>}
              />
            </div>
          </div>
          <div className="w-1/3 border border-red-500/40 rounded-lg p-4">
            pk
          </div>
        </div>
      </InvoiceProvider>
    </InvoiceHistoryProvider>
  );
}

export default App;
