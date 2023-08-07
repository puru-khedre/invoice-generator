import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateToInputStyle = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString().split("/").reverse().join("-");
};
