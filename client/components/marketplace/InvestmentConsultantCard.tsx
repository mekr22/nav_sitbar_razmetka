import { FC, KeyboardEvent } from "react";
import { BookOpen, Mail } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { InvestmentConsultant } from "@/data/marketplaceInvestmentConsultants";

const isActivationKey = (key: string) => key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

export interface InvestmentConsultantCardProps {
  consultant: InvestmentConsultant;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const InvestmentConsultantCard: FC<InvestmentConsultantCardProps> = ({ consultant, isActive, onSelect, isFavorite, onToggleFavorite }) => (
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
        "relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#0C1014]/50 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-48 overflow-hidden rounded-t-2xl">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f720613dd9fcaf1c3d357a5aaed12b083a2c1931?width=682"
          alt=""
          className="h-full w-full object-cover opacity-20 mix-blend-lighten"
        />
      </div>

      <div className="relative p-4">
        <div className="absolute right-4 top-4">
          <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
        </div>
        <div className="mb-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-xl shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]">
            <img src={consultant.avatar} alt={consultant.name} className="block h-full w-full object-cover object-center [transform:scale(1.2)]" />
          </div>
          <div className="flex h-24 flex-col justify-center gap-1">
            <div className="flex items-center gap-1">
              <h3 className="text-lg font-bold leading-none text-white sm:text-[19px]">
                {consultant.name}
              </h3>
              <span className="rounded bg-[#A06AFF] px-1 text-[11px] font-extrabold uppercase text-white">{consultant.credentials}</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#B0B0B0]">{consultant.company}</div>
            <div className="text-[11px] font-bold uppercase text-[#B0B0B0]">{consultant.location}</div>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold text-[#B0B0B0]">{consultant.description}</p>

        <div className="grid gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
          <div className="flex items-center gap-1">
            <span>Clients:</span>
            <span className="text-white">{consultant.clients}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Risk Profile:</span>
            <span className="text-white">{consultant.riskLevel}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>AUM:</span>
            <span className="text-white">{consultant.aum}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Portfolio Return:</span>
            <span className="text-[#2EBD85]">{consultant.portfolioReturn}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-[12px] font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
            <BookOpen className="h-4 w-4" />
            Learn More
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-[12px] font-bold uppercase text-white transition-opacity hover:opacity-90">
            <Mail className="h-4 w-4" />
            Contact
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default InvestmentConsultantCard;
