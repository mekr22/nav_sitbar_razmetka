import {
  Activity,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Play,
  ShieldCheck,
  Star,
  Timer,
  Users,
} from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MarketplaceCategory } from "@/data/marketplaceCategories";
import type { Signal } from "@/components/marketplace/SignalCard";
import { baseSignals } from "@/data/marketplaceSignals";

interface SignalDetailsLocationState {
  signal?: Signal;
  category?: MarketplaceCategory;
  scrollToTop?: boolean;
}

interface SignalReview {
  id: string;
  author: string;
  avatar: string;
  postedAt: string;
  message: string;
  likes: number;
}

interface SignalAuthor {
  name: string;
  avatar: string;
  bio?: string;
  communityLink?: string;
  socials?: string[];
}

interface SpecificationItem {
  label: string;
  value: string;
}

type ExtendedSignal = Signal & {
  description?: string;
  features?: string[];
  specifications?: SpecificationItem[];
  reviews?: SignalReview[];
  price?: string;
  author?: SignalAuthor;
  gallery?: string[];
  productImage?: string;
};

const resolveFallbackSignal = (): ExtendedSignal => {
  const first = baseSignals[0] as ExtendedSignal | undefined;
  if (first) {
    return {
      ...first,
      price: first.price ?? "Pricing available on request",
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
    price: "Pricing available on request",
  };
};

const FALLBACK_SIGNAL = resolveFallbackSignal();

const SignalsDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"chart" | "source">("chart");
  const [galleryIndex, setGalleryIndex] = useState(0);

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
    const resolved = (locationState?.signal as ExtendedSignal | undefined) ?? FALLBACK_SIGNAL;
    return {
      ...resolved,
      price: resolved.price ?? FALLBACK_SIGNAL.price,
    };
  }, [locationState]);

  const categoryLabel =
    locationState?.category ?? "Signals and Technical indicators";

  const assets = Array.isArray(signal.assets)
    ? signal.assets.filter((item) => item && item.trim().length > 0)
    : [];
  const platforms = Array.isArray(signal.platforms)
    ? signal.platforms.filter((item) => item && item.trim().length > 0)
    : [];
  const timeframes = Array.isArray(signal.timeframes)
    ? signal.timeframes.filter((item) => item && item.trim().length > 0)
    : [];

  const assetsText = assets.length ? assets.join(", ") : "diverse assets";
  const timeframesText = timeframes.length
    ? timeframes.join(", ")
    : "multiple timeframes";
  const useLabelLower = signal.use ? signal.use.toLowerCase() : "";
  const riskLabelLower = signal.riskLevel ? signal.riskLevel.toLowerCase() : "";

  const gallery = useMemo(() => {
    const additional = Array.isArray(signal.gallery)
      ? signal.gallery.filter((item) => item && item.trim().length > 0)
      : [];
    if (signal.chartImage) {
      const deduped = [signal.chartImage, ...additional.filter((src) => src !== signal.chartImage)];
      return deduped;
    }
    return additional;
  }, [signal.chartImage, signal.gallery]);

  useEffect(() => {
    setGalleryIndex(0);
  }, [signal.id, gallery.length]);

  const currentGalleryImage =
    gallery[galleryIndex] ?? signal.chartImage ?? "";
  const canNavigateGallery = gallery.length > 1;

  const handlePreviousImage = () => {
    if (!canNavigateGallery) {
      return;
    }
    setGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNextImage = () => {
    if (!canNavigateGallery) {
      return;
    }
    setGalleryIndex((prev) => (prev + 1) % gallery.length);
  };

  const accuracyValue = (() => {
    const parsed = Number.parseFloat(
      String(signal.accuracy ?? "").replace(/[^0-9.]/g, ""),
    );
    if (Number.isFinite(parsed)) {
      return Math.min(Math.max(parsed, 0), 100);
    }
    return null;
  })();

  const accuracyBreakdown = accuracyValue == null
    ? null
    : {
        successful: Number.parseFloat(accuracyValue.toFixed(1)),
        unsuccessful: Number.parseFloat((100 - accuracyValue).toFixed(1)),
      };

  const description =
    signal.description ??
    `${signal.name} focuses on ${(useLabelLower || signal.use).trim()} setups across ${assetsText}. It performs best on ${timeframesText} and maintains a ${(riskLabelLower || signal.riskLevel).trim()} risk profile with ${signal.users} subscribers.`;
  const methodologyText =
    signal.description ??
    `${signal.name} applies ${signal.type ? signal.type.toLowerCase() : signal.type} logic while operating with a ${(riskLabelLower || signal.riskLevel).trim()} risk profile.`;

  const specificationItems = (signal.specifications && signal.specifications.length)
    ? signal.specifications.filter(
        (item) =>
          typeof item.label === "string" &&
          item.label.trim().length > 0 &&
          typeof item.value === "string" &&
          item.value.trim().length > 0,
      )
    : (
        [
          { label: "Strategy type", value: signal.type },
          { label: "Primary use", value: signal.use },
          { label: "Risk profile", value: signal.riskLevel },
          {
            label: "Supported assets",
            value: assets.join(", "),
          },
          {
            label: "Timeframes",
            value: timeframes.join(", "),
          },
          {
            label: "Platforms",
            value: platforms.join(", "),
          },
          { label: "Subscribers", value: signal.users },
          { label: "Accuracy", value: signal.accuracy },
        ] as SpecificationItem[]
      ).filter((item) => item.value && item.value.trim().length > 0);

  const featureItems = (signal.features && signal.features.length)
    ? signal.features.filter((item) => item.trim().length > 0)
    : [
        platforms.length ? `Accessible on ${platforms.join(", ")}` : "",
        timeframes.length ? `Calibrated for ${timeframes.join(", ")}` : "",
        assets.length ? `Targets ${assets.join(", ")}` : "",
        `Risk level ${signal.riskLevel}`,
        accuracyValue != null
          ? `Historical accuracy of ${accuracyValue.toFixed(1)}%`
          : "",
      ].filter((item) => item.trim().length > 0);

  const reviews = (signal.reviews ?? []).filter(
    (review) => review.author.trim().length > 0 && review.message.trim().length > 0,
  );

  const author = signal.author ?? {
    name: "Marketplace contributor",
    avatar: signal.icon,
    bio: `${signal.name} is curated by our marketplace team.`,
  };

  const priceLabel = signal.price ?? FALLBACK_SIGNAL.price ?? "Pricing available on request";
  const productImage = signal.productImage ?? signal.chartImage ?? signal.icon;

  const heroMetrics = [
    {
      label: "Subscribers",
      value: signal.users,
      icon: Users,
    },
    {
      label: "Risk",
      value: signal.riskLevel,
      icon: ShieldCheck,
    },
    {
      label: "Accuracy",
      value: signal.accuracy,
      icon: Activity,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex items-center gap-2 text-[15px]">
          <span className="font-normal text-[#B0B0B0]">{categoryLabel}</span>
          <span className="font-bold text-[#B0B0B0]">/</span>
          <span className="font-bold text-white">{signal.name}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="inline-flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("chart")}
            className={`flex h-[26px] items-center justify-center gap-1.5 rounded-lg px-4 text-[15px] font-bold transition-colors ${
              activeTab === "chart"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C101480] text-white backdrop-blur-[50px]"
            }`}
          >
            Chart view
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("source")}
            className={`flex h-[26px] items-center justify-center gap-1.5 rounded-lg px-4 text-[15px] font-bold transition-colors ${
              activeTab === "source"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C101480] text-white backdrop-blur-[50px]"
            }`}
          >
            Methodology
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
              <div className="flex items-center justify-between">
                <h1 className="text-[31px] font-bold leading-normal text-white">
                  {signal.name}
                </h1>
                <button
                  type="button"
                  className="text-[#B0B0B0] transition-colors hover:text-white"
                  aria-label="Add to favourites"
                >
                  <Star className="h-6 w-6" />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[#181B22]">
                {currentGalleryImage ? (
                  <img
                    src={currentGalleryImage}
                    alt={`${signal.name} chart preview`}
                    className="h-auto w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center text-[15px] font-semibold text-[#B0B0B0]">
                    Visualization not provided
                  </div>
                )}

                {canNavigateGallery && (
                  <button
                    type="button"
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                    aria-label="Previous chart"
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                )}
                {canNavigateGallery && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                    aria-label="Next chart"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                )}

                {gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
                    {gallery.map((_, index) => (
                      <div
                        key={`${signal.id}-dot-${index}`}
                        className={`h-1.5 w-4 rounded-full transition-colors ${
                          index === galleryIndex
                            ? "bg-white"
                            : "bg-[#B0B0B0]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  {heroMetrics.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 rounded border border-[#181B22] bg-[#0C101480] px-3 py-1 text-xs font-bold uppercase text-white backdrop-blur-[50px]"
                    >
                      <Icon className="h-4 w-4 text-[#B0B0B0]" />
                      <span className="text-[#B0B0B0]">{label}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
                {timeframes.length > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full border border-[#181B22] bg-[#0C101480] px-3 py-1 text-xs font-bold uppercase text-white backdrop-blur-[50px]">
                    <Timer className="h-4 w-4 text-[#B0B0B0]" />
                    <span className="text-[#B0B0B0]">Timeframes:</span>
                    <span className="text-white">{timeframes.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">
                  {activeTab === "chart" ? "Performance" : "Methodology"}
                </h2>
              </div>
              <div className="p-4">
                {activeTab === "chart" ? (
                  <div className="flex flex-col gap-4">
                    {currentGalleryImage ? (
                      <img
                        src={currentGalleryImage}
                        alt={`${signal.name} performance visualization`}
                        className="h-auto w-full rounded-xl border border-[#181B22] object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-[#B0B0B0]">
                        Performance data will appear when available
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs font-bold uppercase text-[#B0B0B0]">
                      {platforms.map((platform) => (
                        <span
                          key={`${signal.id}-platform-${platform}`}
                          className="rounded bg-[#2E2744] px-2 py-1 text-white"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 text-[15px] font-normal text-white">
                    <p>{methodologyText}</p>
                    <ul className="list-disc space-y-2 pl-5 text-[#B0B0B0]">
                      {timeframes.map((frame) => (
                        <li key={`${signal.id}-frame-${frame}`}>
                          Optimized configuration for timeframe {frame}
                        </li>
                      ))}
                      {platforms.map((platform) => (
                        <li key={`${signal.id}-methodology-platform-${platform}`}>
                          Deployment available on {platform}
                        </li>
                      ))}
                      {platforms.length === 0 && (
                        <li>Platform agnostic deployment supported</li>
                      )}
                      {accuracyValue != null && (
                        <li>
                          Historical accuracy recorded at {accuracyValue.toFixed(1)}%
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
                <div className="border-b border-[#181B22] p-4">
                  <h2 className="text-[19px] font-bold text-[#A06AFF]">Accuracy</h2>
                </div>
                <div className="flex flex-col gap-4 p-4">
                  {accuracyBreakdown ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                          {accuracyBreakdown.successful.toFixed(1)}%
                        </span>
                        <span className="text-sm font-bold uppercase text-[#B0B0B0]">
                          Successful outcomes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                        <span className="rounded bg-[#A06AFF]/20 px-2 py-1 text-[#A06AFF]">
                          {accuracyBreakdown.unsuccessful.toFixed(1)}% unsuccessful
                        </span>
                        <span className="rounded bg-[#2EBD85]/20 px-2 py-1 text-[#2EBD85]">
                          {accuracyBreakdown.successful.toFixed(1)}% successful
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[15px] font-normal text-[#B0B0B0]">
                      Accuracy metrics will be displayed once data is shared by the author.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
                <div className="border-b border-[#181B22] p-4">
                  <h2 className="text-[19px] font-bold text-[#A06AFF]">Description</h2>
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-normal text-white">{description}</p>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
                <div className="border-b border-[#181B22] p-4">
                  <h2 className="text-[19px] font-bold text-[#A06AFF]">Specifications</h2>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  {specificationItems.map((item) => (
                    <div
                      key={`${signal.id}-spec-${item.label}`}
                      className="flex items-start gap-2"
                    >
                      <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#A06AFF]" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                          {item.label}
                        </span>
                        <span className="text-[15px] font-normal text-white">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-[#523A83] bg-[#0C101480] backdrop-blur-[50px]">
                <div className="border-b border-[#2E2744] p-4">
                  <h2 className="text-[19px] font-bold text-[#A06AFF]">Features</h2>
                </div>
                <div className="p-4">
                  <ul className="list-disc space-y-2 pl-5 text-[15px] font-normal text-white">
                    {featureItems.map((feature, index) => (
                      <li key={`${signal.id}-feature-${index}`}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {reviews.length ? `${reviews.length} review${reviews.length > 1 ? "s" : ""}` : "Reviews"}
                </h2>
                <button
                  type="button"
                  className="flex h-[26px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 text-xs font-bold uppercase text-white"
                >
                  Share feedback
                </button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  Be the first to share your experience with {signal.name}.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start gap-3 rounded-xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]"
                    >
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[15px] font-bold text-white">
                            {review.author}
                          </span>
                          <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                            {review.postedAt}
                          </span>
                        </div>
                        <p className="text-[15px] font-normal text-white">
                          {review.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                          <span className="rounded bg-[#2EBD85]/20 px-2 py-1 text-[#2EBD85]">
                            Helpful: {review.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 lg:w-[339px]">
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
              {productImage && (
                <img
                  src={productImage}
                  alt={`${signal.name} visual`}
                  className="h-auto w-full rounded-t-2xl border-b border-[#181B22] object-cover"
                />
              )}

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={signal.icon}
                    alt={signal.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-[19px] font-bold text-white">{signal.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                      <span className="rounded bg-[#2E2744] px-2 py-1 text-white">
                        {signal.users} subscribers
                      </span>
                      <span className="rounded bg-[#1C3430] px-2 py-1 text-[#2EBD85]">
                        Risk: {signal.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                  {assets.map((asset) => (
                    <span
                      key={`${signal.id}-sidebar-asset-${asset}`}
                      className="rounded bg-[#2E2744] px-2 py-1 text-white"
                    >
                      {asset}
                    </span>
                  ))}
                  {timeframes.map((frame) => (
                    <span
                      key={`${signal.id}-sidebar-frame-${frame}`}
                      className="rounded bg-[rgba(106,165,255,0.16)] px-2 py-1 text-[#6AA5FF]"
                    >
                      {frame}
                    </span>
                  ))}
                </div>

                <div className="rounded border border-[#181B22] bg-[#0C101480] p-3 text-xs font-bold uppercase text-[#B0B0B0]">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>{signal.accuracy} accuracy</span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-2">
                <p className="text-2xl font-bold text-white">{priceLabel}</p>
              </div>

              <div className="flex flex-col gap-3 px-4 pb-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] py-2.5 text-[15px] font-bold text-white"
                >
                  <Check className="h-4 w-4" />
                  Subscribe
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with author
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C101480] py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px]"
                >
                  <Play className="h-4 w-4" />
                  Start demo
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
              <div className="flex items-center gap-3">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-[15px] font-bold text-white">{author.name}</h3>
                  {author.communityLink && (
                    <a
                      href={author.communityLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold uppercase text-[#A06AFF] underline"
                    >
                      Visit community
                    </a>
                  )}
                </div>
              </div>
              {author.bio && (
                <p className="text-[15px] font-normal text-[#B0B0B0]">{author.bio}</p>
              )}
              {author.socials && author.socials.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                  {author.socials.map((social) => (
                    <span
                      key={`${author.name}-social-${social}`}
                      className="rounded bg-[#2E2744] px-2 py-1 text-white"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalsDetailLanding;
