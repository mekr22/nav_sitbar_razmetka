import { FC, KeyboardEvent, useId } from "react";
import { BookOpen, Mail, Users, FileEdit, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { Trader } from "@/data/marketplaceTraders";

const isActivationKey = (key: string) =>
  key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

const PerformanceChart: FC = () => {
  const id = useId();
  const gradientId = `${id}-gradient`;
  const strokeId = `${id}-stroke`;

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 312 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M1 77.6667L3.31346 73.6648L10.2537 75.1392L14.8806 69.663L24.7127 68.1886L27.6045 69.663L29.3396 67.3462L32.2314 69.0311L36.2798 63.9762L40.3284 63.7656L43.7985 68.1886L50.7388 70.2949L54.7873 67.7674H57.1007L58.2575 66.7143H65.1978L68.0896 69.0311L72.138 65.8718L75.6082 66.7143L76.1866 63.5549L83.1268 59.1319L91.2239 60.185L92.3805 58.5L99.8992 62.0806L101.056 59.9744L103.948 60.8168L111.466 58.5L114.358 52.1813L123.034 56.815L129.974 57.8681L132.866 56.815L135.179 48.6007L139.228 47.7582L143.276 47.1264L146.746 34.2784L151.373 28.5916L154.265 32.804L154.843 27.5385L160.627 28.8022L168.146 22.4835L172.772 11.5311L177.399 13.2161L182.026 19.956L184.918 4.15934L188.388 11.5311L190.123 10.6886L191.858 12.163L195.328 9.21429L199.377 14.6905L202.269 10.6886L203.425 18.2711L206.896 14.6905L212.679 15.533L214.414 18.9029L219.619 6.68681L221.354 9.21429L223.668 7.73993H226.56L235.235 1L238.127 14.6905L243.91 16.1648L248.537 21.4304L252.007 16.3755C253.164 17.92 255.478 21.0513 255.478 21.2198C255.478 21.3883 258.177 16.7967 259.526 14.4799L262.996 17.0073L267.623 6.89744L276.298 4.58059L280.347 5.84432L282.66 3.10623L289.601 22.6941L292.493 20.5879L298.276 21.2198L303.481 11.5311L311 5.84432L311 79H1V77.6667Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M1 77.6667L3.31346 73.6648L10.2537 75.1392L14.8806 69.663L24.7127 68.1886L27.6045 69.663L29.3396 67.3462L32.2314 69.0311L36.2798 63.9762L40.3284 63.7656L43.7985 68.1886L50.7388 70.2949L54.7873 67.7674H57.1007L58.2575 66.7143H65.1978L68.0896 69.0311L72.138 65.8718L75.6082 66.7143L76.1866 63.5549L83.1268 59.1319L91.2239 60.185L92.3805 58.5L99.8992 62.0806L101.056 59.9744L103.948 60.8168L111.466 58.5L114.358 52.1813L123.034 56.815L129.974 57.8681L132.866 56.815L135.179 48.6007L139.228 47.7582L143.276 47.1264L146.746 34.2784L151.373 28.5916L154.265 32.804L154.843 27.5385L160.627 28.8022L168.146 22.4835L172.772 11.5311L177.399 13.2161L182.026 19.956L184.918 4.15934L188.388 11.5311L190.123 10.6886L191.858 12.163L195.328 9.21429L199.377 14.6905L202.269 10.6886L203.425 18.2711L206.896 14.6905L212.679 15.533L214.414 18.9029L219.619 6.68681L221.354 9.21429L223.668 7.73993H226.56L235.235 1L238.127 14.6905L243.91 16.1648L248.537 21.4304L252.007 16.3755C253.164 17.92 255.478 21.0513 255.478 21.2198C255.478 21.3883 258.177 16.7967 259.526 14.4799L262.996 17.0073L267.623 6.89744L276.298 4.58059L280.347 5.84432L282.66 3.10623L289.601 22.6941L292.493 20.5879L298.276 21.2198L303.481 11.5311L311 5.84432"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="1"
          y1="1"
          x2="1"
          y2="79"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A06AFF" stopOpacity="0.32" />
          <stop offset="1" stopColor="#181A20" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={strokeId}
          x1="1"
          y1="1"
          x2="1"
          y2="79"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C6A6FF" />
          <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

type SecondaryCta = {
  label: string;
  icon: LucideIcon;
};

const TraderCard: FC<{
  trader: Trader;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  secondaryCta?: SecondaryCta;
}> = ({
  trader,
  isActive,
  onSelect,
  isFavorite,
  onToggleFavorite,
  secondaryCta,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect();
    navigate("/marketplace/trader-details", { state: { trader } });
  };

  const resolvedSecondaryCta = secondaryCta ?? {
    label: "CONTACT",
    icon: Mail,
  };
  const SecondaryIcon = resolvedSecondaryCta.icon;

  return (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={handleClick}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "relative cursor-pointer rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="absolute right-4 top-4">
        <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
      </div>
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-xl shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]">
            <img
              src={trader.avatar}
              alt={trader.name}
              className="block h-full w-full object-cover object-center [transform:scale(1.2)]"
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <span className="rounded bg-[#A06AFF] px-1 text-[12px] font-extrabold uppercase text-white">
                PRO
              </span>
              <span className="rounded bg-[#1C3430] px-1 text-[12px] font-bold text-[#2EBD85]">
                {trader.rating}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-bold leading-tight text-white">
                {trader.name}
              </h3>
              <div className="flex flex-col items-start gap-1">
                <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded bg-[#3E321D] px-1 py-0.5 text-[12px] font-extrabold uppercase text-[#FFA800] self-start">
                  {trader.badge}
                </span>
                <div className="flex items-center gap-1">
                  <span className="flex items-center gap-1 whitespace-nowrap rounded bg-[#2E2744] px-1 py-0.5 text-[12px] font-bold text-white">
                    <Users className="h-4 w-4 text-[#B0B0B0]" />
                    {trader.followers}
                  </span>
                  <span className="flex items-center gap-1 whitespace-nowrap rounded bg-[#2E2744] px-1 py-0.5 text-[12px] font-bold text-white">
                    <FileEdit className="h-4 w-4 text-[#B0B0B0]" />
                    {trader.publications}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-[12px] font-bold uppercase text-[#B0B0B0]">
              <div className="flex items-center gap-1">
                <span>Number of trades in 30 days:</span>
                <span className="text-[#2EBD85]">{trader.trades30Days}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Experience:</span>
                <span className="text-[#2EBD85]">{trader.experience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-14 w-full overflow-hidden">
          <PerformanceChart />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-bold uppercase text-[#B0B0B0] sm:gap-y-3 sm:text-[12px]">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>ROI(Month)</span>
            <span className="text-[#2EBD85]">{trader.roiMonth}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>ROI(3 Months)</span>
            <span className="text-[#2EBD85]">{trader.roiQuarter}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>Average trade profit</span>
            <span className="text-[#2EBD85]">{trader.avgProfitability}</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>Trades accuracy</span>
            <span className="text-[#2EBD85]">{trader.accuracy}</span>
          </div>
        </div>

        <div className="text-[12px] font-extrabold text-white">
          {trader.certification}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-[12px] font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]">
            <BookOpen className="h-4 w-4" />
            Learn More
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-[12px] font-bold uppercase text-white transition-opacity hover:opacity-90">
            <SecondaryIcon className="h-4 w-4" />
            {resolvedSecondaryCta.label}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TraderCard;
