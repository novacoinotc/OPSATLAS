import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatClabe(clabe: string): string {
  return clabe.replace(/(\d{3})(\d{3})(\d{11})(\d{1})/, "$1 $2 $3 $4");
}

const GAMINGO_CLABES = [
  "684180327012000020",
  "684180327012000033",
  "684180327012000046",
  "684180327012000059",
  "684180327012000062",
  "684180327012000075",
  "684180327012000088",
  "684180327012000091",
  "684180327012000101",
  "684180327012000114",
];

const OASAT_CLABES = [
  "684180327011000021",
  "684180327011000034",
  "684180327011000047",
  "684180327011000050",
  "684180327011000063",
  "684180327011000076",
  "684180327011000089",
  "684180327011000092",
  "684180327011000102",
  "684180327011000115",
];

export function getCompanyFromClabe(clabe: string): string {
  if (GAMINGO_CLABES.includes(clabe)) return "Gamingo";
  if (OASAT_CLABES.includes(clabe)) return "Oasat";
  return "Desconocido";
}

export function isValidClabe(clabe: string): boolean {
  return GAMINGO_CLABES.includes(clabe) || OASAT_CLABES.includes(clabe);
}
