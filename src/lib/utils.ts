import { type ClassValue, clsx } from "clsx";
import {
  DollarSign,
  Euro,
  IndianRupee,
  LucideIcon,
  PoundSterling,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateToInputStyle = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString().split("/").reverse().join("-");
};

export const formatCurrency = (
  num: number,
  locale: string = "en-US",
  currency: string = "INR"
): string => {
  const f = Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    currencyDisplay: "symbol",
  });

  // let str = f.format(num);
  // str += str[0];
  // str = str.slice(1);
  return f.format(num);
};

export const currencyIcon = (curr: string): LucideIcon => {
  switch (curr) {
    case "INR":
      return IndianRupee;
    case "GBP":
      return PoundSterling;
    case "SGD":
      return DollarSign;
    case "EUR":
      return Euro;
    default:
      return DollarSign;
  }
};
