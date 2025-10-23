import { useCallback, useEffect, useMemo, useState, type FC } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
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

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

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
            <CarouselPrevious
              variant="ghost"
              size="icon"
              className="left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-[#181B22] bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white shadow-[0_12px_24px_rgba(0,0,0,0.48)] transition hover:opacity-100 focus-visible:ring-[#A06AFF]"
              aria-label="Previous slide"
            />
            <CarouselNext
              variant="ghost"
              size="icon"
              className="right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-[#181B22] bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white shadow-[0_12px_24px_rgba(0,0,0,0.48)] transition hover:opacity-100 focus-visible:ring-[#A06AFF]"
              aria-label="Next slide"
            />
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
