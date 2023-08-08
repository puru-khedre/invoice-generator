import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateToInputStyle = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString().split("/").reverse().join("-");
};

export const formatCurrency = (num: number): string => {
  const f = Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  let str = f.format(num);
  str += str[0];
  str = str.slice(1);
  return str;
};
