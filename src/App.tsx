import "./App.css";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceHistory from "./components/InvoiceHistory";
import InvoiceHistoryProvider from "./components/InvoiceHistoryProvider";
import InvoiceProvider from "./components/InvoiceProvider";

function App() {
  return (
    <>
      <InvoiceHistoryProvider>
        <InvoiceProvider>
          <div className="flex flex-row gap-4 m-4">
            <div className="border-2 border-purple-400 rounded-lg divide-y-2 grow-1 p-4 h-max">
              <InvoiceForm />
            </div>
            <div className="w-1/3 border-2 border-red-400 rounded-lg p-4 h-max">
              <h2 className="font-medium text-3xl">Invoice History</h2>
              <InvoiceHistory />
            </div>
          </div>
        </InvoiceProvider>
      </InvoiceHistoryProvider>
    </>
  );
}

export default App;
