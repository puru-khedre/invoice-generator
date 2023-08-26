import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceHistory } from "./InvoiceHistoryProvider";

interface CurrencySelectionProps {}
const CurrencySelection: FC<CurrencySelectionProps> = () => {
  const { currency, setCurrency } = useInvoiceHistory();
  console.log("🚀 ~ file: CurrencySelection.tsx:17 ~ currency:", currency);

  return (
    <Select onValueChange={setCurrency} defaultValue={currency}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Currencies</SelectLabel>
          <SelectItem value="INR">
            INR({formatCurrency(0, undefined, "INR")[0]}) - India
          </SelectItem>
          <SelectItem value="USD">
            USD({formatCurrency(0, undefined, "USD")[0]}) - US
          </SelectItem>
          <SelectItem value="EUR">
            EUR({formatCurrency(0, undefined, "EUR")[0]}) - Europe
          </SelectItem>
          <SelectItem value="SGD">
            SGD({formatCurrency(0, undefined, "SGD")[0]}) - Singapore
          </SelectItem>
          <SelectItem value="AUD">
            AUD({formatCurrency(0, undefined, "AUD")[0]}) - Australian
          </SelectItem>
          <SelectItem value="GBP">
            GBP({formatCurrency(0, undefined, "GBP")[0]}) - Britain
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

/* 
USD - US
EUR - Europe
SGD - Singapore
AUD - Australian
GBP - 
 */

export default CurrencySelection;
