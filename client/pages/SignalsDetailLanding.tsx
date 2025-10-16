import {
  Check,
  Eye,
  Instagram,
  MessageCircle,
  Play,
  Star,
  TrendingUp,
  Users,
  Youtube,
} from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MarketplaceCategory } from "@/data/marketplaceCategories";
import type { Signal } from "@/components/marketplace/SignalCard";
import { baseSignals } from "@/data/marketplaceSignals";

interface SignalDetailsLocationState {
  signal?: Signal;
  category?: MarketplaceCategory;
  scrollToTop?: boolean;
}

type ExtendedSignal = Signal & {
  gallery?: string[];
  price?: string;
  productImage?: string;
  author?: {
    name: string;
    avatar: string;
    bio?: string;
    communityLink?: string;
    socials?: string[];
  };
  tags?: string[];
  reviews?: Array<{
    id: string;
    author: string;
    avatar: string;
    postedAt: string;
    rating: number;
    title: string;
    message: string;
    likes?: number;
  }>;
  averageRating?: number;
  totalReviews?: number;
};

const DEFAULT_CHART_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fe406955c384c49af9277d65283062ad7?format=webp&width=800";

const resolveFallbackSignal = (): ExtendedSignal => {
  const first = baseSignals[0] as ExtendedSignal | undefined;
  if (first) {
    return {
      ...first,
      price: first.price ?? "$10 / month",
      productImage: first.chartImage,
      author: {
        name: "Sarah Lee",
        avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=160",
        bio: "Professional trader with 8+ years of experience in momentum strategies and technical analysis.",
        communityLink: "https://example.com",
        socials: ["twitter", "youtube", "instagram", "web"],
      },
      tags: ["Distribution", "Luxaigo", "signals", "statisticalprobability", "statistics", "Stop", "trailingstop", "trendanalysis"],
      averageRating: 4.5,
      totalReviews: 28,
      reviews: [
        {
          id: "1",
          author: "John Smith",
          avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
          postedAt: "2 days ago",
          rating: 5,
          title: "Game changer for my trading strategy!",
          message: "This tool has completely transformed how I manage risk in my trading. The automatic calculations save me so much time, and I've seen a significant improvement in my overall performance. Highly recommended for any serious trader.",
        },
        {
          id: "2",
          author: "John Smith",
          avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
          postedAt: "1 week ago",
          rating: 4,
          title: "Great tool, but could use more features",
          message: "RiskMaster has been very helpful for my day trading. The risk calculations are spot on and have helped me avoid some potentially big losses. I'd love to see more advanced features in future updates, like custom risk models and better integration with other platforms.",
        },
        {
          id: "3",
          author: "John Smith",
          avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
          postedAt: "3 weeks ago",
          rating: 4.5,
          title: "Worth every penny",
          message: "I was hesitant about the price at first, but after using Riskmaster for a month, I can confidently say it's worth every penny. The portfolio analysis feature alone has saved me from making several costly mistakes. The UI is clean and intuitive, making it easy to incorporate into my daily routine.",
        },
      ],
    };
  }

  return {
    id: "default-signal",
    name: "Signals Overview",
    icon:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1d90fdad8fa945dc9d0b417f6bb84c17?format=webp&width=256",
    users: "0",
    riskLevel: "UNSPECIFIED",
    platforms: [],
    assets: [],
    type: "N/A",
    timeframes: [],
    use: "N/A",
    accuracy: "0%",
    chartImage:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fff6cd09eeae445f2bcc6ca0b891f197c?format=webp&width=800",
    price: "$10 / month",
  };
};

const FALLBACK_SIGNAL = resolveFallbackSignal();

const platformLogos = [
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1d90fdad8fa945dc9d0b417f6bb84c17?format=webp&width=64",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fff6cd09eeae445f2bcc6ca0b891f197c?format=webp&width=64",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F59711ad87739493eaa7a0b6857960587?format=webp&width=64",
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F59dfc5c913eb4f6d845cfb34003ed89b?format=webp&width=64",
];

type PerformanceLevel = {
  label: string;
  accent?: boolean;
};

const PERFORMANCE_LEVELS: readonly PerformanceLevel[] = [
  { label: "$500K" },
  { label: "$100K" },
  { label: "$10K" },
  { label: "$100" },
  { label: "$1" },
  { label: "$0.01", accent: true },
];

const PERFORMANCE_MONTHS = [
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
  "JAN",
  "FEB",
  "MAR",
] as const;

const ACCURACY_LEVELS = [250, 200, 150, 100, 50, 0] as const;

const ACCURACY_DATA = [
  { month: "APR", successful: 37, unsuccessful: 14 },
  { month: "MAY", successful: 17, unsuccessful: 25 },
  { month: "JUN", successful: 37, unsuccessful: 29 },
  { month: "JUL", successful: 57, unsuccessful: 8 },
  { month: "AUG", successful: 37, unsuccessful: 6 },
  { month: "SEP", successful: 27, unsuccessful: 22 },
  { month: "OCT", successful: 27, unsuccessful: 16 },
  { month: "NOV", successful: 57, unsuccessful: 27 },
  { month: "DEC", successful: 181, unsuccessful: 6 },
  { month: "JAN", successful: 27, unsuccessful: 6 },
  { month: "FEB", successful: 181, unsuccessful: 47 },
  { month: "MAR", successful: 57, unsuccessful: 15 },
] as const;

const SPECIFICATIONS = [
  "Strategy: RSI, Bollinger Bands",
  "Exchanges: Binance, NYSE",
  "Assets: BTC, AAPL, EUR/USD",
  "Risk: Low, drawdown up to 10%",
  "Signals: 5–10 per week",
  "Stats: ROI chart, 311 subscribers, 4.5/5 rating, latest signals available",
] as const;

const COMMENT_AVATAR =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=800";

const SignalsDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"chart" | "source">("chart");

  const locationState =
    (location.state as SignalDetailsLocationState | null) ?? null;

  useEffect(() => {
    if (locationState?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, {
        replace: true,
        state: { ...locationState, scrollToTop: false },
      });
    }
  }, [location.pathname, locationState, navigate]);

  const signal = useMemo<ExtendedSignal>(() => {
    const provided = locationState?.signal as ExtendedSignal | undefined;
    return provided ?? FALLBACK_SIGNAL;
  }, [locationState]);


  const reviews = useMemo(() => {
    if (!Array.isArray(signal.reviews)) {
      return [];
    }

    return signal.reviews.filter(
      (review) =>
        typeof review?.author === "string" &&
        review.author.trim().length > 0 &&
        typeof review?.message === "string" &&
        review.message.trim().length > 0,
    );
  }, [signal.reviews]);

  const categoryLabel =
    locationState?.category ?? "Signals and Technical indicators";

  const handleNavigateToCategory = useCallback(() => {
    navigate("/marketplace/signals", {
      state: { scrollToTop: true, category: categoryLabel },
    });
  }, [categoryLabel, navigate]);

  const assets = Array.isArray(signal.assets) ? signal.assets : [];
  const platforms = Array.isArray(signal.platforms) ? signal.platforms : [];
  const timeframes = Array.isArray(signal.timeframes) ? signal.timeframes : [];
  const tags = Array.isArray(signal.tags) ? signal.tags : FALLBACK_SIGNAL.tags ?? [];
  const author = signal.author ?? FALLBACK_SIGNAL.author;
  const averageRating = signal.averageRating ?? FALLBACK_SIGNAL.averageRating ?? 0;
  const totalReviews = signal.totalReviews ?? FALLBACK_SIGNAL.totalReviews ?? 0;
  const baseChartImage = signal.productImage ?? signal.chartImage ?? "";
  const displayChartImage = DEFAULT_CHART_IMAGE;
  const authorAvatar = author?.avatar ?? FALLBACK_SIGNAL.author?.avatar ?? "";
  const heroImage = authorAvatar || baseChartImage || DEFAULT_CHART_IMAGE;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      const halfFilled = !filled && index < rating;

      return (
        <Star
          key={index}
          className={`h-4 w-4 ${
            filled
              ? "fill-[#A06AFF] text-[#A06AFF]"
              : halfFilled
                ? "fill-[url(#half-star)] text-[#A06AFF]"
                : "fill-[#2E2744] text-[#2E2744]"
          }`}
        />
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex items-center gap-2 text-[15px]">
          <button
            type="button"
            onClick={handleNavigateToCategory}
            className="font-normal text-[#B0B0B0] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
          >
            {categoryLabel}
          </button>
          <span className="font-bold text-[#B0B0B0]">/</span>
          <span className="font-bold text-white">{signal.name}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="inline-flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("chart")}
            className={`flex h-[26px] items-center justify-center rounded-full px-4 text-[15px] font-bold transition-colors ${
              activeTab === "chart"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C1014]/50 text-white backdrop-blur-[50px]"
            }`}
          >
            Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("source")}
            className={`flex h-[26px] items-center justify-center rounded-full px-4 text-[15px] font-bold transition-colors ${
              activeTab === "source"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C1014]/50 text-white backdrop-blur-[50px]"
            }`}
          >
            Source code
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-4">
          <div className="flex flex-col gap-5 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] lg:flex-[2] lg:min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-white sm:text-[31px]">
                {signal.name}
              </h1>
              <button
                type="button"
                className="text-[#B0B0B0] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                aria-label="Add to favourites"
              >
                <Star className="h-6 w-6" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#181B22]">
              <img
                src={displayChartImage}
                alt={`${signal.name} chart`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                aria-label="Previous chart"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11.9908" cy="11.9908" r="11.9908" fill="url(#paint0_linear_left)" />
                  <path
                    d="M13.627 8.17578L9.81171 11.991L13.627 15.8063"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_left"
                      x1="23.9815"
                      y1="11.9907"
                      x2="0"
                      y2="11.9907"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#A06AFF" />
                      <stop offset="1" stopColor="#482090" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                aria-label="Next chart"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11.9908" cy="11.9908" r="11.9908" fill="url(#paint0_linear_right)" />
                  <path
                    d="M10.373 8.17578L14.188 11.991L10.373 15.8063"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_right"
                      x1="23.9815"
                      y1="11.9907"
                      x2="0"
                      y2="11.9907"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#A06AFF" />
                      <stop offset="1" stopColor="#482090" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                <span className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                <span className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#B0B0B0]" />
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Use on chart
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#B0B0B0]" />
                  <span className="text-xs font-bold text-[#B0B0B0]">
                    {signal.users}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#B0B0B0]" />
                  <span className="text-xs font-bold text-[#B0B0B0]">
                    {reviews.length > 0 ? reviews.length : "87"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#B0B0B0]" />
                <span className="text-xs font-bold text-[#B0B0B0]">11,299</span>
              </div>
            </div>

            <div className="relative flex flex-col gap-4 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Performance</h2>

              <div className="h-px w-full bg-[#181B22]" />

              <div className="relative">
                <div className="relative h-[220px]">
                  <div className="absolute left-0.5 top-0 h-full w-[calc(100%-42px)]">
                    <svg
                      className="h-full w-full"
                      viewBox="0 0 652 221"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <g filter="url(#filter0_d_perf)">
                        <path
                          d="M9 208.911L16.454 212L21.0091 205.822L25.1502 208.028L26.3926 204.498L29.7054 205.822L33.8465 202.291L37.5735 204.498L49.5826 185.08L51.2391 186.404L56.6225 176.696L58.2789 180.226L60.3494 178.02L62.42 180.226L64.0764 176.696L66.9752 179.343L69.8739 176.696L72.3586 178.02C73.6009 174.048 76.0856 166.016 76.0856 165.663C76.0856 165.31 76.0856 157.278 76.0856 153.307L79.3984 157.278L81.8831 153.307C81.8831 154.189 81.8831 155.601 81.8831 154.189C81.8831 152.777 84.6438 143.009 86.0242 138.302L89.337 151.1L93.8922 140.067L97.2051 139.185L98.4474 131.683L100.932 133.007L102.174 128.593L105.487 136.537L107.144 145.804L108.8 137.42L110.457 142.274L112.113 154.189L114.184 139.185L117.911 149.776L122.88 131.683L127.021 135.213L128.677 130.8L130.748 134.33L134.061 129.917L138.616 144.922L141.101 137.42L144.828 140.067L147.726 129.917L148.555 135.213L151.453 130.8L155.594 147.57L157.665 143.157L158.493 147.57L162.22 144.922L163.462 152.865L165.119 146.687L168.846 143.157L170.502 145.804L171.745 140.067L175.057 147.57L177.542 146.687L181.269 152.865L183.754 146.687L187.067 161.691L190.379 160.367V151.1L192.864 148.452L199.076 157.72L201.975 149.776L203.217 157.72L205.702 156.837L208.186 152.865L209.843 156.837L211.499 144.922L212.741 147.57L214.812 142.274C216.192 145.216 218.953 150.57 218.953 148.452C218.953 146.334 219.781 137.861 220.195 133.889L225.579 142.274L228.063 143.157L228.892 141.391H231.376L234.689 144.922L237.588 145.804L238.416 141.391L240.487 144.039L245.87 143.157L249.183 136.537L252.496 143.157H254.152L255.395 140.067L258.707 146.687L260.364 143.157L263.263 149.776L269.888 148.452L272.373 162.574L274.443 155.072L278.17 152.865L281.483 166.104L283.554 161.691L288.109 168.311C289.904 165.222 293.575 159.308 293.907 160.367C294.238 161.427 298.186 169.341 300.118 173.165L302.603 169.635L303.845 174.93H306.33L308.815 170.517L310.057 174.048L317.097 165.222L319.167 152.865L322.066 156.396L324.137 151.1L328.692 146.687C330.9 150.953 335.317 159.397 335.317 159.043C335.317 158.69 336.422 153.601 336.974 151.1H339.459L340.701 149.776L345.256 160.367L346.912 157.72L348.983 166.104L351.054 168.311L353.538 184.198L355.609 178.461L358.093 180.226L360.164 163.457L360.992 166.104L363.477 165.222L365.133 170.517L365.547 163.457L368.86 160.367L372.173 170.517L374.658 164.339L377.557 169.635L379.627 163.457H381.283L382.526 157.72L382.94 159.926L385.425 149.776H390.394L392.464 161.25L394.121 163.015L395.777 161.25L400.747 167.428L402.817 164.78L404.474 172.724L406.544 171.4L409.857 177.578L412.342 177.137L414.412 174.489L417.311 166.104L421.038 169.635L422.694 161.25L427.664 164.339L430.976 152.865L438.016 149.776L440.087 152.865L441.329 148.011L443.4 151.541L446.299 140.95L449.197 140.509L451.682 149.776L456.651 154.189L459.55 148.893H461.206L462.035 146.687H467.004L469.074 151.541L471.973 144.922L474.458 146.687L474.872 140.067L479.841 130.8L485.639 133.007L486.467 129.476L491.85 136.978L492.679 132.565L494.749 134.33L500.133 129.476L502.203 116.237L508.415 125.946L513.384 128.152L515.455 125.946L517.111 108.735L520.01 106.97L522.909 105.646L525.393 78.7261L528.706 66.8109L530.777 75.637L531.191 64.6043L535.332 67.2522L540.715 54.013L544.028 31.0652L547.341 34.5957L550.654 48.7174L552.724 15.6196L555.209 31.0652L556.451 29.3L557.694 32.3891L560.178 26.2109L563.077 37.6848L565.148 29.3L565.976 45.187L568.46 37.6848L572.602 39.45L573.844 46.5109L577.571 20.9152L578.813 26.2109L580.47 23.1217H582.54L588.752 9L590.822 37.6848L594.963 40.7739L598.276 51.8065L600.761 41.2152C601.589 44.4514 603.246 51.0122 603.246 51.3652C603.246 51.7183 605.178 42.0978 606.144 37.2435L608.629 42.5391L611.942 21.3565L618.154 16.5022L621.052 19.15L622.709 13.413L627.678 54.4543L629.749 50.0413L633.89 51.3652L637.617 31.0652L643 19.15"
                          stroke="#A06AFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </g>
                      <defs>
                        <filter id="filter0_d_perf" x="0.249756" y="0.698242" width="651.5" height="220.22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset />
                          <feGaussianBlur stdDeviation="4" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0.627451 0 0 0 0 0.415686 0 0 0 0 1 0 0 0 0.24 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_perf" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_perf" result="shape" />
                        </filter>
                      </defs>
                    </svg>
                  </div>

                  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
                    {PERFORMANCE_LEVELS.map((level) => (
                      <div key={level.label} className="flex items-center gap-0.5">
                        <div
                          className={`h-px flex-1 ${level.accent ? "bg-[#523A83]" : "bg-[#2E2744]"}`}
                        />
                        <span className="w-10 text-right text-xs font-bold uppercase text-[#B0B0B0]">
                          {level.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute right-4 top-0 z-20 inline-flex items-center justify-center rounded bg-[#A06AFF] px-1 py-0.5">
                    <span className="text-center text-xs font-bold uppercase text-white">$507K</span>
                  </div>
                </div>

                <div className="relative left-0.5 top-0.5 flex w-[calc(100%-42px)] items-start justify-between gap-2">
                  {PERFORMANCE_MONTHS.map((month) => (
                    <div key={month} className="flex flex-col items-center gap-1">
                      <div className="h-2 w-px bg-[#523A83]" />
                      <span className="text-center text-xs font-bold uppercase text-[#B0B0B0]">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex flex-col gap-4 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Accuracy</h2>

              <div className="h-px w-full bg-[#181B22]" />

              <div className="relative">
                <div className="relative h-[216px]">
                  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
                    {ACCURACY_LEVELS.map((level, index) => (
                      <div key={level} className="flex items-center gap-0.5">
                        <div
                          className={`h-px flex-1 ${index === ACCURACY_LEVELS.length - 1 ? "bg-[#523A83]" : "bg-[#2E2744]"}`}
                        />
                        <span className="w-10 text-right text-xs font-bold uppercase text-[#B0B0B0]">
                          {level}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-[42px] z-20 flex items-end justify-between gap-[2px]">
                    {ACCURACY_DATA.map((data) => {
                      const maxHeight = 181;
                      const successfulHeight = (data.successful / 250) * maxHeight;
                      const unsuccessfulHeight = (data.unsuccessful / 250) * maxHeight;

                      return (
                        <div key={data.month} className="flex flex-1 items-end gap-px">
                          <div
                            className="w-full rounded-t-full bg-gradient-to-t from-[#181A20] to-[#A06AFF]"
                            style={{
                              height: `${successfulHeight}px`,
                              minHeight: successfulHeight > 0 ? "8px" : "0px",
                            }}
                          />
                          <div
                            className="w-full rounded-t-full bg-gradient-to-t from-[#181A20] to-[#FFA800]"
                            style={{
                              height: `${unsuccessfulHeight}px`,
                              minHeight: unsuccessfulHeight > 0 ? "8px" : "0px",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative left-0.5 top-0.5 flex w-[calc(100%-42px)] items-start justify-between gap-2">
                  {ACCURACY_DATA.map((data) => (
                    <div key={data.month} className="flex flex-col items-center gap-1">
                      <div className="h-2 w-px bg-[#523A83]" />
                      <span className="text-center text-xs font-bold uppercase text-[#B0B0B0]">
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#A06AFF]" />
                  <span className="text-xs font-bold uppercase text-[#808283]">Successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FFA800]" />
                  <span className="text-xs font-bold uppercase text-[#808283]">Unsuccessful</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Description</h2>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-medium text-white">
                  Catches breakouts on M5–D1 for crypto, stocks, and forex. Suitable for accounts starting from $500.
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Specifications</h2>
              </div>
              <div className="flex flex-col gap-4 p-4">
                {SPECIFICATIONS.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center">
                      <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                    </div>
                    <p className="flex-1 text-[15px] font-medium text-white">{spec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">20 comments</h2>
                <div className="flex items-center gap-1 rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px]">
                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_clock)">
                        <path d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 5.33301V7.99967L9.33333 9.33301" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_clock">
                          <rect width="16" height="16" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.23732 14.6663C17.3855 12.6663 12.8225 4.66634 7.28172 1.33301C6.63012 3.66634 5.65217 4.33301 3.69657 6.66634C1.10739 9.75561 2.39292 13.333 5.97805 14.6663C5.43485 13.9997 4.03297 12.6002 4.99992 10.6663C5.33325 9.99967 5.99992 9.33301 5.66659 7.99967C6.31844 8.33301 7.66659 8.66634 7.99992 10.333C8.54312 9.66634 9.10685 8.26634 8.58545 6.66634C12.6666 9.66634 10.9999 12.6663 9.23732 14.6663Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="flex h-[88px] w-full flex-col gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
                  <span className="text-[15px] font-medium text-[#B0B0B0]">Comment...</span>
                </div>
                <button className="flex h-[26px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2.5">
                  <span className="text-center text-[15px] font-bold text-white">Send</span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={COMMENT_AVATAR}
                        alt="John Smith avatar"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-[15px] font-bold text-white">John Smith</span>
                        <span className="text-xs font-bold text-[#B0B0B0]">6 hours ago</span>
                      </div>
                    </div>
                    <p className="text-[15px] font-medium text-white">
                      Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs font-bold text-[#B0B0B0]">25</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF]">Hide</button>
                    <button className="rounded-full px-4 py-2 text-[15px] font-bold text-white">Reply</button>
                    <button className="rotate-90">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-4 top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]" />

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <img
                        src={COMMENT_AVATAR}
                        alt="John Smith avatar"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                        <div className="flex flex-1 flex-col gap-0.5">
                          <span className="text-[15px] font-bold text-white">John Smith</span>
                          <span className="text-xs font-bold text-[#B0B0B0]">6 hours ago</span>
                        </div>
                      </div>
                      <p className="text-[15px] font-medium text-white">Thank you, John Smith!</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="text-xs font-bold text-[#B0B0B0]">25</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF]">Hide</button>
                      <button className="rounded-full px-4 py-2 text-[15px] font-bold text-white">Reply</button>
                      <button className="rotate-90">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-12 top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]" />

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <img
                        src={COMMENT_AVATAR}
                        alt="John Smith avatar"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                        <div className="flex flex-1 flex-col gap-0.5">
                          <span className="text-[15px] font-bold text-white">John Smith</span>
                          <span className="text-xs font-bold text-[#B0B0B0]">6 hours ago</span>
                        </div>
                      </div>
                      <p className="text-[15px] font-medium text-white">At your service, John Smith!</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="text-xs font-bold text-[#B0B0B0]">25</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="rounded-full px-4 py-2 text-[15px] font-bold text-white">Reply</button>
                      <button className="rotate-90">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 self-stretch">
                      <img
                        src={COMMENT_AVATAR}
                        alt="John Smith avatar"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-[15px] font-bold text-white">John Smith</span>
                        <span className="text-xs font-bold text-[#808283]">6 hours ago</span>
                      </div>
                    </div>
                    <p className="self-stretch text-[15px] font-medium text-white">
                      Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z" stroke="#808283" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs font-bold text-[#808283]">25</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF]">1 reply</button>
                    <button className="rounded-full px-4 py-2 text-[15px] font-bold text-white">Reply</button>
                    <button className="rotate-90">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11Z" fill="#808283" stroke="#808283" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11Z" fill="#808283" stroke="#808283" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="#808283" stroke="#808283" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <button className="flex h-[26px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2.5">
                    <span className="text-center text-[15px] font-bold text-white">16 more comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 lg:max-w-[339px] lg:flex-1 lg:min-w-0">
            <div className="flex flex-col overflow-hidden rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <img
                src={heroImage}
                alt={author?.name ?? signal.name}
                className="h-[332px] w-full border-b border-[#181B22] object-cover"
              />

              <div className="flex items-center gap-3 p-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[19px] font-bold text-white">{signal.name}</h3>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                      <Users className="h-4 w-4 text-[#B0B0B0]" />
                      <span className="text-xs font-bold text-white">
                        {signal.users}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded bg-[#1C3430] px-1 py-0.5">
                      <span className="text-xs font-bold uppercase text-[#2EBD85]">
                        Risk: {signal.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#181B22]" />

              {platforms.length > 0 && (
                <div className="flex items-center gap-2 p-4">
                  {platforms.slice(0, 4).map((platform, idx) => (
                    <img
                      key={`${signal.id}-platform-${idx}`}
                      src={platformLogos[idx % platformLogos.length]}
                      alt={platform}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2 p-4">
                {assets.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Assets:</span>
                    {assets.map((asset, idx) => (
                      <div
                        key={`${signal.id}-asset-${idx}`}
                        className="rounded px-1 py-0.5 bg-[#2E2744]"
                      >
                        <span className="text-white">{asset}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                  <span className="text-[#B0B0B0]">Type:</span>
                  <div className="rounded bg-[#2E2744] px-1 py-0.5">
                    <span className="text-white">{signal.type}</span>
                  </div>
                </div>

                {timeframes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Timeframe:</span>
                    {timeframes.map((tf, idx) => (
                      <div
                        key={`${signal.id}-tf-${idx}`}
                        className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5"
                      >
                        <span className="text-[#6AA5FF]">{tf}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                  <span className="text-[#B0B0B0]">Use:</span>
                  <div className="rounded bg-[#2E2744] px-1 py-0.5">
                    <span className="text-white">{signal.use}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                  <span className="text-[#B0B0B0]">Product Accuracy:</span>
                  <span className="text-[15px] font-bold text-[#2EBD85]">
                    {signal.accuracy}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 px-4 py-2">
                <p className="text-2xl font-bold text-white">
                  {signal.price ?? "$10 / month"}
                </p>
              </div>

              <div className="flex flex-col gap-3 p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90"
                >
                  <Check className="h-4 w-4" />
                  Subscribe
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-xs font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-xs font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <Play className="h-4 w-4" />
                  Demo
                </button>
              </div>
            </div>

            {author && (
              <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                <div className="flex items-center justify-between gap-4 p-4">
                  <h3 className="text-[15px] font-bold text-white">{author.name}</h3>
                  <button
                    type="button"
                    className="flex h-[26px] w-20 items-center justify-center rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] text-xs font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Follow
                  </button>
                </div>

                {author.communityLink && (
                  <div className="px-4 pb-4">
                    <p className="text-[15px] font-medium text-[#B0B0B0]">
                      Join our 10k+ community:{" "}
                      <a
                        href={author.communityLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#A06AFF] underline"
                      >
                        example.com
                      </a>
                    </p>
                  </div>
                )}

                {author.bio && (
                  <div className="px-4">
                    <p className="text-[15px] font-medium text-[#B0B0B0]">
                      {author.bio}
                    </p>
                  </div>
                )}

                {author.socials && author.socials.length > 0 && (
                  <div className="flex items-center gap-3 p-4">
                    <span className="text-[15px] font-medium text-[#B0B0B0]">
                      Also on:
                    </span>
                    <div className="flex items-center gap-3">
                      {author.socials.includes("twitter") && (
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M12.2174 1.26953H14.4663L9.55298 6.88519L15.3332 14.5268H10.8073L7.26253 9.89222L3.20647 14.5268H0.956125L6.21146 8.52026L0.666504 1.26953H5.30724L8.51143 5.50575L12.2174 1.26953ZM11.428 13.1807H12.6742L4.6301 2.54495H3.29281L11.428 13.1807Z" />
                        </svg>
                      )}
                      {author.socials.includes("youtube") && (
                        <Youtube className="h-4 w-4 text-white" />
                      )}
                      {author.socials.includes("instagram") && (
                        <Instagram className="h-4 w-4 text-white" />
                      )}
                      {author.socials.includes("web") && (
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M8.00016 14.6663C4.31826 14.6663 1.3335 11.6815 1.3335 7.99967C1.3335 6.13798 2.0966 4.45452 3.32708 3.24502M8.00016 14.6663C7.35816 14.1906 7.46063 13.6367 7.7827 13.0828C8.2779 12.2313 8.2779 12.2313 8.2779 11.0959C8.2779 9.96061 8.95256 9.42827 11.3335 9.90441C12.4033 10.1184 13.1829 8.64027 14.5717 9.12834M8.00016 14.6663C11.2974 14.6663 14.0355 12.2727 14.5717 9.12834M3.32708 3.24502C3.89327 3.30477 4.21028 3.6081 4.7368 4.16445C5.73643 5.22069 6.73603 5.30882 7.4025 4.95674C8.4021 4.42863 7.5621 3.57321 8.7353 3.10833C9.45456 2.82335 9.59163 2.077 9.25123 1.4502M3.32708 3.24502C4.53013 2.06248 6.17996 1.33301 8.00016 1.33301C8.42776 1.33301 8.84596 1.37327 9.25123 1.4502M14.5717 9.12834C14.6342 8.76147 14.6668 8.38441 14.6668 7.99967C14.6668 4.74539 12.3351 2.03571 9.25123 1.4502"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-4">
                    {tags.map((tag, idx) => (
                      <div
                        key={`${signal.id}-tag-${idx}`}
                        className="rounded bg-[#2E2744] px-2 py-0.5"
                      >
                        <span className="text-xs font-bold uppercase text-white">
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Reviews</h2>
              </div>

              <div className="flex flex-col gap-2.5 p-4">
                <div className="flex items-center gap-4">
                  <span className="text-[31px] font-bold text-[#A06AFF]">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-0.5">
                      {renderStars(averageRating)}
                    </div>
                    <p className="text-xs font-bold text-[#B0B0B0]">
                      Based on {totalReviews} reviews
                    </p>
                  </div>
                </div>
              </div>

              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="flex flex-col">
                  <div className="px-4 py-2">
                    <div className="h-px bg-[#181B22]" />
                  </div>
                  <div className="flex flex-col gap-2 px-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-white">
                            {review.author}
                          </span>
                          <span className="text-xs font-bold text-[#B0B0B0]">
                            {review.postedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[15px] font-bold text-white">
                        {review.title}
                      </h4>
                      <p className="text-[15px] font-medium text-[#B0B0B0]">
                        {review.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  Show More Reviews
                </button>
              </div>
            </div>

            <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Disclaimer</h2>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-medium text-[#B0B0B0]">
                  The information and publications are not meant to be, and do not
                  constitute, financial, investment, trading, or other types of advice
                  or recommendations supplied or endorsed by TyrianTrade. Read more in
                  the{" "}
                  <a
                    href="/terms"
                    className="text-[#A06AFF] underline"
                  >
                    Terms of Use
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#A06AFF" />
            <stop offset="50%" stopColor="#2E2744" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SignalsDetailLanding;
