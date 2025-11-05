import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskNonWhitespace(value: string, maskChar = "•") {
  return value.replace(/\S/g, maskChar);
}

export function extractOriginalProductId(displayId: string): string {
  let originalId = displayId;

  originalId = originalId.replace(/-pair-\d+-\d+$/, "");
  originalId = originalId.replace(/-\d+-\d+$/, "");
  originalId = originalId.replace(/-variant-\d+$/, "");
  originalId = originalId.replace(/-set-\d+$/, "");

  return originalId;
}
