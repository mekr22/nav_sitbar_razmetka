import { FC, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Package, Plus, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import TraderCard from "@/components/marketplace/TraderCard";
import { baseTraders, Trader } from "@/data/marketplaceTraders";
import { marketplaceCategories, MarketplaceCategory } from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DUPLICATED_SETS = 12;

const BADGE_VARIANTS = [
  { value: "securities", label: "Securities trading (USA)" },
  { value: "futures", label: "Futures & derivatives" },
  { value: "portfolio", label: "Portfolio allocation" },
  { value: "crypto", label: "Crypto strategies" },
] as const;

const EXPERIENCE_VARIANTS = [
  { value: "junior", years: 3, label: "3 years" },
  { value: "professional", years: 5, label: "5 years" },
  { value: "veteran", years: 8, label: "8 years" },
] as const;

const CERTIFICATION_VARIANTS = [
  "Series 7 (General Securities Representative)",
  "Chartered Market Technician (CMT)",
  "Chartered Financial Analyst (CFA)",
  "FINRA Principal License",
];

const formatPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
const formatNumber = (value: number) => value.toLocaleString("en-US");

const parsePercent = (value: string) => {
  const numeric = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const parseFollowers = (value: string) => {
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const resolveRoiBucket = (roi: number) => {
  if (roi < 20) {
    return "steady";
  }
  if (roi < 35) {
    return "growth";
  }
  return "aggressive";
};

const resolveAccuracyBucket = (accuracy: number) => {
  if (accuracy >= 90) {
    return "precision";
  }
  if (accuracy >= 80) {
    return "expert";
  }
  return "reliable";
};

type BadgeFilterValue = "all" | typeof BADGE_VARIANTS[number]["value"];
type ExperienceFilterValue = "all" | typeof EXPERIENCE_VARIANTS[number]["value"];
type RoiFilterValue = "all" | "steady" | "growth" | "aggressive";
type AccuracyFilterValue = "all" | "precision" | "expert" | "reliable";

type FilterSelections = {
  badge: BadgeFilterValue;
  experience: ExperienceFilterValue;
  roi: RoiFilterValue;
  accuracy: AccuracyFilterValue;
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

const FILTER_CONFIG: FilterConfigMap = {
  badge: {
    label: "Specialization",
    options: [
      { value: "all", label: "All specializations", buttonLabel: "Specialization" },
      ...BADGE_VARIANTS.map((variant) => ({
        value: variant.value,
        label: variant.label,
        buttonLabel: variant.label,
      })),
    ],
  },
  experience: {
    label: "Experience",
    options: [
      { value: "all", label: "All experience levels", buttonLabel: "Experience" },
      ...EXPERIENCE_VARIANTS.map((variant) => ({
        value: variant.value,
        label: `${variant.label} +`,
        buttonLabel: variant.label,
      })),
    ],
  },
  roi: {
    label: "Monthly ROI",
    options: [
      { value: "all", label: "Any ROI", buttonLabel: "ROI" },
      { value: "steady", label: "Steady (< 20%)", buttonLabel: "Steady" },
      { value: "growth", label: "Growth (20% - 35%)", buttonLabel: "Growth" },
      { value: "aggressive", label: "Aggressive (35%+)", buttonLabel: "Aggressive" },
    ],
  },
  accuracy: {
    label: "Accuracy",
    options: [
      { value: "all", label: "Any accuracy", buttonLabel: "Accuracy" },
      { value: "precision", label: "Precision (90%+)", buttonLabel: "90%+" },
      { value: "expert", label: "Expert (80% - 89%)", buttonLabel: "80%+" },
      { value: "reliable", label: "Reliable (70% - 79%)", buttonLabel: "70%+" },
    ],
  },
};

const FILTER_ORDER: (keyof FilterSelections)[] = ["badge", "experience", "roi", "accuracy"];

type TraderWithMeta = Trader & {
  normalizedBadge: BadgeFilterValue;
  experienceBucket: ExperienceFilterValue;
  roiBucket: RoiFilterValue;
  accuracyBucket: AccuracyFilterValue;
  followersCount: number;
};

const Traders: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("Traders");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(new Set());
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterSelections>({
    badge: "all",
    experience: "all",
    roi: "all",
    accuracy: "all",
  });

  useEffect(() => {
    const state = location.state as { category?: MarketplaceCategory } | null;
    if (state?.category && marketplaceCategories.includes(state.category)) {
      setSelectedCategory(state.category);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, { replace: true, state: { ...location.state, scrollToTop: false } });
    }
  }, [location.pathname, location.state, navigate]);

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
    if (category === "Traders") {
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
    if (category === "Investment consultants") {
      navigate("/marketplace/investment-consultants", { state: { category } });
      return;
    }
    if (category === "Analysts") {
      navigate("/marketplace/analysts", { state: { category } });
      return;
    }
    if (category === "Trading robots and Algorithms") {
      navigate("/marketplace/trading-robots", { state: { category } });
      return;
    }
    navigate("/marketplace/my-products", { state: { category } });
  };

  const handleFilterChange = <K extends keyof FilterSelections>(key: K, value: FilterSelections[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const traders: TraderWithMeta[] = useMemo(() => {
    return Array.from({ length: DUPLICATED_SETS }, (_, setIndex) =>
      baseTraders.map((baseTrader, cardIndex) => {
        const metaIndex = setIndex * baseTraders.length + cardIndex;
        const badgeVariant = BADGE_VARIANTS[metaIndex % BADGE_VARIANTS.length];
        const experienceVariant = EXPERIENCE_VARIANTS[metaIndex % EXPERIENCE_VARIANTS.length];
        const certification = CERTIFICATION_VARIANTS[metaIndex % CERTIFICATION_VARIANTS.length];

        const baseFollowers = parseFollowers(baseTrader.followers);
        const followersCount = baseFollowers + setIndex * 850 + cardIndex * 420;
        const trades30 = 30 + (metaIndex % 25);
        const experienceYears = experienceVariant.years + Math.floor(metaIndex / 3);

        const roiMonthBase = parsePercent(baseTrader.roiMonth);
        const roiMonth = roiMonthBase + (metaIndex % 18) - 4;
        const roiQuarter = roiMonth * 1.25;
        const avgProfit = roiMonth / 7;

        const accuracyBase = parsePercent(baseTrader.accuracy);
        const accuracy = Math.min(96, accuracyBase + (metaIndex % 15));

        const publicationsBase = parseInt(baseTrader.publications.replace(/[^0-9]/g, ""), 10) || 600;
        const publications = publicationsBase + setIndex * 35 + cardIndex * 12;

        const rating = Math.min(5, 4.7 + (metaIndex % 4) * 0.1).toFixed(1);

        return {
          ...baseTrader,
          id: `${baseTrader.id}-${setIndex}-${cardIndex}`,
          name: setIndex === 0 ? baseTrader.name : `${baseTrader.name} ${metaIndex + 1}`,
          badge: badgeVariant.label,
          followers: formatNumber(followersCount),
          publications: formatNumber(publications),
          trades30Days: trades30.toString(),
          experience: `${experienceYears} years`,
          roiMonth: formatPercent(roiMonth),
          roiQuarter: formatPercent(roiQuarter),
          avgProfitability: formatPercent(avgProfit),
          accuracy: `${accuracy}%`,
          certification,
          rating,
          normalizedBadge: badgeVariant.value,
          experienceBucket: experienceVariant.value,
          roiBucket: resolveRoiBucket(roiMonth),
          accuracyBucket: resolveAccuracyBucket(accuracy),
          followersCount,
        } satisfies TraderWithMeta;
      }),
    ).flat();
  }, []);

  const filteredTraders = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return traders.filter((trader) => {
      if (filters.badge !== "all" && trader.normalizedBadge !== filters.badge) {
        return false;
      }
      if (filters.experience !== "all" && trader.experienceBucket !== filters.experience) {
        return false;
      }
      if (filters.roi !== "all" && trader.roiBucket !== filters.roi) {
        return false;
      }
      if (filters.accuracy !== "all" && trader.accuracyBucket !== filters.accuracy) {
        return false;
      }
      if (normalizedTerm) {
        const haystack = `${trader.name} ${trader.badge} ${trader.certification}`.toLowerCase();
        return haystack.includes(normalizedTerm);
      }
      return true;
    });
  }, [filters.accuracy, filters.badge, filters.experience, filters.roi, searchTerm, traders]);

  useEffect(() => {
    if (!activeCardKey) {
      return;
    }
    const isActiveVisible = filteredTraders.some((trader) => `trader:${trader.id}` === activeCardKey);
    if (!isActiveVisible) {
      setActiveCardKey(null);
    }
  }, [activeCardKey, filteredTraders]);

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = maskNonWhitespace(balanceValue);

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
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Traders</h2>
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
                          onValueChange={(value) => handleFilterChange(filterKey, value as FilterSelections[typeof filterKey])}
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
                  placeholder="Find trader"
                  className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none sm:text-xs md:text-sm leading-none"
                  aria-label="Find trader"
                />
              </div>
            </div>
          </div>

          {filteredTraders.length === 0 ? (
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-6 text-center text-sm font-semibold text-[#B0B0B0]">
              No traders match your filters yet. Try adjusting the filters or search query.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
              {filteredTraders.map((trader) => {
                const cardKey = `trader:${trader.id}`;
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
          )}

          <div className="mt-6 mb-10 flex w-full justify-center sm:mb-16">
            <nav aria-label="Traders pagination placeholder">
              <div className="flex items-center gap-1" aria-hidden="true">
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6585 15L15.8335 13.825L12.0168 10L15.8335 6.175L14.6585 5L9.6585 10L14.6585 15Z" fill="#B0B0B0" />
                    <path d="M9.1668 15L10.3418 13.825L6.52513 10L10.3418 6.175L9.1668 5L4.1668 10L9.1668 15Z" fill="#B0B0B0" />
                  </svg>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.575 15L13.75 13.825L9.93333 10L13.75 6.175L12.575 5L7.575 10L12.575 15Z" fill="#B0B0B0" />
                  </svg>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)]">
                  <span className="text-[15px] font-bold text-white">1</span>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <span className="text-[15px] font-bold text-[#B0B0B0]">2</span>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <span className="text-[15px] font-bold text-[#B0B0B0]">3</span>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.675 5L7.5 6.175L11.3167 10L7.5 13.825L8.675 15L13.675 10L8.675 5Z" fill="#B0B0B0" />
                  </svg>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.3415 5L4.1665 6.175L7.98317 10L4.1665 13.825L5.3415 15L10.3415 10L5.3415 5Z" fill="#B0B0B0" />
                    <path d="M10.8332 5L9.6582 6.175L13.4749 10L9.6582 13.825L10.8332 15L15.8332 10L10.8332 5Z" fill="#B0B0B0" />
                  </svg>
                </div>
              </div>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Traders;
