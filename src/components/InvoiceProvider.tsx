import {
  FC,
  ReactNode,
  RefObject,
  createRef,
  useContext,
  useEffect,
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
  date?: Date;
  due_date: Date;
  payment_terms?: string;
  bill_to: string;
  ship_to?: string;
};

export type TInvoiceItem = {
  name: string;
  quantity: number | string;
  rate: number | string;
  total_amt?: number;
};

export type TInvoiceFooter = {
  tax: string | number;
  discount: string | number;
  shipping: string | number;
  paid: string | number;
};

export type TAmounts = {
  sub_total: number;
  discount_amt: number;
  tax_amt: number;
  total: number;
  due_amt: number;
};

export type TInvoice = {
  headerData: TInvoiceHeader;
  items: TInvoiceItem[];
  footerData: TInvoiceFooter;
  amounts: TAmounts;
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
};

// eslint-disable-next-line react-refresh/only-export-components
export const initialState: TInvoiceDataContext = {
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
};

const InvoiceDataContext = createContext<TInvoiceDataContext>(initialState);

// eslint-disable-next-line react-refresh/only-export-components
export const useInvoice = () => useContext(InvoiceDataContext);

const InvoiceProvider: FC<ProviderProps> = ({ children }) => {
  const { currentInvoice } = useInvoiceHistory();

  // *  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ =========== HEADER PART ==========  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓

  const [headerData, setHeaderData] = useState<TInvoiceHeader>(
    currentInvoice.headerData
  );

  useEffect(() => setHeaderData(currentInvoice.headerData), [currentInvoice]);

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

  const { discount, paid, shipping, tax } = footerData;

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

  const tax_amt =
    typeof tax == "number" && tax != 0
      ? (+tax * (sub_total - discount_amt)) / 100
      : 0;

  const total = tax_amt + (sub_total - discount_amt) + +shipping;
  const due_amt = total - +paid;

  const amounts: TAmounts = {
    sub_total,
    discount_amt,
    tax_amt,
    total,
    due_amt,
  };

  // * ↑ ↑ ↑ ↑ ↑ ↑ ↑ ============  FOOTER DATA PART   ============ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑

  const printRef = useRef<HTMLDivElement>(null);

  const [dueAmt, setDueAmt] = useState<string | number>("0");

  const { addInvoiceToHistory } = useInvoiceHistory();

  const saveToHistory = () => {
    addInvoiceToHistory({ amounts, footerData, headerData, items: itemsList });
  };

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
        saveToHistory,
      }}
    >
      {children}
    </InvoiceDataContext.Provider>
  );
};

export default InvoiceProvider;
