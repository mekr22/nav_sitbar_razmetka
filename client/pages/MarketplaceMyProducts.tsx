import type { FC } from "react";
import { useState } from "react";
import { Eye, ChevronRight, Package, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Popular",
  "Favourites",
  "Signals and Technical indicators",
  "Strategies and Portfolios",
  "Trading robots and Algorithms",
  "Investment consultants",
  "Analysts",
  "Traders",
  "Scripts and Software",
  "Courses and Training materials",
  "Others",
] as const;

const MarketplaceMyProducts: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 border-b border-[#181B22] pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6">
            <h1 className="text-[56px] font-bold leading-[100%] text-white">Marketplace</h1>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-white">Total Balance</span>
                <Eye className="h-5 w-5 text-[#808283]" />
              </div>
              
              <div className="text-2xl font-bold text-white">$1,000,000,000.00</div>
              
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-white">Today's PnL</span>
                <div className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 py-0.5">
                  <span className="text-xs font-bold uppercase text-[#2EBD85]">+ $0.00</span>
                </div>
                <ChevronRight className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                className="flex h-[26px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
              >
                <Package className="h-4 w-4" />
                <span>My Products</span>
              </button>
              
              <button
                type="button"
                className="flex h-[26px] items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] px-3 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="flex h-[194px] w-full items-center justify-center rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px] lg:w-[344px]">
            <span className="text-2xl font-bold text-[#808283]">Advertising Banner</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex h-8 items-center justify-center gap-2 rounded-full px-4 text-[15px] font-bold text-white backdrop-blur-[58px] transition-colors",
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
    </div>
  );
};

export default MarketplaceMyProducts;
