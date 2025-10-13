import { FC, useMemo, useState } from "react";
import { Eye, ChevronRight, Package, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignalCard, { Signal } from "@/components/marketplace/SignalCard";
import { baseSignals } from "@/data/marketplaceSignals";
import { marketplaceCategories, MarketplaceCategory } from "@/data/marketplaceCategories";
import { cn } from "@/lib/utils";

const DUPLICATED_PAIRS = 6;

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

const SignalsAndTechnicalIndicators: FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("Signals and Technical indicators");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(new Set());

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
                Signals & Technical Indicators
              </h1>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Total Subscriptions</span>
                  <Eye className="h-4 w-4 text-[#808283] sm:h-5 sm:w-5" />
                </div>
                <div className="text-xl font-bold text-white sm:text-2xl">87,540 Active Licenses</div>
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Average Accuracy</span>
                  <div className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 py-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#2EBD85] sm:text-xs">+ 38.2%</span>
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
                  <span>My Signals</span>
                </button>

                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:h-[32px] sm:px-8 sm:text-[15px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Signal</span>
                </button>
              </div>
            </div>

            <div className="flex h-[170px] w-full flex-col justify-between rounded-xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px] sm:h-[194px] lg:w-[260px] xl:w-[280px]">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#B0B0B0]">Top performer</span>
                <span className="text-lg font-bold text-white sm:text-2xl">Impulse Hunter</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Accuracy</span>
                <span className="rounded bg-[#2EBD85]/16 px-2 py-0.5 text-[#2EBD85]">72%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Users</span>
                <span>12,430</span>
              </div>
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
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">All Signals</h2>
            <p className="text-sm font-bold text-[#B0B0B0] sm:text-[15px]">
              Discover curated indicators optimized for momentum, mean-reversion, and volatility breakouts across global markets.
            </p>
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
