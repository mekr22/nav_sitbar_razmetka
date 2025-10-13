import { Mail, MapPin, Globe } from "lucide-react";

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
        "relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#0C1014]/60 backdrop-blur-[50px] transition-colors",
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

      <div className="relative p-5 sm:p-6">
        <div className="absolute right-6 top-6">
          <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative h-[116px] w-[116px] flex-shrink-0 overflow-hidden rounded-xl shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)] sm:h-[128px] sm:w-[128px]">
            <img src={consultant.avatar} alt={consultant.name} className="block h-full w-full object-cover object-center [transform:scale(1.15)]" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-white">
              <h3 className="text-xl font-bold leading-none sm:text-2xl">
                {consultant.name}
                {consultant.credentials ? `, ${consultant.credentials}` : ""}
              </h3>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B0B0B0] sm:text-sm">{consultant.company}</div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#A06AFF]" aria-hidden="true" />
                {consultant.location}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-[#A06AFF]" aria-hidden="true" />
                {consultant.nationwide ? "Nationwide" : "Regional"}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm font-semibold leading-relaxed text-white sm:mt-6">
          {consultant.description}
        </p>

        <div className="mt-5 grid gap-2 text-sm font-semibold text-[#B0B0B0]">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wide">Number of Clients</span>
            <span className="text-white">{consultant.clients}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wide">Risk Level</span>
            <span className="text-white">{consultant.riskLevel}</span>
          </div>
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-3 text-sm font-bold uppercase text-white transition-opacity hover:opacity-90">
          <Mail className="h-4 w-4" />
          Contact
        </button>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#181B22] bg-[#0B0F13]/80 px-5 py-4 text-sm font-semibold text-[#B0B0B0] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-col gap-1">
            <span className="uppercase tracking-wide">Assets Under Management (AUM)</span>
            <span className="text-base font-bold text-[#2EBD85]">{consultant.aum}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="uppercase tracking-wide">Average Portfolio Return</span>
            <span className="text-base font-bold text-[#2EBD85]">{consultant.portfolioReturn}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InvestmentConsultantCard;
