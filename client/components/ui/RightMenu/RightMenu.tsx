import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  Search,
  Settings,
  ChevronDown,
  Plus,
  RefreshCw,
  MoreHorizontal,
  X,
  BadgeHelp,
} from "lucide-react";

interface Props {
  isCollapsed: boolean;
  onClose?: () => void;
}

const DefaultWidgetCard: FC<{ title: string; children?: ReactNode }> = ({
  title,
  children,
}) => (
  <div className="container-card rounded-[16px] p-4">
    <h3 className="mb-3 text-[15px] font-semibold text-white">{title}</h3>
    {children ?? (
      <span className="text-sm text-webGray">
        Widget content coming soon...
      </span>
    )}
  </div>
);

const DefaultRightMenuContent: FC = () => (
  <>
    <DefaultWidgetCard title="Quick Search">
      <input
        className="h-9 w-full rounded-lg border border-[#181B22] bg-[#0C101480] px-3 text-sm text-white placeholder:text-webGray outline-none"
        placeholder="Search markets..."
      />
    </DefaultWidgetCard>

    <DefaultWidgetCard title="Trading Psychology">
      <div className="flex items-center justify-between">
        <span className="text-sm text-webGray">Fear & Greed Index</span>
        <span className="text-lg font-bold text-green">72</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#181B22]">
        <div className="h-full w-[72%] bg-green transition-all" />
      </div>
    </DefaultWidgetCard>

    <DefaultWidgetCard title="Sector Movers">
      <div className="flex flex-col gap-2">
        {["Technology", "Healthcare", "Finance"].map((sector) => (
          <div
            key={sector}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-white">{sector}</span>
            <span className="text-green">+2.4%</span>
          </div>
        ))}
      </div>
    </DefaultWidgetCard>

    <DefaultWidgetCard title="Portfolio" />
    <DefaultWidgetCard title="Watch List" />
    <DefaultWidgetCard title="Latest News" />
    <DefaultWidgetCard title="Calendar" />
  </>
);

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

const watchlistGroups = [
  "Group 1",
  "Group 2",
  "Group 3",
  "Group 4",
  "Group 5",
].map((name) => ({
  name,
  items: watchlistItems,
}));

const customizeColumnsOptions = [
  "Alphabetical",
  "Creation Date",
  "By Integration",
] as const;
const savedViewsOptions = ["Default", "Default"] as const;
const symbolDisplayOptions = ["Logo", "Ticker", "Description"] as const;

const newsItems = [
  {
    date: "January 31, 5:10 PM",
    title: "The Future of Crypto-currency Trading",
  },
  {
    date: "January 31, 5:10 PM",
    title: "The Future of Crypto-currency Trading",
  },
  {
    date: "January 31, 5:10 PM",
    title: "The Future of Crypto-currency Trading",
  },
  {
    date: "January 31, 5:10 PM",
    title: "The Future of Crypto-currency Trading",
  },
  {
    date: "January 31, 5:10 PM",
    title: "The Future of Crypto-currency Trading",
  },
];

const calendarEvents = [
  {
    date: "Jun 03",
    events: [
      { symbol: "NIO", name: "NIO Inc" },
      { symbol: "HPE", name: "Hewlett Packard Enterprise Co" },
    ],
  },
  {
    date: "Jun 05",
    events: [
      { symbol: "UEC", name: "Uranium Energy Corp" },
      { symbol: "AVGO", name: "Broadcom Inc" },
    ],
  },
  {
    date: "Jun 07",
    events: [
      { symbol: "DOCU", name: "DocuSign Inc" },
      { symbol: "OKTA", name: "Okta Inc" },
      { symbol: "ASAN", name: "Asana Inc" },
    ],
  },
  {
    date: "Jun 10",
    events: [
      { symbol: "TSLA", name: "Tesla Inc" },
      { symbol: "AAPL", name: "Apple Inc" },
    ],
  },
];

const calendarFilters = ["Upcoming", "This Month", "Last Month"] as const;

const MarketplaceRightMenuContent: FC = () => {
  const [sectorFilter, setSectorFilter] = useState<"domination" | "24hour">(
    "24hour",
  );
  const [newsCategory, setNewsCategory] = useState("earnings");
  const [watchlistSettingsOpen, setWatchlistSettingsOpen] = useState(false);
  const [isTradingCollapsed, setIsTradingCollapsed] = useState(false);
  const [isSectorCollapsed, setIsSectorCollapsed] = useState(false);
  const [isPortfolioCollapsed, setIsPortfolioCollapsed] = useState(false);
  const [isNewsCollapsed, setIsNewsCollapsed] = useState(false);
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<
    string | null
  >(() => {
    const firstGroup = calendarEvents[0];
    const firstDetail = firstGroup?.events[0];
    return firstGroup && firstDetail
      ? `${firstGroup.date}-${firstDetail.symbol}`
      : null;
  });
  const [selectedCalendarFilter, setSelectedCalendarFilter] =
    useState<(typeof calendarFilters)[number]>("Upcoming");
  const [isCalendarFilterOpen, setIsCalendarFilterOpen] = useState(false);
  const [tableViewEnabled, setTableViewEnabled] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(customizeColumnsOptions.map((option) => [option, true])),
  );
  const [selectedSavedViews, setSelectedSavedViews] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      savedViewsOptions.map((option, index) => [
        `${option}-${index}`,
        index === 0,
      ]),
    ),
  );
  const [selectedSymbolDisplays, setSelectedSymbolDisplays] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      symbolDisplayOptions.map((option, index) => [option, index === 0]),
    ),
  );
  const [collapsedWatchlistGroups, setCollapsedWatchlistGroups] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      watchlistGroups.map((group, index) => [group.name, index !== 0]),
    ),
  );

  useEffect(() => {
    if (isCalendarCollapsed) {
      setIsCalendarFilterOpen(false);
    }
  }, [isCalendarCollapsed]);

  const toggleWatchlistGroup = useCallback((groupName: string) => {
    setCollapsedWatchlistGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  }, []);

  const toggleColumnOption = useCallback((option: string) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  }, []);

  const toggleSavedView = useCallback((key: string) => {
    setSelectedSavedViews((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const toggleSymbolDisplay = useCallback((option: string) => {
    setSelectedSymbolDisplays((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  }, []);

  const newsFilterScrollRef = useRef<HTMLDivElement | null>(null);
  const newsFilterDragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const updateNewsFilterShadows = useCallback(() => {
    const container = newsFilterScrollRef.current;
    if (!container) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;
    container.classList.toggle("has-left-shadow", scrollLeft > 1);
    container.classList.toggle(
      "has-right-shadow",
      scrollLeft < maxScrollLeft - 1,
    );
  }, []);

  const handleNewsPointerMove = useCallback(
    (event: PointerEvent) => {
      const container = newsFilterScrollRef.current;
      const dragState = newsFilterDragRef.current;
      if (!dragState.active || !container) {
        return;
      }

      const delta = event.clientX - dragState.startX;
      if (!dragState.moved && Math.abs(delta) > 3) {
        dragState.moved = true;
      }

      container.scrollLeft = dragState.scrollLeft - delta;
      updateNewsFilterShadows();
      if (dragState.moved) {
        event.preventDefault();
      }
    },
    [updateNewsFilterShadows],
  );

  const endNewsFilterDrag = useCallback(() => {
    const container = newsFilterScrollRef.current;
    if (container) {
      container.classList.remove("is-dragging");
    }

    const dragState = newsFilterDragRef.current;
    if (!dragState.active) {
      return;
    }

    dragState.active = false;
    updateNewsFilterShadows();
    window.removeEventListener("pointermove", handleNewsPointerMove);
    window.removeEventListener("pointerup", endNewsFilterDrag);
    window.removeEventListener("pointercancel", endNewsFilterDrag);
  }, [handleNewsPointerMove, updateNewsFilterShadows]);

  const handleNewsPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || newsFilterDragRef.current.active) {
        return;
      }

      const container = newsFilterScrollRef.current;
      if (!container) {
        return;
      }

      newsFilterDragRef.current.active = true;
      newsFilterDragRef.current.startX = event.clientX;
      newsFilterDragRef.current.scrollLeft = container.scrollLeft;
      newsFilterDragRef.current.moved = false;

      container.classList.add("is-dragging");
      updateNewsFilterShadows();

      window.addEventListener("pointermove", handleNewsPointerMove, {
        passive: false,
      });
      window.addEventListener("pointerup", endNewsFilterDrag);
      window.addEventListener("pointercancel", endNewsFilterDrag);
    },
    [endNewsFilterDrag, handleNewsPointerMove, updateNewsFilterShadows],
  );

  const handleNewsPointerCancel = useCallback(() => {
    endNewsFilterDrag();
  }, [endNewsFilterDrag]);

  const handleNewsScroll = useCallback(() => {
    updateNewsFilterShadows();
  }, [updateNewsFilterShadows]);

  const handleNewsClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (newsFilterDragRef.current.moved) {
        event.preventDefault();
        event.stopPropagation();
        newsFilterDragRef.current.moved = false;
      }
    },
    [],
  );

  useEffect(() => {
    updateNewsFilterShadows();

    window.addEventListener("resize", updateNewsFilterShadows);
    return () => {
      window.removeEventListener("pointermove", handleNewsPointerMove);
      window.removeEventListener("pointerup", endNewsFilterDrag);
      window.removeEventListener("pointercancel", endNewsFilterDrag);
      window.removeEventListener("resize", updateNewsFilterShadows);
    };
  }, [endNewsFilterDrag, handleNewsPointerMove, updateNewsFilterShadows]);

  useEffect(() => {
    if (!isNewsCollapsed) {
      updateNewsFilterShadows();
    }
  }, [isNewsCollapsed, updateNewsFilterShadows]);

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] px-3 backdrop-blur-[50px]">
          <Search className="h-6 w-6 text-webGray" />
          <input
            className="w-full bg-transparent text-[15px] text-webGray placeholder:text-webGray outline-none"
            placeholder="Quote Lookup"
          />
        </div>
        <button
          className="h-6 w-6 text-webGray transition-colors hover:text-white"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      <div
        className={cn(
          "flex flex-col rounded-xl border border-[#181B22] bg-[#0C101480] py-4 backdrop-blur-[50px]",
          isTradingCollapsed ? "gap-0" : "gap-2",
        )}
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <h3 className="text-[19px] font-bold text-white">
            Trading Psychology
          </h3>
          <button
            type="button"
            onClick={() => setIsTradingCollapsed((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center text-[#B0B0B0] transition-colors hover:text-white"
            aria-label={
              isTradingCollapsed
                ? "Expand trading psychology"
                : "Close trading psychology"
            }
          >
            {isTradingCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
        {!isTradingCollapsed && (
          <p className="px-4 text-[15px] font-normal leading-normal text-webGray">
            You can trade if all factors of your strategy are met, you are
            confident in the trade, ready to accept a loss, without emotions,
            and fully concentrated.
          </p>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col rounded-xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]",
          isSectorCollapsed ? "gap-0" : "gap-6",
        )}
      >
        <div
          className={cn("flex flex-col", isSectorCollapsed ? "gap-0" : "gap-4")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[19px] font-bold text-white">Sector Mover</h3>
              <BadgeHelp
                className="h-6 w-6 text-[#B0B0B0]"
                aria-hidden="true"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsSectorCollapsed((prev) => !prev)}
              className="flex h-6 w-6 items-center justify-center text-[#B0B0B0] transition-colors hover:text-white"
              aria-label={
                isSectorCollapsed ? "Expand sector mover" : "Close sector mover"
              }
            >
              {isSectorCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
          {!isSectorCollapsed && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSectorFilter("domination")}
                className={cn(
                  "flex-1 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-[color,background,border-color]",
                  sectorFilter === "domination"
                    ? "border-0 bg-[linear-gradient(103deg,#A06AFF_0%,#482090_100%)] text-white"
                    : "border border-[#181B22] bg-[#0C101480] text-white/70",
                )}
              >
                Domination
              </button>
              <button
                onClick={() => setSectorFilter("24hour")}
                className={cn(
                  "flex-1 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-[color,background,border-color]",
                  sectorFilter === "24hour"
                    ? "border-0 bg-[linear-gradient(103deg,#A06AFF_0%,#482090_100%)] text-white"
                    : "border border-[#181B22] bg-[#0C101480] text-white/70",
                )}
              >
                24 Hour %
              </button>
            </div>
          )}
        </div>

        {!isSectorCollapsed && (
          <div className="grid grid-cols-3 gap-2">
            {sectorData.map((sector) => (
              <div
                key={sector.name}
                className={cn(
                  "flex aspect-square flex-col justify-between rounded-xl p-1.5",
                  sector.highlighted ? "bg-[#523A83]" : "bg-[#2E2744]",
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] text-webGray">
                    {sector.percentage}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {sector.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-right text-[17px] font-bold",
                    sector.change.startsWith("+") ? "text-green" : "text-red",
                  )}
                >
                  {sector.change}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col rounded-xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]",
          isPortfolioCollapsed ? "gap-0" : "gap-6",
          !isPortfolioCollapsed && "pb-12",
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[19px] font-bold text-white">Portfolio</h3>
          <button
            type="button"
            onClick={() => setIsPortfolioCollapsed((prev) => !prev)}
            className="flex h-6 w-6 items-center justify_center text-[#B0B0B0] transition-colors hover:text-white"
            aria-label={
              isPortfolioCollapsed ? "Expand portfolio" : "Close portfolio"
            }
          >
            {isPortfolioCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
        {!isPortfolioCollapsed && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-[15px] font-bold text-white">
              Sign in to access your portfolio
            </p>
            <button className="rounded-[32px] bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-3 backdrop-blur-[58px]">
              <span className="text-[15px] font-bold text-white">Sign In</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative flex flex-col rounded-xl border border-[#181B22] bg-[#0B0E1180] p-4 backdrop-blur-[50px]">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[19px] font-bold text-white">Watchlist</h3>
            <ChevronDown className="h-6 w-6 text-webGray" />
          </div>
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 cursor-pointer text-white" />
            <RefreshCw className="h-5 w-5 cursor-pointer text-white" />
            <button
              onClick={() => setWatchlistSettingsOpen((prev) => !prev)}
              className="relative"
              aria-label="Toggle watchlist settings"
            >
              <MoreHorizontal className="h-5 w-5 rotate-90 text-[#A06AFF]" />
            </button>
          </div>
        </div>

        {watchlistSettingsOpen && (
          <div className="absolute right-4 top-16 z-10 flex w-[200px] flex-col gap-4 rounded-lg border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
            <button
              type="button"
              onClick={() => setTableViewEnabled((prev) => !prev)}
              className="flex items-center justify-between gap-3 text-left text-[15px] font-bold text-white"
            >
              <span>Table View</span>
              <span
                className={cn(
                  "flex h-5 w-[38px] items-center rounded-full p-[2px] transition-all",
                  tableViewEnabled
                    ? "justify-end border border-transparent bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                    : "justify-start border border-[#181B22] bg-[#0C101480]",
                )}
              >
                <span className="h-4 w-4 rounded-full bg-white" />
              </span>
            </button>
            <div className="h-px bg-[#181B22]" />
            <div className="text-xs font-bold uppercase text-webGray">
              Customize Columns
            </div>
            <div className="flex flex-col gap-3">
              {customizeColumnsOptions.map((option) => {
                const isSelected = selectedColumns[option];
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleColumnOption(option)}
                    className="flex items-center gap-2 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border border-[#523A83]/70 transition-colors",
                        isSelected &&
                          "border-0 bg-gradient-to-r from-[#A06AFF] to-[#482090]",
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="h-[6px] w-[10px]"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 2.5L5 6.5L10.5 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-[15px] font-bold text-white">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="h-px bg-[#181B22]" />
            <div className="text-xs font-bold uppercase text-webGray">
              Saved Views
            </div>
            <div className="flex flex-col gap-3">
              {savedViewsOptions.map((option, idx) => {
                const key = `${option}-${idx}`;
                const isSelected = selectedSavedViews[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSavedView(key)}
                    className="flex items-center gap-2 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border border-[#523A83]/70 transition-colors",
                        isSelected &&
                          "border-0 bg-gradient-to-r from-[#A06AFF] to-[#482090]",
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="h-[6px] w-[10px]"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 2.5L5 6.5L10.5 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-[15px] font-bold text-white">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="h-px bg-[#181B22]" />
            <div className="text-xs font-bold uppercase text-webGray">
              Symbol Display
            </div>
            <div className="flex flex-col gap-3">
              {symbolDisplayOptions.map((option) => {
                const isSelected = selectedSymbolDisplays[option];
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleSymbolDisplay(option)}
                    className="flex items-center gap-2 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border border-[#A06AFF]/60 transition-colors",
                        isSelected &&
                          "border-transparent bg-gradient-to-r from-[#A06AFF] to-[#482090]",
                      )}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-[15px] font-bold text-white">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center border-b border-[#181B22] py-3">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase text-webGray">
              Symbol
            </span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-xs font-bold uppercase text-webGray">
              Last
            </span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-xs font-bold uppercase text-webGray">
              ChG
            </span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-xs font-bold uppercase text-webGray">
              CHG,%
            </span>
          </div>
        </div>

        {watchlistGroups.map((group, index) => {
          const isCollapsed = collapsedWatchlistGroups[group.name];

          return (
            <div key={group.name}>
              <div
                className={cn(
                  "flex items-center px-4 py-1 transition-colors",
                  isCollapsed ? "bg-transparent" : "bg-[#2E2744]",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleWatchlistGroup(group.name)}
                  className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-[#B0B0B0] transition-colors hover:text-white"
                  aria-label={
                    isCollapsed ? `Expand ${group.name}` : `Close ${group.name}`
                  }
                >
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </button>
                <span className="flex-1 text-xs font-bold text-webGray">
                  {group.name}
                </span>
                <button
                  className="text-webGray transition-colors hover:text-white"
                  aria-label={`Delete ${group.name}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13 3.66663L12.5869 10.35C12.4813 12.0576 12.4285 12.9114 12.0005 13.5252C11.7889 13.8287 11.5165 14.0848 11.2005 14.2773C10.5614 14.6666 9.706 14.6666 7.99513 14.6666C6.28208 14.6666 5.42553 14.6666 4.78603 14.2766C4.46987 14.0838 4.19733 13.8272 3.98579 13.5232C3.55792 12.9084 3.5063 12.0534 3.40307 10.3434L3 3.66663"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 3.66671H14M10.7038 3.66671L10.2487 2.72786C9.9464 2.10421 9.7952 1.79239 9.53447 1.59791C9.47667 1.55477 9.4154 1.5164 9.35133 1.48317C9.0626 1.33337 8.71607 1.33337 8.023 1.33337C7.31253 1.33337 6.95733 1.33337 6.66379 1.48945C6.59873 1.52405 6.53665 1.56397 6.47819 1.60882C6.21443 1.81117 6.06709 2.13441 5.77241 2.78088L5.36861 3.66671"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.3335 11V7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.6665 11V7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {!isCollapsed && (
                <div>
                  {group.items.map((item, itemIdx) => (
                    <div key={`${group.name}-${item.symbol}-${itemIdx}`}>
                      <div className="flex items-center px-4 py-1">
                        <div className="flex flex-1 items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5B300]">
                            <span className="text-xs font-bold text-white">
                              ₿
                            </span>
                          </div>
                          <span className="text-xs font-bold uppercase text-white">
                            {item.symbol}
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-xs font-bold text-white">
                            {item.last}
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-xs font-bold text-green">
                            {item.chg}
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-xs font-bold text-green">
                            {item.chgPercent}
                          </span>
                        </div>
                      </div>
                      {itemIdx < group.items.length - 1 && (
                        <div className="h-px bg-[#181B22]" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {index < watchlistGroups.length - 1 && (
                <div className="mt-1 h-px bg-[#181B22]" />
              )}
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "flex flex-col rounded-xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]",
          isNewsCollapsed ? "gap-0" : "gap-4",
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[19px] font-bold text-white">News</h3>
          <button
            type="button"
            onClick={() => setIsNewsCollapsed((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center text-[#B0B0B0] transition-colors hover:text-white"
            aria-label={isNewsCollapsed ? "Expand news" : "Close news"}
          >
            {isNewsCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
        {!isNewsCollapsed && (
          <>
            <div
              ref={newsFilterScrollRef}
              className="news-filter-scroll custom-scroll -mx-1 overflow-x-auto pb-1"
              onPointerDown={handleNewsPointerDown}
              onPointerUp={handleNewsPointerCancel}
              onPointerCancel={handleNewsPointerCancel}
              onClickCapture={handleNewsClickCapture}
              onScroll={handleNewsScroll}
            >
              <div className="flex min-w-max items-center gap-2 px-1">
                {["Earnings", "Macro", "Crypto", "Stock Market"].map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() => setNewsCategory(category.toLowerCase())}
                      className={cn(
                        "flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-xs font-semibold leading-none whitespace-nowrap transition-all",
                        newsCategory === category.toLowerCase()
                          ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white shadow-[0_0_0_1px_rgba(160,106,255,0.45)]"
                          : "border border-[#181B22] bg-[#0C101480] text-white",
                      )}
                    >
                      {category}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {newsItems.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className={cn(
                    "flex flex-col gap-1 pb-1",
                    idx < newsItems.length - 1 && "border-b border-[#181B22]",
                  )}
                >
                  <span className="text-xs font-bold text-webGray">
                    {item.date}
                  </span>
                  <p className="pb-1 text-[15px] font-bold text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]",
          isCalendarCollapsed ? "gap-0" : "gap-4",
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[19px] font-bold text-white">Calendar</h3>
          <button
            type="button"
            onClick={() => setIsCalendarCollapsed((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center text-[#B0B0B0] transition-colors hover:text-white"
            aria-label={
              isCalendarCollapsed ? "Expand calendar" : "Close calendar"
            }
          >
            {isCalendarCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
        {!isCalendarCollapsed && (
          <>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarFilterOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isCalendarFilterOpen}
                className="flex h-10 w-full items-center justify-between rounded-lg border border-[#181B22] bg-[#0C101480] px-4 text-[15px] font-semibold text-white/90 transition-colors hover:border-[#1F2230]"
              >
                <span>{selectedCalendarFilter}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-webGray transition-transform",
                    isCalendarFilterOpen && "rotate-180",
                  )}
                />
              </button>
              {isCalendarFilterOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-lg border border-[#181B22] bg-[#0C1014] py-1 shadow-lg">
                  {calendarFilters.map((filter) => {
                    const isSelected = selectedCalendarFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedCalendarFilter(filter);
                          setIsCalendarFilterOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors",
                          isSelected
                            ? "text-white"
                            : "text-white/80 hover:text-white",
                        )}
                      >
                        <span>{filter}</span>
                        {isSelected && (
                          <span className="text-xs font-semibold text-[#A06AFF]">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#181B22] to-transparent" />
            <div className="space-y-6">
              {calendarEvents.map((event) => {
                const [month, day] = event.date.split(" ");
                const isGroupSelected = event.events.some(
                  (detail) =>
                    selectedCalendarEvent === `${event.date}-${detail.symbol}`,
                );

                return (
                  <div key={event.date} className="flex gap-4">
                    <div className="flex w-[52px] flex-col items-end justify-center gap-1 leading-none">
                      <span className="text-2xl font-bold text-webGray">
                        {month}
                      </span>
                      <span className="text-[31px] font-bold text-white">
                        {day}
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <span
                        className={cn(
                          "pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-full",
                          isGroupSelected
                            ? "bg-gradient-to-b from-[#A06AFF] via-[#563191] to-[#2E2744]"
                            : "bg-[#2E2744]",
                        )}
                      />
                      <div className="space-y-4 pl-4">
                        {event.events.map((detail) => {
                          const eventKey = `${event.date}-${detail.symbol}`;
                          const isSelected = selectedCalendarEvent === eventKey;

                          return (
                            <button
                              key={eventKey}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => setSelectedCalendarEvent(eventKey)}
                              className={cn(
                                "flex w-full flex-col gap-1 rounded-lg border border-transparent px-3 py-2 text-left transition-[background,border-color]",
                                isSelected
                                  ? "border-[#A06AFF]/60 bg-[#2E2744]"
                                  : "hover:border-[#1F2230] hover:bg-[#141821]",
                              )}
                            >
                              <span className="text-sm font-semibold text-white">
                                {detail.symbol}
                              </span>
                              <span
                                className={cn(
                                  "text-sm",
                                  isSelected ? "text-white/80" : "text-webGray",
                                )}
                              >
                                {detail.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const RightMenu: FC<Props> = ({ isCollapsed, onClose }) => {
  const location = useLocation();
  const isMarketplaceRoute =
    location.pathname.startsWith("/marketplace") ||
    location.pathname === "/cart";

  const renderMenuContent = () => (
    <div className="flex flex-col gap-6 pb-6">
      {isMarketplaceRoute ? (
        <MarketplaceRightMenuContent />
      ) : (
        <DefaultRightMenuContent />
      )}
    </div>
  );

  return (
    <>
      <section
        className={cn(
          "hidden lg:flex flex-col gap-6 min-h-full overflow-hidden transition-all duration-500 ease-in-out",
          {
            "h-0 w-0 p-0 opacity-0": !isCollapsed,
            "min-w-[312px] w-[312px] pr-6 opacity-100": isCollapsed,
          },
        )}
        aria-hidden={!isCollapsed}
      >
        {renderMenuContent()}
      </section>

      <div
        className={cn(
          "fixed inset-0 z-40 flex lg:hidden",
          isCollapsed ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            isCollapsed ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative z-10 ml-auto flex h-full w-[320px] max-w-[90%] flex-col gap-5 bg-[#0C1014]/95 p-5 backdrop-blur-xl transition-transform duration-300 ease-in-out",
            isCollapsed ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Right menu"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase text-[#B0B0B0]">
              Insights
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close right menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/60 text-white transition-colors hover:border-[#1F2230]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-px w-full bg-[#181B22]" />
          <div className="flex-1 overflow-y-auto pr-2">
            {renderMenuContent()}
          </div>
        </div>
      </div>
    </>
  );
};
