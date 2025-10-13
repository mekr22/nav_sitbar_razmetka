export type Strategy = {
  id: string;
  name: string;
  icon: string;
  users: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  profitSharing: string;
  exchanges: string[];
  exchangesCount: number;
  assets: string[];
  strategy: string;
  maxDrawdown: string;
  minCapital: string;
  roi30d: string;
  roi1y: string;
};

export const baseStrategies: Strategy[] = [
  {
    id: "strategy-momentum-alpha",
    name: "Momentum Alpha",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144",
    users: "315",
    riskLevel: "MEDIUM",
    profitSharing: "20% Profit Sharing",
    exchanges: ["binance", "ripple", "tron", "dogecoin", "meta"],
    exchangesCount: 30,
    assets: ["STOCKS", "BONDS", "ETFS", "CRYPTO"],
    strategy: "MOMENTUM BREAKOUT",
    maxDrawdown: "15%",
    minCapital: "$1,000",
    roi30d: "+12.4%",
    roi1y: "+68.3%",
  },
  {
    id: "strategy-income-stability",
    name: "Income Stability",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144",
    users: "428",
    riskLevel: "LOW",
    profitSharing: "15% Profit Sharing",
    exchanges: ["binance", "kraken", "coinbase", "bitfinex", "bybit"],
    exchangesCount: 24,
    assets: ["BONDS", "ETFS", "CRYPTO"],
    strategy: "INCOME ROTATION",
    maxDrawdown: "6%",
    minCapital: "$5,000",
    roi30d: "+4.1%",
    roi1y: "+22.7%",
  },
  {
    id: "strategy-global-macro",
    name: "Global Macro Edge",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144",
    users: "189",
    riskLevel: "HIGH",
    profitSharing: "25% Profit Sharing",
    exchanges: ["nyse", "lse", "hkex", "euronext", "tsx"],
    exchangesCount: 42,
    assets: ["STOCKS", "COMMODITIES", "FX"],
    strategy: "GLOBAL MACRO",
    maxDrawdown: "22%",
    minCapital: "$10,000",
    roi30d: "+18.6%",
    roi1y: "+84.2%",
  },
  {
    id: "strategy-balanced-growth",
    name: "Balanced Growth",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144",
    users: "512",
    riskLevel: "MEDIUM",
    profitSharing: "18% Profit Sharing",
    exchanges: ["nasdaq", "nyse", "cme", "binance", "bybit"],
    exchangesCount: 36,
    assets: ["STOCKS", "CRYPTO", "FUTURES"],
    strategy: "BALANCED MOMENTUM",
    maxDrawdown: "12%",
    minCapital: "$2,500",
    roi30d: "+9.7%",
    roi1y: "+54.9%",
  },
];
