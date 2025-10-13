import { FC, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Package, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignalCard, { Signal } from "@/components/marketplace/SignalCard";
import { baseSignals } from "@/data/marketplaceSignals";
import { marketplaceCategories, MarketplaceCategory } from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CategoryOptionValue = "signals" | "indicators";
type CreatedOptionValue = "24h" | "7d";
type ActiveTimeOptionValue = "intraday" | "swing";
type PnlOptionValue = "positive" | "negative";
type DrawdownOptionValue = "low" | "high";

type CategoryFilterValue = "all" | CategoryOptionValue;
type CreatedFilterValue = "any" | CreatedOptionValue;
type ActiveTimeFilterValue = "any" | ActiveTimeOptionValue;
type PnlFilterValue = "any" | PnlOptionValue;
type DrawdownFilterValue = "any" | DrawdownOptionValue;

type FilterSelections = {
  category: CategoryFilterValue;
  created: CreatedFilterValue;
  activeTime: ActiveTimeFilterValue;
  pnl: PnlFilterValue;
  drawdown: DrawdownFilterValue;
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

type SignalWithMeta = Signal & {
  category: CategoryOptionValue;
  createdWindow: CreatedOptionValue;
  activeTimeBucket: ActiveTimeOptionValue;
  pnlBucket: PnlOptionValue;
  drawdownBucket: DrawdownOptionValue;
};

const FILTER_CONFIG: FilterConfigMap = {
  category: {
    label: "All",
    options: [
      { value: "all", label: "All signal types", buttonLabel: "All" },
      { value: "signals", label: "Momentum trading signals", buttonLabel: "Signals" },
      { value: "indicators", label: "Technical indicators", buttonLabel: "Indicators" },
    ],
  },
  created: {
    label: "Created",
    options: [
      { value: "any", label: "Any creation date", buttonLabel: "Created" },
      { value: "24h", label: "Last 24 hours", buttonLabel: "24h" },
      { value: "7d", label: "Last 7 days", buttonLabel: "7d" },
    ],
  },
  activeTime: {
    label: "Active Time",
    options: [
      { value: "any", label: "Any active duration", buttonLabel: "Active Time" },
      { value: "intraday", label: "Intraday (M1 - H1)", buttonLabel: "Intraday" },
      { value: "swing", label: "Swing (H4 - D1)", buttonLabel: "Swing" },
    ],
  },
  pnl: {
    label: "PnL",
    options: [
      { value: "any", label: "Any performance", buttonLabel: "PnL" },
      { value: "positive", label: "Positive (> +5%)", buttonLabel: "Positive" },
      { value: "negative", label: "Negative (< -5%)", buttonLabel: "Negative" },
    ],
  },
  drawdown: {
    label: "Max Drawdown (7d)",
    options: [
      { value: "any", label: "Any drawdown", buttonLabel: "Max Drawdown (7d)" },
      { value: "low", label: "Low (< 5%)", buttonLabel: "Low DD" },
      { value: "high", label: "High (> 10%)", buttonLabel: "High DD" },
    ],
  },
};

const FILTER_ORDER: (keyof FilterSelections)[] = ["category", "created", "activeTime", "pnl", "drawdown"];

const CATEGORY_CYCLE: CategoryOptionValue[] = ["signals", "indicators"];
const CREATED_CYCLE: CreatedOptionValue[] = ["24h", "7d"];
const ACTIVE_TIME_CYCLE: ActiveTimeOptionValue[] = ["intraday", "swing"];
const PNL_CYCLE: PnlOptionValue[] = ["positive", "negative"];
const DRAWDOWN_CYCLE: DrawdownOptionValue[] = ["low", "high"];

const DUPLICATED_PAIRS = 6;

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

const SignalsAndTechnicalIndicators: FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("Signals and Technical indicators");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(new Set());
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [filters, setFilters] = useState<FilterSelections>({
    category: FILTER_CONFIG.category.options[0].value,
    created: FILTER_CONFIG.created.options[0].value,
    activeTime: FILTER_CONFIG.activeTime.options[0].value,
    pnl: FILTER_CONFIG.pnl.options[0].value,
    drawdown: FILTER_CONFIG.drawdown.options[0].value,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = maskNonWhitespace(balanceValue);

  const signals: SignalWithMeta[] = useMemo(
    () =>
      Array.from({ length: DUPLICATED_PAIRS }, (_, pairIndex) =>
        baseSignals.map((signal, cardIndex) => {
          const metaIndex = pairIndex * baseSignals.length + cardIndex;

          return {
            ...signal,
            id: `${signal.id}-pair-${pairIndex}-${cardIndex}`,
            name: `${signal.name} ${metaIndex + 1}`,
            category: CATEGORY_CYCLE[metaIndex % CATEGORY_CYCLE.length],
            createdWindow: CREATED_CYCLE[metaIndex % CREATED_CYCLE.length],
            activeTimeBucket: ACTIVE_TIME_CYCLE[metaIndex % ACTIVE_TIME_CYCLE.length],
            pnlBucket: PNL_CYCLE[metaIndex % PNL_CYCLE.length],
            drawdownBucket: DRAWDOWN_CYCLE[metaIndex % DRAWDOWN_CYCLE.length],
          };
        }),
      ).flat(),
    [],
  );

  const filteredSignals = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return signals.filter((signal) => {
      if (filters.category !== "all" && signal.category !== filters.category) {
        return false;
      }
      if (filters.created !== "any" && signal.createdWindow !== filters.created) {
        return false;
      }
      if (filters.activeTime !== "any" && signal.activeTimeBucket !== filters.activeTime) {
        return false;
      }
      if (filters.pnl !== "any" && signal.pnlBucket !== filters.pnl) {
        return false;
      }
      if (filters.drawdown !== "any" && signal.drawdownBucket !== filters.drawdown) {
        return false;
      }
      if (normalizedTerm) {
        const haystack = `${signal.name} ${signal.type} ${signal.use}`.toLowerCase();
        return haystack.includes(normalizedTerm);
      }

      return true;
    });
  }, [filters, searchTerm, signals]);

  useEffect(() => {
    if (!activeCardKey) {
      return;
    }

    const isActiveVisible = filteredSignals.some((signal) => buildCardKey("signals-page", signal.id) === activeCardKey);

    if (!isActiveVisible) {
      setActiveCardKey(null);
    }
  }, [activeCardKey, filteredSignals]);

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
    if (category !== "Signals and Technical indicators") {
      navigate("/marketplace/my-products", { state: { category } });
    }
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
              <h1 className="text-4xl font-bold leading-tight text-white md:text-[56px] md:leading-[100%]">
                Marketplace
              </h1>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Total Balance</span>
                  <button
                    type="button"
                    onClick={() => setIsBalanceVisible((prev) => !prev)}
                    aria-label={isBalanceVisible ? "Hide total balance" : "Show total balance"}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#808283] transition-colors hover:border-[#1F2230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  >
                    {isBalanceVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
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
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Signals & Technical Indicators</h2>
            <div className="flex w-full flex-wrap items-center gap-1 sm:gap-2 md:gap-3">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3">
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
                            "flex h-9 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]",
                            isActive ? "border-[#A06AFF] text-white" : "text-[#B0B0B0]",
                          )}
                          aria-label={`Filter by ${config.label}`}
                        >
                          <span className="text-xs font-medium sm:text-sm">{selectedOption.buttonLabel}</span>
                          <ChevronDown className={cn("h-5 w-5", isActive ? "text-white" : "text-[#B0B0B0]")} />
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
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#B0B0B0] data-[state=checked]:bg-[#1A1F2A] data-[state=checked]:text-white"
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
              <div className="flex h-9 w-full max-w-[235px] flex-shrink-0 items-center gap-1 rounded-xl border border-[#181B22] bg-[#0C1014]/50 px-2 backdrop-blur-[50px] sm:w-[235px] md:w-[235px] lg:w-[235px]">
                <Search className="h-4 w-4 flex-shrink-0 text-[#B0B0B0]" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Find signals & indicator"
                  className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none sm:text-xs md:text-sm leading-none"
                  aria-label="Find signals and indicators"
                />
              </div>
            </div>
          </div>

          {filteredSignals.length === 0 ? (
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-6 text-center text-sm font-semibold text-[#B0B0B0]">
              No signals match your filters yet. Try adjusting the filters or search query.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
              {filteredSignals.map((signal) => {
                const cardKey = buildCardKey("signals-page", signal.id);
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
          )}
        </section>
      </div>
    </div>
  );
};

export default SignalsAndTechnicalIndicators;
