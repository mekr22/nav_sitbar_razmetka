import { FC, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ChevronRight, Package, Plus, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { marketplaceCategories, MarketplaceCategory } from "@/data/marketplaceCategories";
import { cn, maskNonWhitespace } from "@/lib/utils";

const Favourites: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>("Favourites");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (location.state?.category && marketplaceCategories.includes(location.state.category)) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, { replace: true, state: { ...location.state, scrollToTop: false } });
    }
  }, [location.pathname, location.state, navigate]);

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = useMemo(() => maskNonWhitespace(balanceValue), [balanceValue]);

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
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">Favourites</h2>
            <div className="ml-auto flex h-9 w-[235px] min-w-[235px] flex-shrink-0 items-center gap-1 rounded-xl border border-[#181B22] bg-[#0C1014]/50 px-2 backdrop-blur-[50px] max-[1142px]:ml-0 max-[1142px]:mt-0 max-[1142px]:w-full max-[1142px]:min-w-0 max-[1142px]:flex-1">
              <Search className="h-4 w-4 flex-shrink-0 text-[#B0B0B0]" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find favourite listings"
                className="flex-1 bg-transparent text-[11px] font-medium text-[#B0B0B0] placeholder:text-[#B0B0B0] outline-none sm:text-xs md:text-sm leading-none"
                aria-label="Find favourite listings"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-6" aria-label="Favourite listings canvas" />
        </section>
      </div>
    </div>
  );
};

export default Favourites;
