import { FC, KeyboardEvent } from "react";
import { FC, KeyboardEvent } from "react";
import { BookOpen, ShoppingCart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";

export type Signal = {
  id: string;
  name: string;
  icon: string;
  users: string;
  riskLevel: string;
  platforms: string[];
  assets: string[];
  type: string;
  timeframes: string[];
  use: string;
  accuracy: string;
  chartImage: string;
};

const platformLogos = [
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1d90fdad8fa945dc9d0b417f6bb84c17?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fff6cd09eeae445f2bcc6ca0b891f197c?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F59711ad87739493eaa7a0b6857960587?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F59dfc5c913eb4f6d845cfb34003ed89b?format=webp&width=800",
];

const isActivationKey = (key: string) => key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

interface SignalCardProps {
  signal: Signal;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const SignalCard: FC<SignalCardProps> = ({ signal, isActive, onSelect, isFavorite, onToggleFavorite }) => {
  const platforms = Array.isArray(signal.platforms) ? signal.platforms : [];
  const assets = Array.isArray(signal.assets) ? signal.assets : [];
  const timeframes = Array.isArray(signal.timeframes) ? signal.timeframes : [];
  const useLabel = signal.use ?? "";
  const accuracyLabel = signal.accuracy ?? "";

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
        <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <img src={signal.icon} alt={signal.name} className="h-16 w-16 rounded-lg" />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">{signal.name}</h3>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                <Users className="h-4 w-4 text-[#B0B0B0]" />
                <span className="text-xs font-bold text-white">{signal.users}</span>
              </div>
              <div className="flex items-center gap-1 rounded bg-[#1C3430] px-1 py-0.5">
                <span className="text-xs font-bold uppercase text-[#2EBD85]">Risk: {signal.riskLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-[#181B22]" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {platforms.map((platform, idx) => (
            <img
              key={`${signal.id}-platform-${platform}-${idx}`}
              src={platformLogos[idx % platformLogos.length]}
              alt={platform}
              className="h-8 w-8 rounded-full object-cover"
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Assets:</span>
          {assets.map((asset, idx) => (
            <div key={`${signal.id}-asset-${asset}-${idx}`} className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{asset}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Type:</span>
          <div className="rounded bg-[#2E2744] px-1 py-0.5">
            <span className="text-white">{signal.type}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Timeframe:</span>
          {timeframes.map((tf, idx) => (
            <div key={`${signal.id}-tf-${tf}-${idx}`} className="rounded bg-[rgba(106,165,255,0.16)] px-2 py-0.5">
              <span className="text-[#6AA5FF]">{tf}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Use:</span>
          <div className="rounded bg-[#2E2744] px-1 py-0.5">
            <span className="text-white">{useLabel}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-bold uppercase">
        <span className="text-[#B0B0B0]">Product Accuracy:</span>
        <span className="text-[15px] text-[#2EBD85]">{accuracyLabel}</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-xs font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
          <BookOpen className="h-4 w-4" />
          Learn More
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
          <ShoppingCart className="h-4 w-4" />
          Buy
        </button>
      </div>
    </div>
    </div>
  );
};

export default SignalCard;
