import type { FC } from "react";
import { cn } from "@/lib/utils";

interface PlaceholderPanelProps {
  className?: string;
}

const PlaceholderPanel: FC<PlaceholderPanelProps> = ({ className }) => (
  <div
    className={cn(
      "w-full min-h-[180px] rounded-2xl border border-[#181B22]/60 bg-[#0C101480] backdrop-blur-[80px] transition-colors duration-300 hover:border-purple/40",
      className,
    )}
    aria-hidden
  />
);

const Stock: FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PlaceholderPanel key={`metric-${index}`} className="min-h-[120px]" />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PlaceholderPanel className="xl:col-span-2 min-h-[320px]" />
        <PlaceholderPanel className="min-h-[320px]" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PlaceholderPanel className="min-h-[260px]" />
        <PlaceholderPanel className="min-h-[260px]" />
      </section>

      <PlaceholderPanel className="min-h-[340px]" />
    </div>
  );
};

export default Stock;
