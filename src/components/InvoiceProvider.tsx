import {
  FC,
  ReactNode,
  RefObject,
  createRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface ProviderProps {
  children: ReactNode;
}

import { createContext } from "react";
import { useInvoiceHistory } from "./InvoiceHistoryProvider";

export type TInvoiceHeader = {
  invoice_number: number | string;
  format_invoice_number: string;
  date?: Date;
  due_date: Date;
  payment_terms?: string;
  bill_to: string;
  bill_to_addr: string;
  ship_to?: string;
  ship_to_addr?: string;
};

export type TInvoiceItem = {
  name: string;
  quantity: number | string;
  rate: number | string;
  total_amt?: number;
};

export type TInvoiceFooter = {
  other_taxes: string | number;
  discount: string | number;
  shipping: string | number;
  paid: string | number;
  terms: string;
};

export type TAmounts = {
  sub_total: number;
  discount_amt: number;
  other_taxes_amt: number;
  gst_amt: number;
  total: number;
  due_amt: number;
};

export type TInvoice = {
  headerData: TInvoiceHeader;
  items: TInvoiceItem[];
  footerData: TInvoiceFooter;
  amounts: TAmounts;
  currency: string;
};

type TInvoiceDataContext = TInvoice & {
  setHeader: (cb: (prev: TInvoiceHeader) => TInvoiceHeader) => void;
  setFooter: (cb: (prev: TInvoiceFooter) => TInvoiceFooter) => void;
  setItem: {
    add: (item: TInvoiceItem) => void;
    edit: (ind: number, item: TInvoiceItem) => void;
    delete: (ind: number) => void;
  };
  printRef: RefObject<HTMLDivElement>;
  dueAmt: string | number;
  setDueAmt: (amt: string | number) => void;
  saveToHistory: () => void;
  formatInvoiceNumber: (num: number | string) => string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const initialState: TInvoiceDataContext = {
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
    paid: "0",
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

  setHeader: () => {},
  setFooter: () => {},
  setItem: {
    add: () => {},
    delete: () => {},
    edit: () => {},
  },
  printRef: createRef<HTMLDivElement>(),
  dueAmt: "0",
  setDueAmt: () => {},
  saveToHistory: () => {},
  formatInvoiceNumber: (num) => "" + num,
};

const InvoiceDataContext = createContext<TInvoiceDataContext>(initialState);

// eslint-disable-next-line react-refresh/only-export-components
export const useInvoice = () => useContext(InvoiceDataContext);

const InvoiceProvider: FC<ProviderProps> = ({ children }) => {
  const { currentInvoice, currency: cCurrency } = useInvoiceHistory();

  const formatInvoiceNumber = useMemo(() => {
    const date = new Date();

    let month: string | number = date.getMonth() + 1;
    month = month < 10 ? "0" + month : "" + month;

    const year = date.getFullYear();

    return (num: number | string) => `#0${num}-${month}${year}`;
  }, []);

  // *  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ =========== HEADER PART ==========  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓

  const [headerData, setHeaderData] = useState<TInvoiceHeader>(
    currentInvoice.headerData
  );

  useEffect(
    () =>
      setHeaderData({
        ...currentInvoice.headerData,
        format_invoice_number: formatInvoiceNumber(
          currentInvoice.headerData.invoice_number
        ),
      }),
    [currentInvoice, formatInvoiceNumber]
  );

  const setHeader = (cb: (prev: TInvoiceHeader) => TInvoiceHeader) => {
    setHeaderData(cb);
  };

  // * ↑ ↑ ↑ ↑ ↑ ↑ ↑ ============  HEADER PART   ============ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑

  // *  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ =========== ITEMS LIST PART ==========  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
  const [itemsList, setItemsList] = useState<TInvoiceItem[]>(
    currentInvoice.items
  );

  useEffect(() => setItemsList(currentInvoice.items), [currentInvoice]);

  const addItems = (item: TInvoiceItem) => {
    setItemsList((list) => [...list, item]);
  };

  const deleteItem = (index: number) => {
    setItemsList((list) => list.filter((_, ind) => ind !== index));
  };

  const editItem = (ind: number, item: TInvoiceItem) => {
    setItemsList((list) => {
      list[ind] = item;
      return list;
    });
  };

  // * ↑ ↑ ↑ ↑ ↑ ↑ ↑ ============  ITEMS LIST PART   ============ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑

  // *  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ =========== FOOTER DATA PART ==========  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓

  const [footerData, setFooterData] = useState<TInvoiceFooter>(
    currentInvoice.footerData
  );

  useEffect(() => setFooterData(currentInvoice.footerData), [currentInvoice]);

  const { discount, paid, shipping, other_taxes } = footerData;

  const setFooter = (cb: (prev: TInvoiceFooter) => TInvoiceFooter) => {
    setFooterData(cb);
  };

  const sub_total = itemsList.reduce(
    (total, item) => total + (item.total_amt ?? +item.quantity * +item.rate),
    0
  );

  const discount_amt =
    typeof discount == "number" && discount != 0
      ? (+discount * sub_total) / 100
      : 0;

  const other_taxes_amt =
    typeof other_taxes == "number" && other_taxes != 0
      ? (+other_taxes * (sub_total - discount_amt)) / 100
      : 0;

  const gst_amt =
    ((cCurrency === "INR" ? 18 : 0) * (sub_total - discount_amt)) / 100;

  const total =
    gst_amt + other_taxes_amt + (sub_total - discount_amt) + +shipping;
  const due_amt = total - +paid;

  const amounts: TAmounts = {
    sub_total,
    discount_amt,
    other_taxes_amt,
    gst_amt,
    total,
    due_amt,
  };

  // * ↑ ↑ ↑ ↑ ↑ ↑ ↑ ============  FOOTER DATA PART   ============ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑

  const printRef = useRef<HTMLDivElement>(null);

  const [dueAmt, setDueAmt] = useState<string | number>("0");

  const { addInvoiceToHistory } = useInvoiceHistory();

  const saveToHistory = () => {
    addInvoiceToHistory({
      amounts,
      footerData,
      headerData,
      items: itemsList,
      currency,
    });
  };

  const [currency, setCurrency] = useState(cCurrency);
  useEffect(() => setCurrency(cCurrency), [cCurrency]);

  return (
    <InvoiceDataContext.Provider
      value={{
        headerData,
        setHeader,
        items: itemsList,
        amounts,
        footerData,
        setFooter,
        setItem: { add: addItems, edit: editItem, delete: deleteItem },
        printRef,
        dueAmt,
        setDueAmt: (amt) => setDueAmt(amt),
        formatInvoiceNumber,
        saveToHistory,
        currency,
      }}
    >
      {children}
    </InvoiceDataContext.Provider>
  );
};

export default InvoiceProvider;
