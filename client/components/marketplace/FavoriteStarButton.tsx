import { FC } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteStarButtonProps {
  pressed: boolean;
  onToggle: () => void;
  className?: string;
}

export const FavoriteStarButton: FC<FavoriteStarButtonProps> = ({ pressed, onToggle, className }) => (
  <button
    type="button"
    aria-pressed={pressed}
    aria-label="Toggle favorite"
    onPointerDown={(event) => event.stopPropagation()}
    onPointerUp={(event) => event.stopPropagation()}
    onMouseDown={(event) => event.stopPropagation()}
    onMouseUp={(event) => event.stopPropagation()}
    onTouchStart={(event) => event.stopPropagation()}
    onTouchEnd={(event) => event.stopPropagation()}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onToggle();
    }}
    onKeyDown={(event) => event.stopPropagation()}
    className={cn(
      "relative z-10 rounded-full p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]/60",
      pressed ? "text-[#A06AFF]" : "text-[#B0B0B0]",
      className,
    )}
  >
    <Star className="h-6 w-6" strokeWidth={pressed ? 1.5 : 1.4} fill={pressed ? "#A06AFF" : "none"} />
  </button>
);

export default FavoriteStarButton;
