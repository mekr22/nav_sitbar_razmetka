import { FC, KeyboardEvent, useId } from "react";
import { BookOpen, Check, Rocket, Users } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { TradingRobot } from "@/data/marketplaceTradingRobots";

const actionButtonBaseClass =
  "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase text-white sm:w-auto";

const accuracyStyles: Record<TradingRobot["accuracyLevel"], { container: string; text: string }> = {
  LOW: { container: "bg-[rgba(234,57,67,0.16)]", text: "text-[#EA3943]" },
  MEDIUM: { container: "bg-[#2A1C0E]", text: "text-[#FFA800]" },
  HIGH: { container: "bg-[rgba(46,189,133,0.16)]", text: "text-[#2EBD85]" },
};

const leverageBadges: Record<TradingRobot["leverageCategory"], string> = {
  low: "LEV x1 - x5",
  moderate: "LEV x5 - x15",
  high: "LEV x15+",
};

const isActivationKey = (key: string) => key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

const TradingRobotSparkline: FC = () => {
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
        <linearGradient id={gradientId} x1="1" y1="1" x2="1" y2="79" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A06AFF" stopOpacity="0.32" />
          <stop offset="1" stopColor="#181A20" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={strokeId} x1="1" y1="1" x2="1" y2="79" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C6A6FF" />
          <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export interface TradingRobotCardProps {
  robot: TradingRobot;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const TradingRobotCard: FC<TradingRobotCardProps> = ({ robot, isActive, onSelect, isFavorite, onToggleFavorite }) => {
  const accuracyStyle = accuracyStyles[robot.accuracyLevel];

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
          <img src={robot.icon} alt={robot.name} className="h-[72px] w-[72px] rounded-lg object-cover" />
          <div className="flex flex-1 flex-col gap-1">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">{robot.name}</h3>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-1 text-xs font-bold">
                <span className="flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-white">
                  <Users className="h-4 w-4 text-[#B0B0B0]" />
                  {robot.users}
                </span>
                <span className={cn("inline-flex rounded px-2 py-0.5 font-extrabold uppercase", accuracyStyle.container, accuracyStyle.text)}>
                  {robot.accuracyLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-[#B0B0B0]">
                  <Rocket className="h-3.5 w-3.5" />
                  {leverageBadges[robot.leverageCategory]}
                </span>
              </div>
              <div className="flex items-center self-start rounded bg-[#1C3430] px-2 py-0.5">
                <span className="text-xs font-extrabold uppercase text-[#2EBD85]">{robot.profitSharing}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#181B22]" />

        <div className="flex items-center gap-2">
          {robot.exchanges.slice(0, 3).map((exchange) => (
            <img
              key={exchange.id}
              src={exchange.icon}
              alt={exchange.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ))}
          {robot.exchanges.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E2744]">
              <span className="text-xs font-bold text-white">+{robot.exchanges.length - 3}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
          <div className="flex items-center gap-1 text-white">
            <span className="text-[#B0B0B0]">Pair:</span>
            <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">{robot.pair}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Max Drawdown:</span>
            <span className="rounded bg-[#1C3430] px-1 py-0.5 text-[#2EBD85]">{robot.maxDrawdown}</span>
          </div>
          <div className="flex items-center gap-1 text-white">
            <span className="text-[#B0B0B0]">Market Type:</span>
            <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">{robot.market}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-white">
            <span className="text-[#B0B0B0]">Type:</span>
            {robot.assetTags.map((tag) => (
              <span key={tag} className="rounded bg-[#2E2744] px-1 py-0.5 text-white">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-white">
            <span className="text-[#B0B0B0]">Strategy:</span>
            <span className="rounded bg-[#2E2744] px-1 py-0.5 text-white">{robot.strategy}</span>
          </div>
          <div className="flex items-center gap-1 text-white">
            <span className="text-[#B0B0B0]">Settings:</span>
            <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF]">{robot.settingsTag}</span>
          </div>
        </div>

        <div className="h-px w-full bg-[#181B22]" />

        <div className="h-14 w-full overflow-hidden">
          <TradingRobotSparkline />
        </div>

        <div className="h-px w-full bg-[#181B22]" />

        <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-white">
          <span className="text-[#B0B0B0]">Calc. APY</span>
          <div className="inline-flex items-center justify-center rounded border border-[#B0B0B0] px-1.5 py-0 text-[10px] text-[#B0B0B0]">
            30D
          </div>
          <span className="text-[#2EBD85]">{robot.roi30d}</span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
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

export default TradingRobotCard;
