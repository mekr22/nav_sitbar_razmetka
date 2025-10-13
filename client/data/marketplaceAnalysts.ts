export type Analyst = {
  id: string;
  name: string;
  avatar: string;
  company: string;
  role: string;
  rating: string;
  followers: string;
  publications: string;
  markets: string;
  assets: string;
  analysis: string;
  forecastAccuracy: string;
  featured?: boolean;
};

export const baseAnalysts: Analyst[] = [
  {
    id: "analyst-sarah-lee",
    name: "Sarah Lee",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "BERKSHIRE HATHAWAY",
    role: "HEDGE FUND MANAGER",
    rating: "5.0",
    followers: "15,054",
    publications: "983",
    markets: "BINANCE, NASDAQ",
    assets: "BTC, ETH, TESLA, GOLD",
    analysis: "TECHNICAL & FUNDAMENTAL ANALYSIS",
    forecastAccuracy: "68%",
    featured: true,
  },
  {
    id: "analyst-alex-morgan",
    name: "Alex Morgan",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "SONMORE FINANCIAL",
    role: "INVESTMENT STRATEGIST",
    rating: "4.9",
    followers: "12,678",
    publications: "742",
    markets: "NYSE, NASDAQ",
    assets: "AAPL, NVDA, GOLD, BTC",
    analysis: "TECHNICAL & FUNDAMENTAL ANALYSIS",
    forecastAccuracy: "65%",
  },
];
