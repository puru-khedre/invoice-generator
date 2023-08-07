import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  TAmounts,
  TInvoice,
  TInvoiceFooter,
  TInvoiceHeader,
  TInvoiceItem,
} from "./InvoiceProvider";

export type TInvoiceInHistory = {
  header: TInvoiceHeader;
  items: TInvoiceItem[];
  footer: TInvoiceFooter;
  amounts: TAmounts;
};

type TInvoiceHistory = {
  invoices: TInvoice[];
  invoice_count: number;

  currentInvoice: TInvoice;
  changeCurrentInvoice: (ind: number) => void;
  addInvoiceToHistory: (invoice: TInvoice) => void;
};

const emptyInvoice: TInvoice = {
  headerData: {
    invoice_number: "",
    bill_to: "",
    date: new Date(),
    due_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    payment_terms: "",
  },
  items: [],
  footerData: {
    tax: "",
    discount: "",
    shipping: "",
    paid: "0",
  },
  amounts: {
    sub_total: 0,
    discount_amt: 0,
    tax_amt: 0,
    total: 0,
    due_amt: 0,
  },
};

const initialState: TInvoiceHistory = {
  invoices: [],
  invoice_count: 0,

  currentInvoice: emptyInvoice,
  changeCurrentInvoice: () => {},
  addInvoiceToHistory: () => {},
};

const InvoiceHistoryContext = createContext<TInvoiceHistory>(initialState);

// eslint-disable-next-line react-refresh/only-export-components
export const useInvoiceHistory = () => useContext(InvoiceHistoryContext);

const InvoiceHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [currentInvoice, setCurrentInvoice] = useState<TInvoice>({
    headerData: {
      invoice_number: "",
      bill_to: "",
      date: new Date(),
      due_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      payment_terms: "",
    },
    items: [],
    footerData: {
      tax: "",
      discount: "",
      shipping: "",
      paid: "0",
    },
    amounts: {
      sub_total: 0,
      discount_amt: 0,
      tax_amt: 0,
      total: 0,
      due_amt: 0,
    },
  });
  const [invoiceList, setInvoiceList] = useState<TInvoice[]>([]);
  const [invoiceCount, setInvoiceCount] = useState(0);

  useEffect(() => {
    const count: number = JSON.parse(
      localStorage.getItem("invoice:count") || "0"
    );

    const history = JSON.parse(
      localStorage.getItem("invoice:list") || "[]"
    ) as TInvoice[];

    console.log({ currentInvoice, count, history });
    setInvoiceList(history);
    setInvoiceCount(count);

    if (history.at(-1)) {
      console.log("if");
      setCurrentInvoice(history.at(-1));
    } else console.log("else");

    // else {
    //   // setCurrentInvoice();
    //   console.log("sff");
    // }

    return () => {
      // localStorage.setItem("invoice:list", JSON.stringify(invoiceList));
      // localStorage.setItem("invoice:count", `${invoiceCount}`);
    };
  }, []);

  const changeCurrentInvoice = (ind: number) => {
    const history = JSON.parse(
      localStorage.getItem("invoice:list") || "[]"
    ) as TInvoice[];

    console.log({ history, ind });

    // if (ind <= history.length) setCurrentInvoice(history.at(ind));
  };

  const addInvoiceToHistory = (invoice: TInvoice) => {
    setInvoiceList((prev) => [...prev, invoice]);
  };

  return (
    <InvoiceHistoryContext.Provider
      value={{
        ...initialState,
        addInvoiceToHistory,
        changeCurrentInvoice,
        currentInvoice,
      }}
    >
      {children}
    </InvoiceHistoryContext.Provider>
  );
};

export default InvoiceHistoryProvider;
