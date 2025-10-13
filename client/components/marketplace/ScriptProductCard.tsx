import type { FC, KeyboardEvent } from "react";
import { BookOpen, ShoppingCart, Eye, Users, Star } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { ScriptProduct } from "@/data/marketplaceScriptsSoftware";

const actionButtonBaseClass = "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase text-white sm:w-auto";

const isActivationKey = (key: string) => key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

type ScriptProductCardProps = {
  product: ScriptProduct;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const ScriptProductCard: FC<ScriptProductCardProps> = ({ product, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div
    role="button"
    tabIndex={0}
    aria-pressed={isActive}
    onClick={onSelect}
    onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
      if (isActivationKey(event.key)) {
        event.preventDefault();
        onSelect();
      }
    }}
    className={cn(
      "relative cursor-pointer rounded-2xl border bg-[#0C101480] p-6 backdrop-blur-[50px] transition-colors",
      isActive ? "border-[#A06AFF]" : "border-[#181B22]",
    )}
  >
    <div className="absolute right-4 top-4 flex items-center gap-4 text-xs font-bold uppercase text-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4 text-[#FFA800]" />
          <span className="text-[#FFA800]">{product.purchases}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4 text-[#FFA800]" />
          <span className="text-[#FFA800]">{product.views}</span>
        </div>
      </div>
      <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
    </div>
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <img src={product.heroImage} alt={product.heroAlt} className="h-80 w-full rounded-lg object-cover" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-bold uppercase text-[#B0B0B0] sm:flex sm:flex-nowrap sm:items-center sm:gap-6">
          <div className="flex flex-col gap-1 sm:gap-2">
            <span className="whitespace-nowrap">Type:</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">{product.typeLabel}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <span className="whitespace-nowrap">Industry</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="inline-flex rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF] whitespace-nowrap">{product.industryLabel}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <span className="whitespace-nowrap">Revenue</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">{product.revenueLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-5">
        <div className="flex flex-col gap-4 border-b border-[#181B22] pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="h-20 w-20 overflow-hidden rounded-lg">
                <img src={product.creator.avatar} alt={product.creator.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-white sm:text-[19px]">{product.creator.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold text-white">
                    <Users className="h-4 w-4 text-[#B0B0B0]" />
                    {product.creator.followers}
                  </span>
                  {product.creator.tags.map((tag) => (
                    <span key={tag} className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="mb-2 text-lg font-bold text-white sm:text-[19px]">{product.title}</h4>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[rgba(160,106,255,0.16)] px-2 py-0.5 text-xs font-extrabold uppercase text-[#A06AFF]">
              {product.verificationLabel}
            </span>
            <span className="text-xs font-bold uppercase text-white">{product.location}</span>
          </div>
          <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">{product.description}</p>

          <div className="mb-4 space-y-2 text-xs font-bold">
            <div className="flex flex-wrap items-center gap-2">
              <span className="uppercase text-[#B0B0B0]">Compatibility:</span>
              {product.compatibility.map((item) => (
                <span key={item} className="rounded bg-[#2E2744] px-1 uppercase text-white">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="uppercase text-[#B0B0B0]">Requirements:</span>
              {product.requirements.map((item) => (
                <span key={item} className="rounded bg-[#2E2744] px-1 uppercase text-white">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-[#FFA800] text-[#FFA800]" />
                ))}
              </div>
              <span className="text-sm font-bold text-white sm:text-[15px]">{product.ratingScore}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
          <button
            className={cn(
              actionButtonBaseClass,
              "border border-[#181B22] bg-[#0C1014]/60 backdrop-blur-[50px] transition-colors hover:border-[#1F2230]",
            )}
          >
            <BookOpen className="h-4 w-4" />
            Details
          </button>
          <button
            className={cn(actionButtonBaseClass, "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90")}
          >
            <ShoppingCart className="h-4 w-4" />
            Buy
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ScriptProductCard;
