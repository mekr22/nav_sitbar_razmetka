import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskNonWhitespace(value: string, maskChar = "•") {
  return value.replace(/\S/g, maskChar);
}

export function extractOriginalProductId(displayId: string): string {
  const match = displayId.match(/^(.+?)-pair-\d+-\d+$/);
  return match ? match[1] : displayId;
}
