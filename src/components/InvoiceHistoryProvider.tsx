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

  currency: string;
  setCurrency: (val: string) => void;

  currentInvoice: TInvoice;
  changeCurrentInvoice: (ind: number) => void;
  addInvoiceToHistory: (invoice: TInvoice) => void;
  createNewInvoice: () => void;
};

const emptyInvoice: TInvoice = {
  headerData: {
    invoice_number: "",
    format_invoice_number: "",
    bill_to: "",
    bill_to_addr: "",
    date: new Date(),
    due_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    payment_terms: "",
  },
  items: [],
  footerData: {
    other_taxes: "",
    discount: "",
    shipping: "",
    paid: "",
    terms: "",
  },
  amounts: {
    sub_total: 0,
    discount_amt: 0,
    other_taxes_amt: 0,
    gst_amt: 0,
    total: 0,
    due_amt: 0,
  },
  currency: "USD",
};

const initialState: TInvoiceHistory = {
  invoices: [],
  invoice_count: 0,

  currency: "USD",
  setCurrency: () => {},

  currentInvoice: emptyInvoice,
  changeCurrentInvoice: () => {},
  addInvoiceToHistory: () => {},
  createNewInvoice: () => {},
};

const InvoiceHistoryContext = createContext<TInvoiceHistory>(initialState);

// eslint-disable-next-line react-refresh/only-export-components
export const useInvoiceHistory = () => useContext(InvoiceHistoryContext);

const InvoiceHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [currentInvoice, setCurrentInvoice] = useState<TInvoice>(emptyInvoice);
  const [invoiceList, setInvoiceList] = useState<TInvoice[]>([]);
  const [, setInvoiceCount] = useState(0);
  const [currency, setCurrency] = useState(initialState.currency);

  useEffect(() => {
    const count: number = JSON.parse(
      localStorage.getItem("invoice:count") || "0"
    );

    const history = JSON.parse(
      localStorage.getItem("invoice:list") || "[]"
    ) as TInvoice[];

    setInvoiceList(history);
    setInvoiceCount(count);

    const iNo =
      history.reduce(
        (r, i) =>
          +i.headerData.invoice_number > r ? +i.headerData.invoice_number : r,
        0
      ) + 1;

    setCurrentInvoice((prev) => ({
      ...prev,
      headerData: { ...prev.headerData, invoice_number: iNo },
    }));

    if (history.at(-1)) {
      console.log({ iNo });

      // const i = history.at(-1);
      // if (i) {
      //   i.headerData.invoice_number = iNo;
      //   setCurrentInvoice(i);
      // }
    }
  }, []);

  const changeCurrentInvoice = (ind: number) => {
    setCurrentInvoice(invoiceList[ind]);
  };

  const createNewInvoice = () => {
    const iNo =
      invoiceList.reduce(
        (r, i) =>
          +i.headerData.invoice_number > r ? +i.headerData.invoice_number : r,
        0
      ) + 1;

    setCurrentInvoice({
      ...emptyInvoice,
      headerData: { ...emptyInvoice.headerData, invoice_number: iNo },
    });
  };

  const addInvoiceToHistory = (invoice: TInvoice) => {
    let isInEdit = false;
    invoiceList.forEach((value, i) => {
      if (
        +value.headerData.invoice_number === +invoice.headerData.invoice_number
      ) {
        setInvoiceList((prev) => {
          prev[i] = value;
          localStorage.setItem("invoice:list", JSON.stringify(prev));
          return prev;
        });
        isInEdit = true;
      }
    });

    if (isInEdit == false) {
      setInvoiceList((prev) => {
        const newList = [...prev, invoice];

        localStorage.setItem("invoice:list", JSON.stringify(newList));
        return newList;
      });

      console.log({ items: emptyInvoice.items });
      setCurrentInvoice({
        ...emptyInvoice,
        headerData: {
          ...emptyInvoice.headerData,
          invoice_number: +invoice.headerData.invoice_number + 1,
        },
      });
    }
  };

  return (
    <InvoiceHistoryContext.Provider
      value={{
        ...initialState,
        invoices: invoiceList,
        addInvoiceToHistory,
        changeCurrentInvoice,
        currentInvoice,
        createNewInvoice,
        currency,
        setCurrency: (val: string) => setCurrency(val),
      }}
    >
      {children}
    </InvoiceHistoryContext.Provider>
  );
};

export default InvoiceHistoryProvider;
