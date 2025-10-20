import { Check, MessageCircle, ShoppingCart, Star, Users } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { baseTraders, type Trader } from "@/data/marketplaceTraders";

type ExtendedTrader = Trader & {
  price?: string;
  chartImage?: string;
  description?: string;
  originalDescription?: string;
};

const DEFAULT_CHART_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F2d6d24710ba34771b2ab72e3d53cd2ec?format=webp&width=800";
const FAVORITE_STORAGE_KEY = "trader-detail-favorites";

const PRODUCT_ACTIONS = [
  { key: "subscribe", label: "Subscribe", icon: Check },
  { key: "chat", label: "Chat", icon: MessageCircle },
] as const;

type ProductActionKey = (typeof PRODUCT_ACTIONS)[number]["key"];

interface TraderDetailsState {
  trader?: Trader;
  scrollToTop?: boolean;
  isFavorite?: boolean;
}

const TraderDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<ProductActionKey>("subscribe");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showOriginalDescription, setShowOriginalDescription] = useState(false);

  const locationState = (location.state as TraderDetailsState | null) ?? null;

  const [favoriteTraderIds, setFavoriteTraderIds] = useState<Set<string>>(() => {
    const storedIds = new Set<string>();

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(FAVORITE_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((value) => {
              if (typeof value === "string" && value.trim().length > 0) {
                storedIds.add(value);
              }
            });
          }
        } catch {
          // ignore
        }
      }
    }

    if (locationState?.trader?.id && locationState.isFavorite) {
      storedIds.add(locationState.trader.id);
    }

    return storedIds;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      FAVORITE_STORAGE_KEY,
      JSON.stringify(Array.from(favoriteTraderIds)),
    );
  }, [favoriteTraderIds]);

  useEffect(() => {
    const id = locationState?.trader?.id;
    if (!id || !locationState?.isFavorite) {
      return;
    }

    setFavoriteTraderIds((prev) => {
      if (prev.has(id)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [locationState]);

  useEffect(() => {
    if (locationState?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, {
        replace: true,
        state: { ...locationState, scrollToTop: false },
      });
    }
  }, [location.pathname, locationState, navigate]);

  const trader = useMemo<ExtendedTrader>(() => {
    const fallback: ExtendedTrader = {
      ...baseTraders[0],
      price: "$10 / month",
      chartImage: DEFAULT_CHART_IMAGE,
      description: "Professional trader specializing in securities trading with over 5 years of experience. Focused on momentum strategies and technical analysis with consistent profitability.",
      originalDescription: "Professional trader specializing in securities trading with over 5 years of experience. Focused on momentum strategies and technical analysis with consistent profitability.",
    };

    const provided = locationState?.trader as Partial<ExtendedTrader> | undefined;
    if (!provided) {
      return fallback;
    }

    return {
      ...fallback,
      ...provided,
      chartImage: provided.chartImage ?? fallback.chartImage,
      description:
        typeof provided.description === "string" && provided.description.trim().length > 0
          ? provided.description
          : fallback.description,
      originalDescription:
        typeof provided.originalDescription === "string" && provided.originalDescription.trim().length > 0
          ? provided.originalDescription
          : fallback.originalDescription,
    };
  }, [locationState]);

  const isTraderFavorite = favoriteTraderIds.has(trader.id);

  const handleToggleFavoriteTrader = useCallback(() => {
    setFavoriteTraderIds((prev) => {
      const next = new Set(prev);
      if (next.has(trader.id)) {
        next.delete(trader.id);
      } else {
        next.add(trader.id);
      }
      return next;
    });
  }, [trader.id]);

  const handleNavigateToCategory = useCallback(() => {
    navigate("/marketplace/traders", {
      state: {
        scrollToTop: true,
      },
    });
  }, [navigate]);

  const hasOriginalDescription = Boolean(trader.originalDescription && trader.originalDescription.trim().length > 0);
  const descriptionToDisplay =
    showOriginalDescription && hasOriginalDescription
      ? trader.originalDescription ?? ""
      : trader.description ?? "";

  return (
    <div className="flex flex-col gap-6 max-[360px]:gap-4">
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex items-center gap-2 text-[15px] max-[360px]:gap-1.5 max-[360px]:text-sm">
          <button
            type="button"
            onClick={handleNavigateToCategory}
            className="font-normal text-[#B0B0B0] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
          >
            Traders
          </button>
          <span className="font-bold text-[#B0B0B0]">/</span>
          <span className="font-bold text-white">{trader.name}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:flex-col max-[360px]:items-start max-[360px]:gap-2 max-[360px]:rounded-xl max-[360px]:p-3">
          <h1 className="text-2xl font-bold text-white sm:text-[31px] max-[360px]:text-xl">
            {trader.name}
          </h1>
          <FavoriteStarButton
            pressed={isTraderFavorite}
            onToggle={handleToggleFavoriteTrader}
            className="focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6 max-[360px]:gap-4">
          <div className="flex flex-col gap-6 lg:flex-[2] lg:min-w-0 max-[360px]:gap-4">
            {/* Description */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4 max-[360px]:p-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">About {trader.name}</h2>
              </div>
              <div className="p-4 max-[360px]:p-3">
                <div
                  className={`relative text-[15px] font-medium leading-relaxed text-white/90 max-[360px]:text-sm ${
                    isDescriptionExpanded ? "" : "max-h-[176px] overflow-hidden pr-1"
                  }`}
                >
                  <p className="whitespace-pre-line">{descriptionToDisplay}</p>
                  {!isDescriptionExpanded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#0C1014]" />
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-6 text-[15px] font-medium max-[360px]:gap-4">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="text-[#A06AFF] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  >
                    {isDescriptionExpanded ? "Collapse" : "Expand"}
                  </button>
                  {hasOriginalDescription && (
                    <button
                      type="button"
                      onClick={() => setShowOriginalDescription((prev) => !prev)}
                      className="text-[#A06AFF] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                    >
                      {showOriginalDescription ? "Show Translation" : "Show Original"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4 max-[360px]:p-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Trading Details</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 max-[360px]:gap-3 max-[360px]:p-3">
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">ROI (Month)</span>
                  <span className="text-[15px] font-bold text-[#2EBD85] max-[360px]:text-sm">
                    {trader.roiMonth}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">ROI (Quarter)</span>
                  <span className="text-[15px] font-bold text-[#2EBD85] max-[360px]:text-sm">
                    {trader.roiQuarter}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Avg Profitability</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {trader.avgProfitability}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 border-t border-[#181B22] p-4 sm:grid-cols-3 max-[360px]:gap-3 max-[360px]:p-3">
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Accuracy</span>
                  <span className="text-[15px] font-bold text-[#2EBD85] max-[360px]:text-sm">
                    {trader.accuracy}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Experience</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {trader.experience}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Trades (30 Days)</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {trader.trades30Days}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 border-t border-[#181B22] p-4 max-[360px]:gap-3 max-[360px]:p-3">
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Certification</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {trader.certification}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Trader Card (Figma Design) */}
          <div className="flex w-full flex-col gap-6 lg:max-w-[339px] lg:flex-1 lg:min-w-0 max-[360px]:gap-4">
            <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              {/* Background gradient chart */}
              <div className="relative h-[220px] w-full overflow-hidden border-b border-[#181B22]">
                <svg
                  className="absolute left-0 top-0 h-full w-full"
                  viewBox="0 0 311 116"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2.81635 74.7739L0.50293 78.8428V115.891H310.503V5.81618L302.984 11.5983L297.779 21.4494L291.995 20.807L289.104 22.9485L282.163 3.03217L279.85 5.81618L275.801 4.53125L267.126 6.88695L262.499 17.1664L259.029 14.5965C257.68 16.9522 254.981 21.6208 254.981 21.4494C254.981 21.2781 252.667 18.0944 251.51 16.5239L248.04 21.6636L243.413 16.3097L237.63 14.8107L234.738 0.890625L226.063 7.74357H223.171L220.857 9.24265L219.122 6.67279L213.917 19.0938L212.182 15.6673L206.398 14.8107L202.928 18.4513L201.772 10.7417L198.88 14.8107L194.831 9.24265L191.361 12.2408L189.626 10.7417L187.891 11.5983L184.421 4.10294L181.529 20.1645L176.902 13.3116L172.275 11.5983L167.648 22.7344L160.13 29.159L154.346 27.8741L153.768 33.2279L150.876 28.9449L146.249 34.727L142.779 47.7904L138.731 48.4329L134.682 49.2895L132.369 57.6415L129.477 58.7123L122.536 57.6415L113.861 52.9301L110.969 59.3548L103.451 61.7105L100.559 60.8539L99.4022 62.9954L91.8835 59.3548L90.7268 61.068L82.6297 59.9972L75.6895 64.4945L75.1112 67.7068L71.641 66.8502L67.5924 70.0625L64.7007 67.7068H57.7604L56.6037 68.7776H54.2903L50.2417 71.3474L43.3014 69.2059L39.8312 64.7086L35.7827 64.9228L31.7343 70.0625L28.8424 68.3493L27.1074 70.705L24.2156 69.2059L14.3835 70.705L9.75663 76.273L2.81635 74.7739Z"
                    fill="url(#paint0_linear_trader)"
                  />
                  <path
                    d="M0.50293 77.5573L2.81639 73.5555L9.75666 75.0298L14.3835 69.5536L24.2156 68.0793L27.1074 69.5536L28.8425 67.2368L31.7343 68.9218L35.7828 63.8668L39.8313 63.6562L43.3014 68.0793L50.2418 70.1855L54.2902 67.658H56.6036L57.7604 66.6049H64.7007L67.5925 68.9218L71.641 65.7624L75.1111 66.6049L75.6895 63.4456L82.6298 59.0225L90.7268 60.0756L91.8835 58.3906L99.4021 61.9712L100.559 59.865L103.451 60.7075L110.969 58.3906L113.861 52.0719L122.537 56.7056L129.477 57.7588L132.369 56.7056L134.682 48.4914L138.731 47.6489L142.779 47.017L146.249 34.169L150.876 28.4822L153.768 32.6947L154.346 27.4291L160.13 28.6928L167.648 22.3741L172.275 11.4218L176.902 13.1067L181.529 19.8467L184.421 4.04997L187.891 11.4218L189.626 10.5793L191.361 12.0536L194.831 9.10491L198.88 14.5811L201.772 10.5793L202.928 18.1617L206.398 14.5811L212.182 15.4236L213.917 18.7936L219.122 6.57744L220.857 9.10491L223.171 7.63055H226.063L234.738 0.890625L237.63 14.5811L243.413 16.0555L248.04 21.321L251.51 16.2661C252.667 17.8107 254.981 20.9419 254.981 21.1104C254.981 21.2789 257.68 16.6873 259.029 14.3705L262.499 16.898L267.126 6.78806L275.801 4.47121L279.85 5.73495L282.163 2.99685L289.104 22.5848L291.995 20.4785L297.779 21.1104L302.984 11.4218L310.503 5.73495"
                    stroke="#523A83"
                    strokeWidth="1.00667"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_trader"
                      x1="-132.231"
                      y1="0.890625"
                      x2="-132.231"
                      y2="115.891"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#A06AFF" stopOpacity="0.32" />
                      <stop offset="1" stopColor="#181A20" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Profile Picture */}
                <img
                  src={trader.avatar}
                  alt={trader.name}
                  className="absolute left-4 top-4 h-24 w-24 rounded-full border-2 border-[#0C1014] object-cover shadow-xl"
                />

                {/* Favorite Star Button */}
                <div className="absolute right-5 top-5">
                  <button
                    type="button"
                    onClick={handleToggleFavoriteTrader}
                    className="text-[#B0B0B0] transition-colors hover:text-[#A06AFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                    aria-pressed={isTraderFavorite}
                    aria-label={isTraderFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        isTraderFavorite
                          ? "fill-[#A06AFF] text-[#A06AFF]"
                          : "fill-none stroke-current"
                      }`}
                      strokeWidth="1.00667"
                    />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 p-4">
                {/* Name and PRO badge */}
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{trader.name}</h3>
                  <div className="rounded-md bg-[#A06AFF] px-1">
                    <span className="text-xs font-extrabold text-white">PRO</span>
                  </div>
                </div>

                {/* Badge */}
                <div className="text-xs font-bold uppercase text-[#B0B0B0]">{trader.badge}</div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-1">
                  <div className="flex items-center gap-1 rounded bg-[#3E321D] px-1 py-0.5">
                    <span className="text-xs font-extrabold uppercase text-[#FFA800]">
                      HEDGE FUND MANAGER
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1 py-0.5">
                    <span className="text-xs font-bold text-[#2EBD85]">{trader.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                    <Users className="h-4 w-4 text-[#B0B0B0]" />
                    <span className="text-xs font-bold text-white">{trader.followers}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                    <svg
                      className="h-4 w-4 text-[#B0B0B0]"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.1663 7.33301V6.66634C13.1663 4.15218 13.1663 2.89511 12.3852 2.11405C11.6042 1.33301 10.3471 1.33301 7.83298 1.33301H7.16638C4.65223 1.33301 3.39515 1.33301 2.61411 2.11405C1.83306 2.89509 1.83305 4.15215 1.83303 6.66629L1.83301 9.33301C1.83298 11.8471 1.83297 13.1042 2.61399 13.8853C3.39504 14.6663 4.65216 14.6663 7.16631 14.6663"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.83301 4.66699H10.1663M4.83301 8.00033H10.1663"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8.83301 13.8842V14.6663H9.61527C9.88821 14.6663 10.0247 14.6663 10.1473 14.6155C10.2701 14.5647 10.3665 14.4682 10.5595 14.2753L13.7753 11.0593C13.9573 10.8773 14.0483 10.7863 14.0969 10.6881C14.1895 10.5013 14.1895 10.2821 14.0969 10.0953C14.0483 9.99707 13.9573 9.90607 13.7753 9.72407C13.5932 9.54207 13.5022 9.45107 13.404 9.40241C13.2172 9.30987 12.9979 9.30987 12.8111 9.40241C12.7129 9.45107 12.6219 9.54207 12.4399 9.72407L9.22414 12.9401C9.03114 13.133 8.93467 13.2295 8.88387 13.3521C8.83301 13.4749 8.83301 13.6113 8.83301 13.8842Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs font-bold text-white">{trader.publications}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#181B22]" />

                {/* Markets, Assets Info */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Markets:</span>
                    <span className="text-white">BINANCE, NASDAQ</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Assets:</span>
                    <span className="text-white">BTC, ETH, TESLA, GOLD</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Analysis:</span>
                    <span className="text-white">TECHNICAL & FUNDAMENTAL ANALYSIS</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#181B22]" />

                {/* Forecast Accuracy */}
                <div className="flex items-center gap-1 text-xs font-bold uppercase">
                  <span className="text-[#B0B0B0]">Forecast Accuracy:</span>
                  <span className="text-[#2EBD85]">{trader.accuracy}</span>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-white">{trader.price}</div>

                {/* Buy Button */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 py-2.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy
                </button>

                {/* Chat Button */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderDetailLanding;
