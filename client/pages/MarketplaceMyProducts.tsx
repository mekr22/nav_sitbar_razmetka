import type { FC } from "react";
import { KeyboardEvent, useCallback, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ChevronRight,
  Package,
  Plus,
  X,
  BookOpen,
  Mail,
  Check,
  ShoppingCart,
  Users,
  FileEdit,
  MapPin,
  Globe,
  Star,
} from "lucide-react";
import { cn, maskNonWhitespace } from "@/lib/utils";
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import SignalCard, { Signal } from "@/components/marketplace/SignalCard";
import StrategyCard from "@/components/marketplace/StrategyCard";
import TradingRobotCard from "@/components/marketplace/TradingRobotCard";
import TraderCard from "@/components/marketplace/TraderCard";
import AnalystCard from "@/components/marketplace/AnalystCard";
import InvestmentConsultantCard from "@/components/marketplace/InvestmentConsultantCard";
import { baseSignals } from "@/data/marketplaceSignals";
import { baseStrategies, Strategy } from "@/data/marketplaceStrategies";
import {
  baseTradingRobots,
  TradingRobot,
  RISK_MASTER_ICON,
} from "@/data/marketplaceTradingRobots";
import {
  baseInvestmentConsultants,
  InvestmentConsultant,
} from "@/data/marketplaceInvestmentConsultants";
import { baseAnalysts, Analyst } from "@/data/marketplaceAnalysts";
import { baseTraders, Trader } from "@/data/marketplaceTraders";
import {
  baseScriptProducts,
  ScriptProduct,
} from "@/data/marketplaceScriptsSoftware";
import {
  baseCourses,
  Course as MarketplaceCourse,
} from "@/data/marketplaceCourses";
import {
  marketplaceCategories,
  MarketplaceCategory,
} from "@/data/marketplaceCategories";

const actionButtonBaseClass =
  "flex w-full flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase text-white sm:w-auto";

const isActivationKey = (key: string) =>
  key === "Enter" || key === " " || key === "Space" || key === "Spacebar";

const buildCardKey = (section: string, id: string) => `${section}:${id}`;

type FaqItem = {
  id: string;
  question: string;
  description?: string;
  bullets?: string[];
};

const faqs: FaqItem[] = [
  {
    id: "partner",
    question: "How can I become a partner?",
    description:
      "Apply with your verified trading account. We review requests within two business days and share onboarding steps.",
    bullets: [
      "Submit the partner form",
      "Confirm contact and payout info",
      "Receive the onboarding kit",
    ],
  },
  {
    id: "percentage",
    question: "What percentage will I receive for each referred client?",
    description:
      "Commission tiers scale with the activity of your referred clients and are recalculated every month.",
    bullets: [
      "Base tier starts at 20% of platform fees",
      "Refer 10 active clients monthly to unlock 30%",
      "Maintain top retention to reach the 40% premium tier",
    ],
  },
  {
    id: "payouts",
    question: "How often are payouts made?",
    description:
      "Affiliate rewards are processed automatically every Monday, with status tracking inside your dashboard.",
    bullets: [
      "Weekly transfers available in USD or USDT",
      "Minimum withdrawal amount is $50",
      "Payment history stored in your dashboard",
    ],
  },
  {
    id: "tools",
    question: "What tools are provided for partners?",
    description:
      "After registration you'll access a dashboard with everything needed to promote Tyrian Trade efficiently.",
    bullets: [
      "Monitor client stats and analytics",
      "Use ready-made promotional materials",
      "Share your unique referral link",
    ],
  },
];

const traders: Trader[] = baseTraders;

const analysts: Analyst[] = baseAnalysts;

const investmentConsultants: InvestmentConsultant[] =
  baseInvestmentConsultants.slice(0, 2);

const signals: Signal[] = baseSignals;
const strategies: Strategy[] = baseStrategies.slice(0, 2);
const tradingRobots: TradingRobot[] = baseTradingRobots;

const courses: MarketplaceCourse[] = baseCourses.slice(0, 3);

const CourseCard: FC<{
  course: MarketplaceCourse;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetails: (course: MarketplaceCourse, meta?: { isFavorite: boolean }) => void;
}> = ({
  course,
  isActive,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
}) => (
  <div className="w-full">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onDoubleClick={() => {
        onOpenDetails(course, { isFavorite });
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
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        className="h-[133px] w-full rounded-lg object-cover md:h-auto md:w-[231px] md:self-center"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 md:gap-3 md:justify-between">
        {/* Title */}
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

        {/* Host and Details */}
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

      {/* Buttons */}
      <div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:self-end sm:items-center sm:gap-3 md:ml-auto">
        <button
          type="button"
          className={cn(
            actionButtonBaseClass,
            "border border-[#181B22] bg-[#141821] transition-colors hover:border-[#1F2230]",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetails(course, { isFavorite });
          }}
        >
          <BookOpen className="h-4 w-4" />
          DETAILS
        </button>
        <button
          type="button"
          className={cn(
            actionButtonBaseClass,
            "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90",
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          BUY
        </button>
      </div>
    </div>
  </div>
);

const InvestmentConsultantCard: FC<{
  consultant: InvestmentConsultant;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({ consultant, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#0C1014]/50 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      {/* Decorative ribbon background */}
      <div className="absolute inset-x-0 top-0 h-48 overflow-hidden rounded-t-2xl">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f720613dd9fcaf1c3d357a5aaed12b083a2c1931?width=682"
          alt=""
          className="h-full w-full object-cover opacity-20 mix-blend-lighten"
        />
      </div>

      <div className="relative p-4">
        <div className="absolute right-4 top-4">
          <FavoriteStarButton
            pressed={isFavorite}
            onToggle={onToggleFavorite}
          />
        </div>
        {/* Avatar and Header */}
        <div className="mb-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-xl shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)]">
              <img
                src={consultant.avatar}
                alt={consultant.name}
                className="block h-full w-full object-cover object-center [transform:scale(1.2)]"
              />
            </div>
            <div className="flex h-24 flex-col justify-center gap-1">
              <div className="flex items-center gap-1">
                <h3 className="text-lg font-bold leading-none text-white sm:text-[19px]">
                  {consultant.name}, {consultant.credentials}
                </h3>
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.59517 1.74435C9.85534 1.64072 10.1445 1.64072 10.4047 1.74435C11.2433 2.07834 11.4072 3.36449 12.3968 3.43609C13.0936 3.48651 13.7774 2.9056 14.4767 3.07974C14.7587 3.14998 15.0023 3.32978 15.1549 3.58043C15.6226 4.34849 15.019 5.47739 15.7818 6.11469C16.3118 6.55727 17.1875 6.49999 17.6483 7.04254C17.8423 7.27108 17.9376 7.56915 17.9127 7.86971C17.8389 8.76379 16.699 9.32296 16.9495 10.2865C17.1228 10.9535 17.8543 11.4225 17.9127 12.1302C17.9376 12.4308 17.8423 12.7289 17.6483 12.9574C17.0693 13.639 15.8173 13.4145 15.4563 14.3385C15.2028 14.987 15.5283 15.8064 15.1549 16.4195C15.0023 16.6701 14.7587 16.85 14.4767 16.9202C13.6084 17.1364 12.7272 16.2037 11.8917 16.7298C11.2952 17.1053 11.0814 17.9862 10.4047 18.2555C10.1445 18.3592 9.85534 18.3592 9.59517 18.2555C8.91842 17.9862 8.70467 17.1053 8.10816 16.7298C7.28301 16.2103 6.37669 17.1327 5.52318 16.9202C5.24114 16.85 4.99759 16.6701 4.84496 16.4195C4.3773 15.6515 4.98079 14.5225 4.218 13.8852C3.6881 13.4426 2.81237 13.5 2.35162 12.9574C2.15759 12.7289 2.06229 12.4308 2.08713 12.1302C2.14563 11.4225 2.87692 10.9535 3.05034 10.2865C3.29832 9.33304 2.15995 8.75071 2.08713 7.86971C2.06229 7.56915 2.15759 7.27108 2.35162 7.04254C2.93055 6.36066 4.18241 6.5854 4.54357 5.66148C4.7971 5.01296 4.47165 4.19352 4.84496 3.58043C4.99759 3.32978 5.24114 3.14998 5.52318 3.07974C6.22246 2.9056 6.90623 3.48652 7.60307 3.43609C8.59267 3.36451 8.7565 2.07834 9.59517 1.74435Z"
                    fill="#A06AFF"
                  />
                  <path
                    d="M7.5 11.1111C7.5 11.1111 8.22917 11.1111 8.95833 12.5C8.95833 12.5 11.2745 9.02779 13.3333 8.33337"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#B0B0B0]">
                {consultant.company}
              </div>
            </div>
          </div>
        </div>

        {/* Location and Nationwide */}
        <div className="mb-3 flex items-center gap-4 text-xs font-bold text-white">
          <div className="flex items-center gap-0.5">
            <MapPin className="h-3 w-3" />
            <span>{consultant.location}</span>
          </div>
          {consultant.nationwide && (
            <div className="flex items-center gap-0.5">
              <Globe className="h-3 w-3" />
              <span>Nationwide</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">
          {consultant.description}
        </p>

        {/* Clients and Risk Level */}
        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className="text-[#B0B0B0]">Number of Clients</span>
            <span className="text-white">{consultant.clients}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className="text-[#B0B0B0]">Risk Level</span>
            <span className="text-white">{consultant.riskLevel}</span>
          </div>
        </div>

        {/* Contact Button */}
        <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 py-2.5 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
          <Mail className="h-4 w-4" />
          CONTACT
        </button>

        {/* Divider */}
        <div className="mb-2 h-px w-full bg-[#181B22]" />

        {/* AUM */}
        <div className="mb-2 flex items-center gap-0.5 text-sm font-bold sm:text-[15px]">
          <span className="text-white">Assets Under Management (AUM)</span>
          <span className="text-[#16C784]">{consultant.aum}</span>
        </div>

        {/* Divider */}
        <div className="mb-2 h-px w-full bg-[#181B22]" />

        {/* Portfolio Return */}
        <div className="flex items-center gap-2 text-sm font-bold sm:text-[15px]">
          <span className="text-white">Average Portfolio Return</span>
          <div className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 py-0.5">
            <span className="text-xs font-bold uppercase text-[#2EBD85]">
              {consultant.portfolioReturn}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SignalCardLegacy: FC<{
  signal: Signal;
  isActive: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({ signal, isActive, onSelect, isFavorite, onToggleFavorite }) => (
  <div className="mx-auto w-full max-w-[525px]">
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onSelect}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isActivationKey(event.key)) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-[#0C1014]/50 p-4 backdrop-blur-[50px] transition-colors",
        isActive ? "border-[#A06AFF]" : "border-[#181B22]",
      )}
    >
      <div className="absolute right-4 top-4">
        <FavoriteStarButton pressed={isFavorite} onToggle={onToggleFavorite} />
      </div>
      {/* Header with icon, name, users, risk */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <img
            src={signal.icon}
            alt={signal.name}
            className="h-16 w-16 rounded-lg"
          />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg font-bold text-white sm:text-[19px]">
              {signal.name}
            </h3>
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
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#181B22]" />

      {/* Platforms and Details */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {signal.platforms.map((platform, idx) => (
            <img
              key={idx}
              src={platformLogos[idx % platformLogos.length]}
              alt={platform}
              className="h-8 w-8 rounded-full object-cover"
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Assets:</span>
          {signal.assets.map((asset, idx) => (
            <div key={idx} className="rounded bg-[#2E2744] px-1 py-0.5">
              <span className="text-white">{asset}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Type:</span>
          <div className="rounded bg-[#2E2744] px-1 py-0.5">
            <span className="text-white">{signal.type}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Timeframe:</span>
          {signal.timeframes.map((tf, idx) => (
            <div
              key={idx}
              className="rounded bg-[rgba(106,165,255,0.16)] px-2 py-0.5"
            >
              <span className="text-[#6AA5FF]">{tf}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
          <span className="text-[#B0B0B0]">Use:</span>
          <div className="rounded bg-[#2E2744] px-1 py-0.5">
            <span className="text-white">{signal.use}</span>
          </div>
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center gap-1 text-xs font-bold uppercase">
        <span className="text-[#B0B0B0]">Product Accuracy:</span>
        <span className="text-[15px] text-[#2EBD85]">{signal.accuracy}</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-5 py-2 text-xs font-bold uppercase text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
          onClick={(event) => {
            event.stopPropagation();
            if (featuredScriptProduct) {
              openScriptDetails(featuredScriptProduct, {
                isFavorite: scriptsFavorited,
              });
            }
          }}
        >
          <BookOpen className="h-4 w-4" />
          Learn More
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-5 py-2 text-xs font-bold uppercase text-white transition-opacity hover:opacity-90">
          <ShoppingCart className="h-4 w-4" />
          Buy
        </button>
      </div>
    </div>
  </div>
);

const MarketplaceMyProducts: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] =
    useState<MarketplaceCategory>("All");
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [favoriteCardKeys, setFavoriteCardKeys] = useState<Set<string>>(
    new Set(),
  );
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const balanceValue = "$1,000,000,000.00";
  const maskedBalanceValue = maskNonWhitespace(balanceValue);

  useEffect(() => {
    const state = location.state as { category?: MarketplaceCategory } | null;
    if (state?.category && marketplaceCategories.includes(state.category)) {
      setSelectedCategory(state.category);
    }
  }, [location.state]);

  const toggleFavorite = (key: string) => {
    setFavoriteCardKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isFavorite = (key: string) => favoriteCardKeys.has(key);

  const handleCategoryClick = (category: MarketplaceCategory) => {
    setSelectedCategory(category);
    if (category === "Popular") {
      navigate("/marketplace/popular", { state: { category } });
      return;
    }
    if (category === "Favourites") {
      navigate("/marketplace/favourites", { state: { category } });
      return;
    }
    if (category === "Signals and Technical indicators") {
      navigate("/marketplace/signals", { state: { category } });
      return;
    }
    if (category === "Strategies and Portfolios") {
      navigate("/marketplace/strategies", { state: { category } });
      return;
    }
    if (category === "Trading robots and Algorithms") {
      navigate("/marketplace/trading-robots", { state: { category } });
      return;
    }
    if (category === "Investment consultants") {
      navigate("/marketplace/investment-consultants", { state: { category } });
      return;
    }
    if (category === "Analysts") {
      navigate("/marketplace/analysts", { state: { category } });
      return;
    }
    if (category === "Traders") {
      navigate("/marketplace/traders", { state: { category } });
      return;
    }
    if (category === "Courses and Training materials") {
      navigate("/marketplace/courses", { state: { category } });
      return;
    }
    if (category === "Scripts and Software") {
      navigate("/marketplace/scripts", { state: { category } });
      return;
    }
    if (category === "Others") {
      navigate("/marketplace/others", { state: { category } });
      return;
    }
  };

  const scriptsCardKey = buildCardKey("scripts", "main");
  const otherCardKey = buildCardKey("other", "main");

  const scriptsFavorited = isFavorite(scriptsCardKey);
  const otherFavorited = isFavorite(otherCardKey);

  const featuredScriptProduct = baseScriptProducts[0];

const openCourseDetails = useCallback(
  (selectedCourse: MarketplaceCourse, meta?: { isFavorite: boolean }) => {
    navigate("/marketplace/course-details", {
      state: {
        scrollToTop: true,
        category: "Courses and Training materials" as MarketplaceCategory,
        course: selectedCourse,
        isFavorite: Boolean(meta?.isFavorite),
      },
    });
  },
  [navigate],
);

const openScriptDetails = useCallback(
  (product: ScriptProduct, meta?: { isFavorite: boolean }) => {
    navigate("/marketplace/script-details", {
      state: {
        scrollToTop: true,
        category: "Scripts and Software" as MarketplaceCategory,
        product,
        isFavorite: Boolean(meta?.isFavorite),
      },
    });
  },
  [navigate],
);

const openSignalDetails = useCallback(
    (selectedSignal: Signal, meta?: { isFavorite: boolean }) => {
      navigate("/marketplace/signals-details", {
        state: {
          scrollToTop: true,
          category: "Signals and Technical indicators",
          signal: selectedSignal,
          isFavorite: Boolean(meta?.isFavorite),
        },
      });
    },
    [navigate],
  );

  const openInvestmentConsultantDetails = useCallback(
    (consultant: InvestmentConsultant, meta?: { isFavorite: boolean }) => {
      navigate("/marketplace/investment-consultant-details", {
        state: {
          scrollToTop: true,
          category: "Investment consultants",
          consultant,
          isFavorite: Boolean(meta?.isFavorite),
        },
      });
    },
    [navigate],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto w-full max-w-[880px] px-3 sm:px-4 xl:min-w-[880px]">
        <div className="flex flex-col gap-6 border-b border-[#181B22] pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-[56px] md:leading-[100%]">
                Marketplace
              </h1>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Total Balance</span>
                  <button
                    type="button"
                    onClick={() => setIsBalanceVisible((prev) => !prev)}
                    aria-label={
                      isBalanceVisible
                        ? "Hide total balance"
                        : "Show total balance"
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#808283] transition-colors hover:border-[#1F2230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  >
                    {isBalanceVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="text-xl font-bold text-white sm:text-2xl">
                  {isBalanceVisible ? balanceValue : maskedBalanceValue}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
                  <span>Today's PnL</span>
                  <div className="flex items-center gap-0.5 rounded bg-[#2EBD85]/16 px-1 py-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#2EBD85] sm:text-xs">
                      + $0.00
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:h-[32px] sm:px-8 sm:text-[15px]"
                >
                  <Package className="h-4 w-4" />
                  <span>My Products</span>
                </button>

                <button
                  type="button"
                  className="flex h-9 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:h-[32px] sm:px-8 sm:text-[15px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="flex h-[170px] w-full items-center justify-center rounded-xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px] sm:h-[194px] lg:w-[260px] xl:w-[280px]">
              <span className="text-lg font-bold text-[#808283] sm:text-2xl">
                Advertising Banner
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {marketplaceCategories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "flex h-8 items-center justify-center rounded-full px-3 text-xs font-bold text-white backdrop-blur-[58px] transition-colors sm:gap-2 sm:text-sm md:px-4 md:text-[15px]",
                    isSelected
                      ? "bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                      : "border border-[#181B22] bg-[#0C101480] hover:border-[#1F2230]",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Traders Section */}
        <section className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Traders
            </h2>
            <Link
              to="/marketplace/traders"
              state={{ scrollToTop: true, category: "Traders" }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {traders.map((trader) => {
              const cardKey = buildCardKey("trader", trader.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <TraderCard
                  key={trader.id}
                  trader={trader}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </section>

        {/* Analysts Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Analysts
            </h2>
            <Link
              to="/marketplace/analysts"
              state={{ scrollToTop: true, category: "Analysts" }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {analysts.map((analyst) => {
              const cardKey = buildCardKey("analyst", analyst.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <AnalystCard
                  key={analyst.id}
                  analyst={analyst}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Investment Consultants Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Investment consultants
            </h2>
            <Link
              to="/marketplace/investment-consultants"
              state={{ scrollToTop: true, category: "Investment consultants" }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {investmentConsultants.map((consultant) => {
              const cardKey = buildCardKey("consultant", consultant.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <InvestmentConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => {
                    setActiveCardKey(cardKey);
                    openInvestmentConsultantDetails(consultant, {
                      isFavorite: isFavorited,
                    });
                  }}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Signals and Technical Indicators Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Signals and Technical indicators
            </h2>
            <Link
              to="/marketplace/signals"
              state={{ scrollToTop: true }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {signals.map((signal) => {
              const cardKey = buildCardKey("signal", signal.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                  onOpenDetails={openSignalDetails}
                />
              );
            })}
          </div>
        </div>

        {/* Strategies and Portfolios Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Strategies and Portfolios
            </h2>
            <Link
              to="/marketplace/strategies"
              state={{ scrollToTop: true }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {strategies.map((strategy) => {
              const cardKey = buildCardKey("strategy", strategy.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Courses and Training materials Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Courses and Training materials
            </h2>
            <Link
              to="/marketplace/courses"
              state={{
                scrollToTop: true,
                category: "Courses and Training materials",
              }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {courses.map((course) => {
              const cardKey = buildCardKey("course", course.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => setActiveCardKey(cardKey)}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                  onOpenDetails={openCourseDetails}
                />
              );
            })}
          </div>
        </div>

        {/* Scripts and Software Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Scripts and Software
            </h2>
            <Link
              to="/marketplace/scripts"
              state={{ scrollToTop: true, category: "Scripts and Software" }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeCardKey === scriptsCardKey}
            onClick={() => setActiveCardKey(scriptsCardKey)}
            onDoubleClick={() => {
              if (featuredScriptProduct) {
                openScriptDetails(featuredScriptProduct, {
                  isFavorite: scriptsFavorited,
                });
              }
            }}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (isActivationKey(event.key)) {
                event.preventDefault();
                setActiveCardKey(scriptsCardKey);
              }
            }}
            className={cn(
              "relative cursor-pointer rounded-2xl border bg-[#0C101480] p-6 backdrop-blur-[50px] transition-colors",
              activeCardKey === scriptsCardKey
                ? "border-[#A06AFF]"
                : "border-[#181B22]",
            )}
          >
            <div className="absolute right-4 top-4 flex items-center gap-4 text-xs font-bold uppercase text-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4 text-[#FFA800]" />
                  <span className="text-[#FFA800]">1.5K</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-[#FFA800]" />
                  <span className="text-[#FFA800]">563</span>
                </div>
              </div>
              <FavoriteStarButton
                pressed={scriptsFavorited}
                onToggle={() => toggleFavorite(scriptsCardKey)}
              />
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              {/* Left side - Image and Type Details */}
              <div className="flex w-full flex-col gap-4 lg:w-80">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/7825b04c53855449a418b331c5ca1f44ac396b69?width=640"
                  alt="RiskMaster - Trading risk calculation script"
                  className="h-80 w-full rounded-lg object-cover"
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-bold uppercase text-[#B0B0B0] sm:flex sm:flex-nowrap sm:items-center sm:gap-6">
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="whitespace-nowrap">Type:</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">
                        SCRIPT
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="whitespace-nowrap">Industry</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="inline-flex rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5 text-[#6AA5FF] whitespace-nowrap">
                        TRADING AND FINANCE
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="whitespace-nowrap">Revenue</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="inline-flex rounded bg-[#2E2744] px-1 py-0.5 text-white whitespace-nowrap">
                        USD $15,000/MONTH
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="relative flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-4 border-b border-[#181B22] pb-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                      <div className="h-20 w-20 overflow-hidden rounded-lg">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F4a0f255d9e9940ecaf46e40918c30f1f?format=webp&width=800"
                          alt="Sarah Lee"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-bold text-white sm:text-[19px]">
                          Sarah Lee
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold text-white">
                            <Users className="h-4 w-4 text-[#B0B0B0]" />
                            1,748
                          </span>
                          <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">
                            Windows/Mac
                          </span>
                          <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">
                            Top Seller
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product details */}
                <div className="flex-1">
                  <h4 className="mb-2 text-lg font-bold text-white sm:text-[19px]">
                    RiskMaster - Trading risk calculation script
                  </h4>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-[rgba(160,106,255,0.16)] px-2 py-0.5 text-xs font-extrabold uppercase text-[#A06AFF]">
                      Verified Listing
                    </span>
                    <span className="text-xs font-bold uppercase text-white">
                      🌍 Australia
                    </span>
                  </div>
                  <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">
                    RiskMaster – powerful tool for traders, automatically
                    calculates trade risks. Optimize trading and minimize
                    losses!
                  </p>

                  <div className="mb-4 space-y-2 text-xs font-bold">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="uppercase text-[#B0B0B0]">
                        Compatibility:
                      </span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                        MetaTrader 4
                      </span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                        MetaTrader 5
                      </span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                        TradingView
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="uppercase text-[#B0B0B0]">
                        Requirements:
                      </span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                        Python 3.8+
                      </span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                        numpy
                      </span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                        pandas
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-[#FFA800] text-[#FFA800]"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white sm:text-[15px]">
                        5/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons at bottom */}
                <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
                  <button
                    className={cn(
                      actionButtonBaseClass,
                      "border border-[#181B22] bg-[#0C1014]/60 backdrop-blur-[50px] transition-colors hover:border-[#1F2230]",
                    )}
                  >
                    <BookOpen className="h-4 w-4" />
                    Details
                  </button>
                  <button
                    className={cn(
                      actionButtonBaseClass,
                      "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90",
                    )}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Robots Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Trading robots and Algorithms
            </h2>
            <Link
              to="/marketplace/trading-robots"
              state={{ scrollToTop: true }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {tradingRobots.slice(0, 2).map((robot) => {
              const adjustedRobot = { ...robot, icon: RISK_MASTER_ICON };
              const cardKey = buildCardKey("trading-robot", adjustedRobot.id);
              const isFavorited = isFavorite(cardKey);
              return (
                <TradingRobotCard
                  key={adjustedRobot.id}
                  robot={adjustedRobot}
                  isActive={activeCardKey === cardKey}
                  onSelect={() => {
                    setActiveCardKey(cardKey);
                    navigate("/marketplace/trading-robot-details", {
                      state: {
                        robot: adjustedRobot,
                        isFavorite: isFavorited,
                        scrollToTop: true,
                      },
                    });
                  }}
                  isFavorite={isFavorited}
                  onToggleFavorite={() => toggleFavorite(cardKey)}
                />
              );
            })}
          </div>
        </div>

        {/* Other Section */}
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white sm:text-[31px]">
              Other
            </h2>
            <Link
              to="/marketplace/others"
              state={{ scrollToTop: true, category: "Others" }}
              className="text-sm font-bold text-[#A06AFF] underline hover:opacity-80 sm:text-[15px]"
            >
              See all
            </Link>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-pressed={activeCardKey === otherCardKey}
            onClick={() => setActiveCardKey(otherCardKey)}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (isActivationKey(event.key)) {
                event.preventDefault();
                setActiveCardKey(otherCardKey);
              }
            }}
            className={cn(
              "relative w-full cursor-pointer rounded-2xl border bg-[#0C101480] p-4 backdrop-blur-[50px] transition-colors max-[640px]:p-6",
              activeCardKey === otherCardKey
                ? "border-[#A06AFF]"
                : "border-[#181B22]",
            )}
          >
            <div className="absolute right-4 top-4">
              <FavoriteStarButton
                pressed={otherFavorited}
                onToggle={() => toggleFavorite(otherCardKey)}
              />
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative h-[264px] w-full overflow-hidden rounded-lg lg:w-[451px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902"
                  alt="Product"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 left-1 rounded bg-[#2E2744] px-1 text-xs font-bold uppercase text-white">
                  Windows/MAC
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col items-start gap-3 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-4 sm:flex-row sm:items-center">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128"
                    alt="Author"
                    className="h-16 w-16 rounded-lg object-cover max-[640px]:h-20 max-[640px]:w-20"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white sm:text-[19px]">
                      Product Name
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1 py-0.5 text-xs font-bold text-[#2EBD85]">
                        4.8
                      </span>
                      <span className="flex items-center gap-1 rounded bg-[#2E2744] px-1 text-xs font-bold text-white">
                        <Users className="h-4 w-4 text-[#B0B0B0]" />
                        1,748
                      </span>
                      <span className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]">
                        Individual Analyst
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#181B22]" />

                <div>
                  <h4 className="mb-3 text-lg font-bold text-white sm:text-[19px]">
                    Auto Script - Automation script
                  </h4>
                  <p className="mb-4 text-sm font-medium text-white sm:text-[15px]">
                    RiskMaster – powerful tool for traders, automatically
                    calculates trade risks. Optimize trading and minimize
                    losses!
                  </p>

                  <div className="mb-4 flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">Type:</span>
                      <span className="rounded bg-[#2E2744] px-1 uppercase text-white">
                        Script
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[#B0B0B0]">
                        Industry:
                      </span>
                      <span className="rounded bg-[rgba(106,165,255,0.16)] px-1 uppercase text-[#6AA5FF]">
                        Automation
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:self-end sm:items-center sm:gap-3">
                    <button
                      className={cn(
                        actionButtonBaseClass,
                        "border border-[#181B22] bg-[#141821] transition-colors hover:border-[#1F2230]",
                      )}
                    >
                      <BookOpen className="h-4 w-4" />
                      DETAILS
                    </button>
                    <button
                      className={cn(
                        actionButtonBaseClass,
                        "bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-opacity hover:opacity-90",
                      )}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10 mb-10 flex flex-col gap-6 py-6 sm:mt-16 sm:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-white sm:text-[56px] sm:leading-[100%]">
              FAQ
            </h2>
            <p className="text-sm font-bold text-[#B0B0B0] sm:text-[15px] sm:whitespace-nowrap">
              Find quick answers about our affiliate program. Need more help?
              Contact our{" "}
              <a href="#" className="text-white underline hover:opacity-80">
                support team
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={cn(
                    "rounded-2xl border bg-[#0C101480] backdrop-blur-[50px] transition-colors",
                    isOpen ? "border-[#A06AFF]" : "border-[#181B22]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaqId((prev) => (prev === faq.id ? null : faq.id))
                    }
                    className="group flex w-full items-center justify-between gap-4 px-4 py-6 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg font-bold text-white sm:text-2xl">
                      {faq.question}
                    </span>
                    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                      <Plus
                        className={cn(
                          "absolute h-6 w-6 text-[#B0B0B0] transition-all",
                          isOpen ? "rotate-45 opacity-0" : "opacity-100",
                        )}
                        strokeWidth={2}
                      />
                      <X
                        className={cn(
                          "absolute h-6 w-6 text-[#B0B0B0] transition-all",
                          isOpen ? "opacity-100" : "-rotate-45 opacity-0",
                        )}
                        strokeWidth={1.5}
                      />
                    </div>
                  </button>
                  {isOpen && (faq.description || faq.bullets?.length) ? (
                    <div className="px-4 pb-6 text-sm font-bold leading-normal text-[#B0B0B0] sm:px-6 sm:text-[15px]">
                      {faq.description ? (
                        <p className="mb-3">{faq.description}</p>
                      ) : null}
                      {faq.bullets?.length ? (
                        <ul className="list-disc space-y-1 pl-4">
                          {faq.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceMyProducts;
