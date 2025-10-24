import { FC, useCallback, useMemo } from "react";
import type { JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { Course } from "@/data/marketplaceCourses";
import { baseCourses } from "@/data/marketplaceCourses";

const AVATAR_PLACEHOLDER =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=160";

const renderStars = (rating: number) => {
  const stars = [] as JSX.Element[];
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i += 1) {
    const isFull = i <= Math.floor(roundedRating);
    const isHalf = !isFull && i - roundedRating === 0.5;

    if (isFull) {
      stars.push(
        <svg key={`${i}-full`} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M7.99868 12.654L3.29868 15.146L4.19868 9.76732L0.532013 6.01999L5.64868 5.27999L7.99868 0.426659L10.3487 5.27999L15.4653 6.01999L11.7987 9.76732L12.6987 15.146L7.99868 12.654Z"
            fill="#FFD166"
          />
        </svg>,
      );
      continue;
    }

    if (isHalf) {
      stars.push(
        <svg key={`${i}-half`} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8.00065 1.33301L9.96465 5.30634L14.334 5.90634L11.1673 8.99967L11.928 13.3463L8.00065 11.253L4.07398 13.3463L4.83465 8.99967L1.66798 5.90634L6.03732 5.30634L8.00065 1.33301Z"
            stroke="#FFD166"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 1.33301V11.253"
            stroke="#FFD166"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>,
      );
      continue;
    }

    stars.push(
      <svg key={`${i}-empty`} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8.00065 1.33301L9.96465 5.30634L14.334 5.90634L11.1673 8.99967L11.928 13.3463L8.00065 11.253L4.07398 13.3463L4.83465 8.99967L1.66798 5.90634L6.03732 5.30634L8.00065 1.33301Z"
          stroke="#B0B0B0"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    );
  }

  return stars;
};

const toTitleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const AddProductLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    course?: Course;
    category?: string;
  } | null;

  const course = useMemo<Course>(() => {
    if (locationState?.course) {
      return locationState.course;
    }
    return baseCourses[0];
  }, [locationState]);

  const categoryLabel = useMemo(
    () => locationState?.category ?? "Courses and Training materials",
    [locationState?.category],
  );

  const formatLabel = useMemo(() => toTitleCase(course.format), [course.format]);
  const focusLabel = useMemo(() => toTitleCase(course.focusArea), [course.focusArea]);

  const handleNavigateBack = useCallback(() => {
    navigate("/marketplace/courses", {
      state: {
        scrollToTop: true,
        category: "Courses and Training materials",
      },
    });
  }, [navigate]);

  return (
    <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={handleNavigateBack}
          className="rounded-full text-[15px] font-normal text-[#B0B0B0] hover:text-white"
        >
          {categoryLabel}
        </button>
        <span className="text-[15px] font-bold text-[#808283]">/</span>
        <span className="text-[15px] font-bold text-white">{course.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_339px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px]">
            <div className="relative w-full">
              <img
                src={course.image}
                alt={`${course.title} preview`}
                className="w-full rounded-lg"
              />
              <button
                type="button"
                aria-label="Previous screenshot"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11.9908" cy="11.9908" r="11.9908" fill="url(#course_prev)" />
                  <path
                    d="M13.627 8.17578L9.81171 11.991L13.627 15.8063"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="course_prev"
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
                aria-label="Next screenshot"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11.9908" cy="11.9908" r="11.9908" fill="url(#course_next)" />
                  <path
                    d="M10.373 8.17578L14.188 11.991L10.373 15.8063"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="course_next"
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
                <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.20)] p-4 backdrop-blur-[50px]" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="h-[332px] w-full rounded-t-3xl border border-[#181B22] object-cover"
              />
              <button
                type="button"
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-l from-[#482090] to-[#A06AFF] shadow-[0_12px_24px_0_rgba(0,0,0,0.48)]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12.0004V8.44038C4 4.02038 7.13 2.21039 10.96 4.42039L14.05 6.20039L17.14 7.98039C20.97 10.1904 20.97 13.8104 17.14 16.0204L14.05 17.8004L10.96 19.5804C7.13 21.7904 4 19.9804 4 15.5604V12.0004Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-white">$39.99</div>
                <div className="flex items-center gap-2">
                  <div className="text-[15px] font-medium text-[#B0B0B0] line-through">$39.99</div>
                  <span className="rounded bg-[#1C3430] px-2 py-0.5 text-xs font-bold uppercase text-[#2EBD85]">
                    34% OFF
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  4.5H
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  17 LECTURES
                </span>
                <span className="rounded bg-[rgba(106,165,255,0.16)] px-2 py-0.5 text-xs font-bold uppercase text-[#6AA5FF]">
                  ALL LEVELS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clipPath="url(#clip0_1111_20909)">
                    <path
                      d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z"
                      stroke="#A06AFF"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 5.33301V7.99967L9.33333 9.33301"
                      stroke="#A06AFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1111_20909">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-[15px] text-[#A06AFF]">
                  Limited time offer: <span className="font-bold">2 days left</span>
                </span>
              </div>
              <div className="text-[15px] text-[#B0B0B0]">{course.subtitle}</div>
            </div>
            <div className="flex flex-col gap-2 px-4 pb-2">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Expert level content</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">For experienced users</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Full lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Certificate of completion</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Access on mobile and TV</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">{renderStars(4.1)}</div>
                <span className="text-[15px] text-[#B0B0B0]">4.1 (311 reviews)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 px-4 pb-4">
              <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">COURSES</span>
              <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">TRADING_MATERIALS</span>
              <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">CRYPTOCURRENCY</span>
              <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">P2P_TRADING</span>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <button className="flex h-[46px] items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[#482090] to-[#A06AFF] text-[15px] font-bold text-white">
                Buy
              </button>
              <button className="flex h-[46px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                Chat
              </button>
              <button className="flex h-[46px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                Live Preview
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <img src={AVATAR_PLACEHOLDER} alt={course.host} className="h-20 w-20 rounded-full" />
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-white">{course.host}</div>
                  <div className="text-sm font-semibold text-[#B0B0B0]">
                    {focusLabel} specialist • {formatLabel} format
                  </div>
                  <button className="mt-2 flex h-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-3 text-xs font-bold text-white">
                    Follow
                  </button>
                </div>
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Students gain lifetime access to annotated slides, case study replays, and a private forum moderated weekly by {course.host}.
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Weekly AMA sessions keep the cohort aligned with {course.host}'s market outlook and provide direct feedback on submitted trade plans.
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[15px] font-normal text-[#B0B0B0]">Also on:</span>
                <div className="flex gap-2 text-white">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12.2169 1.26953H14.4659L9.55249 6.88519L15.3327 14.5268H10.8068L7.26204 9.89222L3.20598 14.5268H0.955637L6.21097 8.52026L0.666016 1.26953H5.30675L8.51095 5.50575L12.2169 1.26953ZM11.4276 13.1807H12.6737L4.62961 2.54495H3.29232L11.4276 13.1807Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M15.8406 4.8002C15.8406 4.8002 15.6844 3.69707 15.2031 3.2127C14.5938 2.5752 13.9125 2.57207 13.6 2.53457C11.3625 2.37207 8.00313 2.37207 8.00313 2.37207H7.99687C7.99687 2.37207 4.6375 2.37207 2.4 2.53457C2.0875 2.57207 1.40625 2.5752 0.796875 3.2127C0.315625 3.69707 0.1625 4.8002 0.1625 4.8002C0.1625 4.8002 0 6.09707 0 7.39082V8.60332C0 9.89707 0.159375 11.1939 0.159375 11.1939C0.159375 11.1939 0.315625 12.2971 0.79375 12.7814C1.40313 13.4189 2.20313 13.3971 2.55938 13.4658C3.84063 13.5877 8 13.6252 8 13.6252C8 13.6252 11.3625 13.6189 13.6 13.4596C13.9125 13.4221 14.5938 13.4189 15.2031 12.7814C15.6844 12.2971 15.8406 11.1939 15.8406 11.1939C15.8406 11.1939 16 9.90019 16 8.60332V7.39082C16 6.09707 15.8406 4.8002 15.8406 4.8002ZM6.34688 10.0752V5.57832L10.6687 7.83457L6.34688 10.0752Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1.44062C10.1375 1.44062 10.3906 1.45 11.2313 1.4875C12.0125 1.52187 12.4344 1.65313 12.7156 1.7625C13.0875 1.90625 13.3563 2.08125 13.6344 2.35938C13.9156 2.64063 14.0875 2.90625 14.2313 3.27813C14.3406 3.55938 14.4719 3.98437 14.5063 4.7625C14.5438 5.60625 14.5531 5.85938 14.5531 7.99375C14.5531 10.1313 14.5438 10.3844 14.5063 11.225C14.4719 12.0063 14.3406 12.4281 14.2313 12.7094C14.0875 13.0813 13.9125 13.35 13.6344 13.6281C13.3531 13.9094 13.0875 14.0813 12.7156 14.225C12.4344 14.3344 12.0094 14.4656 11.2313 14.5C10.3875 14.5375 10.1344 14.5469 8 14.5469C5.8625 14.5469 5.60938 14.5375 4.76875 14.5C3.9875 14.4656 3.56563 14.3344 3.28438 14.225C2.9125 14.0813 2.64375 13.9063 2.36563 13.6281C2.08438 13.3469 1.9125 13.0813 1.76875 12.7094C1.65938 12.4281 1.52813 12.0031 1.49375 11.225C1.45625 10.3813 1.44688 10.1281 1.44688 7.99375C1.44688 5.85625 1.45625 5.60312 1.49375 4.7625C1.52813 3.98125 1.65938 3.55938 1.76875 3.27813C1.9125 2.90625 2.0875 2.6375 2.36563 2.35938C2.64688 2.07813 2.9125 1.90625 3.28438 1.7625C3.56563 1.65313 3.99063 1.52187 4.76875 1.4875C5.60938 1.45 5.8625 1.44062 8 1.44062Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductLanding;
