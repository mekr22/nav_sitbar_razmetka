import type { FC } from "react";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  className?: string;
}

const PlaceholderCard: FC<PlaceholderCardProps> = ({ className }) => (
  <div
    className={cn(
      "rounded-2xl border border-[#181B22]/60 bg-[#0C101480] backdrop-blur-[80px] transition-colors duration-300 hover:border-purple/40",
      className,
    )}
    aria-hidden
  />
);

const MarketplaceMyProducts: FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PlaceholderCard key={`summary-${index}`} className="h-[120px]" />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PlaceholderCard className="lg:col-span-2 min-h-[320px]" />
        <PlaceholderCard className="min-h-[320px]" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PlaceholderCard className="min-h-[260px]" />
        <PlaceholderCard className="min-h-[260px]" />
      </section>

      <PlaceholderCard className="min-h-[340px]" />
    </div>
  );
};

export default MarketplaceMyProducts;
