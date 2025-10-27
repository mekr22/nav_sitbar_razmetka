import type { FC, KeyboardEvent } from "react";
import { BookOpen, ShoppingCart, Eye, Users, Star } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { ScriptProduct } from "@/data/marketplaceScriptsSoftware";

const actionButtonBaseClass =
  "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase text-white sm:w-auto";

const isActivationKey = (key: string) =>
  key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

type ScriptProductCardProps = {
  product: ScriptProduct;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetails?: (
    product: ScriptProduct,
    meta?: { isFavorite: boolean },
  ) => void;
  onBuy?: (product: ScriptProduct) => void;
  variant?: "default" | "compact";
  className?: string;
};

const ScriptProductCard: FC<ScriptProductCardProps> = ({
  product,
  isActive,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onBuy,
  variant = "default",
  className,
}) => {
  const isCompact = variant === "compact";
  const creatorTags = isCompact
    ? product.creator.tags.slice(0, 1)
    : product.creator.tags;
  const compatibilityItems = isCompact
    ? product.compatibility.slice(0, 3)
    : product.compatibility;
  const requirementsItems = isCompact
    ? product.requirements.slice(0, 3)
    : product.requirements;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onDoubleClick={() => {
        onOpenDetails?.(product, { isFavorite });
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative cursor-pointer rounded-2xl border bg-[#0C101480] p-6 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
        isCompact && "flex h-full flex-col gap-4 p-4",
        className,
      )}
    >
      <div
        className={cn(
          "absolute right-4 top-4 flex items-center gap-4 text-xs font-bold uppercase text-white",
          isCompact && "gap-2 text-[11px]",
        )}
      >
        <div className={cn("flex items-center gap-3", isCompact && "gap-2")}>
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

      <div
        className={cn(
          "flex flex-col gap-6",
          isCompact ? "" : "lg:flex-row lg:items-center",
        )}
      >
        <div
          className={cn(
            "flex w-full flex-col gap-4",
            isCompact ? "" : "lg:w-80",
          )}
        >
          <img
            src={product.heroImage}
            alt={product.heroAlt}
            className={cn(
              "w-full rounded-lg object-cover",
              isCompact ? "h-48" : "h-80",
            )}
          />
          <div
            className={cn(
              "grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-bold uppercase text-[#B0B0B0]",
              isCompact && "grid-cols-1 gap-2 text-[11px]",
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap">Type:</span>
              <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">
                {product.typeLabel}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap">Industry</span>
              <span className="inline-flex rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF] whitespace-nowrap">
                {product.industryLabel}
              </span>
            </div>
            {!isCompact && (
              <div className="flex flex-col gap-1">
                <span className="whitespace-nowrap">Revenue</span>
                <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">
                  {product.revenueLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "relative flex flex-1 flex-col gap-5",
            isCompact && "gap-4",
          )}
        >
          <div className="flex flex-col gap-4 border-b border-[#181B22] pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="h-20 w-20 overflow-hidden rounded-lg">
                  <img
                    src={product.creator.avatar}
                    alt={product.creator.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-white sm:text-[19px]">
                    {product.creator.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold text-white">
                      <Users className="h-4 w-4 text-[#B0B0B0]" />
                      {product.creator.followers}
                    </span>
                    {creatorTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]"
                      >
                        {tag}
                      </span>
                    ))}
                    {isCompact &&
                      product.creator.tags.length > creatorTags.length && (
                        <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">
                          +{product.creator.tags.length - creatorTags.length}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="mb-2 text-lg font-bold text-white sm:text-[19px]">
              {product.title}
            </h4>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-[rgba(160,106,255,0.16)] px-2 py-0.5 text-xs font-extrabold uppercase text-[#A06AFF]">
                {product.verificationLabel}
              </span>
              <span className="text-xs font-bold uppercase text-white">
                {product.location}
              </span>
            </div>
            <p
              className={cn(
                "mb-4 text-sm font-medium text-white sm:text-[15px]",
                isCompact && "line-clamp-3",
              )}
            >
              {product.description}
            </p>

            <div className="mb-4 space-y-2 text-xs font-bold">
              <div className="flex flex-wrap items-center gap-2">
                <span className="uppercase text-[#B0B0B0]">Compatibility:</span>
                {compatibilityItems.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-[#2E2744] px-1 uppercase text-white"
                  >
                    {item}
                  </span>
                ))}
                {isCompact &&
                  product.compatibility.length > compatibilityItems.length && (
                    <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                      +{product.compatibility.length - compatibilityItems.length}
                    </span>
                  )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="uppercase text-[#B0B0B0]">Requirements:</span>
                {requirementsItems.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-[#2E2744] px-1 uppercase text-white"
                  >
                    {item}
                  </span>
                ))}
                {isCompact &&
                  product.requirements.length > requirementsItems.length && (
                    <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                      +{product.requirements.length - requirementsItems.length}
                    </span>
                  )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-[#FFA800] text-[#FFA800]"
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-white sm:text-[15px]">
                  {product.ratingScore}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
            <button
              className={cn(
                actionButtonBaseClass,
                "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90",
              )}
              onClick={(event) => {
                event.stopPropagation();
                onBuy?.(product);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptProductCard;
