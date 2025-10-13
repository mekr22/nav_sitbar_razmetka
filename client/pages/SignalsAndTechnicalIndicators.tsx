import { FC, useMemo, useState } from "react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Package, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignalCard, { Signal } from "@/components/marketplace/SignalCard";
import { baseSignals } from "@/data/marketplaceSignals";
import { marketplaceCategories, MarketplaceCategory } from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace } from "@/lib/utils";

const DUPLICATED_PAIRS = 6;

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

const SignalsAndTechnicalIndicators: FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("Signals and Technical indicators");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(new Set());
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = maskNonWhitespace(balanceValue);

  const signals: Signal[] = useMemo(
    () =>
      Array.from({ length: DUPLICATED_PAIRS }, (_, pairIndex) =>
        baseSignals.map((signal, cardIndex) => ({
          ...signal,
          id: `${signal.id}-pair-${pairIndex}-${cardIndex}`,
          name: `${signal.name} ${pairIndex * baseSignals.length + cardIndex + 1}`,
        })),
      ).flat(),
    [],
  );

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
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors hover:border-[#1F2230]"
                >
                  <span className="text-xs font-medium text-[#B0B0B0] sm:text-sm">All</span>
                  <ChevronDown className="h-5 w-5 text-[#B0B0B0]" />
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors hover:border-[#1F2230]"
                >
                  <span className="text-xs font-medium text-[#B0B0B0] sm:text-sm">Created</span>
                  <ChevronDown className="h-5 w-5 text-[#B0B0B0]" />
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors hover:border-[#1F2230]"
                >
                  <span className="text-xs font-medium text-[#B0B0B0] sm:text-sm">Active Time</span>
                  <ChevronDown className="h-5 w-5 text-[#B0B0B0]" />
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors hover:border-[#1F2230]"
                >
                  <span className="text-xs font-medium text-[#B0B0B0] sm:text-sm">PnL</span>
                  <ChevronDown className="h-5 w-5 text-[#B0B0B0]" />
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[58px] transition-colors hover:border-[#1F2230]"
                >
                  <span className="text-xs font-medium text-[#B0B0B0] sm:text-sm">Max Drawdown (7d)</span>
                  <ChevronDown className="h-5 w-5 text-[#B0B0B0]" />
                </button>
              </div>
              <div className="flex h-9 w-full max-w-[220px] flex-shrink-0 items-center gap-1 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-2 backdrop-blur-[50px] sm:w-[240px] md:w-[260px] lg:w-[280px]">
                <Search className="h-4 w-4 flex-shrink-0 text-[#B0B0B0]" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Find signals & indicator"
                  className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none sm:text-xs md:text-sm leading-none"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {signals.map((signal) => {
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
        </section>
      </div>
    </div>
  );
};

export default SignalsAndTechnicalIndicators;
