import { FC, useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  ChevronRight,
  Package,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import InvestmentConsultantCard from "@/components/marketplace/InvestmentConsultantCard";
import {
  baseInvestmentConsultants,
  InvestmentConsultant,
} from "@/data/marketplaceInvestmentConsultants";
import {
  marketplaceCategories,
  MarketplaceCategory,
} from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AvailabilityFilterValue = "all" | "nationwide" | "regional";
type FeaturedFilterValue = "all" | "featured" | "notFeatured";
type SortFilterValue = "default" | "clients" | "aum" | "return";
type RiskFilterValue = "all" | string;

type FilterSelections = {
  availability: AvailabilityFilterValue;
  risk: RiskFilterValue;
  featured: FeaturedFilterValue;
  sort: SortFilterValue;
};

type ConsultantWithMeta = InvestmentConsultant & {
  sortIndex: number;
  normalizedRisk: string;
  clientsCount: number;
  aumValue: number;
  returnValue: number;
  availability: "nationwide" | "regional";
};

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

const toTitleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const parseClients = (value: string) => {
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const parseAum = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  const multiplier = trimmed.endsWith("B")
    ? 1_000_000_000
    : trimmed.endsWith("M")
      ? 1_000_000
      : trimmed.endsWith("K")
        ? 1_000
        : 1;
  const numeric = parseFloat(trimmed.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric * multiplier;
};

const parsePercentage = (value: string) => {
  const numeric = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const InvestmentConsultants: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>(
    "Investment consultants",
  );
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(
    new Set(),
  );
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterSelections>({
    availability: "all",
    risk: "all",
    featured: "all",
    sort: "default",
  });

  const consultants = useMemo<ConsultantWithMeta[]>(() => {
    const targetCount = 24;
    const base = baseInvestmentConsultants;

    return Array.from({ length: targetCount }, (_, index) => {
      const baseConsultant = base[index % base.length];
      const uniqueId = `${baseConsultant.id}-variant-${index}`;

      return {
        ...baseConsultant,
        id: uniqueId,
        sortIndex: index,
        normalizedRisk: baseConsultant.riskLevel.trim().toLowerCase(),
        clientsCount: parseClients(baseConsultant.clients),
        aumValue: parseAum(baseConsultant.aum),
        returnValue: parsePercentage(baseConsultant.portfolioReturn),
        availability: baseConsultant.nationwide ? "nationwide" : "regional",
      };
    });
  }, []);

  const riskOptions = useMemo(() => {
    const uniqueRisks = Array.from(
      new Set(consultants.map((consultant) => consultant.normalizedRisk)),
    )
      .filter(Boolean)
      .sort();
    return [
      {
        value: "all" as RiskFilterValue,
        label: "All risk profiles",
        buttonLabel: "Risk",
      },
      ...uniqueRisks.map((risk) => ({
        value: risk as RiskFilterValue,
        label: toTitleCase(risk),
        buttonLabel: toTitleCase(risk),
      })),
    ];
  }, [consultants]);

  const filterConfig = useMemo(
    () =>
      [
        {
          key: "availability" as const,
          label: "Availability",
          options: [
            {
              value: "all" as AvailabilityFilterValue,
              label: "All service areas",
              buttonLabel: "Availability",
            },
            {
              value: "nationwide" as AvailabilityFilterValue,
              label: "Nationwide coverage",
              buttonLabel: "Nationwide",
            },
            {
              value: "regional" as AvailabilityFilterValue,
              label: "Regional coverage",
              buttonLabel: "Regional",
            },
          ],
        },
        {
          key: "risk" as const,
          label: "Risk profile",
          options: riskOptions,
        },
        {
          key: "featured" as const,
          label: "Featured",
          options: [
            {
              value: "all" as FeaturedFilterValue,
              label: "All consultants",
              buttonLabel: "Featured",
            },
            {
              value: "featured" as FeaturedFilterValue,
              label: "Featured only",
              buttonLabel: "Featured only",
            },
            {
              value: "notFeatured" as FeaturedFilterValue,
              label: "Exclude featured",
              buttonLabel: "Non-featured",
            },
          ],
        },
        {
          key: "sort" as const,
          label: "Sort",
          options: [
            {
              value: "default" as SortFilterValue,
              label: "Recommended order",
              buttonLabel: "Sort",
            },
            {
              value: "clients" as SortFilterValue,
              label: "Most clients",
              buttonLabel: "Clients",
            },
            {
              value: "aum" as SortFilterValue,
              label: "Highest AUM",
              buttonLabel: "AUM",
            },
            {
              value: "return" as SortFilterValue,
              label: "Best returns",
              buttonLabel: "Return",
            },
          ],
        },
      ] as const,
    [riskOptions],
  );

  useEffect(() => {
    const state = location.state as { category?: MarketplaceCategory } | null;
    if (state?.category && marketplaceCategories.includes(state.category)) {
      setSelectedCategory(state.category);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, scrollToTop: false },
      });
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
    if (category === "Investment consultants") {
      return;
    }
    if (category === "Popular") {
      navigate("/marketplace/popular", { state: { category } });
      return;
    }
    if (category === "Favourites") {
      navigate("/marketplace/favourites", { state: { category } });
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
    if (category === "Trading robots and Algorithms") {
      navigate("/marketplace/trading-robots", { state: { category } });
      return;
    }
    if (category === "Analysts") {
      navigate("/marketplace/analysts", { state: { category } });
      return;
    }
    if (category === "Traders") {
      navigate("/marketplace/traders", { state: { category } });
      return;
    }
    if (category === "Courses and Training materials") {
      navigate("/marketplace/courses", { state: { category } });
      return;
    }
    if (category === "Scripts and Software") {
      navigate("/marketplace/scripts", { state: { category } });
      return;
    }
    if (category === "Others") {
      navigate("/marketplace/others", { state: { category } });
      return;
    }
    navigate("/marketplace/my-products", { state: { category } });
  };

  const handleFilterChange = <K extends keyof FilterSelections>(
    key: K,
    value: FilterSelections[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const normalizedConsultants = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return consultants.filter((consultant) => {
      if (
        filters.availability !== "all" &&
        consultant.availability !== filters.availability
      ) {
        return false;
      }
      if (
        filters.risk !== "all" &&
        consultant.normalizedRisk !== filters.risk
      ) {
        return false;
      }
      if (filters.featured === "featured" && !consultant.featured) {
        return false;
      }
      if (filters.featured === "notFeatured" && consultant.featured) {
        return false;
      }
      if (normalizedTerm) {
        const haystack =
          `${consultant.name} ${consultant.company} ${consultant.location} ${consultant.description}`.toLowerCase();
        if (!haystack.includes(normalizedTerm)) {
          return false;
        }
      }
      return true;
    });
  }, [
    consultants,
    filters.availability,
    filters.featured,
    filters.risk,
    searchTerm,
  ]);

  const sortedConsultants = useMemo(() => {
    const items = [...normalizedConsultants];

    switch (filters.sort) {
      case "clients":
        items.sort(
          (a, b) =>
            b.clientsCount - a.clientsCount || a.sortIndex - b.sortIndex,
        );
        break;
      case "aum":
        items.sort(
          (a, b) => b.aumValue - a.aumValue || a.sortIndex - b.sortIndex,
        );
        break;
      case "return":
        items.sort(
          (a, b) => b.returnValue - a.returnValue || a.sortIndex - b.sortIndex,
        );
        break;
      default:
        items.sort((a, b) => a.sortIndex - b.sortIndex);
        break;
    }

    return items;
  }, [filters.sort, normalizedConsultants]);

  useEffect(() => {
    if (!activeCardKey) {
      return;
    }
    const isActiveVisible = sortedConsultants.some(
      (consultant) =>
        buildCardKey("consultants-page", consultant.id) === activeCardKey,
    );
    if (!isActiveVisible) {
      setActiveCardKey(null);
    }
  }, [activeCardKey, sortedConsultants]);

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = maskNonWhitespace(balanceValue);

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
                    aria-label={
                      isBalanceVisible
                        ? "Hide total balance"
                        : "Show total balance"
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#808283] transition-colors hover:border-[#1F2230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  >
                    {isBalanceVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="text-xl font-bold text-white sm:text-2xl">
                  {isBalanceVisible ? balanceValue : maskedBalanceValue}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Today&apos;s PnL</span>
                  <div className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 py-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#2EBD85] sm:text-xs">
                      + $0.00
                    </span>
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
              <span className="text-lg font-bold text-[#808283] sm:text-2xl">
                Advertising Banner
              </span>
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
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Investment Consultants
            </h2>
            <div className="flex w-full flex-wrap items-center gap-1 sm:gap-2 md:gap-3">
              <div className="hidden min-[1143px]:flex min-[1143px]:w-full min-[1143px]:flex-1 min-[1143px]:items-center min-[1143px]:gap-3">
                {filterConfig.map((config) => {
                  const selectedOption =
                    config.options.find(
                      (option) => option.value === filters[config.key],
                    ) ?? config.options[0];
                  const isActive =
                    filters[config.key] !== config.options[0].value;

                  return (
                    <DropdownMenu key={config.key}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors focus-visible:outline-none focus-visible:ring-0",
                            isActive
                              ? "border-[#A06AFF] text-white"
                              : "text-[#B0B0B0]",
                          )}
                          aria-label={`Filter by ${config.label}`}
                        >
                          <span className="truncate text-xs font-medium sm:text-sm">
                            {selectedOption.buttonLabel}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive ? "text-white" : "text-[#B0B0B0]",
                            )}
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-60 rounded-xl border border-[#181B22] bg-[#0C1014]/95 p-1 backdrop-blur-xl"
                      >
                        <DropdownMenuRadioGroup
                          value={filters[config.key]}
                          onValueChange={(value) =>
                            handleFilterChange(
                              config.key,
                              value as FilterSelections[typeof config.key],
                            )
                          }
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
                <Search
                  className="h-4 w-4 flex-shrink-0 text-[#B0B0B0]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Find consultant"
                  className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none sm:text-xs md:text-sm leading-none"
                  aria-label="Find investment consultant"
                />
              </div>
            </div>
          </div>

          {sortedConsultants.length === 0 ? (
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-6 text-center text-sm font-semibold text-[#B0B0B0]">
              No consultants match your filters yet. Try adjusting the filters
              or updating your search query.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
              {sortedConsultants.map((consultant) => {
                const cardKey = buildCardKey("consultants-page", consultant.id);
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
          )}

          <div className="mt-6 mb-10 flex w-full justify-center sm:mb-16">
            <nav aria-label="Investment consultants pagination placeholder">
              <div className="flex items-center gap-1" aria-hidden="true">
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.6585 15L15.8335 13.825L12.0168 10L15.8335 6.175L14.6585 5L9.6585 10L14.6585 15Z"
                      fill="#B0B0B0"
                    />
                    <path
                      d="M9.1668 15L10.3418 13.825L6.52513 10L10.3418 6.175L9.1668 5L4.1668 10L9.1668 15Z"
                      fill="#B0B0B0"
                    />
                  </svg>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.575 15L13.75 13.825L9.93333 10L13.75 6.175L12.575 5L7.575 10L12.575 15Z"
                      fill="#B0B0B0"
                    />
                  </svg>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)]">
                  <span className="text-[15px] font-bold text-white">1</span>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <span className="text-[15px] font-bold text-[#B0B0B0]">
                    2
                  </span>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <span className="text-[15px] font-bold text-[#B0B0B0]">
                    3
                  </span>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.675 5L7.5 6.175L11.3167 10L7.5 13.825L8.675 15L13.675 10L8.675 5Z"
                      fill="#B0B0B0"
                    />
                  </svg>
                </div>
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.3415 5L4.1665 6.175L7.98317 10L4.1665 13.825L5.3415 15L10.3415 10L5.3415 5Z"
                      fill="#B0B0B0"
                    />
                    <path
                      d="M10.8332 5L9.6582 6.175L13.4749 10L9.6582 13.825L10.8332 15L15.8332 10L10.8332 5Z"
                      fill="#B0B0B0"
                    />
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

export default InvestmentConsultants;
