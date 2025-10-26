import { FC, KeyboardEvent, MouseEvent } from "react";
import { BookOpen, ShoppingCart } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { OtherProduct } from "@/data/marketplaceOthers";

const actionButtonBaseClass =
  "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold text-white sm:w-auto";

const isActivationKey = (key: string) =>
  key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

type OtherProductCardProps = {
  product: OtherProduct;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetails?: (product: OtherProduct, meta?: { isFavorite: boolean }) => void;
};

const OtherProductCard: FC<OtherProductCardProps> = ({
  product,
  isActive,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
}) => {
  const handleOpenDetails = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onOpenDetails?.(product, { isFavorite });
  };

  return (
    <div className="mx-auto h-full w-full max-w-[525px]">
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
          "relative flex h-full min-h-[360px] cursor-pointer flex-col gap-4 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
          isActive ? "border-[#A06AFF]" : "border-[#181B22]",
        )}
      >
        <div className="absolute right-4 top-4">
          <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <img
            src={product.image}
            alt={product.title}
            className="h-[72px] w-[72px] flex-shrink-0 rounded-lg object-cover"
          />
          <div className="flex flex-1 min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-[#2E2744] px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                {product.label}
              </span>
            </div>
            <h3 className="truncate text-lg font-bold text-white sm:text-[19px]">
              {product.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1 text-xs font-bold text-[#B0B0B0]">
              <span className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1.5 py-0.5 text-[11px] font-bold uppercase text-[#2EBD85]">
                {product.rating}
              </span>
              <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-[11px] font-extrabold uppercase text-[#FFA800]">
                {product.ratingTag}
              </span>
              <span className="text-[11px] font-semibold text-[#B0B0B0]">
                {product.location}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#181B22]" />

        <p className="text-sm font-medium text-[#B0B0B0] sm:text-[15px]">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase text-[#B0B0B0]">
          <span>Type:</span>
          <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">
            {product.typeLabel}
          </span>
          <span>Industry:</span>
          <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF]">
            {product.industryLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase text-[#B0B0B0]">
          <span>Compatibility:</span>
          {product.compatibility.map((item) => (
            <span key={item} className="rounded bg-[#2E2744] px-1 py-0.5 text-white">
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase text-[#B0B0B0]">
          <span>Requirements:</span>
          {product.requirements.map((item) => (
            <span key={item} className="rounded bg-[#2E2744] px-1 py-0.5 text-white">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            className={cn(
              actionButtonBaseClass,
              "border border-[#181B22] bg-[#141821] transition-colors hover:border-[#1F2230]",
            )}
            onClick={handleOpenDetails}
          >
            <BookOpen className="h-4 w-4" />
            Learn More
          </button>
          <button
            type="button"
            className={cn(
              actionButtonBaseClass,
              "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90",
            )}
            onClick={handleOpenDetails}
          >
            <ShoppingCart className="h-4 w-4" />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherProductCard;
