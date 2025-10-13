import { FC, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Package, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TradingRobotCard from "@/components/marketplace/TradingRobotCard";
import { baseTradingRobots, TradingRobot, RISK_MASTER_ICON } from "@/data/marketplaceTradingRobots";
import { marketplaceCategories, MarketplaceCategory } from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AutomationOptionValue = "trend" | "grid" | "arbitrage" | "scalping";
type AccuracyOptionValue = "low" | "medium" | "high";
type MarketOptionValue = "spot" | "futures" | "derivatives";
type LeverageOptionValue = "low" | "moderate" | "high";
type RoiOptionValue = "steady" | "growth" | "aggressive";

type AutomationFilterValue = "all" | AutomationOptionValue;
type AccuracyFilterValue = "any" | AccuracyOptionValue;
type MarketFilterValue = "any" | MarketOptionValue;
type LeverageFilterValue = "any" | LeverageOptionValue;
type RoiFilterValue = "any" | RoiOptionValue;

type FilterSelections = {
  automation: AutomationFilterValue;
  accuracy: AccuracyFilterValue;
  market: MarketFilterValue;
  leverage: LeverageFilterValue;
  roi: RoiFilterValue;
};

type FilterConfigMap = {
  [K in keyof FilterSelections]: {
    label: string;
    options: {
      value: FilterSelections[K];
      label: string;
      buttonLabel: string;
    }[];
  };
};

type TradingRobotWithMeta = TradingRobot & {
  automationBucket: AutomationOptionValue;
  accuracyBucket: AccuracyOptionValue;
  marketBucket: MarketOptionValue;
  leverageBucket: LeverageOptionValue;
  roiBucket: RoiOptionValue;
};

const FILTER_CONFIG: FilterConfigMap = {
  automation: {
    label: "Automation",
    options: [
      { value: "all", label: "All automation styles", buttonLabel: "All" },
      { value: "trend", label: "Trend following", buttonLabel: "Trend" },
      { value: "grid", label: "Grid & range", buttonLabel: "Grid" },
      { value: "arbitrage", label: "Arbitrage", buttonLabel: "Arbitrage" },
      { value: "scalping", label: "Scalping & latency", buttonLabel: "Scalping" },
    ],
  },
  accuracy: {
    label: "Accuracy",
    options: [
      { value: "any", label: "All accuracy levels", buttonLabel: "Accuracy" },
      { value: "high", label: "High accuracy", buttonLabel: "High" },
      { value: "medium", label: "Medium accuracy", buttonLabel: "Medium" },
      { value: "low", label: "Low accuracy", buttonLabel: "Low" },
    ],
  },
  market: {
    label: "Market",
    options: [
      { value: "any", label: "All market types", buttonLabel: "Market" },
      { value: "spot", label: "Spot trading", buttonLabel: "Spot" },
      { value: "futures", label: "Futures & perps", buttonLabel: "Futures" },
      { value: "derivatives", label: "Derivatives & arbitrage", buttonLabel: "Derivatives" },
    ],
  },
  leverage: {
    label: "Leverage",
    options: [
      { value: "any", label: "All leverage profiles", buttonLabel: "Leverage" },
      { value: "low", label: "Low leverage (x1 - x5)", buttonLabel: "Low" },
      { value: "moderate", label: "Moderate leverage (x5 - x15)", buttonLabel: "Moderate" },
      { value: "high", label: "High leverage (x15+)", buttonLabel: "High" },
    ],
  },
  roi: {
    label: "ROI",
    options: [
      { value: "any", label: "Any ROI profile", buttonLabel: "ROI" },
      { value: "steady", label: "Steady growth (< 20%)", buttonLabel: "Steady" },
      { value: "growth", label: "Growth (20% - 50%)", buttonLabel: "Growth" },
      { value: "aggressive", label: "Aggressive (50%+)", buttonLabel: "Aggressive" },
    ],
  },
};

const FILTER_ORDER: (keyof FilterSelections)[] = ["automation", "accuracy", "market", "leverage", "roi"];

const DUPLICATED_PAIRS = 6;

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

const parsePercentage = (value: string) => {
  const numeric = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : Math.abs(numeric);
};

const resolveRoiBucket = (roi: number): RoiOptionValue => {
  if (roi < 20) {
    return "steady";
  }
  if (roi <= 50) {
    return "growth";
  }
  return "aggressive";
};

const TradingRobotsAndAlgorithms: FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("Trading robots and Algorithms");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(new Set());
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [filters, setFilters] = useState<FilterSelections>({
    automation: FILTER_CONFIG.automation.options[0].value,
    accuracy: FILTER_CONFIG.accuracy.options[0].value,
    market: FILTER_CONFIG.market.options[0].value,
    leverage: FILTER_CONFIG.leverage.options[0].value,
    roi: FILTER_CONFIG.roi.options[0].value,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = maskNonWhitespace(balanceValue);

  const robots: TradingRobotWithMeta[] = useMemo(
    () =>
      Array.from({ length: DUPLICATED_PAIRS }, (_, pairIndex) =>
        baseTradingRobots.map((robot, cardIndex) => {
          const metaIndex = pairIndex * baseTradingRobots.length + cardIndex;
          const roiValue = parsePercentage(robot.roi30d);

          return {
            ...robot,
            id: `${robot.id}-pair-${pairIndex}-${cardIndex}`,
            name: pairIndex === 0 ? robot.name : `${robot.name} ${metaIndex + 1}`,
            automationBucket: robot.automationStyle,
            accuracyBucket: robot.accuracyLevel.toLowerCase() as AccuracyOptionValue,
            marketBucket: robot.marketCategory,
            leverageBucket: robot.leverageCategory,
            roiBucket: resolveRoiBucket(roiValue),
          };
        }),
      ).flat(),
    [],
  );

  const filteredRobots = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return robots.filter((robot) => {
      if (filters.automation !== "all" && robot.automationBucket !== filters.automation) {
        return false;
      }
      if (filters.accuracy !== "any" && robot.accuracyBucket !== filters.accuracy) {
        return false;
      }
      if (filters.market !== "any" && robot.marketBucket !== filters.market) {
        return false;
      }
      if (filters.leverage !== "any" && robot.leverageBucket !== filters.leverage) {
        return false;
      }
      if (filters.roi !== "any" && robot.roiBucket !== filters.roi) {
        return false;
      }
      if (normalizedTerm) {
        const haystack = `${robot.name} ${robot.pair} ${robot.strategy} ${robot.assetTags.join(" ")}`.toLowerCase();
        return haystack.includes(normalizedTerm);
      }

      return true;
    });
  }, [filters, robots, searchTerm]);

  const PaginationPlaceholder = () => {
    const controlClassName =
      "flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]";

    return (
      <div className="flex items-center gap-1" aria-hidden="true">
        <div className={controlClassName}>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6585 15L15.8335 13.825L12.0168 10L15.8335 6.175L14.6585 5L9.6585 10L14.6585 15Z" fill="#B0B0B0" />
            <path d="M9.1668 15L10.3418 13.825L6.52513 10L10.3418 6.175L9.1668 5L4.1668 10L9.1668 15Z" fill="#B0B0B0" />
          </svg>
        </div>
        <div className={controlClassName}>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.575 15L13.75 13.825L9.93333 10L13.75 6.175L12.575 5L7.575 10L12.575 15Z" fill="#B0B0B0" />
          </svg>
        </div>
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)]">
          <span className="text-[15px] font-bold text-white">1</span>
        </div>
        <div className={controlClassName}>
          <span className="text-[15px] font-bold text-[#B0B0B0]">2</span>
        </div>
        <div className={controlClassName}>
          <span className="text-[15px] font-bold text-[#B0B0B0]">3</span>
        </div>
        <div className={controlClassName}>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.675 5L7.5 6.175L11.3167 10L7.5 13.825L8.675 15L13.675 10L8.675 5Z" fill="#B0B0B0" />
          </svg>
        </div>
        <div className={controlClassName}>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.3415 5L4.1665 6.175L7.98317 10L4.1665 13.825L5.3415 15L10.3415 10L5.3415 5Z" fill="#B0B0B0" />
            <path d="M10.8332 5L9.6582 6.175L13.4749 10L9.6582 13.825L10.8332 15L15.8332 10L10.8332 5Z" fill="#B0B0B0" />
          </svg>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!activeCardKey) {
      return;
    }

    const isActiveVisible = filteredRobots.some((robot) => buildCardKey("trading-robots-page", robot.id) === activeCardKey);

    if (!isActiveVisible) {
      setActiveCardKey(null);
    }
  }, [activeCardKey, filteredRobots]);

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

  const handleCategoryClick = (category: MarketplaceCategory) => {
    setSelectedCategory(category);
    if (category === "Trading robots and Algorithms") {
      return;
    }
    if (category === "Signals and Technical indicators") {
      navigate("/marketplace/signals", { state: { category } });
      return;
    }
    if (category === "Strategies and Portfolios") {
      navigate("/marketplace/strategies", { state: { category } });
      return;
    }
    navigate("/marketplace/my-products", { state: { category } });
  };

  const handleFilterChange = (key: keyof FilterSelections, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value as FilterSelections[keyof FilterSelections],
    }));
  };

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
                  <button
                    type="button"
                    onClick={() => setIsBalanceVisible((prev) => !prev)}
                    aria-label={isBalanceVisible ? "Hide total balance" : "Show total balance"}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#808283] transition-colors hover:border-[#1F2230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  >
                    {isBalanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-xl font-bold text-white sm:text-2xl">{isBalanceVisible ? balanceValue : maskedBalanceValue}</div>
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Today&apos;s PnL</span>
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
            {marketplaceCategories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
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

        <section className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Trading robots and Algorithms</h2>
            <div className="flex w-full flex-wrap items-center gap-1 sm:gap-2 md:gap-3">
              <div className="hidden min-[1143px]:flex min-[1143px]:w-full min-[1143px]:flex-1 min-[1143px]:items-center min-[1143px]:gap-3">
                {FILTER_ORDER.map((filterKey) => {
                  const config = FILTER_CONFIG[filterKey];
                  const selectedOption = config.options.find((option) => option.value === filters[filterKey]) ?? config.options[0];
                  const isActive = filters[filterKey] !== config.options[0].value;

                  return (
                    <DropdownMenu key={filterKey}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors focus-visible:outline-none focus-visible:ring-0",
                            isActive ? "border-[#A06AFF] text-white" : "text-[#B0B0B0]",
                          )}
                          aria-label={`Filter by ${config.label}`}
                        >
                          <span className="truncate text-xs font-medium sm:text-sm">{selectedOption.buttonLabel}</span>
                          <ChevronDown className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-[#B0B0B0]")} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-60 rounded-xl border border-[#181B22] bg-[#0C1014]/95 p-1 backdrop-blur-xl"
                      >
                        <DropdownMenuRadioGroup
                          value={filters[filterKey]}
                          onValueChange={(value) => handleFilterChange(filterKey, value)}
                        >
                          {config.options.map((option) => (
                            <DropdownMenuRadioItem
                              key={option.value}
                              value={option.value}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#B0B0B0] outline-none data-[state=checked]:bg-[#1A1F2A] data-[state=checked]:text-white"
                            >
                              {option.label}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })}
              </div>
              <div className="ml-auto flex h-9 w-[235px] min-w-[235px] flex-shrink-0 items-center gap-1 rounded-xl border border-[#181B22] bg-[#0C1014]/50 px-2 backdrop-blur-[50px] max-[1142px]:ml-0 max-[1142px]:mt-0 max-[1142px]:w-full max-[1142px]:min-w-0 max-[1142px]:flex-1">
                <Search className="h-4 w-4 flex-shrink-0 text-[#B0B0B0]" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Find trading robots & algorithms"
                  className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none sm:text-xs md:text-sm leading-none"
                  aria-label="Find trading robots and algorithms"
                />
              </div>
            </div>
          </div>

          {filteredRobots.length === 0 ? (
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-6 text-center text-sm font-semibold text-[#B0B0B0]">
              No trading robots match your filters yet. Try adjusting the filters or search query.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
              {filteredRobots.map((robot) => {
                const cardKey = buildCardKey("trading-robots-page", robot.id);
                const isFavorited = isFavorite(cardKey);
                return (
                  <TradingRobotCard
                    key={robot.id}
                    robot={robot}
                    isActive={activeCardKey === cardKey}
                    onSelect={() => setActiveCardKey(cardKey)}
                    isFavorite={isFavorited}
                    onToggleFavorite={() => toggleFavorite(cardKey)}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-6 mb-10 flex w-full justify-center sm:mb-16">
            <nav aria-label="Trading robots pagination placeholder">
              <PaginationPlaceholder />
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TradingRobotsAndAlgorithms;
