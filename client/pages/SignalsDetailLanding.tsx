import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
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

type ExtendedSignal = Signal & {
  gallery?: string[];
  reviews?: Array<{
    id: string;
    author: string;
    avatar: string;
    postedAt: string;
    message: string;
    likes: number;
  }>;
};

const resolveFallbackSignal = (): ExtendedSignal => {
  const first = baseSignals[0] as ExtendedSignal | undefined;
  if (first) {
    return first;
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
    const provided = locationState?.signal as ExtendedSignal | undefined;
    return provided ?? FALLBACK_SIGNAL;
  }, [locationState]);

  const gallery = useMemo(() => {
    const additional = Array.isArray(signal.gallery)
      ? signal.gallery.filter((src) => typeof src === "string" && src.trim().length > 0)
      : [];

    if (signal.chartImage) {
      return [
        signal.chartImage,
        ...additional.filter((src) => src !== signal.chartImage),
      ];
    }

    return additional;
  }, [signal.chartImage, signal.gallery]);

  useEffect(() => {
    setGalleryIndex(0);
  }, [signal.id, gallery.length]);

  const currentGalleryImage =
    gallery[galleryIndex] ?? signal.chartImage ?? "";
  const canNavigateGallery = gallery.length > 1;

  const reviewsCount = useMemo(() => {
    if (!Array.isArray(signal.reviews)) {
      return 0;
    }

    return signal.reviews.filter(
      (review) =>
        typeof review?.author === "string" &&
        review.author.trim().length > 0 &&
        typeof review?.message === "string" &&
        review.message.trim().length > 0,
    ).length;
  }, [signal.reviews]);

  const categoryLabel =
    locationState?.category ?? "Signals and Technical indicators";

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
        <div className="flex flex-col gap-4 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white sm:text-[31px]">
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
                Chart not available
              </div>
            )}

            {canNavigateGallery && (
              <>
                <button
                  type="button"
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </>
            )}

            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
                {gallery.map((_, index) => (
                  <div
                    key={`${signal.id}-featured-dot-${index}`}
                    className={`h-1 w-1 rounded-full transition-colors ${
                      index === galleryIndex ? "bg-white" : "bg-[#B0B0B0]"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-5 w-5 text-[#B0B0B0]" />
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Use on chart
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-5 w-5 text-[#B0B0B0]" />
                <span className="text-xs font-bold text-[#B0B0B0]">
                  {signal.users}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-5 w-5 text-[#B0B0B0]" />
                <span className="text-xs font-bold text-[#B0B0B0]">
                  {reviewsCount > 0 ? reviewsCount : "87"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-5 w-5 text-[#B0B0B0]" />
              <span className="text-xs font-bold text-[#B0B0B0]">11,299</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalsDetailLanding;
