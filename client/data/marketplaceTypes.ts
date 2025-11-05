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

export type InvestmentConsultant = {
  id: string;
  name: string;
  credentials: string;
  avatar: string;
  company: string;
  location: string;
  nationwide: boolean;
  description: string;
  clients: string;
  riskLevel: string;
  aum: string;
  portfolioReturn: string;
  featured?: boolean;
};

export type Trader = {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  followers: string;
  publications: string;
  trades30Days: string;
  experience: string;
  roiMonth: string;
  roiQuarter: string;
  avgProfitability: string;
  accuracy: string;
  certification: string;
  rating: string;
};

export type Signal = {
  id: string;
  name: string;
  icon: string;
  users: string;
  riskLevel: string;
  platforms: string[];
  assets: string[];
  type: string;
  timeframes: string[];
  use: string;
  accuracy: string;
  chartImage?: string;
};

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

export type ExchangeInfo = {
  id: string;
  name: string;
  icon: string;
};

export type TradingRobot = {
  id: string;
  name: string;
  icon: string;
  users: string;
  accuracyLabel: string;
  accuracyLevel: "LOW" | "MEDIUM" | "HIGH";
  profitSharing: string;
  exchanges: ExchangeInfo[];
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

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  host: string;
  students: string;
  rating: string;
  duration: string;
  lectures: string;
  level: string;
  levelCategory: "beginner" | "intermediate" | "advanced" | "all";
  materialType: "course" | "training";
  releaseWindow: "24h" | "7d" | "30d";
  format: "video" | "ebook" | "live";
  focusArea: "stocks" | "forex" | "crypto" | "options" | "macro" | "futures";
  language: "english" | "spanish" | "german";
};

export type CreatorInfo = {
  name: string;
  avatar: string;
  followers: string;
  tags: string[];
};

export type ScriptProduct = {
  id: string;
  title: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  typeLabel: string;
  industryLabel: string;
  revenueLabel: string;
  purchases: string;
  views: string;
  creator: CreatorInfo;
  location: string;
  verificationLabel: string;
  compatibility: string[];
  requirements: string[];
  ratingScore: string;
};

export type OtherProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label: string;
  location: string;
  rating: string;
  ratingTag: string;
  typeLabel: string;
  industryLabel: string;
  compatibility: string[];
  requirements: string[];
};

export type MarketplaceCategory =
  | "All"
  | "Popular"
  | "Favourites"
  | "Signals and Technical indicators"
  | "Strategies and Portfolios"
  | "Trading robots and Algorithms"
  | "Investment consultants"
  | "Analysts"
  | "Traders"
  | "Courses and Training materials"
  | "Scripts and Software"
  | "Others";
