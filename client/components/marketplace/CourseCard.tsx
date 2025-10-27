import type { FC, KeyboardEvent } from "react";
import { BookOpen, ShoppingCart, Users } from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { Course } from "@/data/marketplaceCourses";

const actionButtonBaseClass =
  "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase text-white sm:w-auto";

const isActivationKey = (key: string) =>
  key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

type CourseCardProps = {
  course: Course;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetails?: (course: Course, meta?: { isFavorite: boolean }) => void;
  onBuy?: (course: Course) => void;
};

const CourseCard: FC<CourseCardProps> = ({
  course,
  isActive,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onBuy,
}) => (
  <div className="w-full">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onDoubleClick={() => {
        onOpenDetails?.(course, { isFavorite });
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border bg-[#0C1014]/60 p-4 backdrop-blur-[50px] transition-colors md:flex-row md:items-center md:gap-6",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="w-full overflow-hidden rounded-2xl md:w-[231px] md:self-center">
        <img
          src={course.image}
          alt={course.title}
          className="h-[133px] w-full object-cover md:h-auto"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 md:gap-3 md:justify-between">
        <div className="flex items-start gap-4 pr-6 md:pr-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">
              {course.title}
            </h3>
            <p className="text-sm font-bold text-[#B0B0B0] sm:text-[15px]">
              {course.subtitle}
            </p>
          </div>
        </div>
        <div className="absolute right-4 top-4">
          <FavoriteStarButton
            pressed={isFavorite}
            onToggle={onToggleFavorite}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="uppercase text-[#B0B0B0]">HOST:</span>
            <span className="text-sm font-bold text-white sm:text-[15px]">
              {course.host}
            </span>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                <Users className="h-4 w-4 text-[#B0B0B0]" />
                <span className="text-xs font-bold text-white">
                  {course.students}
                </span>
              </div>
              <div className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1 py-0.5">
                <span className="text-xs font-bold text-[#2EBD85]">
                  {course.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
            <span className="text-[#B0B0B0]">TOTAL:</span>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{course.duration}</span>
            </div>
            <div className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{course.lectures}</span>
            </div>
            <div className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5">
              <span className="text-[#6AA5FF]">{course.level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:self-end sm:items-center sm:gap-3 md:ml-auto">
        <button
          className={cn(
            actionButtonBaseClass,
            "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90 sm:flex-none",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onBuy?.(course);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy
        </button>
      </div>
    </div>
  </div>
);

export default CourseCard;
