import type { FC } from "react";
import { useState } from "react";
import { Eye, ChevronRight, Package, Plus, Star, BookOpen, Mail, Check, ShoppingCart, Users, FileEdit } from "lucide-react";
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
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/d83ddcd1551e722a63cd2e617b3a356762dc989a?width=240",
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
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/d83ddcd1551e722a63cd2e617b3a356762dc989a?width=240",
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
    <defs>
      <linearGradient id="traderGradient" x1="-152.286" y1="1" x2="-152.286" y2="57" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A06AFF" stopOpacity="0.32" />
        <stop offset="1" stopColor="#181A20" stopOpacity="0" />
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
        <div className="flex gap-4">
          <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]">
            <img src={trader.avatar} alt={trader.name} className="h-full w-full object-cover" />
            <div className="absolute bottom-1 left-1 flex items-center gap-1">
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
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-4 py-2.5 text-[12px] font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
            <BookOpen className="h-4 w-4" />
            Learn More
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 py-2.5 text-[12px] font-bold uppercase text-white transition-opacity hover:opacity-90">
            <Mail className="h-4 w-4" />
            Contact/Hire
          </button>
        </div>
      </div>
    </div>
  </div>
);

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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px]",
                  i === 1 ? "border-[#A06AFF]" : "border-[#181B22]",
                )}
              >
                <div className="flex items-start justify-between">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/77e4df4a83a9976526d548c7af09c284d52a5034?width=192"
                    alt="Sarah Lee"
                    className="h-24 w-24 rounded-full object-cover shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]"
                  />
                  <Star className="h-6 w-6 text-[#B0B0B0]" />
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">Sarah Lee</h3>
                  <span className="rounded bg-[#A06AFF] px-1 text-[12px] font-extrabold text-white">PRO</span>
                </div>

                <div className="text-[12px] font-bold uppercase text-[#B0B0B0]">Berkshire Hathaway</div>

                <div className="relative h-[115px] w-full">
                  <svg className="h-full w-full" viewBox="0 0 312 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.31342 74.8833L1 78.9522V116H311V5.92555L303.481 11.7077L298.276 21.5588L292.492 20.9164L289.601 23.0579L282.66 3.14154L280.347 5.92555L276.298 4.64063L267.623 6.99632L262.996 17.2757L259.526 14.7059C258.177 17.0616 255.478 21.7301 255.478 21.5588C255.478 21.3875 253.164 18.2037 252.007 16.6333L248.537 21.773L243.91 16.4191L238.127 14.92L235.235 1L226.56 7.85294H223.668L221.354 9.35202L219.619 6.78217L214.414 19.2031L212.679 15.7767L206.896 14.92L203.425 18.5607L202.269 10.8511L199.377 14.92L195.328 9.35202L191.858 12.3502L190.123 10.8511L188.388 11.7077L184.918 4.21232L182.026 20.2739L177.399 13.421L172.772 11.7077L168.145 22.8438L160.627 29.2684L154.843 27.9835L154.265 33.3373L151.373 29.0542L146.746 34.8364L143.276 47.8998L139.228 48.5423L135.179 49.3989L132.866 57.7509L129.974 58.8217L123.033 57.7509L114.358 53.0395L111.466 59.4642L103.948 61.8199L101.056 60.9632L99.8992 63.1048L92.3806 59.4642L91.2239 61.1774L83.1268 60.1066L76.1865 64.6039L75.6082 67.8162L72.1381 66.9596L68.0895 70.1719L65.1977 67.8162H58.2575L57.1008 68.8869H54.7873L50.7388 71.4568L43.7985 69.3153L40.3283 64.818L36.2798 65.0322L32.2313 70.1719L29.3395 68.4586L27.6045 70.8143L24.7127 69.3153L14.8806 70.8143L10.2537 76.3823L3.31342 74.8833Z" fill="url(#paint0_analyst_${i})" />
                    <path d="M1 77.6667L3.31346 73.6648L10.2537 75.1392L14.8806 69.663L24.7127 68.1886L27.6045 69.663L29.3396 67.3462L32.2314 69.0311L36.2798 63.9762L40.3284 63.7656L43.7985 68.1886L50.7388 70.2949L54.7873 67.7674H57.1007L58.2575 66.7143H65.1978L68.0896 69.0311L72.138 65.8718L75.6082 66.7143L76.1866 63.5549L83.1268 59.1319L91.2239 60.185L92.3805 58.5L99.8992 62.0806L101.056 59.9744L103.948 60.8169L111.466 58.5L114.358 52.1813L123.034 56.815L129.974 57.8681L132.866 56.815L135.179 48.6007L139.228 47.7582L143.276 47.1264L146.746 34.2784L151.373 28.5916L154.265 32.804L154.843 27.5385L160.627 28.8022L168.146 22.4835L172.772 11.5311L177.399 13.2161L182.026 19.956L184.918 4.15934L188.388 11.5311L190.123 10.6886L191.858 12.163L195.328 9.21429L199.377 14.6905L202.269 10.6886L203.425 18.2711L206.896 14.6905L212.679 15.533L214.414 18.9029L219.619 6.68681L221.354 9.21429L223.668 7.73993H226.56L235.235 1L238.127 14.6905L243.91 16.1648L248.537 21.4304L252.007 16.3755C253.164 17.92 255.478 21.0513 255.478 21.2198C255.478 21.3883 258.177 16.7967 259.526 14.4799L262.996 17.0073L267.623 6.89744L276.298 4.58059L280.347 5.84432L282.66 3.10623L289.601 22.6941L292.493 20.5879L298.276 21.2198L303.481 11.5311L311 5.84432" stroke="#523A83" strokeWidth="1.00667" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="paint0_analyst_${i}" x1="-131.734" y1="1" x2="-131.734" y2="116" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A06AFF" stopOpacity="0.32" />
                        <stop offset="1" stopColor="#181A20" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  <span className="rounded bg-[#3E321D] px-1 py-0.5 text-[12px] font-extrabold uppercase text-[#FFA800]">
                    Hedge fund manager
                  </span>
                  <span className="rounded bg-[#1C3430] px-1 py-0.5 text-[12px] font-bold text-[#2EBD85]">5.0</span>
                  <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5 text-[12px] font-bold text-white">
                    <Users className="h-4 w-4 text-[#B0B0B0]" />
                    15,054
                  </span>
                  <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5 text-[12px] font-bold text-white">
                    <FileEdit className="h-4 w-4 text-[#B0B0B0]" />
                    983
                  </span>
                </div>

                <div className="space-y-2 text-[12px] font-bold">
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">Markets:</span>
                    <span className="uppercase text-white">Binance, NASDAQ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">Assets:</span>
                    <span className="uppercase text-white">BTC, ETH, Tesla, Gold</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="uppercase text-[#B0B0B0]">Analysis:</span>
                    <span className="uppercase text-white">Technical & Fundamental Analysis</span>
                  </div>
                </div>

                <div className="h-px w-full bg-[#181B22]" />

                <div className="flex items-center gap-1 text-[12px] font-bold">
                  <span className="uppercase text-[#B0B0B0]">Forecast Accuracy:</span>
                  <span className="uppercase text-[#2EBD85]">68%</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-4 py-2.5 text-[12px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
                    <BookOpen className="h-4 w-4" />
                    Learn More
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-2.5 text-[12px] font-bold text-white transition-opacity hover:opacity-90">
                    <Mail className="h-4 w-4" />
                    Contact/Hire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scripts/Products Section */}
        <div className="flex flex-col gap-8 border-t border-[#181B22] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Scripts and Software</h2>
            <a href="#" className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]">See all</a>
          </div>

          <div className="rounded-2xl border border-[#A06AFF] bg-[#0C101480] p-4 backdrop-blur-[50px]">
            <div className="flex flex-col gap-6 lg:flex-row">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/7825b04c53855449a418b331c5ca1f44ac396b69?width=640"
                alt="Product"
                className="h-80 w-full rounded-lg object-cover lg:w-80"
              />

              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white sm:text-[19px]">Sarah Lee</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 text-xs font-bold text-white">
                        <Users className="h-4 w-4 text-[#B0B0B0]" />
                        1,748
                      </span>
                      <span className="rounded bg-[#FFA800]/16 px-1 text-xs font-bold uppercase text-[#FFA800]">Windows/Mac</span>
                      <span className="rounded bg-[#FFA800]/16 px-1 text-xs font-bold uppercase text-[#FFA800]">Top Seller</span>
                    </div>
                  </div>
                  <Star className="h-6 w-6 text-[#B0B0B0]" />
                </div>

                <div className="border-t border-[#181B22]" />

                <div>
                  <h4 className="mb-2 text-lg font-bold text-white sm:text-[19px]">RiskMaster - Trading risk calculation script</h4>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#A06AFF]/16 px-1 text-xs font-bold uppercase text-[#A06AFF]">Verified Listing</span>
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
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3 text-xs font-bold sm:grid-cols-4">
                    <div>
                      <div className="uppercase text-[#B0B0B0]">Type:</div>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">Script</span>
                    </div>
                    <div>
                      <div className="uppercase text-[#B0B0B0]">Industry:</div>
                      <span className="rounded bg-[#6AA5FF]/16 px-1 uppercase text-[#6AA5FF]">Trading and Finance</span>
                    </div>
                    <div>
                      <div className="uppercase text-[#B0B0B0]">Publication Date:</div>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">2 years ago</span>
                    </div>
                    <div>
                      <div className="uppercase text-[#B0B0B0]">Revenue:</div>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">USD $15,000/Month</span>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-[#FFA800] text-[#FFA800]" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white sm:text-[15px]">5/5</span>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] px-4 py-2 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:text-[15px]">
                      <BookOpen className="h-5 w-5" />
                      Details
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:text-[15px]">
                      <ShoppingCart className="h-5 w-5" />
                      Add to cart
                    </button>
                  </div>
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
