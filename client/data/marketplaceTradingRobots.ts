export type TradingRobot = {
  id: string;
  name: string;
  icon: string;
  users: string;
  accuracyLabel: string;
  accuracyLevel: "LOW" | "MEDIUM" | "HIGH";
  profitSharing: string;
  exchanges: { id: string; name: string; icon: string }[];
  pair: string;
  maxDrawdown: string;
  market: string;
  assetTags: string[];
  strategy: string;
  settingsTag: string;
  roi30d: string;
  roi90d: string;
  roi1y: string;
  automationStyle: "trend" | "grid" | "arbitrage" | "scalping";
  marketCategory: "spot" | "futures" | "derivatives";
  leverageCategory: "low" | "moderate" | "high";
};

export const RISK_MASTER_ICON =
  "https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144";

const exchangeIcons = {
  binance:
    "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F31262df0fdbe4b649612c82741a80ce2?format=webp&width=512",
  bybit:
    "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F46bbf20463b949229b2fa9f4e5301083?format=webp&width=512",
  kraken:
    "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Ffdb76a79e3714022a31f6ce34d69a80a?format=webp&width=512",
  huobi:
    "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F5812aa6cc56f419ca24acdce705cca81?format=webp&width=512",
  okx: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F757765515d584eee8550efa4011da550?format=webp&width=512",
} as const;

export const baseTradingRobots: TradingRobot[] = [
  {
    id: "quant-vertex",
    name: "Quant Vertex",
    icon: RISK_MASTER_ICON,
    users: "315",
    accuracyLabel: "Medium Accuracy",
    accuracyLevel: "MEDIUM",
    profitSharing: "20% Profit Sharing",
    exchanges: [
      { id: "binance", name: "Binance", icon: exchangeIcons.binance },
      { id: "okx", name: "OKX", icon: exchangeIcons.okx },
      { id: "kraken", name: "Kraken", icon: exchangeIcons.kraken },
    ],
    pair: "BTC/USDT",
    maxDrawdown: "8.2%",
    market: "Futures (x10 leverage)",
    assetTags: ["CRYPTO", "FUTURES"],
    strategy: "Tech Analysis (MA, RSI)",
    settingsTag: "CUSTOM INDICATOR",
    roi30d: "+120.3%",
    roi90d: "+248.6%",
    roi1y: "+842.1%",
    automationStyle: "trend",
    marketCategory: "futures",
    leverageCategory: "moderate",
  },
  {
    id: "grid-flow",
    name: "Grid Flow Pro",
    icon: RISK_MASTER_ICON,
    users: "428",
    accuracyLabel: "High Accuracy",
    accuracyLevel: "HIGH",
    profitSharing: "18% Profit Sharing",
    exchanges: [
      { id: "binance", name: "Binance", icon: exchangeIcons.binance },
      { id: "bybit", name: "Bybit", icon: exchangeIcons.bybit },
      { id: "huobi", name: "Huobi", icon: exchangeIcons.huobi },
    ],
    pair: "ETH/USDT",
    maxDrawdown: "4.6%",
    market: "Spot grid (x2 leverage)",
    assetTags: ["CRYPTO", "SPOT"],
    strategy: "AI Grid Balancing",
    settingsTag: "AUTO ADAPTIVE",
    roi30d: "+42.8%",
    roi90d: "+88.4%",
    roi1y: "+221.5%",
    automationStyle: "grid",
    marketCategory: "spot",
    leverageCategory: "low",
  },
  {
    id: "arb-scout",
    name: "Arb Scout X",
    icon: RISK_MASTER_ICON,
    users: "189",
    accuracyLabel: "High Accuracy",
    accuracyLevel: "HIGH",
    profitSharing: "25% Profit Sharing",
    exchanges: [
      { id: "okx", name: "OKX", icon: exchangeIcons.okx },
      { id: "kraken", name: "Kraken", icon: exchangeIcons.kraken },
      { id: "huobi", name: "Huobi", icon: exchangeIcons.huobi },
    ],
    pair: "BTC/ETH",
    maxDrawdown: "3.1%",
    market: "Cross-exchange arbitrage",
    assetTags: ["CRYPTO", "DERIVATIVES"],
    strategy: "Triangular Arbitrage",
    settingsTag: "MULTI-LEG",
    roi30d: "+26.4%",
    roi90d: "+71.2%",
    roi1y: "+198.7%",
    automationStyle: "arbitrage",
    marketCategory: "derivatives",
    leverageCategory: "low",
  },
  {
    id: "pulse-scalper",
    name: "Pulse Scalper",
    icon: RISK_MASTER_ICON,
    users: "502",
    accuracyLabel: "Medium Accuracy",
    accuracyLevel: "MEDIUM",
    profitSharing: "22% Profit Sharing",
    exchanges: [
      { id: "bybit", name: "Bybit", icon: exchangeIcons.bybit },
      { id: "binance", name: "Binance", icon: exchangeIcons.binance },
      { id: "okx", name: "OKX", icon: exchangeIcons.okx },
    ],
    pair: "SOL/USDT",
    maxDrawdown: "11.4%",
    market: "Perpetual futures (x20 leverage)",
    assetTags: ["CRYPTO", "PERPS"],
    strategy: "Latency Scalping",
    settingsTag: "HFT READY",
    roi30d: "+78.9%",
    roi90d: "+156.2%",
    roi1y: "+412.5%",
    automationStyle: "scalping",
    marketCategory: "futures",
    leverageCategory: "high",
  },
];
