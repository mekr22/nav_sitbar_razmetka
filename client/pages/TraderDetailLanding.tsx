import { ArrowUpDown, Heart, MessageCircle, Share2, ShoppingCart, Star, Users } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart as HeartIcon, MessageCircle as MessageCircleIcon, Share2 as ShareIcon, ShoppingCart as ShoppingCartIcon, Star as StarIcon, Users as UsersIcon } from "lucide-react";
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

interface TraderDetailsState {
  trader?: Trader;
  scrollToTop?: boolean;
  isFavorite?: boolean;
}

const TraderDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
      description: "This algorithm is designed to optimize your trading decisions by analyzing market data in real time. It uses a combination of historical patterns and predictive models to identify high-probability entry and exit points. With a focus on risk management, the algorithm adjusts its strategy based on changing market conditions.",
      originalDescription: "This algorithm is designed to optimize your trading decisions by analyzing market data in real time. It uses a combination of historical patterns and predictive models to identify high-probability entry and exit points. With a focus on risk management, the algorithm adjusts its strategy based on changing market conditions.",
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
          {/* Left Sidebar - Trader Card (Compact) */}
          <div className="flex w-full flex-col gap-6 lg:max-w-[339px] lg:flex-shrink-0 max-[360px]:gap-4">
            <div className="relative w-full overflow-hidden rounded-2xl border border-[#181B22]">
              <svg
                className="absolute inset-0 -z-10 h-full w-full"
                viewBox="0 0 311 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                aria-hidden="true"
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

              <img
                src={trader.avatar}
                alt={trader.name}
                className="absolute left-4 top-4 z-20 h-24 w-24 rounded-full border-2 border-[#0C1014] object-cover shadow-xl"
              />

              <div className="absolute right-5 top-5 z-20">
                <button
                  type="button"
                  onClick={handleToggleFavoriteTrader}
                  className="text-[#B0B0B0] transition-colors hover:text-[#A06AFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  aria-pressed={isTraderFavorite}
                  aria-label={isTraderFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <StarIcon
                    className={`h-6 w-6 ${
                      isTraderFavorite ? "fill-[#A06AFF] text-[#A06AFF]" : "fill-none stroke-current"
                    }`}
                    strokeWidth="1.00667"
                  />
                </button>
              </div>

              <div className="relative z-10 flex flex-col gap-4 px-4 pb-6 pt-[7.25rem] sm:pt-[7.75rem]">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{trader.name}</h3>
                  <div className="rounded-md bg-[#A06AFF] px-1">
                    <span className="text-xs font-extrabold text-white">PRO</span>
                  </div>
                </div>

                <div className="text-xs font-bold uppercase text-[#B0B0B0]">{trader.badge}</div>

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
                    <UsersIcon className="h-4 w-4 text-[#B0B0B0]" />
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

                <div className="h-px w-full bg-[#181B22]" />

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
                    <span className="text-white">TECHNICAL & ANALYSIS.</span>
                  </div>
                </div>

                <div className="h-px w-full bg-[#181B22]" />

                <div className="flex items-center gap-1 text-xs font-bold uppercase">
                  <span className="text-[#B0B0B0]">Forecast Accuracy:</span>
                  <span className="text-[#2EBD85]">{trader.accuracy}</span>
                </div>

                <div className="text-2xl font-bold text-white">{trader.price}</div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 py-2.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Buy
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <MessageCircleIcon className="h-4 w-4" />
                  Chat
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Detailed Information (Figma Design) */}
          <div className="flex flex-1 flex-col gap-6 min-w-0 max-[360px]:gap-4">
            {/* Stats Header */}
            <div className="relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] sm:flex-row sm:items-center">
              <div className="flex w-full flex-col gap-6 sm:w-auto sm:flex-1">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Followers</span>
                    <span className="text-[15px] font-bold text-white">85</span>
                  </div>
                  <div className="h-9 w-px bg-[#2E2744]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Trading Days</span>
                    <span className="text-[15px] font-bold text-white">438</span>
                  </div>
                  <div className="h-9 w-px bg-[#2E2744]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Stability Index</span>
                    <span className="text-[15px] font-bold text-white">5.0/5.0</span>
                  </div>
                  <div className="h-9 w-px bg-[#2E2744]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Views (7d)</span>
                    <span className="text-[15px] font-bold text-white">776</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-white whitespace-nowrap">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.86667 6.00043C9.7459 5.79094 9.57043 5.61823 9.35905 5.5008C9.14768 5.38337 8.90834 5.32563 8.66667 5.33376H7.33333C6.97971 5.33376 6.64057 5.47424 6.39052 5.72429C6.14048 5.97434 6 6.31347 6 6.6671C6 7.02072 6.14048 7.35986 6.39052 7.6099C6.64057 7.85995 6.97971 8.00043 7.33333 8.00043H8.66667C9.02029 8.00043 9.35943 8.14091 9.60948 8.39095C9.85952 8.641 10 8.98014 10 9.33376C10 9.68738 9.85952 10.0265 9.60948 10.2766C9.35943 10.5266 9.02029 10.6671 8.66667 10.6671H7.33333C7.09166 10.6752 6.85232 10.6175 6.64095 10.5001C6.42957 10.3826 6.2541 10.2099 6.13333 10.0004" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 4.66699V11.3337" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    AUM 210,390.40 USDT
                  </div>
                  <div className="h-5 w-px bg-[#2E2744]" />
                  <div className="flex items-center gap-1 text-xs font-bold text-white whitespace-nowrap">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M11.3337 5.33366V3.33366C11.3337 3.15685 11.2634 2.98728 11.1384 2.86225C11.0134 2.73723 10.8438 2.66699 10.667 2.66699H4.00033C3.6467 2.66699 3.30756 2.80747 3.05752 3.05752C2.80747 3.30756 2.66699 3.6467 2.66699 4.00033M2.66699 4.00033C2.66699 4.35395 2.80747 4.69309 3.05752 4.94313C3.30756 5.19318 3.6467 5.33366 4.00033 5.33366H12.0003C12.1771 5.33366 12.3467 5.4039 12.4717 5.52892C12.5968 5.65395 12.667 5.82351 12.667 6.00033V8.00033M2.66699 4.00033V12.0003C2.66699 12.3539 2.80747 12.6931 3.05752 12.9431C3.30756 13.1932 3.6467 13.3337 4.00033 13.3337H12.0003C12.1771 13.3337 12.3467 13.2634 12.4717 13.1384C12.5968 13.0134 12.667 12.8438 12.667 12.667V10.667" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.333 8V10.6667H10.6663C10.3127 10.6667 9.97358 10.5262 9.72353 10.2761C9.47348 10.0261 9.33301 9.68696 9.33301 9.33333C9.33301 8.97971 9.47348 8.64057 9.72353 8.39052C9.97358 8.14048 10.3127 8 10.6663 8H13.333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Total Assets: 25,020.85 USDT
                  </div>
                  <div className="h-5 w-px bg-[#2E2744]" />
                  <div className="flex items-center gap-1 text-xs font-bold text-white whitespace-nowrap">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2V8H14" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Profit Sharing: 10%
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#1C3430] px-1 py-0.5 text-xs font-bold uppercase text-[#2EBD85]">Stable</span>
                  <span className="rounded bg-[#6AA5FF]/16 px-1 py-0.5 text-xs font-bold uppercase text-[#6AA5FF]">High Frequency</span>
                  <span className="rounded bg-[#6AA5FF]/16 px-1 py-0.5 text-xs font-bold uppercase text-[#6AA5FF]">Long-Term</span>
                  <span className="rounded bg-[#6AA5FF]/16 px-1 py-0.5 text-xs font-bold uppercase text-[#6AA5FF]">Veterans</span>
                  <span className="rounded bg-[#6AA5FF]/16 px-1 py-0.5 text-xs font-bold uppercase text-[#6AA5FF]">Sociable</span>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:min-w-[260px] sm:max-w-none sm:items-end sm:self-start sm:px-6">
                <div className="flex w-full items-center justify-center gap-4 self-end sm:w-full sm:justify-between sm:gap-8">
                  <button className="flex items-center gap-1 text-xs font-bold text-white transition-colors hover:text-[#A06AFF]">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M12.7945 6.29445L11.4843 4.97965C10.5403 4.03232 10.1703 3.52271 9.65907 3.70287C9.02167 3.92751 9.23147 5.34494 9.23147 5.82347C8.24047 5.82347 7.21013 5.73539 6.23323 5.91891C3.00839 6.52475 2 9.14386 2 12.0003C2.91273 11.3538 3.82455 10.665 4.92155 10.3654C6.29091 9.99133 7.82027 10.1698 9.23147 10.1698C9.23147 10.6483 9.02167 12.0658 9.65907 12.2904C10.2383 12.4945 10.5403 11.9609 11.4843 11.0136L12.7945 9.69879C13.5982 8.89233 14 8.48913 14 7.99666C14 7.50419 13.5982 7.10093 12.7945 6.29445Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Share
                  </button>
                  <div className="h-5 w-px bg-white/24" />
                  <button className="flex items-center gap-1 text-xs font-bold text-white transition-colors hover:text-[#A06AFF]">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M12.9747 2.66277C11.1869 1.56615 9.62661 2.00807 8.68927 2.71201C8.30487 3.00064 8.11274 3.14495 7.99967 3.14495C7.88661 3.14495 7.69447 3.00064 7.31007 2.71201C6.37275 2.00807 4.8124 1.56615 3.02463 2.66277C0.678387 4.10196 0.147488 8.84993 5.55936 12.8556C6.59015 13.6185 7.10554 14 7.99967 14C8.89381 14 9.40921 13.6185 10.44 12.8556C15.8519 8.84993 15.3209 4.10196 12.9747 2.66277Z" stroke="white" strokeLinecap="round"/>
                    </svg>
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Bio</h2>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-normal text-white">{trader.description}</p>
              </div>
            </div>

            {/* Tab Navigation - Placeholder for now */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 rounded-[36px] border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px]">
                <button className="rounded-[32px] border border-[#181B22] bg-[#0C1014]/50 px-4 py-3 text-[15px] font-bold text-white backdrop-blur-[58px]">
                  Statistics
                </button>
                <button className="rounded-[32px] bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-3 text-[15px] font-bold text-white backdrop-blur-[58px]">
                  Trades
                </button>
              </div>
              <div className="flex gap-2 rounded-[36px] border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px]">
                <button className="rounded-[32px] bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-2 text-[15px] font-bold text-white backdrop-blur-[58px]">
                  All
                </button>
                <button className="rounded-[32px] border border-[#181B22] bg-[#0C1014]/50 px-4 py-2 text-[15px] font-bold text-white backdrop-blur-[58px]">
                  Trades
                </button>
                <button className="rounded-[32px] border border-[#181B22] bg-[#0C1014]/50 px-4 py-2 text-[15px] font-bold text-white backdrop-blur-[58px]">
                  Bots
                </button>
              </div>
            </div>

            {/* Placeholder for additional sections */}
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <p className="text-center text-sm text-[#B0B0B0]">Additional sections (Allocation, Performance Charts, Trade Table, Comments) coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderDetailLanding;
