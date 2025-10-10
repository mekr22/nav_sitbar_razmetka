import type { FC } from "react";
import { useState } from "react";
import { Eye, ChevronRight, Package, Plus, Star, BookOpen, Mail, Check, ShoppingCart, Users, FileEdit, MapPin, Globe } from "lucide-react";
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

const TraderPerformanceChart: FC = () => (
  <svg className="h-full w-full" viewBox="0 0 360 57" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M3.67163 36.9779L1 38.9593V57H359V3.39853L350.317 6.21419L344.306 11.0113L337.627 10.6984L334.287 11.7412L326.272 2.04284L323.601 3.39853L318.925 2.77283L308.907 3.91995L303.563 8.92557L299.556 7.67417C297.997 8.82129 294.881 11.0947 294.881 11.0113C294.881 10.9278 292.209 9.37747 290.873 8.61272L286.866 11.1155L281.522 8.50844L274.843 7.77845L271.504 1L261.485 4.33708H258.145L255.474 5.06707L253.47 3.81566L247.459 9.86413L245.455 8.19559L238.776 7.77845L234.769 9.55128L233.433 5.79706L230.093 7.77845L225.418 5.06707L221.41 6.52705L219.407 5.79706L217.403 6.21419L213.395 2.56426L210.056 10.3855L204.713 7.04846L199.369 6.21419L194.026 11.637L185.343 14.7655L178.664 14.1398L177.996 16.7469L174.657 14.6612L169.313 17.4769L165.306 23.8382L160.631 24.151L155.955 24.5682L153.284 28.6352L149.944 29.1566L141.929 28.6352L131.91 26.341L128.571 29.4695L119.888 30.6166L116.548 30.1995L115.213 31.2423L106.53 29.4695L105.194 30.3038L95.8432 29.7824L87.8283 31.9723L87.1605 33.5366L83.153 33.1194L78.4775 34.6837L75.138 33.5366H67.1231L65.7873 34.058H63.1157L58.4403 35.3094L50.4253 34.2666L46.4179 32.0766L41.7425 32.1809L37.0672 34.6837L33.7276 33.8494L31.7238 34.9965L28.3843 34.2666L17.0298 34.9965L11.6865 37.7079L3.67163 36.9779Z"
      fill="url(#traderGradient)"
    />
    <path
      d="M350.317 6.21419L344.306 11.0113L337.627 10.6984L334.287 11.7412L326.272 2.04284L323.601 3.39853L318.925 2.77283L308.907 3.91995L303.563 8.92557L299.556 7.67417C297.997 8.82129 294.881 11.0947 294.881 11.0113C294.881 10.9278 292.209 9.37747 290.873 8.61272L286.866 11.1155L281.522 8.50844L274.843 7.77845L271.504 1L261.485 4.33708H258.145L255.474 5.06707L253.47 3.81566L247.459 9.86413L245.455 8.19559L238.776 7.77845L234.769 9.55128L233.433 5.79706L230.093 7.77845L225.418 5.06707L221.41 6.52705L219.407 5.79706L217.403 6.21419L213.395 2.56426L210.056 10.3855L204.713 7.04846L199.369 6.21419L194.026 11.637L185.343 14.7655L178.664 14.1398L177.996 16.7469L174.657 14.6612L169.313 17.4769L165.306 23.8382L160.631 24.151L155.955 24.5682L153.284 28.6352L149.944 29.1566L141.929 28.6352L131.91 26.341L128.571 29.4695L119.888 30.6166L116.548 30.1995L115.213 31.2423L106.53 29.4695L105.194 30.3038L95.8432 29.7824L87.8283 31.9723L87.1605 33.5366L83.153 33.1194L78.4775 34.6837L75.138 33.5366H67.1231L65.7873 34.058H63.1157L58.4403 35.3094L50.4253 34.2666L46.4179 32.0766L41.7425 32.1809L37.0672 34.6837L33.7276 33.8494L31.7238 34.9965L28.3843 34.2666L17.0298 34.9965L11.6865 37.7079L3.67163 36.9779"
      stroke="url(#traderStroke)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="traderGradient" x1="-152.286" y1="1" x2="-152.286" y2="57" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A06AFF" stopOpacity="0.32" />
        <stop offset="1" stopColor="#181A20" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="traderStroke" x1="-152.286" y1="1" x2="-152.286" y2="57" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C6A6FF" />
        <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </svg>
);

const AnalystPerformanceChart: FC = () => (
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
      fill="url(#analystGradient)"
    />
    <path
      d="M1 77.6667L3.31346 73.6648L10.2537 75.1392L14.8806 69.663L24.7127 68.1886L27.6045 69.663L29.3396 67.3462L32.2314 69.0311L36.2798 63.9762L40.3284 63.7656L43.7985 68.1886L50.7388 70.2949L54.7873 67.7674H57.1007L58.2575 66.7143H65.1978L68.0896 69.0311L72.138 65.8718L75.6082 66.7143L76.1866 63.5549L83.1268 59.1319L91.2239 60.185L92.3805 58.5L99.8992 62.0806L101.056 59.9744L103.948 60.8168L111.466 58.5L114.358 52.1813L123.034 56.815L129.974 57.8681L132.866 56.815L135.179 48.6007L139.228 47.7582L143.276 47.1264L146.746 34.2784L151.373 28.5916L154.265 32.804L154.843 27.5385L160.627 28.8022L168.146 22.4835L172.772 11.5311L177.399 13.2161L182.026 19.956L184.918 4.15934L188.388 11.5311L190.123 10.6886L191.858 12.163L195.328 9.21429L199.377 14.6905L202.269 10.6886L203.425 18.2711L206.896 14.6905L212.679 15.533L214.414 18.9029L219.619 6.68681L221.354 9.21429L223.668 7.73993H226.56L235.235 1L238.127 14.6905L243.91 16.1648L248.537 21.4304L252.007 16.3755C253.164 17.92 255.478 21.0513 255.478 21.2198C255.478 21.3883 258.177 16.7967 259.526 14.4799L262.996 17.0073L267.623 6.89744L276.298 4.58059L280.347 5.84432L282.66 3.10623L289.601 22.6941L292.493 20.5879L298.276 21.2198L303.481 11.5311L311 5.84432"
      stroke="url(#analystStroke)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="analystGradient" x1="1" y1="1" x2="1" y2="79" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A06AFF" stopOpacity="0.32" />
        <stop offset="1" stopColor="#181A20" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="analystStroke" x1="1" y1="1" x2="1" y2="79" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C6A6FF" />
        <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </svg>
);

const TraderCard: FC<{ trader: Trader; featured?: boolean }> = ({ trader, featured }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      className={cn(
        "relative rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px]",
        featured ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-4">
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
            <div className="flex items-start justify-between gap-2">
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
              <Star className="h-6 w-6 flex-shrink-0 text-[#B0B0B0]" />
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

const AnalystCard: FC<{ analyst: Analyst; featured?: boolean }> = ({ analyst, featured }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px]",
        featured ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
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
        <Star className="h-6 w-6 flex-shrink-0 text-[#B0B0B0]" />
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

const InvestmentConsultantCard: FC<{ consultant: InvestmentConsultant; featured?: boolean }> = ({ consultant, featured }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border bg-[#0C1014]/50 backdrop-blur-[50px]",
        featured ? "border-[#A06AFF]" : "border-[#181B22]",
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
        {/* Avatar and Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
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
          <Star className="h-6 w-6 flex-shrink-0 text-[#B0B0B0]" />
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

const SignalCard: FC<{ signal: Signal }> = ({ signal }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div className="relative flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
      {/* Header with icon, name, users, risk */}
      <div className="flex items-start justify-between">
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
        <Star className="h-6 w-6 text-[#B0B0B0]" />
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

const CourseCard: FC<{ course: Course }> = ({ course }) => (
  <div className="w-full">
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4 backdrop-blur-[50px] md:flex-row md:items-stretch md:gap-6">
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        className="h-[133px] w-full rounded-lg object-cover md:h-full md:w-[231px]"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 md:gap-3 md:justify-between">
        {/* Title and Star */}
        <div className="flex items-start justify-between gap-4 pr-6 md:pr-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">{course.title}</h3>
            <p className="text-sm font-bold text-[#B0B0B0] sm:text-[15px]">{course.subtitle}</p>
          </div>
        </div>
        <Star className="absolute right-4 top-4 h-6 w-6 text-[#B0B0B0]" />

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

const StrategyCard: FC<{ strategy: Strategy }> = ({ strategy }) => {
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
      <div className="relative flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
        {/* Header */}
        <div className="flex items-start gap-3">
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
              <div className="self-start rounded bg-[rgba(46,189,133,0.16)] px-1 py-0.5">
                <span className="text-xs font-bold uppercase text-[#2EBD85]">{strategy.profitSharing}</span>
              </div>
            </div>
          </div>
          <Star className="h-6 w-6 flex-shrink-0 text-[#B0B0B0]" />
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
                  className="flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:h-[32px] sm:px-8 sm:text-[15px]"
                >
                  <Package className="h-4 w-4" />
                  <span>My Products</span>
                </button>

                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] px-3 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:h-[32px] sm:text-[15px]"
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
        <section className="flex flex-col gap-8 py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Traders</h2>
            <a
              href="#"
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {traders.map((trader, index) => (
              <TraderCard key={trader.id} trader={trader} featured={index === 0} />
            ))}
          </div>
        </section>

        {/* Analysts Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Analysts</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {analysts.map((analyst, index) => (
              <AnalystCard key={analyst.id} analyst={analyst} featured={index === 0} />
            ))}
          </div>
        </div>

        {/* Investment Consultants Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Investment consultants</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {investmentConsultants.map((consultant, index) => (
              <InvestmentConsultantCard key={consultant.id} consultant={consultant} featured={index === 0} />
            ))}
          </div>
        </div>

        {/* Signals and Technical Indicators Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Signals and Technical indicators</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>

        {/* Strategies and Portfolios Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Strategies and Portfolios</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {strategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        </div>

        {/* Courses and Training materials Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Courses and Training materials</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="flex flex-col gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* Scripts and Software Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Scripts and Software</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="relative rounded-2xl border border-[#A06AFF] bg-[#0C101480] p-6 backdrop-blur-[50px]">
            <div className="absolute right-6 top-6 flex items-center gap-4 text-xs font-bold uppercase text-white">
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
              <Star className="h-6 w-6 text-[#B0B0B0]" />
            </div>
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left side - Image and Type Details */}
              <div className="flex w-full flex-col gap-4 lg:w-80">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/7825b04c53855449a418b331c5ca1f44ac396b69?width=640"
                  alt="RiskMaster - Trading risk calculation script"
                  className="h-80 w-full rounded-lg object-cover"
                />

                <div className="grid grid-cols-2 gap-4 text-xs font-bold sm:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <span className="uppercase text-[#B0B0B0]">Type:</span>
                    <span className="w-fit rounded bg-[#2E2744] px-2 py-0.5 uppercase text-white">Script</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="uppercase text-[#B0B0B0]">Industry</span>
                    <span className="w-fit rounded bg-[rgba(106,165,255,0.16)] px-2 py-0.5 uppercase text-[#6AA5FF]">Trading and Finance</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="uppercase text-[#B0B0B0]">Publication Date</span>
                    <span className="w-fit rounded bg-[#2E2744] px-2 py-0.5 uppercase text-white">2 years ago</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="uppercase text-[#B0B0B0]">Revenue</span>
                    <span className="w-fit rounded bg-[#2E2744] px-2 py-0.5 uppercase text-white">USD $15,000/Month</span>
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="relative flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-4 border-b border-[#181B22] pb-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128"
                        alt="Sarah Lee"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
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
                    <span className="rounded bg-[#A06AFF]/16 px-2 py-0.5 text-xs font-bold uppercase text-[#A06AFF]">Verified Listing</span>
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
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Trading robots and Algorithms</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-[#0C101480] p-4 backdrop-blur-[50px]",
                  i === 1 ? "border border-[#A06AFF]" : "border border-[#181B22]",
                )}
              >
                <div className="flex items-start gap-3">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/daa27cffb99d482ad1e74982407438de65d54b84?width=144"
                    alt="Product"
                    className="h-[72px] w-[72px] rounded-lg object-cover"
                  />
                  <div className="flex flex-1 items-start justify-between">
                    <h3 className="text-lg font-bold text-white sm:text-[19px]">Product Name</h3>
                    <Star className="h-6 w-6 text-[#B0B0B0]" />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-600" />
                  <div className="h-8 w-8 rounded-full bg-gray-600" />
                  <div className="h-8 w-8 rounded-full bg-gray-600" />
                </div>

                <div className="mt-3 border-t border-[#181B22]" />

                <div className="mt-3 space-y-2 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 text-white">
                      <Users className="h-4 w-4 text-[#B0B0B0]" />
                      315
                    </span>
                    <span className="rounded bg-[#FFA800]/16 px-1 uppercase text-[#FFA800]">Medium Accuracy</span>
                    <span className="rounded bg-[#2EBD85]/16 px-1 uppercase text-[#2EBD85]">20% Profit Sharing</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">PAIR:</span>
                    <span className="rounded bg-[#2E2744] px-1 uppercase text-white">BTC/USDT</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">MAX DRAWDOWN:</span>
                    <span className="rounded bg-[#1C3430] px-1 uppercase text-[#2EBD85]">-8.2%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">Market type:</span>
                    <span className="rounded bg-[#2E2744] px-1 uppercase text-white">Futures (x10 LEVERAGE)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">Type:</span>
                    <span className="rounded bg-[#2E2744] px-1 uppercase text-white">Stocks</span>
                    <span className="rounded bg-[#2E2744] px-1 uppercase text-white">Futures</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">Strategy:</span>
                    <span className="rounded bg-[#2E2744] px-1 uppercase text-white">Tech Analysis (MA, RSI)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">Settings:</span>
                    <span className="rounded bg-[#6AA5FF]/16 px-1 uppercase text-[#6AA5FF]">Custom Indicators</span>
                  </div>
                </div>

                <div className="mt-4 relative h-[54px] w-full">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 312 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.31342 34.9377L1 36.8068V53.8244H311V3.26252L303.481 5.91851L298.276 10.4435L292.492 10.1484L289.601 11.1321L282.66 1.9837L280.347 3.26252L276.298 2.67229L267.623 3.75437L262.996 8.47614L259.526 7.2957C258.177 8.37777 255.478 10.5222 255.478 10.4435C255.478 10.3648 253.164 8.90241 252.007 8.18103L248.537 10.5419L243.91 8.08266L238.127 7.39407L235.235 1L226.56 4.14785H223.668L221.354 4.83644L219.619 3.656L214.414 9.36147L212.679 7.78755L206.895 7.39407L203.425 9.06636L202.269 5.52503L199.377 7.39407L195.328 4.83644L191.858 6.21362L190.123 5.52503L188.388 5.91851L184.918 2.47555L182.026 9.85332L177.399 6.70547L172.772 5.91851L168.145 11.0338L160.627 13.9849L154.843 13.3947L154.265 15.8539L151.373 13.8865L146.746 16.5425L143.276 22.5431L139.228 22.8382L135.179 23.2317L132.866 27.0681L129.974 27.56L123.033 27.0681L114.358 24.904L111.466 27.8551L103.948 28.9371L101.056 28.5437L99.8992 29.5274L92.3806 27.8551L91.2239 28.642L83.1268 28.1502L76.1865 30.216L75.6082 31.6915L72.1381 31.298L68.0895 32.7736L65.1977 31.6915H58.2575L57.1008 32.1834H54.7873L50.7388 33.3638L43.7985 32.3801L40.3283 30.3143L36.2798 30.4127L32.2313 32.7736L29.3395 31.9866L27.6044 33.0687L24.7127 32.3801L14.8806 33.0687L10.2537 35.6263L3.31342 34.9377Z" fill="url(#paint0_robot)" />
                    <defs>
                      <linearGradient id="paint0_robot" x1="-131.734" y1="1" x2="-131.734" y2="53.8244" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A06AFF" stopOpacity="0.32" />
                        <stop offset="1" stopColor="#181A20" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <span className="uppercase text-[#B0B0B0]">Calc. APY</span>
                    <span className="rounded border border-[#B0B0B0] px-1.5 uppercase text-[#B0B0B0]">30D</span>
                  </div>
                  <div className="mt-1 text-xl font-bold text-[#2EBD85] sm:text-2xl">+120.33%</div>
                </div>

                <div className="mt-4 flex gap-4">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] px-4 py-1.5 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:text-[15px]">
                    <BookOpen className="h-4 w-4" />
                    Learn More
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:text-[15px]">
                    <Check className="h-4 w-4" />
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Other</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="rounded-2xl border border-[#A06AFF] bg-[#0C101480] p-4 backdrop-blur-[50px]">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative h-[264px] w-full overflow-hidden rounded-lg lg:w-[451px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902"
                  alt="Product"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 left-1 rounded bg-[#2E2744] px-1 text-xs font-bold uppercase text-white">Windows/MAC</span>
              </div>

              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128"
                      alt="Author"
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white sm:text-[19px]">Product Name</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <span className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 text-xs font-bold text-[#2EBD85]">4.8</span>
                        <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 text-xs font-bold text-white">
                          <Users className="h-4 w-4 text-[#B0B0B0]" />
                          1,748
                        </span>
                        <span className="rounded bg-[#FFA800]/16 px-1 text-xs font-bold uppercase text-[#FFA800]">Individual Analyst</span>
                      </div>
                    </div>
                  </div>
                  <Star className="h-6 w-6 text-[#B0B0B0]" />
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
                      <span className="rounded bg-[#6AA5FF]/16 px-1 uppercase text-[#6AA5FF]">Automation</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] px-4 py-1.5 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:text-[15px]">
                      <BookOpen className="h-4 w-4" />
                      Details
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:text-[15px]">
                      <ShoppingCart className="h-4 w-4" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceMyProducts;
