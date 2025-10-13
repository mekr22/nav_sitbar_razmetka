import { FC, KeyboardEvent } from "react";
import { BookOpen, Check, Users } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { Strategy } from "@/data/marketplaceStrategies";

const actionButtonBaseClass =
  "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase text-white sm:w-auto";

const exchangeLogos = [
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F5812aa6cc56f419ca24acdce705cca81?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F31262df0fdbe4b649612c82741a80ce2?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F757765515d584eee8550efa4011da550?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Ffdb76a79e3714022a31f6ce34d69a80a?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F46bbf20463b949229b2fa9f4e5301083?format=webp&width=800",
];

const isActivationKey = (key: string) =>
  key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

export interface StrategyCardProps {
  strategy: Strategy;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const StrategyCard: FC<StrategyCardProps> = ({
  strategy,
  isActive,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const getRiskColor = (level: Strategy["riskLevel"]) => {
    switch (level) {
      case "LOW":
        return { bg: "bg-[#1C3430]", text: "text-[#2EBD85]" };
      case "MEDIUM":
        return { bg: "bg-[rgba(255,168,0,0.16)]", text: "text-[#FFA800]" };
      case "HIGH":
        return { bg: "bg-[rgba(234,57,67,0.16)]", text: "text-[#EA3943]" };
      default:
        return { bg: "bg-[#2E2744]", text: "text-white" };
    }
  };

  const riskColors = getRiskColor(strategy.riskLevel);

  return (
    <div className="mx-auto w-full max-w-[525px]">
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
          "relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
          isActive ? "border-[#A06AFF]" : "border-[#181B22]",
        )}
      >
        <div className="absolute right-4 top-4">
          <FavoriteStarButton
            pressed={isFavorite}
            onToggle={onToggleFavorite}
          />
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <img
            src={strategy.icon}
            alt={strategy.name}
            className="h-[72px] w-[72px] rounded-lg object-cover"
          />
          <div className="flex flex-1 flex-col gap-0.5">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">
              {strategy.name}
            </h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                  <Users className="h-4 w-4 text-[#B0B0B0]" />
                  <span className="text-xs font-bold text-white">
                    {strategy.users}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 rounded px-1 py-0.5 ${riskColors.bg}`}
                >
                  <span
                    className={`text-xs font-bold uppercase ${riskColors.text}`}
                  >
                    Risk: {strategy.riskLevel}
                  </span>
                </div>
              </div>
              <div className="self-start flex items-center rounded bg-[rgba(46,189,133,0.16)] px-1 py-0.5">
                <span className="text-xs font-bold uppercase text-[#2EBD85]">
                  {strategy.profitSharing}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#181B22]" />

        <div className="flex items-center gap-2">
          {exchangeLogos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ))}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E2744]">
            <span className="text-xs font-bold text-white">
              +{strategy.exchangesCount}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Exchanges:</span>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">ALL</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Assets:</span>
            {strategy.assets.map((asset, index) => (
              <div
                key={asset + index}
                className="rounded bg-[#2E2744] px-1 py-0.5"
              >
                <span className="text-white">{asset}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Strategy:</span>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{strategy.strategy}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Max Drawdown:</span>
            <div className="rounded bg-[rgba(160,106,255,0.16)] px-1 py-0.5">
              <span className="text-[#A06AFF]">{strategy.maxDrawdown}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">Min. Capital:</span>
            <div className="rounded bg-[rgba(160,106,255,0.16)] px-1 py-0.5">
              <span className="text-[#A06AFF]">{strategy.minCapital}</span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#181B22]" />

        <div className="flex items-center justify-between text-xs font-bold uppercase">
          <div className="flex items-center gap-1">
            <span className="text-[#B0B0B0]">ROI (30D):</span>
            <span className="text-[#2EBD85]">{strategy.roi30d}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#B0B0B0]">ROI (1Y):</span>
            <span className="text-[#2EBD85]">{strategy.roi1y}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className={cn(
              actionButtonBaseClass,
              "border border-[#181B22] bg-[#141821] transition-colors hover:border-[#1F2230]",
            )}
          >
            <BookOpen className="h-4 w-4" />
            LEARN MORE
          </button>
          <button
            className={cn(
              actionButtonBaseClass,
              "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90",
            )}
          >
            <Check className="h-4 w-4" />
            SUBSCRIBE
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
