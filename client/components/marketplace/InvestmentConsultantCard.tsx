import { FC, KeyboardEvent } from "react";
import { BookOpen, FileEdit, Mail, Users } from "lucide-react";

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
            <img src={consultant.icon} alt={consultant.name} className="block h-full w-full object-cover object-center [transform:scale(1.2)]" />
          </div>
          <div className="flex h-24 flex-col justify-center gap-1">
            <div className="flex items-center gap-1">
              <h3 className="text-lg font-bold leading-none text-white sm:text-[19px]">{consultant.name}</h3>
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.59517 1.74435C9.85534 1.64072 10.1445 1.64072 10.4047 1.74435C11.2433 2.07834 11.4072 3.36449 12.3968 3.43609C13.0936 3.48651 13.7774 2.9056 14.4767 3.07974C14.7587 3.14998 15.0023 3.32978 15.1549 3.58043C15.6226 4.34849 15.019 5.47739 15.7818 6.11469C16.3118 6.55727 17.1875 6.49999 17.6483 7.04254C17.8423 7.27108 17.9376 7.56915 17.9127 7.86971C17.8389 8.76379 16.699 9.32296 16.9495 10.2865C17.1228 10.9535 17.8543 11.4225 17.9127 12.1302C17.9376 12.4308 17.8423 12.7289 17.6483 12.9574C17.0693 13.639 15.8173 13.4145 15.4563 14.3385C15.2028 14.987 15.5283 15.8064 15.1549 16.4195C15.0023 16.6701 14.7587 16.85 14.4767 16.9202C13.6084 17.1364 12.7272 16.2037 11.8917 16.7298C11.2952 17.1053 11.0814 17.9862 10.4047 18.2555C10.1445 18.3592 9.85534 18.3592 9.59517 18.2555C8.91842 17.9862 8.70467 17.1053 8.10816 16.7298C7.28301 16.2103 6.37669 17.1327 5.52318 16.9202C5.24114 16.85 4.99759 16.6701 4.84496 16.4195C4.3773 15.6515 4.98079 14.5225 4.218 13.8852C3.6881 13.4426 2.81237 13.5 2.35162 12.9574C2.15759 12.7289 2.06229 12.4308 2.08713 12.1302C2.14563 11.4225 2.87692 10.9535 3.05034 10.2865C3.29832 9.33304 2.15995 8.75071 2.08713 7.86971C2.06229 7.56915 2.15759 7.27108 2.35162 7.04254C2.93055 6.36066 4.18241 6.5854 4.54357 5.66148C4.7971 5.01296 4.47165 4.19352 4.84496 3.58043C4.99759 3.32978 5.24114 3.14998 5.52318 3.07974C6.22246 2.9056 6.90623 3.48652 7.60307 3.43609C8.59267 3.36451 8.7565 2.07834 9.59517 1.74435Z"
                  fill="#A06AFF"
                />
              </svg>
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#B0B0B0]">{consultant.expertise}</div>
          </div>
        </div>

        <div className="grid gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
          <div className="flex items-center gap-1">
            <span>Clients:</span>
            <span className="text-white">{consultant.clients}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Experience:</span>
            <span className="text-white">{consultant.experience}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Certifications:</span>
            <span className="text-white">{consultant.certifications.join(", ")}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1 text-xs font-bold uppercase text-[#B0B0B0]">
          <span className="text-[#B0B0B0]">Specialties:</span>
          {consultant.specialties.map((specialty, index) => (
            <span key={`${consultant.id}-specialty-${index}`} className="rounded bg-[#2E2744] px-1 py-0.5 text-white">
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1 text-xs font-bold uppercase text-[#B0B0B0]">
          <span>Languages:</span>
          {consultant.languages.map((language, index) => (
            <span key={`${consultant.id}-language-${index}`} className="rounded bg-[#2E2744] px-1 py-0.5 text-white">
              {language}
            </span>
          ))}
        </div>

        <div className="mt-4 h-px w-full bg-[#181B22]" />

        <div className="flex items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Consultation Fee:</span>
          <span className="text-[#A06AFF]">{consultant.consultationFee}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Response Time:</span>
          <span className="text-[#2EBD85]">{consultant.responseTime}</span>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
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
