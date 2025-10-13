import type { FC, KeyboardEvent } from "react";
import { BookOpen, ShoppingCart, Users } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { OtherProduct } from "@/data/marketplaceOthers";

const actionButtonBaseClass = "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase text-white sm:w-auto";

const isActivationKey = (key: string) => key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

type OtherProductCardProps = {
  product: OtherProduct;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const OtherProductCard: FC<OtherProductCardProps> = ({ product, isActive, onSelect, isFavorite, onToggleFavorite }) => (
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
      "relative w-full cursor-pointer rounded-2xl border bg-[#0C101480] p-4 backdrop-blur-[50px] transition-colors max-[640px]:p-6",
      isActive ? "border-[#A06AFF]" : "border-[#181B22]",
    )}
  >
    <div className="absolute right-4 top-4">
      <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
    </div>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative h-[264px] w-full overflow-hidden rounded-lg lg:w-[451px]">
        <img src={product.image} alt={product.imageAlt} className="h-full w-full object-cover" />
        <span className="absolute bottom-1 left-1 rounded bg-[#2E2744] px-1 text-xs font-bold uppercase text-white">{product.label}</span>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col items-start gap-4 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-4 sm:flex-row sm:items-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128"
            alt="Author"
            className="h-16 w-16 rounded-lg object-cover max-[640px]:h-20 max-[640px]:w-20"
          />
          <div>
            <h3 className="text-lg font-bold text-white sm:text-[19px]">{product.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <span className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1 py-0.5 text-xs font-bold text-[#2EBD85]">{product.rating}</span>
              <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 text-xs font-bold text-white">
                <Users className="h-4 w-4 text-[#B0B0B0]" />
                1,748
              </span>
              <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">{product.ratingTag}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#181B22]" />

        <div>
          <h4 className="mb-3 text-lg font-bold text-white sm:text-[19px]">{product.title}</h4>
          <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">{product.description}</p>

          <div className="mb-4 flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1">
              <span className="uppercase text-[#B0B0B0]">Type:</span>
              <span className="rounded bg-[#2E2744] px-1 uppercase text-white">{product.typeLabel}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="uppercase text-[#B0B0B0]">Industry:</span>
              <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 uppercase text-[#6AA5FF]">{product.industryLabel}</span>
            </div>
          </div>

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
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
            <button
              className={cn(
                actionButtonBaseClass,
                "border border-[#181B22] bg-[#141821] transition-colors hover:border-[#1F2230]",
              )}
            >
              <BookOpen className="h-4 w-4" />
              DETAILS
            </button>
            <button
              className={cn(
                actionButtonBaseClass,
                "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90",
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OtherProductCard;
