import { FC, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ChevronRight, Package, Plus, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  marketplaceCategories,
  MarketplaceCategory,
} from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace } from "@/lib/utils";
import AnalystCard from "@/components/marketplace/AnalystCard";
import InvestmentConsultantCard from "@/components/marketplace/InvestmentConsultantCard";
import TraderCard from "@/components/marketplace/TraderCard";
import SignalCard from "@/components/marketplace/SignalCard";
import StrategyCard from "@/components/marketplace/StrategyCard";
import TradingRobotCard from "@/components/marketplace/TradingRobotCard";
import CourseCard from "@/components/marketplace/CourseCard";
import ScriptProductCard from "@/components/marketplace/ScriptProductCard";
import OtherProductCard from "@/components/marketplace/OtherProductCard";
import {
  getUserFavorites,
  toggleFavorite,
  ProductType,
  FavoriteProduct,
} from "@/lib/supabaseFavorites";
import { useCart } from "@/hooks/useCart";
import type {
  Analyst,
  InvestmentConsultant,
  Trader,
  Signal,
  Strategy,
  TradingRobot,
  Course,
  ScriptProduct,
  OtherProduct,
} from "@/data/marketplaceTypes";

interface DisplayProduct {
  id: string;
  type: ProductType;
  data:
    | Analyst
    | InvestmentConsultant
    | Trader
    | Signal
    | Strategy
    | TradingRobot
    | Course
    | ScriptProduct
    | OtherProduct;
}

const Favourites: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] =
    useState<MarketplaceCategory>("Favourites");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);

  const { addProductToCart } = useCart();

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = useMemo(
    () => maskNonWhitespace(balanceValue),
    [balanceValue],
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

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const userFavorites = await getUserFavorites(user.id);
        const displayFavorites: DisplayProduct[] = userFavorites.map((fav) => ({
          id: fav.id,
          type: (fav as any).type,
          data: fav,
        }));

        setFavorites(displayFavorites);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const filteredFavorites = useMemo(() => {
    if (!searchTerm) return favorites;

    return favorites.filter((fav) => {
      const data = fav.data;
      let searchableText = "";

      switch (fav.type) {
        case "analyst":
          const analyst = data as Analyst;
          searchableText = `${analyst.name} ${analyst.company}`;
          break;
        case "investment-consultant":
          const consultant = data as InvestmentConsultant;
          searchableText = `${consultant.name} ${consultant.company}`;
          break;
        case "trader":
          const trader = data as Trader;
          searchableText = `${trader.name} ${trader.badge}`;
          break;
        case "signal":
          const signal = data as Signal;
          searchableText = signal.name;
          break;
        case "strategy":
          const strategy = data as Strategy;
          searchableText = strategy.name;
          break;
        case "trading-robot":
          const robot = data as TradingRobot;
          searchableText = robot.name;
          break;
        case "course":
          const course = data as Course;
          searchableText = `${course.title} ${course.host}`;
          break;
        case "script":
          const script = data as ScriptProduct;
          searchableText = `${script.title} ${script.creator.name}`;
          break;
        case "other":
          const other = data as OtherProduct;
          searchableText = `${other.title} ${other.typeLabel}`;
          break;
      }

      return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [favorites, searchTerm]);

  const handleToggleFavorite = async (
    productType: ProductType,
    productId: string,
  ) => {
    if (!userId) return;

    await toggleFavorite(userId, productType, productId);

    setFavorites((prev) =>
      prev.filter((fav) => !(fav.type === productType && fav.id === productId)),
    );
  };

  const handleNavigateToDetails = (productType: ProductType, product: any) => {
    const routeMap: Record<ProductType, string> = {
      analyst: "/marketplace/analyst-details",
      "investment-consultant": "/marketplace/investment-consultant-details",
      trader: "/marketplace/trader-details",
      signal: "/marketplace/signals-details",
      strategy: "/marketplace/strategy-details",
      "trading-robot": "/marketplace/trading-robot-details",
      course: "/marketplace/course-details",
      script: "/marketplace/script-details",
      other: "/marketplace/other-details",
    };

    const dataMap: Record<ProductType, string> = {
      analyst: "analyst",
      "investment-consultant": "consultant",
      trader: "trader",
      signal: "signal",
      strategy: "strategy",
      "trading-robot": "robot",
      course: "course",
      script: "script",
      other: "other",
    };

    const route = routeMap[productType];
    const dataKey = dataMap[productType];

    navigate(route, {
      state: {
        [dataKey]: product,
        scrollToTop: true,
      },
    });
  };

  const handleCategoryClick = (category: MarketplaceCategory) => {
    setSelectedCategory(category);
    if (category === "Favourites") {
      return;
    }
    if (category === "Popular") {
      navigate("/marketplace/popular", { state: { category } });
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
    if (category === "Others") {
      navigate("/marketplace/others", { state: { category } });
      return;
    }
    navigate("/marketplace/my-products", { state: { category } });
  };

  if (!userId && !loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="mx-auto w-full max-w-[880px] px-3 sm:px-4 xl:min-w-[880px]">
          <div className="flex flex-col gap-6 border-b border-[#181B22] pb-6">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-[56px] md:leading-[100%]">
              Marketplace
            </h1>
            <div className="rounded-lg border border-[#A06AFF] bg-[#A06AFF]/10 p-4">
              <p className="text-sm font-medium text-white">
                Please log in to view your favorites.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Favourites
            </h2>
            <div className="flex h-9 w-full items-center gap-1 rounded-xl border border-[#181B22] bg-[#0C1014]/50 px-2 backdrop-blur-[50px]">
              <Search
                className="h-4 w-4 flex-shrink-0 text-[#B0B0B0]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find favourite listings"
                className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none leading-none sm:text-xs md:text-sm"
                aria-label="Find favourite listings"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#181B22] border-t-[#A06AFF] mx-auto"></div>
                <p className="text-sm font-medium text-[#B0B0B0]">
                  Loading your favorites...
                </p>
              </div>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-12">
              <div className="text-center">
                <p className="text-sm font-medium text-[#B0B0B0]">
                  {searchTerm
                    ? "No favorites match your search."
                    : "You haven't added any favorites yet."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid items-stretch gap-6 md:grid-cols-2 xl:gap-8 auto-rows-fr">
              {filteredFavorites.map((product) => {
                const cardKey = `${product.type}:${product.id}`;
                const isActive = activeCardKey === cardKey;

                switch (product.type) {
                  case "analyst":
                    const analyst = product.data as Analyst;
                    return (
                      <div key={product.id} className="h-full">
                        <AnalystCard
                          analyst={analyst}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite={true}
                          onToggleFavorite={() =>
                            handleToggleFavorite("analyst", product.id)
                          }
                        />
                      </div>
                    );

                  case "investment-consultant":
                    const consultant = product.data as InvestmentConsultant;
                    return (
                      <div key={product.id} className="h-full">
                        <InvestmentConsultantCard
                          consultant={consultant}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite
                          onToggleFavorite={() =>
                            handleToggleFavorite(
                              "investment-consultant",
                              product.id,
                            )
                          }
                          onBuy={(current) => {
                            void addProductToCart("investment-consultant", current);
                          }}
                        />
                      </div>
                    );

                  case "trader":
                    const trader = product.data as Trader;
                    return (
                      <div key={product.id} className="h-full">
                        <TraderCard
                          trader={trader}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite={true}
                          onToggleFavorite={() =>
                            handleToggleFavorite("trader", product.id)
                          }
                        />
                      </div>
                    );

                  case "signal":
                    const signal = product.data as Signal;
                    return (
                      <div key={product.id} className="h-full">
                        <SignalCard
                          signal={signal}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite
                          onToggleFavorite={() =>
                            handleToggleFavorite("signal", product.id)
                          }
                          onOpenDetails={() =>
                            handleNavigateToDetails("signal", signal)
                          }
                          onBuy={(current) => {
                            void addProductToCart("signal", current);
                          }}
                        />
                      </div>
                    );

                  case "strategy":
                    const strategy = product.data as Strategy;
                    return (
                      <div key={product.id} className="w-full">
                        <StrategyCard
                          strategy={strategy}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite={true}
                          onToggleFavorite={() =>
                            handleToggleFavorite("strategy", product.id)
                          }
                          onOpenDetails={() =>
                            handleNavigateToDetails("strategy", strategy)
                          }
                        />
                      </div>
                    );

                  case "trading-robot":
                    const robot = product.data as TradingRobot;
                    return (
                      <div
                        key={product.id}
                        className="w-full cursor-pointer"
                        onClick={() =>
                          handleNavigateToDetails("trading-robot", robot)
                        }
                      >
                        <TradingRobotCard
                          robot={robot}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite={true}
                          onToggleFavorite={() =>
                            handleToggleFavorite("trading-robot", product.id)
                          }
                        />
                      </div>
                    );

                  case "course":
                    const course = product.data as Course;
                    return (
                      <div key={product.id} className="w-full md:col-span-2">
                        <CourseCard
                          course={course}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite={true}
                          onToggleFavorite={() =>
                            handleToggleFavorite("course", product.id)
                          }
                          onOpenDetails={() =>
                            handleNavigateToDetails("course", course)
                          }
                        />
                      </div>
                    );

                  case "script":
                    const script = product.data as ScriptProduct;
                    return (
                      <div key={product.id} className="w-full md:col-span-2">
                        <ScriptProductCard
                          product={script}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite={true}
                          onToggleFavorite={() =>
                            handleToggleFavorite("script", product.id)
                          }
                          onOpenDetails={() =>
                            handleNavigateToDetails("script", script)
                          }
                        />
                      </div>
                    );

                  case "other":
                    const otherProduct = product.data as OtherProduct;
                    return (
                      <div
                        key={product.id}
                        className="w-full cursor-pointer"
                        onClick={() =>
                          handleNavigateToDetails("other", otherProduct)
                        }
                      >
                        <OtherProductCard
                          product={otherProduct}
                          isActive={isActive}
                          onSelect={() => setActiveCardKey(cardKey)}
                          isFavorite={true}
                          onToggleFavorite={() =>
                            handleToggleFavorite("other", product.id)
                          }
                        />
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Favourites;
