import type { FC } from "react";
import { KeyboardEvent, useId, useState } from "react";
import { Eye, ChevronRight, Package, Plus, X, Star, BookOpen, Mail, Check, ShoppingCart, Users, FileEdit, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Popular",
  "Favourites",
  "Signals and Technical indicators",
  "Strategies and Portfolios",
  "Trading robots and Algorithms",
  "Investment consultants",
  "Analysts",
  "Traders",
  "Scripts and Software",
  "Courses and Training materials",
  "Others",
] as const;

const isActivationKey = (key: string) => key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

type Trader = {
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

type FaqItem = {
  id: string;
  question: string;
  description?: string;
  bullets?: string[];
};

const faqs: FaqItem[] = [
  {
    id: "partner",
    question: "How can I become a partner?",
    description:
      "Register for the affiliate program using your verified trading account and submit an application describing your audience and expertise. Our team will review it within two business days and send onboarding instructions.",
    bullets: [
      "Complete the quick partner application",
      "Verify your contact and payout details",
      "Receive onboarding materials to launch your campaign",
    ],
  },
  {
    id: "percentage",
    question: "What percentage will I receive for each referred client?",
    description:
      "Your commission depends on the performance tier you unlock. The more active clients you attract, the higher the rate becomes, with rewards recalculated every month.",
    bullets: [
      "Base tier starts at 20% of platform fees",
      "Unlock 30% by referring 10 active clients monthly",
      "Reach 40% with premium tier by maintaining top retention",
    ],
  },
  {
    id: "payouts",
    question: "How often are payouts made?",
    description:
      "Affiliate rewards are processed automatically every Monday. You can choose the payout method that suits you best and monitor payment status inside your dashboard.",
    bullets: [
      "Weekly transfers in USD or USDT",
      "Minimum withdrawal amount is $50",
      "Detailed payout history stored in your dashboard",
    ],
  },
  {
    id: "tools",
    question: "What tools are provided for partners?",
    description:
      "We provide a comprehensive set of tools to help you effectively attract clients and grow your earnings. After registering for the affiliate program, you'll gain access to your personal dashboard where you can:",
    bullets: [
      "Track client statistics and analytics",
      "Use ready-made promotional materials (banners, text copies, images)",
      "Receive a unique referral link for automatic tracking of your referred clients",
    ],
  },
];

const traders: Trader[] = [
  {
    id: "sarah-lee-primary",
    name: "Sarah Lee",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    badge: "Securities trading (USA)",
    followers: "15,054",
    publications: "983",
    trades30Days: "45",
    experience: "5 years",
    roiMonth: "+28.4%",
    roiQuarter: "+28.4%",
    avgProfitability: "+4.2%",
    accuracy: "74%",
    certification: "Series 7 (General Securities Representative)",
    rating: "5.0",
  },
  {
    id: "sarah-lee-secondary",
    name: "Sarah Lee",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    badge: "Securities trading (USA)",
    followers: "12,903",
    publications: "742",
    trades30Days: "39",
    experience: "5 years",
    roiMonth: "+24.1%",
    roiQuarter: "+31.7%",
    avgProfitability: "+3.8%",
    accuracy: "71%",
    certification: "Series 7 (General Securities Representative)",
    rating: "4.9",
  },
];

const PerformanceChart: FC = () => {
  const id = useId();
  const gradientId = `${id}-gradient`;
  const strokeId = `${id}-stroke`;

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 312 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M1 77.6667L3.31346 73.6648L10.2537 75.1392L14.8806 69.663L24.7127 68.1886L27.6045 69.663L29.3396 67.3462L32.2314 69.0311L36.2798 63.9762L40.3284 63.7656L43.7985 68.1886L50.7388 70.2949L54.7873 67.7674H57.1007L58.2575 66.7143H65.1978L68.0896 69.0311L72.138 65.8718L75.6082 66.7143L76.1866 63.5549L83.1268 59.1319L91.2239 60.185L92.3805 58.5L99.8992 62.0806L101.056 59.9744L103.948 60.8168L111.466 58.5L114.358 52.1813L123.034 56.815L129.974 57.8681L132.866 56.815L135.179 48.6007L139.228 47.7582L143.276 47.1264L146.746 34.2784L151.373 28.5916L154.265 32.804L154.843 27.5385L160.627 28.8022L168.146 22.4835L172.772 11.5311L177.399 13.2161L182.026 19.956L184.918 4.15934L188.388 11.5311L190.123 10.6886L191.858 12.163L195.328 9.21429L199.377 14.6905L202.269 10.6886L203.425 18.2711L206.896 14.6905L212.679 15.533L214.414 18.9029L219.619 6.68681L221.354 9.21429L223.668 7.73993H226.56L235.235 1L238.127 14.6905L243.91 16.1648L248.537 21.4304L252.007 16.3755C253.164 17.92 255.478 21.0513 255.478 21.2198C255.478 21.3883 258.177 16.7967 259.526 14.4799L262.996 17.0073L267.623 6.89744L276.298 4.58059L280.347 5.84432L282.66 3.10623L289.601 22.6941L292.493 20.5879L298.276 21.2198L303.481 11.5311L311 5.84432L311 79H1V77.6667Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M1 77.6667L3.31346 73.6648L10.2537 75.1392L14.8806 69.663L24.7127 68.1886L27.6045 69.663L29.3396 67.3462L32.2314 69.0311L36.2798 63.9762L40.3284 63.7656L43.7985 68.1886L50.7388 70.2949L54.7873 67.7674H57.1007L58.2575 66.7143H65.1978L68.0896 69.0311L72.138 65.8718L75.6082 66.7143L76.1866 63.5549L83.1268 59.1319L91.2239 60.185L92.3805 58.5L99.8992 62.0806L101.056 59.9744L103.948 60.8168L111.466 58.5L114.358 52.1813L123.034 56.815L129.974 57.8681L132.866 56.815L135.179 48.6007L139.228 47.7582L143.276 47.1264L146.746 34.2784L151.373 28.5916L154.265 32.804L154.843 27.5385L160.627 28.8022L168.146 22.4835L172.772 11.5311L177.399 13.2161L182.026 19.956L184.918 4.15934L188.388 11.5311L190.123 10.6886L191.858 12.163L195.328 9.21429L199.377 14.6905L202.269 10.6886L203.425 18.2711L206.896 14.6905L212.679 15.533L214.414 18.9029L219.619 6.68681L221.354 9.21429L223.668 7.73993H226.56L235.235 1L238.127 14.6905L243.91 16.1648L248.537 21.4304L252.007 16.3755C253.164 17.92 255.478 21.0513 255.478 21.2198C255.478 21.3883 258.177 16.7967 259.526 14.4799L262.996 17.0073L267.623 6.89744L276.298 4.58059L280.347 5.84432L282.66 3.10623L289.601 22.6941L292.493 20.5879L298.276 21.2198L303.481 11.5311L311 5.84432"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={gradientId} x1="1" y1="1" x2="1" y2="79" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A06AFF" stopOpacity="0.32" />
          <stop offset="1" stopColor="#181A20" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={strokeId} x1="1" y1="1" x2="1" y2="79" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C6A6FF" />
          <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const TraderPerformanceChart: FC = () => <PerformanceChart />;

const AnalystPerformanceChart: FC = () => <PerformanceChart />;

const FavoriteStarButton: FC<{ pressed: boolean; onToggle: () => void }> = ({ pressed, onToggle }) => (
  <button
    type="button"
    aria-pressed={pressed}
    aria-label="Toggle favorite"
    onPointerDown={(event) => event.stopPropagation()}
    onPointerUp={(event) => event.stopPropagation()}
    onMouseDown={(event) => event.stopPropagation()}
    onMouseUp={(event) => event.stopPropagation()}
    onTouchStart={(event) => event.stopPropagation()}
    onTouchEnd={(event) => event.stopPropagation()}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onToggle();
    }}
    onKeyDown={(event) => event.stopPropagation()}
    className={cn(
      "relative z-10 rounded-full p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]/60",
      pressed ? "text-[#A06AFF]" : "text-[#B0B0B0]",
    )}
  >
    <Star className="h-6 w-6" strokeWidth={pressed ? 1.5 : 1.4} fill={pressed ? "#A06AFF" : "none"} />
  </button>
);

const TraderCard: FC<{ trader: Trader; isActive: boolean; onSelect: () => void; isFavorite: boolean; onToggleFavorite: () => void }> = ({ trader, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative cursor-pointer rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="absolute right-4 top-4">
        <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
      </div>
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-xl shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]">
            <img
              src={trader.avatar}
              alt={trader.name}
              className="block h-full w-full object-cover object-center [transform:scale(1.2)]"
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <span className="rounded bg-[#A06AFF] px-1 text-[12px] font-extrabold uppercase text-white">PRO</span>
              <span className="rounded bg-[#1C3430] px-1 text-[12px] font-bold text-[#2EBD85]">{trader.rating}</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-bold leading-tight text-white">{trader.name}</h3>
              <div className="flex flex-wrap items-center gap-1">
                <span className="rounded bg-[#3E321D] px-1 py-0.5 text-[12px] font-extrabold uppercase text-[#FFA800]">
                  {trader.badge}
                </span>
                <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5 text-[12px] font-bold text-white">
                  <Users className="h-4 w-4 text-[#B0B0B0]" />
                  {trader.followers}
                </span>
                <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5 text-[12px] font-bold text-white">
                  <FileEdit className="h-4 w-4 text-[#B0B0B0]" />
                  {trader.publications}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-[12px] font-bold uppercase text-[#B0B0B0]">
              <div className="flex items-center gap-1">
                <span>Number of trades in 30 days:</span>
                <span className="text-[#2EBD85]">{trader.trades30Days}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Experience:</span>
                <span className="text-[#2EBD85]">{trader.experience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-14 w-full overflow-hidden">
          <TraderPerformanceChart />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-bold uppercase text-[#B0B0B0] sm:gap-y-3 sm:text-[12px]">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>ROI(Month)</span>
            <span className="text-[#2EBD85]">{trader.roiMonth}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>ROI(3 Months)</span>
            <span className="text-[#2EBD85]">{trader.roiQuarter}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>Average trade profit</span>
            <span className="text-[#2EBD85]">{trader.avgProfitability}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>Trades accuracy</span>
            <span className="text-[#2EBD85]">{trader.accuracy}</span>
          </div>
        </div>

        <div className="text-[12px] font-extrabold text-white">{trader.certification}</div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-[12px] font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
            <BookOpen className="h-4 w-4" />
            Learn More
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-[12px] font-bold uppercase text-white transition-opacity hover:opacity-90">
            <Mail className="h-4 w-4" />
            Contact
          </button>
        </div>
      </div>
    </div>
  </div>
);

type Analyst = {
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

type InvestmentConsultant = {
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

const analysts: Analyst[] = [
  {
    id: "analyst-sarah-lee",
    name: "Sarah Lee",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
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
    avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
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

const investmentConsultants: InvestmentConsultant[] = [
  {
    id: "consultant-sarah-lee",
    name: "Sarah Lee",
    credentials: "CFP®",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "SONMORE FINANCIAL",
    location: "Chandler, AZ",
    nationwide: true,
    description: "Helping Retirees and Professionals in Aerospace and Tech Minimize Taxes",
    clients: "232",
    riskLevel: "Moderate",
    aum: "$4.2M",
    portfolioReturn: "+0.00%",
    featured: true,
  },
  {
    id: "consultant-james-wilson",
    name: "James Wilson",
    credentials: "CFA",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "WEALTH ADVISORS GROUP",
    location: "New York, NY",
    nationwide: true,
    description: "Specialized in High Net Worth Portfolio Management and Estate Planning",
    clients: "187",
    riskLevel: "Conservative",
    aum: "$6.8M",
    portfolioReturn: "+2.4%",
  },
];

type Signal = {
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
  chartImage: string;
};

const signals: Signal[] = [
  {
    id: "signal-risk-master",
    name: "Product Name",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128",
    users: "1,748",
    riskLevel: "LOW",
    platforms: ["binance", "mcx", "nyse", "kraken"],
    assets: ["STOCKS", "CRYPTO", "COMMODITIES", "+1"],
    type: "TREND/OSCILLATOR",
    timeframes: ["M15", "H4", "W1"],
    use: "TREND/REVERSAL",
    accuracy: "30%",
    chartImage: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
  },
  {
    id: "signal-risk-master-2",
    name: "Product Name",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128",
    users: "1,748",
    riskLevel: "LOW",
    platforms: ["binance", "mcx", "nyse", "kraken"],
    assets: ["STOCKS", "CRYPTO", "COMMODITIES", "+1"],
    type: "TREND/OSCILLATOR",
    timeframes: ["M15", "H4", "W1"],
    use: "TREND/REVERSAL",
    accuracy: "30%",
    chartImage: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
  },
];

type Strategy = {
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

const strategies: Strategy[] = [
  {
    id: "strategy-1",
    name: "Prodcut Name",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144",
    users: "315",
    riskLevel: "MEDIUM",
    profitSharing: "20% Profit Sharing",
    exchanges: ["bitcoin", "ripple", "tron", "dogecoin", "meta"],
    exchangesCount: 30,
    assets: ["STOCKS", "BONDS", "ETFS", "CRYPTO"],
    strategy: "MOMENTUM BREAKOUT",
    maxDrawdown: "15%",
    minCapital: "$1000",
    roi30d: "+60.33%",
    roi1y: "+60.33%",
  },
  {
    id: "strategy-2",
    name: "Prodcut Name",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144",
    users: "315",
    riskLevel: "MEDIUM",
    profitSharing: "20% Profit Sharing",
    exchanges: ["bitcoin", "ripple", "tron", "dogecoin", "meta"],
    exchangesCount: 30,
    assets: ["STOCKS", "BONDS", "ETFS", "CRYPTO"],
    strategy: "MOMENTUM BREAKOUT",
    maxDrawdown: "15%",
    minCapital: "$1000",
    roi30d: "+60.33%",
    roi1y: "+60.33%",
  },
];

type Course = {
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
};

const courses: Course[] = [
  {
    id: "course-1",
    title: "Expert Futures Trading",
    subtitle: "Expert Trading Training",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/785c3faa6d149a1cf74053c6eee68a561cfcead4?width=463",
    host: "Sarah Lee",
    students: "1,748",
    rating: "4.3",
    duration: "4.5H",
    lectures: "17 LECTURES",
    level: "ALL LEVELS",
  },
];

const AnalystCard: FC<{ analyst: Analyst; isActive: boolean; onSelect: () => void; isFavorite: boolean; onToggleFavorite: () => void }> = ({ analyst, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="absolute right-4 top-4">
        <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-xl shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]">
          <img src={analyst.avatar} alt={analyst.name} className="block h-full w-full object-cover object-center [transform:scale(1.2)]" />
        </div>
        <div className="flex h-[120px] flex-col justify-center gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold leading-none text-white">{analyst.name}</h3>
            <span className="rounded bg-[#A06AFF] px-1 text-xs font-extrabold text-white">PRO</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#B0B0B0]">{analyst.company}</div>
        </div>
      </div>

      <div className="-mt-6 h-14 w-full overflow-hidden">
        <AnalystPerformanceChart />
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <span className="rounded bg-[#3E321D] px-1 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">{analyst.role}</span>
        <span className="rounded bg-[#1C3430] px-1 py-0.5 text-xs font-bold text-[#2EBD85]">{analyst.rating}</span>
        <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5 text-xs font-bold text-white">
          <Users className="h-4 w-4 text-[#B0B0B0]" />
          {analyst.followers}
        </span>
        <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5 text-xs font-bold text-white">
          <FileEdit className="h-4 w-4 text-[#B0B0B0]" />
          {analyst.publications}
        </span>
      </div>

      <div className="grid gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
        <div className="flex items-center gap-1">
          <span>Markets:</span>
          <span className="text-white">{analyst.markets}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Assets:</span>
          <span className="text-white">{analyst.assets}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Analysis:</span>
          <span className="text-white">{analyst.analysis}</span>
        </div>
      </div>

      <div className="h-px w-full bg-[#181B22]" />

      <div className="flex items-center gap-1 text-xs font-bold uppercase">
        <span className="text-[#B0B0B0]">Forecast Accuracy:</span>
        <span className="text-[#2EBD85]">{analyst.forecastAccuracy}</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-[12px] font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
          <BookOpen className="h-4 w-4" />
          Learn More
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-[12px] font-bold uppercase text-white transition-opacity hover:opacity-90">
          <Mail className="h-4 w-4" />
          Contact
        </button>
      </div>
    </div>
  </div>
);

const InvestmentConsultantCard: FC<{ consultant: InvestmentConsultant; isActive: boolean; onSelect: () => void; isFavorite: boolean; onToggleFavorite: () => void }> = ({ consultant, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#0C1014]/50 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      {/* Decorative ribbon background */}
      <div className="absolute inset-x-0 top-0 h-48 overflow-hidden rounded-t-2xl">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f720613dd9fcaf1c3d357a5aaed12b083a2c1931?width=682"
          alt=""
          className="h-full w-full object-cover opacity-20 mix-blend-lighten"
        />
      </div>

      <div className="relative p-4">
        <div className="absolute right-4 top-4">
          <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
        </div>
        {/* Avatar and Header */}
        <div className="mb-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-xl shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]">
              <img
                src={consultant.avatar}
                alt={consultant.name}
                className="block h-full w-full object-cover object-center [transform:scale(1.2)]"
              />
            </div>
            <div className="flex h-24 flex-col justify-center gap-1">
              <div className="flex items-center gap-1">
                <h3 className="text-lg font-bold leading-none text-white sm:text-[19px]">
                  {consultant.name}, {consultant.credentials}
                </h3>
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.59517 1.74435C9.85534 1.64072 10.1445 1.64072 10.4047 1.74435C11.2433 2.07834 11.4072 3.36449 12.3968 3.43609C13.0936 3.48651 13.7774 2.9056 14.4767 3.07974C14.7587 3.14998 15.0023 3.32978 15.1549 3.58043C15.6226 4.34849 15.019 5.47739 15.7818 6.11469C16.3118 6.55727 17.1875 6.49999 17.6483 7.04254C17.8423 7.27108 17.9376 7.56915 17.9127 7.86971C17.8389 8.76379 16.699 9.32296 16.9495 10.2865C17.1228 10.9535 17.8543 11.4225 17.9127 12.1302C17.9376 12.4308 17.8423 12.7289 17.6483 12.9574C17.0693 13.639 15.8173 13.4145 15.4563 14.3385C15.2028 14.987 15.5283 15.8064 15.1549 16.4195C15.0023 16.6701 14.7587 16.85 14.4767 16.9202C13.6084 17.1364 12.7272 16.2037 11.8917 16.7298C11.2952 17.1053 11.0814 17.9862 10.4047 18.2555C10.1445 18.3592 9.85534 18.3592 9.59517 18.2555C8.91842 17.9862 8.70467 17.1053 8.10816 16.7298C7.28301 16.2103 6.37669 17.1327 5.52318 16.9202C5.24114 16.85 4.99759 16.6701 4.84496 16.4195C4.3773 15.6515 4.98079 14.5225 4.218 13.8852C3.6881 13.4426 2.81237 13.5 2.35162 12.9574C2.15759 12.7289 2.06229 12.4308 2.08713 12.1302C2.14563 11.4225 2.87692 10.9535 3.05034 10.2865C3.29832 9.33304 2.15995 8.75071 2.08713 7.86971C2.06229 7.56915 2.15759 7.27108 2.35162 7.04254C2.93055 6.36066 4.18241 6.5854 4.54357 5.66148C4.7971 5.01296 4.47165 4.19352 4.84496 3.58043C4.99759 3.32978 5.24114 3.14998 5.52318 3.07974C6.22246 2.9056 6.90623 3.48652 7.60307 3.43609C8.59267 3.36451 8.7565 2.07834 9.59517 1.74435Z"
                    fill="#A06AFF"
                  />
                  <path
                    d="M7.5 11.1111C7.5 11.1111 8.22917 11.1111 8.95833 12.5C8.95833 12.5 11.2745 9.02779 13.3333 8.33337"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#B0B0B0]">{consultant.company}</div>
            </div>
          </div>
      </div>

      {/* Location and Nationwide */}
        <div className="mb-3 flex items-center gap-4 text-xs font-bold text-white">
          <div className="flex items-center gap-0.5">
            <MapPin className="h-3 w-3" />
            <span>{consultant.location}</span>
          </div>
          {consultant.nationwide && (
            <div className="flex items-center gap-0.5">
              <Globe className="h-3 w-3" />
              <span>Nationwide</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">{consultant.description}</p>

        {/* Clients and Risk Level */}
        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className="text-[#B0B0B0]">Number of Clients</span>
            <span className="text-white">{consultant.clients}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className="text-[#B0B0B0]">Risk Level</span>
            <span className="text-white">{consultant.riskLevel}</span>
          </div>
        </div>

        {/* Contact Button */}
        <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 py-2.5 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
          <Mail className="h-4 w-4" />
          CONTACT
        </button>

        {/* Divider */}
        <div className="mb-2 h-px w-full bg-[#181B22]" />

        {/* AUM */}
        <div className="mb-2 flex items-center gap-0.5 text-sm font-bold sm:text-[15px]">
          <span className="text-white">Assets Under Management (AUM)</span>
          <span className="text-[#16C784]">{consultant.aum}</span>
        </div>

        {/* Divider */}
        <div className="mb-2 h-px w-full bg-[#181B22]" />

        {/* Portfolio Return */}
        <div className="flex items-center gap-2 text-sm font-bold sm:text-[15px]">
          <span className="text-white">Average Portfolio Return</span>
          <div className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 py-0.5">
            <span className="text-xs font-bold uppercase text-[#2EBD85]">{consultant.portfolioReturn}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const platformLogos = [
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1d90fdad8fa945dc9d0b417f6bb84c17?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fff6cd09eeae445f2bcc6ca0b891f197c?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F59711ad87739493eaa7a0b6857960587?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F59dfc5c913eb4f6d845cfb34003ed89b?format=webp&width=800",
];

const SignalCard: FC<{ signal: Signal; isActive: boolean; onSelect: () => void; isFavorite: boolean; onToggleFavorite: () => void }> = ({ signal, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="absolute right-4 top-4">
        <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
      </div>
      {/* Header with icon, name, users, risk */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <img src={signal.icon} alt={signal.name} className="h-16 w-16 rounded-lg" />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">{signal.name}</h3>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                <Users className="h-4 w-4 text-[#B0B0B0]" />
                <span className="text-xs font-bold text-white">{signal.users}</span>
              </div>
              <div className="flex items-center gap-1 rounded bg-[#1C3430] px-1 py-0.5">
                <span className="text-xs font-bold uppercase text-[#2EBD85]">Risk: {signal.riskLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#181B22]" />

      {/* Platforms and Details */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {signal.platforms.map((platform, idx) => (
            <img
              key={idx}
              src={platformLogos[idx % platformLogos.length]}
              alt={platform}
              className="h-8 w-8 rounded-full object-cover"
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Assets:</span>
          {signal.assets.map((asset, idx) => (
            <div key={idx} className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{asset}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Type:</span>
          <div className="rounded bg-[#2E2744] px-1 py-0.5">
            <span className="text-white">{signal.type}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Timeframe:</span>
          {signal.timeframes.map((tf, idx) => (
            <div key={idx} className="rounded bg-[rgba(106,165,255,0.16)] px-2 py-0.5">
              <span className="text-[#6AA5FF]">{tf}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Use:</span>
          <div className="rounded bg-[#2E2744] px-1 py-0.5">
            <span className="text-white">{signal.use}</span>
          </div>
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center gap-1 text-xs font-bold uppercase">
        <span className="text-[#B0B0B0]">Product Accuracy:</span>
        <span className="text-[15px] text-[#2EBD85]">{signal.accuracy}</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-xs font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
          <BookOpen className="h-4 w-4" />
          Learn More
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
          <ShoppingCart className="h-4 w-4" />
          Buy
        </button>
      </div>
    </div>
  </div>
);

const CourseCard: FC<{ course: Course; isActive: boolean; onSelect: () => void; isFavorite: boolean; onToggleFavorite: () => void }> = ({ course, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div className="w-full">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border bg-[#0C1014]/60 p-4 backdrop-blur-[50px] transition-colors md:flex-row md:items-center md:gap-6",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        className="h-[133px] w-full rounded-lg object-cover md:h-auto md:w-[231px] md:self-center"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 md:gap-3 md:justify-between">
        {/* Title */}
        <div className="flex items-start gap-4 pr-6 md:pr-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">{course.title}</h3>
            <p className="text-sm font-bold text-[#B0B0B0] sm:text-[15px]">{course.subtitle}</p>
          </div>
        </div>
        <div className="absolute right-4 top-4">
          <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
        </div>

        {/* Host and Details */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">HOST:</span>
            <span className="text-sm font-bold text-white sm:text-[15px]">{course.host}</span>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                <Users className="h-4 w-4 text-[#B0B0B0]" />
                <span className="text-xs font-bold text-white">{course.students}</span>
              </div>
              <div className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1 py-0.5">
                <span className="text-xs font-bold text-[#2EBD85]">{course.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">TOTAL:</span>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{course.duration}</span>
            </div>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{course.lectures}</span>
            </div>
            <div className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5">
              <span className="text-[#6AA5FF]">{course.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:self-end sm:items-center sm:gap-3 md:ml-auto">
        <button className="flex h-10 min-w-[130px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#141821] px-5 text-xs font-bold uppercase text-white transition-colors hover:border-[#1F2230]">
          <BookOpen className="h-4 w-4" />
          DETAILS
        </button>
        <button className="flex h-10 min-w-[130px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
          <ShoppingCart className="h-4 w-4" />
          BUY
        </button>
      </div>
    </div>
  </div>
);

const exchangeLogos = [
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F5812aa6cc56f419ca24acdce705cca81?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F31262df0fdbe4b649612c82741a80ce2?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F757765515d584eee8550efa4011da550?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Ffdb76a79e3714022a31f6ce34d69a80a?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F46bbf20463b949229b2fa9f4e5301083?format=webp&width=800",
];

const StrategyCard: FC<{ strategy: Strategy; isActive: boolean; onSelect: () => void; isFavorite: boolean; onToggleFavorite: () => void }> = ({ strategy, isActive, onSelect, isFavorite, onToggleFavorite }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return { bg: "bg-[#1C3430]", text: "text-[#2EBD85]" };
      case "MEDIUM":
        return { bg: "bg-[rgba(255,168,0,0.16)]", text: "text-[#FFA800]" };
      case "HIGH":
        return { bg: "bg-[rgba(234,57,67,0.16)]", text: "text-[#EA3943]" };
      default:
        return { bg: "bg-[#2E2744]", text: "text-white" };
    }
  };

  const riskColors = getRiskColor(strategy.riskLevel);

  return (
    <div className="mx-auto w-full max-w-[525px]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        onClick={onSelect}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (isActivationKey(event.key)) {
            event.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          "relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
          isActive ? "border-[#A06AFF]" : "border-[#181B22]",
        )}
      >
        <div className="absolute right-4 top-4">
          <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
        </div>
        {/* Header */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <img src={strategy.icon} alt={strategy.name} className="h-[72px] w-[72px] rounded-lg object-cover" />
          <div className="flex flex-1 flex-col gap-0.5">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">{strategy.name}</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                  <Users className="h-4 w-4 text-[#B0B0B0]" />
                  <span className="text-xs font-bold text-white">{strategy.users}</span>
                </div>
                <div className={`flex items-center gap-1 rounded px-1 py-0.5 ${riskColors.bg}`}>
                  <span className={`text-xs font-bold uppercase ${riskColors.text}`}>
                    Risk: {strategy.riskLevel}
                  </span>
                </div>
              </div>
              <div className="self-start flex items-center rounded bg-[rgba(46,189,133,0.16)] px-1 py-0.5">
                <span className="text-xs font-bold uppercase text-[#2EBD85]">{strategy.profitSharing}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#181B22]" />

        {/* Exchange Logos */}
        <div className="flex items-center gap-2">
          {exchangeLogos.map((logo, idx) => (
            <img key={idx} src={logo} alt="" className="h-8 w-8 rounded-full object-cover" />
          ))}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E2744]">
            <span className="text-xs font-bold text-white">+{strategy.exchangesCount}</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Exchanges:</span>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">ALL</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Assets:</span>
            {strategy.assets.map((asset, idx) => (
              <div key={idx} className="rounded bg-[#2E2744] px-1 py-0.5">
                <span className="text-white">{asset}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Strategy:</span>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{strategy.strategy}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Max Drawdown:</span>
            <div className="rounded bg-[rgba(160,106,255,0.16)] px-1 py-0.5">
              <span className="text-[#A06AFF]">{strategy.maxDrawdown}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Min. Capital:</span>
            <div className="rounded bg-[rgba(160,106,255,0.16)] px-1 py-0.5">
              <span className="text-[#A06AFF]">{strategy.minCapital}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#181B22]" />

        {/* ROI */}
        <div className="flex items-center justify-between text-xs font-bold uppercase">
          <div className="flex items-center gap-1">
            <span className="text-[#B0B0B0]">ROI (30D):</span>
            <span className="text-[#2EBD85]">{strategy.roi30d}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#B0B0B0]">ROI (1Y):</span>
            <span className="text-[#2EBD85]">{strategy.roi1y}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-xs font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
            <BookOpen className="h-4 w-4" />
            LEARN MORE
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
            <Check className="h-4 w-4" />
            SUBSCRIBE
          </button>
        </div>
      </div>
    </div>
  );
};

const MarketplaceMyProducts: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(new Set());
  const [openFaqId, setOpenFaqId] = useState<string | null>("tools");

  const toggleFavorite = (key: string) => {
    setFavoriteCardKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isFavorite = (key: string) => favoriteCardKeys.has(key);

  const scriptsCardKey = buildCardKey("scripts", "main");
  const otherCardKey = buildCardKey("other", "main");

  const scriptsFavorited = isFavorite(scriptsCardKey);
  const otherFavorited = isFavorite(otherCardKey);

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto w-full max-w-[880px] px-3 sm:px-4 xl:min-w-[880px]">
        <div className="flex flex-col gap-6 border-b border-[#181B22] pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-[56px] md:leading-[100%]">Marketplace</h1>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Total Balance</span>
                  <Eye className="h-4 w-4 text-[#808283] sm:h-5 sm:w-5" />
                </div>

                <div className="text-xl font-bold text-white sm:text-2xl">$1,000,000,000.00</div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Today's PnL</span>
                  <div className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 py-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#2EBD85] sm:text-xs">+ $0.00</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:h-[32px] sm:px-8 sm:text-[15px]"
                >
                  <Package className="h-4 w-4" />
                  <span>My Products</span>
                </button>

                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:h-[32px] sm:px-8 sm:text-[15px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="flex h-[170px] w-full items-center justify-center rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px] sm:h-[194px] lg:w-[260px] xl:w-[280px]">
              <span className="text-lg font-bold text-[#808283] sm:text-2xl">Advertising Banner</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "flex h-8 items-center justify-center rounded-full px-3 text-xs font-bold text-white backdrop-blur-[58px] transition-colors sm:gap-2 sm:text-sm md:px-4 md:text-[15px]",
                    isSelected
                      ? "bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                      : "border border-[#181B22] bg-[#0C101480] hover:border-[#1F2230]",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Traders Section */}
        <section className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Traders</h2>
            <a
              href="#"
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {traders.map((trader) => {
              const cardKey = buildCardKey("trader", trader.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <TraderCard
                  key={trader.id}
                  trader={trader}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </section>

        {/* Analysts Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Analysts</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {analysts.map((analyst) => {
              const cardKey = buildCardKey("analyst", analyst.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <AnalystCard
                  key={analyst.id}
                  analyst={analyst}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Investment Consultants Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Investment consultants</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {investmentConsultants.map((consultant) => {
              const cardKey = buildCardKey("consultant", consultant.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <InvestmentConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Signals and Technical Indicators Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Signals and Technical indicators</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {signals.map((signal) => {
              const cardKey = buildCardKey("signal", signal.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Strategies and Portfolios Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Strategies and Portfolios</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {strategies.map((strategy) => {
              const cardKey = buildCardKey("strategy", strategy.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Courses and Training materials Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Courses and Training materials</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="flex flex-col gap-6">
            {courses.map((course) => {
              const cardKey = buildCardKey("course", course.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Scripts and Software Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Scripts and Software</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeCardKey === scriptsCardKey}
            onClick={() => setActiveCardKey(scriptsCardKey)}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (isActivationKey(event.key)) {
                event.preventDefault();
                setActiveCardKey(scriptsCardKey);
              }
            }}
            className={cn(
              "relative cursor-pointer rounded-2xl border bg-[#0C101480] p-6 backdrop-blur-[50px] transition-colors",
              activeCardKey === scriptsCardKey ? "border-[#A06AFF]" : "border-[#181B22]",
            )}
          >
            <div className="absolute right-4 top-4 flex items-center gap-4 text-xs font-bold uppercase text-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4 text-[#FFA800]" />
                  <span className="text-[#FFA800]">1.5K</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-[#FFA800]" />
                  <span className="text-[#FFA800]">563</span>
                </div>
              </div>
              <FavoriteStarButton pressed={scriptsFavorited} onToggle={() => toggleFavorite(scriptsCardKey)} />
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              {/* Left side - Image and Type Details */}
              <div className="flex w-full flex-col gap-4 lg:w-80">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/7825b04c53855449a418b331c5ca1f44ac396b69?width=640"
                  alt="RiskMaster - Trading risk calculation script"
                  className="h-80 w-full rounded-lg object-cover"
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-bold uppercase text-[#B0B0B0] sm:flex sm:flex-nowrap sm:items-center sm:gap-6">
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="whitespace-nowrap">Type:</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">SCRIPT</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="whitespace-nowrap">Industry</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="inline-flex rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF] whitespace-nowrap">TRADING AND FINANCE</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="whitespace-nowrap">Revenue</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">USD $15,000/MONTH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="relative flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-4 border-b border-[#181B22] pb-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                      <div className="h-20 w-20 overflow-hidden rounded-lg">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F4a0f255d9e9940ecaf46e40918c30f1f?format=webp&width=800"
                        alt="Sarah Lee"
                        className="h-full w-full object-cover"
                      />
                    </div>
                      <div>
                        <h3 className="mb-2 text-lg font-bold text-white sm:text-[19px]">Sarah Lee</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold text-white">
                            <Users className="h-4 w-4 text-[#B0B0B0]" />
                            1,748
                          </span>
                          <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">Windows/Mac</span>
                          <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">Top Seller</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product details */}
                <div className="flex-1">
                  <h4 className="mb-2 text-lg font-bold text-white sm:text-[19px]">RiskMaster - Trading risk calculation script</h4>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-[rgba(160,106,255,0.16)] px-2 py-0.5 text-xs font-extrabold uppercase text-[#A06AFF]">Verified Listing</span>
                    <span className="text-xs font-bold uppercase text-white">🌍 Australia</span>
                  </div>
                  <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">
                    RiskMaster – powerful tool for traders, automatically calculates trade risks. Optimize trading and minimize losses!
                  </p>

                  <div className="mb-4 space-y-2 text-xs font-bold">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="uppercase text-[#B0B0B0]">Compatibility:</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">MetaTrader 4</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">MetaTrader 5</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">TradingView</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="uppercase text-[#B0B0B0]">Requirements:</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">Python 3.8+</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">numpy</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">pandas</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-[#FFA800] text-[#FFA800]" />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white sm:text-[15px]">5/5</span>
                    </div>
                  </div>
                </div>

                {/* Buttons at bottom */}
                <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
                  <button className="flex h-10 min-w-[130px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 text-xs font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
                    <BookOpen className="h-4 w-4" />
                    Details
                  </button>
                  <button className="flex h-10 min-w-[130px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
                    <ShoppingCart className="h-4 w-4" />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Robots Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Trading robots and Algorithms</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {[1, 2].map((i) => {
              const cardKey = buildCardKey("trading-robot", `${i}`);
              const isActive = activeCardKey === cardKey;
              const isFavorited = isFavorite(cardKey);

              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => setActiveCardKey(cardKey)}
                  onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                    if (isActivationKey(event.key)) {
                      event.preventDefault();
                      setActiveCardKey(cardKey);
                    }
                  }}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded-2xl border bg-[#0C101480] p-4 backdrop-blur-[50px] transition-colors",
                    isActive ? "border-[#A06AFF]" : "border-[#181B22]",
                  )}
                >
                  <div className="absolute right-4 top-4">
                    <FavoriteStarButton pressed={isFavorited} onToggle={() => toggleFavorite(cardKey)} />
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144"
                      alt="Product"
                      className="h-[72px] w-[72px] rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="text-lg font-bold text-white sm:text-[19px]">Product Name</h3>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-1 text-xs font-bold">
                          <span className="flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-white">
                            <Users className="h-4 w-4 text-[#B0B0B0]" />
                            315
                          </span>
                          <span className="inline-flex rounded bg-[#2A1C0E] px-2 py-0.5 font-extrabold uppercase text-[#FFA800]">Medium Accuracy</span>
                        </div>
                        <div className="flex items-center self-start rounded bg-[#1C3430] px-2 py-0.5">
                          <span className="text-xs font-extrabold uppercase text-[#2EBD85]">20% Profit Sharing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-[#181B22]" />

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#627EEA] to-[#627EEA]/80">
                      <svg width="20" height="20" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#fff" fillOpacity="0.6"/>
                        <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#fff"/>
                        <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#fff" fillOpacity="0.6"/>
                        <path d="M127.962 416.905v-104.72L0 236.585z" fill="#fff"/>
                        <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#fff" fillOpacity="0.2"/>
                        <path d="M0 212.32l127.96 75.638v-133.8z" fill="#fff" fillOpacity="0.6"/>
                      </svg>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#F3BA2F]">
                      <svg width="18" height="18" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M38.171 53.203L62.998 28.375L87.829 53.203L101.289 39.742L62.998 1.451L24.711 39.742L38.171 53.203Z" fill="white"/>
                        <path d="M1.45 63.004L14.91 49.543L28.371 63.004L14.91 76.464L1.45 63.004Z" fill="white"/>
                        <path d="M38.171 72.804L62.998 97.631L87.829 72.804L101.289 86.265L62.998 124.551L24.711 86.265L38.171 72.804Z" fill="white"/>
                        <path d="M97.625 63.004L111.086 49.543L124.546 63.004L111.086 76.464L97.625 63.004Z" fill="white"/>
                        <path d="M77.88 63.003H77.879L63.001 48.124L52.287 58.838L51.654 59.471L48.12 63.005L63.001 77.881L77.879 63.004L77.88 63.003Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <div className="grid h-4 w-4 grid-cols-3 gap-[1px]">
                        <div className="h-1 w-1 bg-white"></div>
                        <div className="h-1 w-1 bg-transparent"></div>
                        <div className="h-1 w-1 bg-white"></div>
                        <div className="h-1 w-1 bg-transparent"></div>
                        <div className="h-1 w-1 bg-white"></div>
                        <div className="h-1 w-1 bg-transparent"></div>
                        <div className="h-1 w-1 bg-white"></div>
                        <div className="h-1 w-1 bg-transparent"></div>
                        <div className="h-1 w-1 bg-white"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs font-bold">
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">PAIR:</span>
                      <span className="rounded bg-[#2E2744] px-1 py-0.5 uppercase text-white">BTC/USDT</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">MAX DRAWDOWN:</span>
                      <span className="rounded bg-[#1C3430] px-1 py-0.5 uppercase text-[#2EBD85]">-8.2%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">MArket type:</span>
                      <span className="rounded bg-[#2E2744] px-1 py-0.5 uppercase text-white">FuTures (x10 LEVERAGE)</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">Type:</span>
                      <span className="rounded bg-[#2E2744] px-1 py-0.5 uppercase text-white">Stocks</span>
                      <span className="rounded bg-[#2E2744] px-1 py-0.5 uppercase text-white">FUtures</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">sTRATEGY:</span>
                      <span className="rounded bg-[#2E2744] px-1 py-0.5 uppercase text-white">Tech Analysis (MA, RSI)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">Settings:</span>
                      <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 uppercase text-[#6AA5FF]">CUSTOM INDICATOR</span>
                    </div>
                  </div>

                  <div className="mt-4 h-14 w-full overflow-hidden">
                    <TraderPerformanceChart />
                  </div>

                  <div className="mt-3 border-t border-[#181B22]" />

                  <div className="mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="uppercase text-[#B0B0B0]">Calc. Apy</span>
                      <div className="inline-flex items-center justify-center rounded border border-[#B0B0B0] px-1.5 py-0 text-xs font-bold uppercase text-[#B0B0B0]">30D</div>
                    </div>
                    <div className="mt-0.5 text-2xl font-bold text-[#2EBD85]">+120.33%</div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
                    <button className="flex h-10 min-w-[130px] flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#141821] px-5 text-xs font-bold uppercase text-white transition-colors hover:border-[#1F2230]">
                      <BookOpen className="h-4 w-4" />
                      LEARN MORE
                    </button>
                    <button className="flex h-10 min-w-[130px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
                      <Check className="h-4 w-4" />
                      SUBSCRIBE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Other</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeCardKey === otherCardKey}
            onClick={() => setActiveCardKey(otherCardKey)}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (isActivationKey(event.key)) {
                event.preventDefault();
                setActiveCardKey(otherCardKey);
              }
            }}
            className={cn(
              "relative cursor-pointer rounded-2xl border bg-[#0C101480] p-4 backdrop-blur-[50px] transition-colors",
              activeCardKey === otherCardKey ? "border-[#A06AFF]" : "border-[#181B22]",
            )}
          >
            <div className="absolute right-4 top-4">
              <FavoriteStarButton pressed={otherFavorited} onToggle={() => toggleFavorite(otherCardKey)} />
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative h-[264px] w-full overflow-hidden rounded-lg lg:w-[451px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902"
                  alt="Product"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 left-1 rounded bg-[#2E2744] px-1 text-xs font-bold uppercase text-white">Windows/MAC</span>
              </div>

              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128"
                    alt="Author"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white sm:text-[19px]">Product Name</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1 py-0.5 text-xs font-bold text-[#2EBD85]">4.8</span>
                      <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 text-xs font-bold text-white">
                        <Users className="h-4 w-4 text-[#B0B0B0]" />
                        1,748
                      </span>
                      <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">Individual Analyst</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#181B22]" />

                <div>
                  <h4 className="mb-3 text-lg font-bold text-white sm:text-[19px]">Auto Script - Automation script</h4>
                  <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">
                    RiskMaster – powerful tool for traders, automatically calculates trade risks. Optimize trading and minimize losses!
                  </p>

                  <div className="mb-4 flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">Type:</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">Script</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">Industry:</span>
                      <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 uppercase text-[#6AA5FF]">Automation</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
                    <button className="flex h-10 min-w-[130px] flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#141821] px-5 text-xs font-bold uppercase text-white transition-colors hover:border-[#1F2230]">
                      <BookOpen className="h-4 w-4" />
                      DETAILS
                    </button>
                    <button className="flex h-10 min-w-[130px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
                      <ShoppingCart className="h-4 w-4" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10 mb-10 flex flex-col gap-6 py-6 sm:mt-16 sm:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-white sm:text-[56px] sm:leading-[100%]">FAQ</h2>
            <p className="max-w-[640px] text-sm font-bold text-[#B0B0B0] sm:text-[15px]">
              We've compiled answers to the most common questions about our affiliate program. If you have additional questions, please contact our{" "}
              <a href="#" className="text-white underline hover:opacity-80">
                support team
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={cn(
                    "rounded-2xl border bg-[#0C101480] backdrop-blur-[50px] transition-colors",
                    isOpen ? "border-[#A06AFF]" : "border-[#181B22]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId((prev) => (prev === faq.id ? null : faq.id))}
                    className="group flex w-full items-center justify-between gap-4 px-4 py-6 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg font-bold text-white sm:text-2xl">{faq.question}</span>
                    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                      <Plus
                        className={cn(
                          "absolute h-6 w-6 text-[#B0B0B0] transition-all",
                          isOpen ? "rotate-45 opacity-0" : "opacity-100",
                        )}
                        strokeWidth={2}
                      />
                      <X
                        className={cn(
                          "absolute h-6 w-6 text-[#B0B0B0] transition-all",
                          isOpen ? "opacity-100" : "-rotate-45 opacity-0",
                        )}
                        strokeWidth={1.5}
                      />
                    </div>
                  </button>
                  {isOpen && (faq.description || faq.bullets?.length) ? (
                    <div className="px-4 pb-6 text-sm font-bold leading-normal text-[#B0B0B0] sm:px-6 sm:text-[15px]">
                      {faq.description ? <p className="mb-3">{faq.description}</p> : null}
                      {faq.bullets?.length ? (
                        <ul className="space-y-1">
                          {faq.bullets.map((bullet) => (
                            <li key={bullet}>- {bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketplaceMyProducts;
