import { useCallback, useEffect, useMemo, useState, useId, type FC } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type GalleryItem = {
  src: string;
  alt: string;
};

type StrategyGalleryCarouselProps = {
  items: GalleryItem[];
  className?: string;
};

const StrategyGalleryCarousel: FC<StrategyGalleryCarouselProps> = ({
  items,
  className,
}) => {
  const slides = useMemo(
    () => items.filter((item) => item.src.trim().length > 0),
    [items],
  );
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const rawId = useId();
  const gradientIdBase = rawId.replace(/:/g, "");
  const leftGradientId = `${gradientIdBase}-left`;
  const rightGradientId = `${gradientIdBase}-right`;

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateState = () => {
      setActiveIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateState();
    api.on("select", updateState);
    api.on("reInit", updateState);

    return () => {
      api.off("select", updateState);
      api.off("reInit", updateState);
    };
  }, [api]);

  useEffect(() => {
    if (slides.length === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= slides.length) {
      setActiveIndex(slides.length - 1);
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
    }
  }, [slides.length]);

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const handlePrevious = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  if (slides.length === 0) {
    return null;
  }

  const hasMultipleSlides = slides.length > 1;

  return (
    <div className={cn("relative", className)}>
      <Carousel
        className="w-full"
        opts={{ align: "start", loop: hasMultipleSlides }}
        setApi={setApi}
      >
        <CarouselContent className="!ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={`${slide.src}-${index}`} className="!pl-0">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#181B22] bg-[#0C1014]/60">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasMultipleSlides && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Previous slide"
              disabled={!canScrollPrev}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="11.9908" cy="11.9908" r="11.9908" fill={`url(#${leftGradientId})`} />
                <path
                  d="M13.627 8.17578L9.81171 11.991L13.627 15.8063"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id={leftGradientId}
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
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Next slide"
              disabled={!canScrollNext}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="11.9908" cy="11.9908" r="11.9908" fill={`url(#${rightGradientId})`} />
                <path
                  d="M10.373 8.17578L14.188 11.991L10.373 15.8063"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id={rightGradientId}
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
          </>
        )}
      </Carousel>
      {hasMultipleSlides && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${slide.src}-dot-${index}`}
                type="button"
                onClick={() => handleDotClick(index)}
                className={cn(
                  "h-1.5 rounded-full bg-[#2E2744] transition-all",
                  isActive ? "w-4 bg-[#A06AFF]" : "w-2 hover:bg-[#3A2A57]",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export type { GalleryItem as StrategyGalleryImage };
export default StrategyGalleryCarousel;
