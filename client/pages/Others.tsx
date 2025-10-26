import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Package,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFavoriteMultiple } from "@/hooks/useFavorite";

import OtherProductCard from "@/components/marketplace/OtherProductCard";
import { baseOtherProducts, OtherProduct } from "@/data/marketplaceOthers";
import {
  marketplaceCategories,
  MarketplaceCategory,
} from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace, extractOriginalProductId } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TypeFilterValue =
  | "all"
  | "script"
  | "workspace"
  | "platform"
  | "portal"
  | "automation"
  | "analytics";
type IndustryFilterValue =
  | "all"
  | "automation"
  | "operations"
  | "content"
  | "investor"
  | "compliance"
  | "execution";
type LocationFilterValue = "any" | "apac" | "emea" | "americas";
type RatingFilterValue = "any" | "4.5" | "4.6" | "4.7" | "4.8" | "4.9";
type LabelFilterValue = "any" | "desktop" | "web" | "enterprise" | "brand";

type FilterSelections = {
  type: TypeFilterValue;
  industry: IndustryFilterValue;
  location: LocationFilterValue;
  rating: RatingFilterValue;
  label: LabelFilterValue;
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
  type: {
    label: "Type",
    options: [
      { value: "all", label: "All product types", buttonLabel: "Type" },
      { value: "script", label: "Automation scripts", buttonLabel: "Script" },
      {
        value: "workspace",
        label: "Collaboration workspaces",
        buttonLabel: "Workspace",
      },
      {
        value: "platform",
        label: "Content platforms",
        buttonLabel: "Platform",
      },
      { value: "portal", label: "Investor portals", buttonLabel: "Portal" },
      {
        value: "automation",
        label: "Process automation",
        buttonLabel: "Automation",
      },
      {
        value: "analytics",
        label: "Analytics suites",
        buttonLabel: "Analytics",
      },
    ],
  },
  industry: {
    label: "Industry",
    options: [
      { value: "all", label: "All industry focus", buttonLabel: "Industry" },
      {
        value: "automation",
        label: "Automation & scripting",
        buttonLabel: "Automation",
      },
      {
        value: "operations",
        label: "Operations & collaboration",
        buttonLabel: "Operations",
      },
      {
        value: "content",
        label: "Content & community",
        buttonLabel: "Content",
      },
      {
        value: "investor",
        label: "Investor relations",
        buttonLabel: "Investor",
      },
      {
        value: "compliance",
        label: "Compliance operations",
        buttonLabel: "Compliance",
      },
      {
        value: "execution",
        label: "Execution analytics",
        buttonLabel: "Execution",
      },
    ],
  },
  location: {
    label: "Location",
    options: [
      { value: "any", label: "Any region", buttonLabel: "Location" },
      { value: "apac", label: "Asia-Pacific", buttonLabel: "APAC" },
      { value: "emea", label: "Europe & Middle East", buttonLabel: "EMEA" },
      { value: "americas", label: "Americas", buttonLabel: "Americas" },
    ],
  },
  rating: {
    label: "Rating",
    options: [
      { value: "any", label: "Any rating", buttonLabel: "Rating" },
      { value: "4.5", label: "4.5 and up", buttonLabel: "4.5+" },
      { value: "4.6", label: "4.6 and up", buttonLabel: "4.6+" },
      { value: "4.7", label: "4.7 and up", buttonLabel: "4.7+" },
      { value: "4.8", label: "4.8 and up", buttonLabel: "4.8+" },
      { value: "4.9", label: "4.9 and up", buttonLabel: "4.9+" },
    ],
  },
  label: {
    label: "Label",
    options: [
      { value: "any", label: "Any label tag", buttonLabel: "Label" },
      { value: "desktop", label: "Desktop ready", buttonLabel: "Desktop" },
      { value: "web", label: "Web platform", buttonLabel: "Web" },
      {
        value: "enterprise",
        label: "Enterprise suite",
        buttonLabel: "Enterprise",
      },
      { value: "brand", label: "Brand-ready", buttonLabel: "Brand" },
    ],
  },
};

const FILTER_ORDER: (keyof FilterSelections)[] = [
  "type",
  "industry",
  "location",
  "rating",
  "label",
];

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

const Others: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] =
    useState<MarketplaceCategory>("Others");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { isFavorite, toggle } = useFavoriteMultiple();
  const [filters, setFilters] = useState<FilterSelections>({
    type: FILTER_CONFIG.type.options[0].value,
    industry: FILTER_CONFIG.industry.options[0].value,
    location: FILTER_CONFIG.location.options[0].value,
    rating: FILTER_CONFIG.rating.options[0].value,
    label: FILTER_CONFIG.label.options[0].value,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const openOtherDetails = useCallback(
    (selectedProduct: OtherProduct, meta?: { isFavorite: boolean }) => {
      navigate("/marketplace/other-details", {
        state: {
          scrollToTop: true,
          category: "Others" as MarketplaceCategory,
          product: selectedProduct,
          isFavorite: Boolean(meta?.isFavorite),
        },
      });
    },
    [navigate],
  );

  useEffect(() => {
    if (
      location.state?.category &&
      marketplaceCategories.includes(location.state.category)
    ) {
      setSelectedCategory(location.state.category);
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

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = maskNonWhitespace(balanceValue);

  const products: OtherProduct[] = useMemo(() => baseOtherProducts, []);

  const filteredProducts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      if (filters.type !== "all") {
        const normalizedType = product.typeLabel.toLowerCase();
        if (
          !normalizedType.includes(filters.type.replace("workspace", "work"))
        ) {
          return false;
        }
      }

      if (filters.industry !== "all") {
        const normalizedIndustry = product.industryLabel.toLowerCase();
        if (
          !normalizedIndustry.includes(
            filters.industry.replace("investor", "investor relations"),
          )
        ) {
          return false;
        }
      }

      if (filters.location !== "any") {
        const country = product.location.toLowerCase();
        if (
          filters.location === "apac" &&
          !country.includes("australia") &&
          !country.includes("singapore")
        ) {
          return false;
        }
        if (
          filters.location === "emea" &&
          !country.includes("germany") &&
          !country.includes("united kingdom")
        ) {
          return false;
        }
        if (
          filters.location === "americas" &&
          !country.includes("united states") &&
          !country.includes("canada")
        ) {
          return false;
        }
      }

      if (filters.rating !== "any") {
        const numericRating = parseFloat(product.rating);
        if (
          Number.isFinite(numericRating) &&
          numericRating < parseFloat(filters.rating)
        ) {
          return false;
        }
      }

      if (filters.label !== "any") {
        const normalizedLabel = product.label.toLowerCase();
        if (
          filters.label === "desktop" &&
          !normalizedLabel.includes("windows") &&
          !normalizedLabel.includes("desktop")
        ) {
          return false;
        }
        if (
          filters.label === "web" &&
          !normalizedLabel.includes("web") &&
          !normalizedLabel.includes("platform")
        ) {
          return false;
        }
        if (
          filters.label === "enterprise" &&
          !normalizedLabel.includes("enterprise")
        ) {
          return false;
        }
        if (filters.label === "brand" && !normalizedLabel.includes("brand")) {
          return false;
        }
      }

      if (normalizedTerm) {
        const haystack =
          `${product.title} ${product.description} ${product.location} ${product.industryLabel}`.toLowerCase();
        if (!haystack.includes(normalizedTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [filters, products, searchTerm]);

  useEffect(() => {
    if (!activeCardKey) {
      return;
    }
    const isActiveVisible = filteredProducts.some(
      (product) => buildCardKey("others-page", product.id) === activeCardKey,
    );
    if (!isActiveVisible) {
      setActiveCardKey(null);
    }
  }, [activeCardKey, filteredProducts]);

  const handleCategoryClick = (category: MarketplaceCategory) => {
    setSelectedCategory(category);
    if (category === "Others") {
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
    if (category === "Investment consultants") {
      navigate("/marketplace/investment-consultants", { state: { category } });
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
    navigate("/marketplace/my-products", { state: { category } });
  };

  const handleFilterChange = (key: keyof FilterSelections, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value as FilterSelections[keyof FilterSelections],
    }));
  };

  const PaginationPlaceholder = () => {
    const controlClassName =
      "flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]";

    return (
      <div className="flex items-center gap-1" aria-hidden="true">
        <div className={controlClassName}>
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
        <div className={controlClassName}>
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
        <div className={controlClassName}>
          <span className="text-[15px] font-bold text-[#B0B0B0]">2</span>
        </div>
        <div className={controlClassName}>
          <span className="text-[15px] font-bold text-[#B0B0B0]">3</span>
        </div>
        <div className={controlClassName}>
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
        <div className={controlClassName}>
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
    );
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
                  <span>Today's PnL</span>
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
                  <span>Products</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/marketplace/add-product")}
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
              Other Products
            </h2>
            <div className="flex w-full flex-wrap items-center gap-1 sm:gap-2 md:gap-3">
              <div className="hidden min-[1157px]:flex min-[1157px]:w-full min-[1157px]:flex-1 min-[1157px]:items-center min-[1157px]:gap-3">
                {FILTER_ORDER.map((filterKey) => {
                  const config = FILTER_CONFIG[filterKey];
                  const selectedOption =
                    config.options.find(
                      (option) => option.value === filters[filterKey],
                    ) ?? config.options[0];
                  const isActive =
                    filters[filterKey] !== config.options[0].value;

                  return (
                    <DropdownMenu key={filterKey}>
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
                          value={filters[filterKey]}
                          onValueChange={(value) =>
                            handleFilterChange(filterKey, value)
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
              <div className="ml-auto flex h-9 w-[235px] min-w-[235px] flex-shrink-0 items-center gap-1 rounded-xl border border-[#181B22] bg-[#0C1014]/50 px-2 backdrop-blur-[50px] max-[1156px]:ml-0 max-[1156px]:mt-0 max-[1156px]:w-full max-[1156px]:min-w-0 max-[1156px]:flex-1">
                <Search
                  className="h-4 w-4 flex-shrink-0 text-[#B0B0B0]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Find other products"
                  className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none leading-none sm:text-xs md:text-sm"
                  aria-label="Find other products"
                />
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-6 text-center text-sm font-semibold text-[#B0B0B0]">
              No products match your filters yet. Try adjusting the filters or
              search query.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredProducts.map((product) => {
                const cardKey = buildCardKey("others-page", product.id);
                const originalId = extractOriginalProductId(product.id);
                const isFavorited = isFavorite("other", originalId);
                return (
                  <OtherProductCard
                    key={product.id}
                    product={product}
                    isActive={activeCardKey === cardKey}
                    onSelect={() => {
                      setActiveCardKey(cardKey);
                      openOtherDetails(product, { isFavorite: isFavorited });
                    }}
                    isFavorite={isFavorited}
                    onToggleFavorite={() => toggle("other", originalId)}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-6 mb-10 flex w-full justify-center sm:mb-16">
            <nav aria-label="Others pagination placeholder">
              <PaginationPlaceholder />
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Others;
