import {
  Check,
  ChevronLeft,
  ChevronRight,
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
  const chartImage =
    signal.productImage ?? signal.chartImage ?? DEFAULT_CHART_IMAGE;
  const displayChartImage = chartImage || DEFAULT_CHART_IMAGE;
  const authorAvatar = author?.avatar ?? FALLBACK_SIGNAL.author?.avatar ?? "";

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

            {chartImage && (
              <div className="relative overflow-hidden rounded-2xl border border-[#181B22]">
                <img
                  src={chartImage}
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
            )}

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
          </div>

          <div className="flex w-full flex-col gap-6 lg:max-w-[339px] lg:flex-1 lg:min-w-0">
            <div className="flex flex-col overflow-hidden rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              {(authorAvatar || chartImage) && (
                <img
                  src={authorAvatar || chartImage}
                  alt={author?.name ?? signal.name}
                  className="h-[332px] w-full border-b border-[#181B22] object-cover"
                />
              )}

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

              <div className="flex flex-col gap-4 p-4">
                <button
                  type="button"
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 py-2.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  <Check className="h-4 w-4" />
                  Subscribe
                </button>
                <button
                  type="button"
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </button>
                <button
                  type="button"
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
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
