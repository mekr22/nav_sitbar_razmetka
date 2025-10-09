import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Settings, ChevronRight, ChevronDown, Plus, RefreshCw, MoreHorizontal, X, HelpCircle } from "lucide-react";

interface Props {
  isCollapsed: boolean;
}

interface SectorTile {
  name: string;
  percentage: string;
  change: string;
  highlighted?: boolean;
}

const sectorData: SectorTile[] = [
  { name: "BTC", percentage: "53.30%", change: "+0.33%", highlighted: true },
  { name: "ETH", percentage: "15.56%", change: "-1.38%" },
  { name: "Layer1", percentage: "10.42%", change: "-0.66%" },
  { name: "CeFi", percentage: "4.05%", change: "-0.63%" },
  { name: "DeFi", percentage: "2.03%", change: "-1.93%" },
  { name: "Payment", percentage: "1.94%", change: "+0.33%", highlighted: true },
  { name: "Meme", percentage: "1.91%", change: "-2.29%" },
  { name: "Layer2", percentage: "1.10%", change: "-0.10%" },
  { name: "SocialFi", percentage: "0.85%", change: "-7.97%" },
  { name: "DePIN", percentage: "0.83%", change: "+1.30%", highlighted: true },
  { name: "GameFi", percentage: "0.74%", change: "+0.28%", highlighted: true },
  { name: "Others", percentage: "0.67%", change: "-0.82%" },
  { name: "AI", percentage: "0.63%", change: "+1.98%", highlighted: true },
  { name: "RWA", percentage: "0.28%", change: "-3.12%" },
  { name: "NFT", percentage: "0.16%", change: "-1.91%" },
  { name: "StableC...", percentage: "5.52%", change: "-0.04%" },
];

const watchlistItems = [
  { symbol: "BTC", last: "$1.46", chg: "3.66", chgPercent: "+1.15%" },
  { symbol: "BTC", last: "$1.46", chg: "3.66", chgPercent: "+1.15%" },
  { symbol: "BTC", last: "$1.46", chg: "3.66", chgPercent: "+1.15%" },
];

const newsItems = [
  { date: "January 31, 5:10 PM", title: "The Future of Crypto-currency Trading" },
  { date: "January 31, 5:10 PM", title: "The Future of Crypto-currency Trading" },
  { date: "January 31, 5:10 PM", title: "The Future of Crypto-currency Trading" },
  { date: "January 31, 5:10 PM", title: "The Future of Crypto-currency Trading" },
  { date: "January 31, 5:10 PM", title: "The Future of Crypto-currency Trading" },
];

const calendarEvents = [
  { date: "Jun 03", events: [
    { symbol: "NIO", name: "NIO Inc" },
    { symbol: "HPE", name: "Hewlett Packard Enterprise Co" }
  ]},
  { date: "Jun 05", events: [
    { symbol: "UEC", name: "Uranium Energy Corp" },
    { symbol: "AVGO", name: "Broadcom Inc" }
  ]}
];

export const RightMenu: FC<Props> = ({ isCollapsed }) => {
  const [sectorFilter, setSectorFilter] = useState<"domination" | "24hour">("24hour");
  const [tradingPsychologyOpen, setTradingPsychologyOpen] = useState(false);
  const [newsCategory, setNewsCategory] = useState("earnings");
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [watchlistSettingsOpen, setWatchlistSettingsOpen] = useState(false);

  return (
    <section
      className={cn(
        "flex flex-col gap-6 min-h-full overflow-hidden transition-all duration-500 ease-in-out",
        {
          "h-0 w-0 p-0 opacity-0": !isCollapsed,
          "min-w-[312px] w-[312px] pr-6 opacity-100": isCollapsed,
        },
      )}
    >
      {/* Quote Lookup */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px] flex-1">
          <Search className="w-6 h-6 text-webGray" />
          <input
            className="bg-transparent text-webGray text-[15px] placeholder:text-webGray outline-none w-full"
            placeholder="Quote Lookup"
          />
        </div>
        <button className="w-6 h-6 text-webGray hover:text-white transition-colors" aria-label="Settings">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Trading Psychology */}
      <div className="flex flex-col p-4 rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
        <button 
          onClick={() => setTradingPsychologyOpen(!tradingPsychologyOpen)}
          className="flex items-center justify-between pb-2"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-[19px]">Trading Psychology</h3>
          </div>
          <ChevronRight className={cn("w-6 h-6 text-webGray transition-transform", tradingPsychologyOpen && "rotate-90")} />
        </button>
        {tradingPsychologyOpen && (
          <p className="text-webGray text-[15px] pt-2">
            You can trade if all factors of your strategy are met, you are confident in the trade, ready to accept a loss, without emotions, and fully concentrated.
          </p>
        )}
      </div>

      {/* Sector Mover */}
      <div className="flex flex-col p-4 gap-6 rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-[19px]">Sector Mover</h3>
            <HelpCircle className="w-6 h-6 text-webGray" />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSectorFilter("domination")}
              className={cn(
                "flex-1 py-3 px-4 rounded-[32px] border border-[#181B22] backdrop-blur-[58px] text-[15px] font-bold transition-all",
                sectorFilter === "domination" 
                  ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white" 
                  : "bg-[#0C101480] text-webGray"
              )}
            >
              Domination
            </button>
            <button
              onClick={() => setSectorFilter("24hour")}
              className={cn(
                "flex-1 py-3 px-4 rounded-[32px] border border-[#181B22] backdrop-blur-[58px] text-[15px] font-bold transition-all",
                sectorFilter === "24hour" 
                  ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white" 
                  : "bg-[#0C101480] text-webGray"
              )}
            >
              24 Hour %
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sectorData.map((sector, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-col justify-between p-2 w-[88px] h-[88px] rounded-xl",
                sector.highlighted ? "bg-[#523A83]" : "bg-[#2E2744]"
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-webGray text-[15px]">{sector.percentage}</span>
                <span className="text-white text-[15px] font-bold">{sector.name}</span>
              </div>
              <span className={cn(
                "text-[19px] font-bold text-right",
                sector.change.startsWith("+") ? "text-green" : "text-red"
              )}>
                {sector.change}
              </span>
            </div>
          ))}
        </div>

        <button className="self-end -mt-10 mr-4" aria-label="Close sector mover">
          <X className="w-6 h-6 text-webGray hover:text-white transition-colors" />
        </button>
      </div>

      {/* Portfolio */}
      <div className="flex flex-col p-4 pb-12 gap-6 rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-[19px]">Portfolio</h3>
          <X className="w-6 h-6 text-webGray hover:text-white transition-colors cursor-pointer" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-white text-[15px] font-bold">Sign in to access your portfolio</p>
          <button className="px-4 py-3 rounded-[32px] bg-gradient-to-r from-[#A06AFF] to-[#482090] backdrop-blur-[58px]">
            <span className="text-white text-[15px] font-bold">Sign In</span>
          </button>
        </div>
      </div>

      {/* Watchlist */}
      <div className="flex flex-col p-4 rounded-xl border border-[#181B22] bg-[#0B0E1180] backdrop-blur-[50px] relative">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-[19px]">Watchlist</h3>
            <ChevronDown className="w-6 h-6 text-webGray" />
          </div>
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-white cursor-pointer" />
            <RefreshCw className="w-5 h-5 text-white cursor-pointer" />
            <button 
              onClick={() => setWatchlistSettingsOpen(!watchlistSettingsOpen)}
              className="relative"
            >
              <MoreHorizontal className="w-5 h-5 text-[#A06AFF] cursor-pointer rotate-90" />
            </button>
          </div>
        </div>

        {watchlistSettingsOpen && (
          <div className="absolute top-16 right-4 w-[180px] p-4 flex flex-col gap-4 rounded-lg border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px] z-10">
            <div className="flex items-center justify-between">
              <span className="text-white text-[15px] font-bold">Table View</span>
              <div className="w-[38px] h-5 p-[2px] rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] flex items-end justify-end">
                <div className="w-4 h-4 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="h-px bg-[#181B22]"></div>
            <div className="text-webGray text-xs font-bold uppercase">Customize Columns</div>
            {["Alphabetical", "Creation Date", "By Integration"].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <div className="w-[18px] h-[18px] rounded-[3px] bg-gradient-to-r from-[#A06AFF] to-[#482090] flex items-center justify-center">
                  <svg className="w-[10px] h-[6px]" viewBox="0 0 12 8" fill="none">
                    <path d="M1 2.5L5 6.5L10.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white text-[15px] font-bold">{option}</span>
              </div>
            ))}
            {["Default", "Default"].map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-[18px] h-[18px] rounded-[3px] border border-[#523A83]"></div>
                <span className="text-white text-[15px] font-bold">{option}</span>
              </div>
            ))}
            <div className="h-px bg-[#181B22]"></div>
            <div className="text-webGray text-xs font-bold uppercase">Symbol Display</div>
            <div className="flex items-center gap-2">
              <div className="w-[18px] h-[18px] rounded-[3px] bg-gradient-to-r from-[#A06AFF] to-[#482090] flex items-center justify-center">
                <svg className="w-[10px] h-[6px]" viewBox="0 0 12 8" fill="none">
                  <path d="M1 2.5L5 6.5L10.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-white text-[15px] font-bold">Logo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-[#A06AFF] p-1 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090]"></div>
              </div>
              <span className="text-white text-[15px] font-bold">Ticker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-[#A06AFF]"></div>
              <span className="text-white text-[15px] font-bold">Description</span>
            </div>
          </div>
        )}

        <div className="flex items-center py-3 border-b border-[#181B22]">
          <div className="flex-1">
            <span className="text-webGray text-xs font-bold uppercase">Symbol</span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-webGray text-xs font-bold uppercase">Last</span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-webGray text-xs font-bold uppercase">ChG</span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-webGray text-xs font-bold uppercase">CHG,%</span>
          </div>
        </div>

        <div className="flex items-center py-1 px-4 bg-[#2E2744]">
          <ChevronDown className="w-4 h-4 text-webGray mr-2" />
          <span className="text-webGray text-xs font-bold flex-1">Group 1</span>
          <button className="text-webGray hover:text-white" aria-label="Delete group">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M13 3.66663L12.5869 10.35C12.4813 12.0576 12.4285 12.9114 12.0005 13.5252C11.7889 13.8287 11.5165 14.0848 11.2005 14.2773C10.5614 14.6666 9.706 14.6666 7.99513 14.6666C6.28208 14.6666 5.42553 14.6666 4.78603 14.2766C4.46987 14.0838 4.19733 13.8272 3.98579 13.5232C3.55792 12.9084 3.5063 12.0534 3.40307 10.3434L3 3.66663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 3.66671H14M10.7038 3.66671L10.2487 2.72786C9.9464 2.10421 9.7952 1.79239 9.53447 1.59791C9.47667 1.55477 9.4154 1.5164 9.35133 1.48317C9.0626 1.33337 8.71607 1.33337 8.023 1.33337C7.31253 1.33337 6.95733 1.33337 6.66379 1.48945C6.59873 1.52405 6.53665 1.56397 6.47819 1.60882C6.21443 1.81117 6.06709 2.13441 5.77241 2.78088L5.36861 3.66671" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6.3335 11V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9.6665 11V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {watchlistItems.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center py-1 px-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-5 h-5 rounded-full bg-[#F5B300] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₿</span>
                </div>
                <span className="text-white text-xs font-bold uppercase">{item.symbol}</span>
              </div>
              <div className="flex-1 text-right">
                <span className="text-white text-xs font-bold">{item.last}</span>
              </div>
              <div className="flex-1 text-right">
                <span className="text-green text-xs font-bold">{item.chg}</span>
              </div>
              <div className="flex-1 text-right">
                <span className="text-green text-xs font-bold">{item.chgPercent}</span>
              </div>
            </div>
            {idx < watchlistItems.length - 1 && <div className="h-px bg-[#181B22]"></div>}
          </div>
        ))}

        <div className="h-px bg-[#181B22] mt-1"></div>
        {["Group 2", "Group 3", "Group 4", "Group 5"].map((group) => (
          <div key={group} className="flex items-center py-1 px-4">
            <ChevronRight className="w-4 h-4 text-webGray mr-2" />
            <span className="text-webGray text-xs font-bold">{group}</span>
          </div>
        ))}
      </div>

      {/* News */}
      <div className="flex flex-col p-4 gap-4 rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-[19px]">News</h3>
          <X className="w-6 h-6 text-webGray hover:text-white transition-colors cursor-pointer" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {["Earnings", "Macro", "Crypto", "Stock Market"].map((category) => (
            <button
              key={category}
              onClick={() => setNewsCategory(category.toLowerCase())}
              className={cn(
                "py-3 px-2 rounded-[32px] border text-xs font-bold backdrop-blur-[58px] transition-all",
                newsCategory === category.toLowerCase()
                  ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] border-transparent text-white"
                  : "bg-[#0C101480] border-[#181B22] text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {newsItems.map((item, idx) => (
            <div key={idx} className={cn("flex flex-col gap-1 pb-1", idx < newsItems.length - 1 && "border-b border-[#181B22]")}>
              <span className="text-webGray text-xs font-bold">{item.date}</span>
              <p className="text-white text-[15px] font-bold pb-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex flex-col p-4 gap-4 rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-[19px]">Calendar</h3>
          <X className="w-6 h-6 text-webGray hover:text-white transition-colors cursor-pointer" />
        </div>

        <div className="flex items-center h-10 px-4 py-2 rounded-lg border border-[#181B22] opacity-80 bg-[#0C101480] backdrop-blur-[50px]">
          <span className="text-white text-[15px] font-bold flex-1">Upcoming</span>
          <ChevronDown className="w-6 h-6 text-webGray rotate-90" />
        </div>

        <div className="pt-4 border-t border-[#181B22] flex flex-col gap-4">
          {calendarEvents.map((event, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex flex-col w-[50px]">
                <span className="text-webGray text-2xl font-bold">{event.date.split(" ")[0]}</span>
                <span className="text-white text-[31px] font-bold">{event.date.split(" ")[1]}</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <div className={cn("w-1 self-stretch rounded-lg", idx === 0 ? "bg-[#523A83]" : "bg-[#2E2744]")}></div>
                <div className="flex flex-col gap-2.5 flex-1">
                  {event.events.map((ev, evIdx) => (
                    <div key={evIdx} className="flex flex-col gap-2">
                      <span className="text-white text-[15px] font-bold">{ev.symbol}</span>
                      <span className="text-webGray text-[15px] font-bold">{ev.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
