import { FC, useState } from "react";
import { Check, MessageCircle, Play, Star, ChevronLeft, ChevronRight } from "lucide-react";

const SignalsDetailLanding: FC = () => {
  const [activeTab, setActiveTab] = useState<"chart" | "source">("chart");

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex items-center gap-2 text-[15px]">
          <span className="font-normal text-[#B0B0B0]">
            Signals and Technical Indicators
          </span>
          <span className="font-bold text-[#B0B0B0]">/</span>
          <span className="font-bold text-white">Signal_name</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="inline-flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("chart")}
            className={`flex h-[26px] items-center justify-center gap-1.5 rounded-lg px-4 text-[15px] font-bold transition-colors ${
              activeTab === "chart"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C101480] text-white backdrop-blur-[50px]"
            }`}
          >
            Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("source")}
            className={`flex h-[26px] items-center justify-center gap-1.5 rounded-lg px-4 text-[15px] font-bold transition-colors ${
              activeTab === "source"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C101480] text-white backdrop-blur-[50px]"
            }`}
          >
            Source code
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left Column */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Hero Card */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
              <div className="flex items-center justify-between">
                <h1 className="text-[31px] font-bold leading-normal text-white">
                  Momentum Breakout: Signals with 65% accuracy
                </h1>
                <button type="button" className="text-[#B0B0B0] transition-colors hover:text-white">
                  <Star className="h-6 w-6" />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/4c71d8e41f45c8da08e1fc2fb08290037fcf089d?width=1360"
                  alt="Chart preview"
                  className="h-auto w-full"
                />
                
                {/* Navigation Arrows */}
                <button
                  type="button"
                  className="absolute left-8 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button
                  type="button"
                  className="absolute right-8 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#B0B0B0]">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                      <path d="M17.5 10C17.5 6.46447 17.5 4.6967 16.4017 3.59835C15.3033 2.5 13.5355 2.5 10 2.5C6.46447 2.5 4.6967 2.5 3.59835 3.59835C2.5 4.6967 2.5 6.46447 2.5 10C2.5 13.5355 2.5 15.3033 3.59835 16.4017C4.6967 17.5 5.46447 17.5 9 17.5" stroke="#B0B0B0" strokeWidth="1.5"/>
                      <path d="M5.83325 11.6663L8.16066 9.33892C8.48608 9.01351 9.01375 9.01351 9.33917 9.33892L10.6607 10.6604C10.9861 10.9858 11.5138 10.9858 11.8392 10.6604L14.1666 8.33301" stroke="#B0B0B0" strokeWidth="1.5"/>
                      <path d="M14.1666 11.667V18.3337M17.4999 15.0003H10.8333" stroke="#B0B0B0" strokeWidth="1.5"/>
                    </svg>
                    Use on chart
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                      <path d="M15.5135 16.667H15.922C16.8802 16.667 17.6423 16.2304 18.3267 15.62C20.0651 14.0692 15.9785 12.5003 14.5834 12.5003M12.9167 4.2243C13.106 4.18677 13.3025 4.16699 13.5041 4.16699C15.0207 4.16699 16.2501 5.28628 16.2501 6.66699C16.2501 8.0477 15.0207 9.16699 13.5041 9.16699C13.3025 9.16699 13.106 9.14724 12.9167 9.10966" stroke="#B0B0B0" strokeWidth="1.5"/>
                      <path d="M3.73443 13.426C2.75195 13.9525 0.175949 15.0276 1.7449 16.3728C2.51133 17.03 3.36493 17.5 4.4381 17.5H10.5619C11.6351 17.5 12.4887 17.03 13.2551 16.3728C14.8241 15.0276 12.2481 13.9525 11.2656 13.426C8.96167 12.1913 6.03833 12.1913 3.73443 13.426Z" stroke="#B0B0B0" strokeWidth="1.5"/>
                      <path d="M10.8334 6.25033C10.8334 8.09128 9.341 9.58366 7.50008 9.58366C5.65913 9.58366 4.16675 8.09128 4.16675 6.25033C4.16675 4.40938 5.65913 2.91699 7.50008 2.91699C9.341 2.91699 10.8334 4.40938 10.8334 6.25033Z" stroke="#B0B0B0" strokeWidth="1.5"/>
                    </svg>
                    <span className="text-xs font-extrabold text-[#B0B0B0]">311</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="h-5 w-5 text-[#B0B0B0]" />
                    <span className="text-xs font-extrabold text-[#B0B0B0]">87</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                    <path d="M17.9534 9.20449C18.2067 9.55974 18.3334 9.73741 18.3334 10.0003C18.3334 10.2632 18.2067 10.4409 17.9534 10.7962C16.815 12.3925 13.9077 15.8337 10.0001 15.8337C6.0924 15.8337 3.18516 12.3925 2.04678 10.7962C1.79342 10.4409 1.66675 10.2632 1.66675 10.0003C1.66675 9.73741 1.79342 9.55974 2.04678 9.20449C3.18516 7.60819 6.0924 4.16699 10.0001 4.16699C13.9077 4.16699 16.815 7.60819 17.9534 9.20449Z" stroke="#B0B0B0" strokeWidth="1.5"/>
                    <path d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z" stroke="#B0B0B0" strokeWidth="1.5"/>
                  </svg>
                  <span className="text-xs font-extrabold text-[#B0B0B0]">11,299</span>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Performance</h2>
              </div>
              <div className="relative p-4">
                <div className="h-[250px] w-full">
                  {/* Chart placeholder */}
                  <div className="flex h-full items-center justify-center text-[#B0B0B0]">
                    Performance Chart
                  </div>
                </div>
              </div>
            </div>

            {/* Accuracy Chart */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Accuracy</h2>
              </div>
              <div className="relative p-4">
                <div className="h-[280px] w-full">
                  {/* Chart placeholder */}
                  <div className="flex h-full items-center justify-center text-[#B0B0B0]">
                    Accuracy Chart
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#A06AFF]" />
                    <span className="text-xs font-bold uppercase text-[#808283]">Successful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#FFA800]" />
                    <span className="text-xs font-bold uppercase text-[#808283]">Unsuccessful</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Description</h2>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-normal text-white">
                  Catches breakouts on M5–D1 for crypto, stocks, and forex. Suitable for accounts starting from $500.
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Specifications</h2>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {[
                  "Strategy: RSI, Bollinger Bands",
                  "Exchanges: Binance, NYSE",
                  "Assets: BTC, AAPL, EUR/USD",
                  "Risk: Low, drawdown up to 10%",
                  "Signals: 5–10 per week",
                  "Stats: ROI chart, 311 subscribers, 4.5/5 rating, latest signals available"
                ].map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center">
                      <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                    </div>
                    <span className="text-[15px] font-normal text-white">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-col rounded-2xl border border-[#523A83] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#2E2744] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Features</h2>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-normal text-white">
                  Copy trading (auto/manual), alerts (Telegram), filters (crypto, H1)
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">20 comments</h2>
                <div className="flex items-center gap-1 rounded-lg border border-[#181B22] bg-[#0C101480] p-1 backdrop-blur-[50px]">
                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928" stroke="#B0B0B0" strokeWidth="1.5"/>
                      <path d="M8 5.33301V7.99967L9.33333 9.33301" stroke="#B0B0B0" strokeWidth="1.5"/>
                    </svg>
                  </button>
                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded bg-gradient-to-r from-[#A06AFF] to-[#482090]">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M9.23732 14.6663C17.3855 12.6663 12.8225 4.66634 7.28172 1.33301C6.63012 3.66634 5.65217 4.33301 3.69657 6.66634C1.10739 9.75561 2.39292 13.333 5.97805 14.6663C5.43485 13.9997 4.03297 12.6002 4.99992 10.6663C5.33325 9.99967 5.99992 9.33301 5.66659 7.99967C6.31844 8.33301 7.66659 8.66634 7.99992 10.333C8.54312 9.66634 9.10685 8.26634 8.58545 6.66634C12.6666 9.66634 10.9999 12.6663 9.23732 14.6663Z" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Comment Input */}
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-[#181B22] bg-[#0C101480] p-3 backdrop-blur-[50px]">
                  <p className="text-[15px] font-normal text-[#B0B0B0]">Comment...</p>
                </div>
                <button className="ml-auto flex h-[26px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-[15px] font-semibold text-white">
                  Send
                </button>
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88"
                    alt="User avatar"
                    className="h-11 w-11 rounded-full"
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-white">John Smith</span>
                      <span className="text-xs font-extrabold text-[#B0B0B0]">6 hours ago</span>
                    </div>
                    <p className="text-[15px] font-normal text-white">
                      Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.
                    </p>
                    <div className="flex items-center gap-1.5 text-[#B0B0B0]">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-xs font-extrabold">25</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="text-[15px] font-bold text-[#A06AFF]">Hide</button>
                      <button className="text-[15px] font-bold text-white">Reply</button>
                    </div>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] py-2 text-[15px] font-bold text-white">
                  16 more comments
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex w-full flex-col gap-6 lg:w-[339px]">
            {/* Product Card */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=678"
                alt="Product"
                className="h-auto w-full rounded-t-2xl border border-[#181B22]"
              />
              
              <div className="flex items-center gap-3 p-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[19px] font-bold text-white">Product Name</h3>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                        <path d="M12.406 13.333H12.7328C13.4993 13.333 14.1091 12.9837 14.6565 12.4954C16.0473 11.2547 12.778 9.99967 11.6619 9.99967M10.3286 3.37885C10.48 3.34883 10.6372 3.33301 10.7985 3.33301C12.0117 3.33301 12.9953 4.22844 12.9953 5.33301C12.9953 6.43757 12.0117 7.33301 10.7985 7.33301C10.6372 7.33301 10.48 7.31721 10.3286 7.28714" stroke="#B0B0B0" strokeWidth="1.5"/>
                        <path d="M2.98998 10.7408C2.204 11.162 0.143201 12.0221 1.39836 13.0983C2.0115 13.624 2.69438 14 3.55292 14H8.45198C9.31051 14 9.99338 13.624 10.6065 13.0983C11.8617 12.0221 9.80091 11.162 9.01491 10.7408C7.17178 9.75307 4.8331 9.75307 2.98998 10.7408Z" stroke="#B0B0B0" strokeWidth="1.5"/>
                        <path d="M8.66732 4.99967C8.66732 6.47243 7.47338 7.66634 6.00065 7.66634C4.52789 7.66634 3.33398 6.47243 3.33398 4.99967C3.33398 3.52691 4.52789 2.33301 6.00065 2.33301C7.47338 2.33301 8.66732 3.52691 8.66732 4.99967Z" stroke="#B0B0B0" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-xs font-bold text-white">1,748</span>
                    </div>
                    <div className="rounded bg-[#1C3430] px-1 py-0.5">
                      <span className="text-xs font-extrabold uppercase text-[#2EBD85]">Risk: LOW</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#181B22]" />

              <div className="flex items-center gap-2 p-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gray-700" />
                ))}
              </div>

              <div className="flex flex-col gap-2 px-4 pb-4 text-xs font-bold uppercase">
                <div className="flex items-center gap-1">
                  <span className="text-[#B0B0B0]">Assets:</span>
                  <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">Stocks</span>
                  <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">Crypto</span>
                  <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">+1</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#B0B0B0]">Type:</span>
                  <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">Trend/oscillator</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#B0B0B0]">Timeframe:</span>
                  <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF]">M15</span>
                  <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF]">H4</span>
                  <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF]">W1</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#B0B0B0]">Use:</span>
                  <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">Trend/Reversal</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#B0B0B0]">Product Accuracy:</span>
                  <span className="text-[15px] text-[#2EBD85]">30%</span>
                </div>
              </div>

              <div className="px-4 pb-2">
                <p className="text-2xl font-bold text-white">$10 / month</p>
              </div>

              <div className="flex flex-col gap-4 p-4">
                <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] py-2.5 text-[15px] font-bold text-white">
                  <Check className="h-4 w-4" />
                  Subscribe
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px]">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px]">
                  <Play className="h-4 w-4" />
                  Demo
                </button>
              </div>
            </div>

            {/* Author Card */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="flex items-center gap-2 p-4">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=160"
                  alt="Sarah Lee"
                  className="h-20 w-20 rounded-full"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-[15px] font-bold text-white">Sarah Lee</h3>
                  <button className="flex h-[26px] w-20 items-center justify-center rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] text-xs font-extrabold text-white">
                    Follow
                  </button>
                </div>
              </div>
              <div className="px-4 pb-2">
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  Join our 10k+ community: <a href="#" className="text-[#A06AFF] underline">example.com</a>
                </p>
              </div>
              <div className="px-4 pb-4">
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  Professional trader with 8+ years of experience in momentum strategies and technical analysis.
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 pb-4">
                <span className="text-[15px] font-normal text-[#B0B0B0]">Also on:</span>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="white" viewBox="0 0 16 16">
                    <path d="M12.2174 1.26953H14.4663L9.55298 6.88519L15.3332 14.5268H10.8073L7.26253 9.89222L3.20647 14.5268H0.956125L6.21146 8.52026L0.666504 1.26953H5.30724L8.51143 5.50575L12.2174 1.26953Z"/>
                  </svg>
                  <svg className="h-4 w-4" fill="white" viewBox="0 0 16 16">
                    <path d="M15.8406 4.8002C15.8406 4.8002 15.6844 3.69707 15.2031 3.2127C14.5938 2.5752 13.9125 2.57207 13.6 2.53457C11.3625 2.37207 8.00313 2.37207 8.00313 2.37207H7.99687C7.99687 2.37207 4.6375 2.37207 2.4 2.53457C2.0875 2.57207 1.40625 2.5752 0.796875 3.2127C0.315625 3.69707 0.1625 4.8002 0.1625 4.8002C0.1625 4.8002 0 6.09707 0 7.39082V8.60332C0 9.89707 0.159375 11.1939 0.159375 11.1939C0.159375 11.1939 0.315625 12.2971 0.79375 12.7814C1.40313 13.4189 2.20313 13.3971 2.55938 13.4658C3.84063 13.5877 8 13.6252 8 13.6252C8 13.6252 11.3625 13.6189 13.6 13.4596C13.9125 13.4221 14.5938 13.4189 15.2031 12.7814C15.6844 12.2971 15.8406 11.1939 15.8406 11.1939C15.8406 11.1939 16 9.90019 16 8.60332V7.39082C16 6.09707 15.8406 4.8002 15.8406 4.8002Z"/>
                  </svg>
                  <svg className="h-4 w-4" fill="white" viewBox="0 0 16 16">
                    <path d="M8 1.44062C10.1375 1.44062 10.3906 1.45 11.2313 1.4875C12.0125 1.52187 12.4344 1.65313 12.7156 1.7625C13.0875 1.90625 13.3563 2.08125 13.6344 2.35938C13.9156 2.64063 14.0875 2.90625 14.2313 3.27813C14.3406 3.55938 14.4719 3.98437 14.5063 4.7625C14.5438 5.60625 14.5531 5.85938 14.5531 7.99375C14.5531 10.1313 14.5438 10.3844 14.5063 11.225C14.4719 12.0063 14.3406 12.4281 14.2313 12.7094C14.0875 13.0813 13.9125 13.35 13.6344 13.6281C13.3531 13.9094 13.0875 14.0813 12.7156 14.225C12.4344 14.3344 12.0094 14.4656 11.2313 14.5C10.3875 14.5375 10.1344 14.5469 8 14.5469C5.8625 14.5469 5.60938 14.5375 4.76875 14.5C3.9875 14.4656 3.56563 14.3344 3.28438 14.225C2.9125 14.0813 2.64375 13.9063 2.36563 13.6281C2.08438 13.3469 1.9125 13.0813 1.76875 12.7094C1.65938 12.4281 1.52813 12.0031 1.49375 11.225C1.45625 10.3813 1.44688 10.1281 1.44688 7.99375C1.44688 5.85625 1.45625 5.60312 1.49375 4.7625C1.52813 3.98125 1.65938 3.55938 1.76875 3.27813C1.9125 2.90625 2.0875 2.6375 2.36563 2.35938C2.64688 2.07813 2.9125 1.90625 3.28438 1.7625C3.56563 1.65313 3.99063 1.52187 4.76875 1.4875C5.60938 1.45 5.8625 1.44062 8 1.44062Z"/>
                  </svg>
                  <svg className="h-4 w-4" fill="white" viewBox="0 0 16 16">
                    <path d="M8.00016 14.6663C4.31826 14.6663 1.3335 11.6815 1.3335 7.99967C1.3335 6.13798 2.0966 4.45452 3.32708 3.24502M8.00016 14.6663C7.35816 14.1906 7.46063 13.6367 7.7827 13.0828C8.2779 12.2313 8.2779 12.2313 8.2779 11.0959C8.2779 9.96061 8.95256 9.42827 11.3335 9.90441C12.4033 10.1184 13.1829 8.64027 14.5717 9.12834M8.00016 14.6663C11.2974 14.6663 14.0355 12.2727 14.5717 9.12834M3.32708 3.24502C3.89327 3.30477 4.21028 3.6081 4.7368 4.16445C5.73643 5.22069 6.73603 5.30882 7.4025 4.95674C8.4021 4.42863 7.5621 3.57321 8.7353 3.10833C9.45456 2.82335 9.59163 2.077 9.25123 1.4502M3.32708 3.24502C4.53013 2.06248 6.17996 1.33301 8.00016 1.33301C8.42776 1.33301 8.84596 1.37327 9.25123 1.4502M14.5717 9.12834C14.6342 8.76147 14.6668 8.38441 14.6668 7.99967C14.6668 4.74539 12.3351 2.03571 9.25123 1.4502" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
                {["Distribution", "Luxaigo", "signals", "statisticalprobability", "statistics", "Stop", "trailingstop", "trendanalysis"].map((tag) => (
                  <span key={tag} className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Reviews</h2>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-[31px] font-bold text-[#A06AFF]">4.5</span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-[#A06AFF] text-[#A06AFF]" />
                      ))}
                      <Star className="h-4 w-4 text-[#2E2744]" />
                    </div>
                    <span className="text-xs font-bold text-[#B0B0B0]">Based on 28 reviews</span>
                  </div>
                </div>
              </div>
              
              {/* Review */}
              <div className="border-b border-[#181B22] p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-11 w-11 rounded-full bg-gray-700" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-white">John Smith</span>
                      <span className="text-xs font-bold text-[#B0B0B0]">2 days ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-[#A06AFF] text-[#A06AFF]" />
                    ))}
                  </div>
                </div>
                <h4 className="mb-2 text-[15px] font-bold text-white">Game changer for my trading strategy!</h4>
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  This tool has completely transformed how I manage risk in my trading. The automatic calculations save me so much time, and I've seen a significant improvement in my overall performance. Highly recommended for any serious trader.
                </p>
              </div>

              <div className="p-4">
                <button className="w-full rounded-lg border border-[#181B22] bg-[#0C101480] py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px]">
                  Show More Reviews
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Disclaimer</h2>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  The information and publications are not meant to be, and do not constitute, financial, investment, trading, or other types of advice or recommendations supplied or endorsed by TyrianTrade. Read more in the{" "}
                  <a href="#" className="text-[#A06AFF] underline">Terms of Use</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalsDetailLanding;
