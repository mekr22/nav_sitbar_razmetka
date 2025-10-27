import type { ProductType } from "@/lib/supabaseFavorites";

export type ProductFormKey = ProductType;

export type ProductTypeOption = {
  label: string;
  value: ProductFormKey;
  description?: string;
};

export const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
  {
    label: "Signal / Technical Indicator",
    value: "signal",
    description: "Signals and indicators for trading entries",
  },
  {
    label: "Strategy / Portfolio",
    value: "strategy",
    description: "Managed portfolios and trading strategies",
  },
  {
    label: "Trading Robot / Algorithm",
    value: "trading-robot",
    description: "Automated trading algorithms and bots",
  },
  {
    label: "Analyst",
    value: "analyst",
    description: "Professional market analysts",
  },
  {
    label: "Investment Consultant",
    value: "investment-consultant",
    description: "Licensed investment consultants",
  },
  {
    label: "Trader",
    value: "trader",
    description: "Experienced traders offering services",
  },
  {
    label: "Course / Training",
    value: "course",
    description: "Educational materials and courses",
  },
  {
    label: "Script / Software",
    value: "script",
    description: "Tools, scripts, and software",
  },
  {
    label: "Other",
    value: "other",
    description: "Any other marketplace product",
  },
];
