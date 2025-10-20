import { ArrowUpDown, Heart, MessageCircle, Share2, ShoppingCart, Star, Users } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart as HeartIcon, MessageCircle as MessageCircleIcon, Share2 as ShareIcon, ShoppingCart as ShoppingCartIcon, Star as StarIcon, Users as UsersIcon } from "lucide-react";
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import PerformanceChartCard, {
  type PerformanceChartLevel,
} from "@/components/marketplace/PerformanceChartCard";
import { baseAnalysts, type Analyst } from "@/data/marketplaceAnalysts";

type ExtendedAnalyst = Analyst & {
  price?: string;
  chartImage?: string;
  description?: string;
  originalDescription?: string;
};

const DEFAULT_CHART_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F2d6d24710ba34771b2ab72e3d53cd2ec?format=webp&width=800";
const FAVORITE_STORAGE_KEY = "analyst-detail-favorites";

interface AnalystDetailsState {
  analyst?: Analyst;
  scrollToTop?: boolean;
  isFavorite?: boolean;
}

type AnalystContentFilter = "all" | "trades" | "bots";

const TRAIT_BADGES = [
  { label: "Stable", backgroundClass: "bg-[#1C3430]", textClass: "text-[#2EBD85]" },
  { label: "High Frequency", backgroundClass: "bg-[#6AA6FF]/[0.16]", textClass: "text-[#6AA6FF]" },
  { label: "Long-Term", backgroundClass: "bg-[#6AA6FF]/[0.16]", textClass: "text-[#6AA6FF]" },
  { label: "Veterans", backgroundClass: "bg-[#6AA6FF]/[0.16]", textClass: "text-[#6AA6FF]" },
  { label: "Sociable", backgroundClass: "bg-[#6AA6FF]/[0.16]", textClass: "text-[#6AA6FF]" },
] as const;

const CONTENT_FILTERS: { id: AnalystContentFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "trades", label: "Trades" },
  { id: "bots", label: "Bots" },
];

const PERFORMANCE_LEVELS: readonly PerformanceChartLevel[] = [
  { label: "$500K" },
  { label: "$100K" },
  { label: "$10K" },
  { label: "$100" },
  { label: "$1" },
  { label: "$0.01", accent: true },
];

const PERFORMANCE_MONTHS = [
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
  "JAN",
  "FEB",
  "MAR",
] as const;

const ANALYST_REVIEWS = [
  {
    id: "review-1",
    author: "John Smith",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F0802e48d16264d2788a8df1c96f6be08?format=webp&width=800",
    postedAt: "2 days ago",
    rating: 5,
    title: "Game changer for my trading strategy!",
    message:
      "This tool has completely transformed how I manage risk in my trading. The automatic calculations save me so much time, and I've seen a significant improvement in my overall performance. Highly recommended for any serious trader.",
  },
  {
    id: "review-2",
    author: "John Smith",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F0802e48d16264d2788a8df1c96f6be08?format=webp&width=800",
    postedAt: "1 week ago",
    rating: 4,
    title: "Great tool, but could use more features",
    message:
      "RiskMaster has been very helpful for my day trading. The risk calculations are spot on and have helped me avoid some potentially big losses. I'd love to see more advanced features in future updates, like custom risk models and better integration with other platforms.",
  },
  {
    id: "review-3",
    author: "John Smith",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F0802e48d16264d2788a8df1c96f6be08?format=webp&width=800",
    postedAt: "3 weeks ago",
    rating: 4.5,
    title: "Worth every penny",
    message:
      "I was hesitant about the price at first, but after using Riskmaster for a month, I can confidently say it's worth every penny. The portfolio analysis feature alone has saved me from making several costly mistakes. The UI is clean and intuitive, making it easy to incorporate into my daily routine.",
  },
];

const ANALYST_AVERAGE_RATING = 4.5;
const ANALYST_TOTAL_REVIEWS = 28;
const TOTAL_COMMENTS_COUNT = 20;
const COMMENT_AVATAR =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=800";
const PORTFOLIO_COMPANY_AVATAR =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F18521892e3ab461db339a01c3ae506cf?format=webp&width=800";

type CommentNode = {
  id: string;
  author: string;
  time: string;
  text: string;
  likes: number;
  likeColor?: string;
  timeColor?: string;
  canHide?: boolean;
  replies?: CommentNode[];
  liked?: boolean;
  hidden?: boolean;
};

const INITIAL_COMMENTS: CommentNode[] = [
  {
    id: "comment-1",
    author: "John Smith",
    time: "6 hours ago",
    text: "Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.",
    likes: 25,
    canHide: true,
    replies: [
      {
        id: "comment-1-1",
        author: "John Smith",
        time: "6 hours ago",
        text: "Thank you, John Smith!",
        likes: 25,
        canHide: true,
        replies: [
          {
            id: "comment-1-1-1",
            author: "John Smith",
            time: "6 hours ago",
            text: "At your service, John Smith!",
            likes: 25,
            likeColor: "#B0B0B0",
          },
        ],
      },
    ],
  },
  {
    id: "comment-2",
    author: "John Smith",
    time: "6 hours ago",
    text: "Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.",
    likes: 25,
    likeColor: "#808283",
    timeColor: "#808283",
  },
  {
    id: "comment-3",
    author: "John Smith",
    time: "6 hours ago",
    text: "Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.",
    likes: 25,
    likeColor: "#808283",
    timeColor: "#808283",
  },
];

const toggleLikeInTree = (nodes: CommentNode[], id: string): CommentNode[] =>
  nodes.map((node) => {
    if (node.id === id) {
      const liked = !node.liked;
      return {
        ...node,
        liked,
        likes: liked ? node.likes + 1 : Math.max(node.likes - 1, 0),
      };
    }

    return {
      ...node,
      replies: node.replies ? toggleLikeInTree(node.replies, id) : undefined,
    };
  });

const toggleHiddenInTree = (nodes: CommentNode[], id: string): CommentNode[] =>
  nodes.map((node) => {
    if (node.id === id) {
      return {
        ...node,
        hidden: !node.hidden,
      };
    }

    return {
      ...node,
      replies: node.replies ? toggleHiddenInTree(node.replies, id) : undefined,
    };
  });

const AnalystDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = (location.state as AnalystDetailsState | null) ?? null;

  const [favoriteAnalystIds, setFavoriteAnalystIds] = useState<Set<string>>(() => {
    const storedIds = new Set<string>();

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(FAVORITE_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((value) => {
              if (typeof value === "string" && value.trim().length > 0) {
                storedIds.add(value);
              }
            });
          }
        } catch {
          // ignore
        }
      }
    }

    if (locationState?.trader?.id && locationState.isFavorite) {
      storedIds.add(locationState.trader.id);
    }

    return storedIds;
  });
  const [activeFilter, setActiveFilter] = useState<AnalystContentFilter>("all");
  const [activeTab, setActiveTab] = useState<"statistics" | "trades">("trades");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [comments, setComments] = useState<CommentNode[]>(() => INITIAL_COMMENTS);
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  const reviews = useMemo(
    () =>
      TRADER_REVIEWS.filter(
        (review) =>
          typeof review?.author === "string" &&
          review.author.trim().length > 0 &&
          typeof review?.message === "string" &&
          review.message.trim().length > 0,
      ),
    [],
  );
  const averageRating = TRADER_AVERAGE_RATING;
  const totalReviews = TRADER_TOTAL_REVIEWS;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      FAVORITE_STORAGE_KEY,
      JSON.stringify(Array.from(favoriteAnalystIds)),
    );
  }, [favoriteAnalystIds]);

  useEffect(() => {
    const id = locationState?.trader?.id;
    if (!id || !locationState?.isFavorite) {
      return;
    }

    setFavoriteAnalystIds((prev) => {
      if (prev.has(id)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [locationState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateLayout = () => {
      setIsCompactLayout(window.innerWidth <= 360);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  useEffect(() => {
    if (locationState?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, {
        replace: true,
        state: { ...locationState, scrollToTop: false },
      });
    }
  }, [location.pathname, locationState, navigate]);

  const analyst = useMemo<ExtendedAnalyst>(() => {
    const baseEntry = baseAnalysts[0];
    const fallback: ExtendedAnalyst = {
      ...baseEntry,
      price: baseEntry?.price ?? "$10 / month",
      chartImage: baseEntry?.chartImage ?? DEFAULT_CHART_IMAGE,
      description:
        baseEntry && typeof (baseEntry as ExtendedAnalyst).description === "string"
          ? (baseEntry as ExtendedAnalyst).description
          : "This analyst provides deep market insights, combining historical research with advanced quantitative models to identify high-probability setups across multiple asset classes.",
      originalDescription:
        baseEntry && typeof (baseEntry as ExtendedAnalyst).originalDescription === "string"
          ? (baseEntry as ExtendedAnalyst).originalDescription
          : "This analyst provides deep market insights, combining historical research with advanced quantitative models to identify high-probability setups across multiple asset classes.",
    };

    const provided = locationState?.analyst as Partial<ExtendedAnalyst> | undefined;
    if (!provided) {
      return fallback;
    }

    return {
      ...fallback,
      ...provided,
      chartImage: provided.chartImage ?? fallback.chartImage,
      description:
        typeof provided.description === "string" && provided.description.trim().length > 0
          ? provided.description
          : fallback.description,
      originalDescription:
        typeof provided.originalDescription === "string" && provided.originalDescription.trim().length > 0
          ? provided.originalDescription
          : fallback.originalDescription,
    };
  }, [locationState]);

  const isAnalystFavorite = favoriteAnalystIds.has(analyst.id);

  const handleToggleFavoriteAnalyst = useCallback(() => {
    setFavoriteAnalystIds((prev) => {
      const next = new Set(prev);
      if (next.has(analyst.id)) {
        next.delete(analyst.id);
      } else {
        next.add(analyst.id);
      }
      return next;
    });
  }, [analyst.id]);

  const handleNavigateToCategory = useCallback(() => {
    navigate("/marketplace/analysts", {
      state: {
        scrollToTop: true,
      },
    });
  }, [navigate]);

  const handleToggleLike = useCallback((id: string) => {
    setComments((prev) => toggleLikeInTree(prev, id));
  }, []);

  const handleToggleHidden = useCallback((id: string) => {
    setComments((prev) => toggleHiddenInTree(prev, id));
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      const halfFilled = !filled && index < rating;

      return (
        <StarIcon
          key={index}
          className={`h-4 w-4 ${
            filled
              ? "fill-[#A06AFF] text-[#A06AFF]"
              : halfFilled
                ? "fill-[url(#half-star)] text-[#A06AFF]"
                : "fill-[#2E2744] text-[#2E2744]"
          }`}
        />
      );
    });
  };

  const renderComment = (comment: CommentNode, depth = 0): JSX.Element => {
    const indentStep = isCompactLayout ? 16 : 24;
    const indent = depth * indentStep;
    const timeColor = comment.timeColor ?? "#B0B0B0";
    const hasReplies = Array.isArray(comment.replies) && comment.replies.length > 0;
    const baseLikeColor = comment.likeColor ?? "#B0B0B0";
    const displayLikeColor = comment.liked ? "#A06AFF" : baseLikeColor;
    const likeButtonClasses = comment.liked
      ? "border-[#A06AFF] bg-[#2C1F4A]/40"
      : "border-[#181B22] hover:border-[#A06AFF]/30";
    const likeAriaLabel = comment.liked ? "Unlike comment" : "Like comment";
    const hideLabel = "Hide";
    const showLabel = hasReplies ? "Show thread" : "Show comment";
    const hiddenLabel = hasReplies ? "Thread hidden" : "Comment hidden";

    if (comment.hidden) {
      return (
        <div
          key={comment.id}
          className="relative flex items-center justify-between rounded-2xl border border-[#181B22] bg-[#0C1014]/50 px-4 py-3 max-[360px]:flex-col max-[360px]:items-start max-[360px]:gap-2 max-[360px]:px-3 max-[360px]:py-2.5"
          style={{ marginLeft: indent }}
        >
          {depth > 0 && (
            <div
              className="absolute top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]"
              style={{ left: -indentStep }}
            />
          )}
          <span className="text-sm font-bold text-[#B0B0B0] max-[360px]:text-xs">{hiddenLabel}</span>
          <button
            type="button"
            onClick={() => handleToggleHidden(comment.id)}
            className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF] max-[360px]:self-end max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm"
          >
            {showLabel}
          </button>
        </div>
      );
    }

    return (
      <div
        key={comment.id}
        className="relative flex flex-col gap-4 max-[360px]:gap-3"
        style={{ marginLeft: indent }}
      >
        {depth > 0 && (
          <div
            className="absolute top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]"
            style={{ left: -indentStep }}
          />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 max-[360px]:items-start max-[360px]:gap-1.5">
            <img
              src={COMMENT_AVATAR}
              alt={`${comment.author} avatar`}
              className="h-11 w-11 rounded-full object-cover max-[360px]:h-10 max-[360px]:w-10"
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-bold text-white max-[360px]:text-sm">{comment.author}</span>
              <span className="text-xs font-bold" style={{ color: timeColor }}>
                {comment.time}
              </span>
            </div>
          </div>
          <p className="text-[15px] font-medium text-white max-[360px]:text-sm">{comment.text}</p>
        </div>

        <button
          type="button"
          onClick={() => handleToggleLike(comment.id)}
          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${likeButtonClasses} max-[360px]:gap-1 max-[360px]:px-2`}
          aria-pressed={comment.liked}
          aria-label={likeAriaLabel}
          style={{ color: displayLikeColor }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill={comment.liked ? displayLikeColor : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z"
              stroke={displayLikeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xs font-bold" style={{ color: displayLikeColor }}>
            {comment.likes}
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2 max-[360px]:gap-1.5">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF] max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm"
            onClick={() => handleToggleHidden(comment.id)}
          >
            {hideLabel}
          </button>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-[15px] font-bold text-white max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm"
          >
            Reply
          </button>
          <button type="button" className="rounded-full p-1 text-[#B0B0B0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11Z"
                fill="#B0B0B0"
                stroke="#B0B0B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11Z"
                fill="#B0B0B0"
                stroke="#B0B0B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                fill="#B0B0B0"
                stroke="#B0B0B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="flex flex-col gap-4">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-[360px]:gap-4">
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex items-center gap-2 text-[15px] max-[360px]:gap-1.5 max-[360px]:text-sm">
          <button
            type="button"
            onClick={handleNavigateToCategory}
            className="rounded-full px-3 py-1 font-normal text-[#B0B0B0] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
          >
            Traders
          </button>
          <span className="font-bold text-[#B0B0B0]">/</span>
          <span className="font-bold text-white">{trader.name}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6 max-[360px]:gap-4">
          {/* Left Sidebar - Trader Card (Compact) */}
          <div className="flex w-full flex-col gap-6 lg:max-w-[339px] lg:flex-shrink-0 max-[360px]:gap-4">
            <div className="relative w-full overflow-hidden rounded-2xl border border-[#181B22]">
              <svg
                className="absolute inset-0 -z-10 h-full w-full"
                viewBox="0 0 311 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2.81635 74.7739L0.50293 78.8428V115.891H310.503V5.81618L302.984 11.5983L297.779 21.4494L291.995 20.807L289.104 22.9485L282.163 3.03217L279.85 5.81618L275.801 4.53125L267.126 6.88695L262.499 17.1664L259.029 14.5965C257.68 16.9522 254.981 21.6208 254.981 21.4494C254.981 21.2781 252.667 18.0944 251.51 16.5239L248.04 21.6636L243.413 16.3097L237.63 14.8107L234.738 0.890625L226.063 7.74357H223.171L220.857 9.24265L219.122 6.67279L213.917 19.0938L212.182 15.6673L206.398 14.8107L202.928 18.4513L201.772 10.7417L198.88 14.8107L194.831 9.24265L191.361 12.2408L189.626 10.7417L187.891 11.5983L184.421 4.10294L181.529 20.1645L176.902 13.3116L172.275 11.5983L167.648 22.7344L160.13 29.159L154.346 27.8741L153.768 33.2279L150.876 28.9449L146.249 34.727L142.779 47.7904L138.731 48.4329L134.682 49.2895L132.369 57.6415L129.477 58.7123L122.536 57.6415L113.861 52.9301L110.969 59.3548L103.451 61.7105L100.559 60.8539L99.4022 62.9954L91.8835 59.3548L90.7268 61.068L82.6297 59.9972L75.6895 64.4945L75.1112 67.7068L71.641 66.8502L67.5924 70.0625L64.7007 67.7068H57.7604L56.6037 68.7776H54.2903L50.2417 71.3474L43.3014 69.2059L39.8312 64.7086L35.7827 64.9228L31.7343 70.0625L28.8424 68.3493L27.1074 70.705L24.2156 69.2059L14.3835 70.705L9.75663 76.273L2.81635 74.7739Z"
                  fill="url(#paint0_linear_trader)"
                />
                <path
                  d="M0.50293 77.5573L2.81639 73.5555L9.75666 75.0298L14.3835 69.5536L24.2156 68.0793L27.1074 69.5536L28.8425 67.2368L31.7343 68.9218L35.7828 63.8668L39.8313 63.6562L43.3014 68.0793L50.2418 70.1855L54.2902 67.658H56.6036L57.7604 66.6049H64.7007L67.5925 68.9218L71.641 65.7624L75.1111 66.6049L75.6895 63.4456L82.6298 59.0225L90.7268 60.0756L91.8835 58.3906L99.4021 61.9712L100.559 59.865L103.451 60.7075L110.969 58.3906L113.861 52.0719L122.537 56.7056L129.477 57.7588L132.369 56.7056L134.682 48.4914L138.731 47.6489L142.779 47.017L146.249 34.169L150.876 28.4822L153.768 32.6947L154.346 27.4291L160.13 28.6928L167.648 22.3741L172.275 11.4218L176.902 13.1067L181.529 19.8467L184.421 4.04997L187.891 11.4218L189.626 10.5793L191.361 12.0536L194.831 9.10491L198.88 14.5811L201.772 10.5793L202.928 18.1617L206.398 14.5811L212.182 15.4236L213.917 18.7936L219.122 6.57744L220.857 9.10491L223.171 7.63055H226.063L234.738 0.890625L237.63 14.5811L243.413 16.0555L248.04 21.321L251.51 16.2661C252.667 17.8107 254.981 20.9419 254.981 21.1104C254.981 21.2789 257.68 16.6873 259.029 14.3705L262.499 16.898L267.126 6.78806L275.801 4.47121L279.85 5.73495L282.163 2.99685L289.104 22.5848L291.995 20.4785L297.779 21.1104L302.984 11.4218L310.503 5.73495"
                  stroke="#523A83"
                  strokeWidth="1.00667"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_trader"
                    x1="-132.231"
                    y1="0.890625"
                    x2="-132.231"
                    y2="115.891"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#A06AFF" stopOpacity="0.32" />
                    <stop offset="1" stopColor="#181A20" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <img
                src={trader.avatar}
                alt={trader.name}
                className="absolute left-4 top-4 z-20 h-24 w-24 rounded-full border-2 border-[#0C1014] object-cover shadow-xl"
              />

              <div className="absolute right-5 top-5 z-20">
                <button
                  type="button"
                  onClick={handleToggleFavoriteTrader}
                  className="rounded-full p-2 text-[#B0B0B0] transition-colors hover:text-[#A06AFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  aria-pressed={isAnalystFavorite}
                  aria-label={isAnalystFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <StarIcon
                    className={`h-6 w-6 ${
                      isAnalystFavorite ? "fill-[#A06AFF] text-[#A06AFF]" : "fill-none stroke-current"
                    }`}
                    strokeWidth="1.00667"
                  />
                </button>
              </div>

              <div className="relative z-10 flex flex-col gap-4 px-4 pb-6 pt-[7.25rem] sm:pt-[7.75rem]">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{trader.name}</h3>
                  <div className="rounded-md bg-[#A06AFF] px-1">
                  <span className="text-xs font-extrabold text-white">PRO</span>
                </div>
                </div>

                <div className="text-xs font-bold uppercase text-[#B0B0B0]">{trader.badge}</div>

                <div className="flex flex-wrap items-center gap-1">
                  <div className="flex items-center gap-1 rounded bg-[#3E321D] px-1 py-0.5">
                    <span className="text-xs font-extrabold uppercase text-[#FFA800]">
                      HEDGE FUND MANAGER
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 rounded bg-[#1C3430] px-1 py-0.5">
                    <span className="text-xs font-bold text-[#2EBD85]">{trader.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                    <UsersIcon className="h-4 w-4 text-[#B0B0B0]" />
                    <span className="text-xs font-bold text-white">{trader.followers}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                    <svg
                      className="h-4 w-4 text-[#B0B0B0]"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.1663 7.33301V6.66634C13.1663 4.15218 13.1663 2.89511 12.3852 2.11405C11.6042 1.33301 10.3471 1.33301 7.83298 1.33301H7.16638C4.65223 1.33301 3.39515 1.33301 2.61411 2.11405C1.83306 2.89509 1.83305 4.15215 1.83303 6.66629L1.83301 9.33301C1.83298 11.8471 1.83297 13.1042 2.61399 13.8853C3.39504 14.6663 4.65216 14.6663 7.16631 14.6663"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.83301 4.66699H10.1663M4.83301 8.00033H10.1663"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8.83301 13.8842V14.6663H9.61527C9.88821 14.6663 10.0247 14.6663 10.1473 14.6155C10.2701 14.5647 10.3665 14.4682 10.5595 14.2753L13.7753 11.0593C13.9573 10.8773 14.0483 10.7863 14.0969 10.6881C14.1895 10.5013 14.1895 10.2821 14.0969 10.0953C14.0483 9.99707 13.9573 9.90607 13.7753 9.72407C13.5932 9.54207 13.5022 9.45107 13.404 9.40241C13.2172 9.30987 12.9979 9.30987 12.8111 9.40241C12.7129 9.45107 12.6219 9.54207 12.4399 9.72407L9.22414 12.9401C9.03114 13.133 8.93467 13.2295 8.88387 13.3521C8.83301 13.4749 8.83301 13.6113 8.83301 13.8842Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs font-bold text-white">{trader.publications}</span>
                  </div>
                </div>

                <div className="h-px w-full bg-[#181B22]" />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Markets:</span>
                    <span className="text-white">BINANCE, NASDAQ</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Assets:</span>
                    <span className="text-white">BTC, ETH, TESLA, GOLD</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">Analysis:</span>
                    <span className="text-white">TECHNICAL & ANALYSIS.</span>
                  </div>
                </div>

                <div className="h-px w-full bg-[#181B22]" />

                <div className="flex items-center gap-1 text-xs font-bold uppercase">
                  <span className="text-[#B0B0B0]">Forecast Accuracy:</span>
                  <span className="text-[#2EBD85]">{trader.accuracy}</span>
                </div>

                <div className="text-2xl font-bold text-white">{trader.price}</div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-12 py-2.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Buy
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-3 py-2.5 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <MessageCircleIcon className="h-4 w-4" />
                  Chat
                </button>
              </div>
            </div>

            {/* Success Rate & Average Return */}
            <div className="flex w-full flex-col gap-6 sm:flex-row lg:max-w-[339px]">
              {/* Success Rate Card */}
              <div className="flex flex-1 flex-col items-center gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Success Rate</span>
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path d="M6.97061 1.75975C7.53867 1.19076 8.46067 1.19076 9.02874 1.75975L9.70167 2.43375C9.97467 2.70727 10.3454 2.86082 10.7319 2.8605L11.6843 2.85972C12.4883 2.85907 13.1403 3.51102 13.1396 4.31505L13.1389 5.26745C13.1385 5.65393 13.2921 6.02464 13.5656 6.29771L14.2396 6.97061C14.8086 7.53867 14.8086 8.46067 14.2396 9.02874L13.5656 9.70167C13.2921 9.97467 13.1385 10.3454 13.1389 10.7319L13.1396 11.6843C13.1403 12.4883 12.4883 13.1403 11.6843 13.1396L10.7319 13.1389C10.3454 13.1385 9.97467 13.2921 9.70167 13.5656L9.02874 14.2396C8.46067 14.8086 7.53867 14.8086 6.97061 14.2396L6.29771 13.5656C6.02464 13.2921 5.65393 13.1385 5.26745 13.1389L4.31505 13.1396C3.51102 13.1403 2.85907 12.4883 2.85972 11.6843L2.8605 10.7319C2.86082 10.3454 2.70727 9.97467 2.43375 9.70167L1.75975 9.02874C1.19076 8.46067 1.19076 7.53867 1.75975 6.97061L2.43375 6.29771C2.70727 6.02464 2.86082 5.65393 2.8605 5.26745L2.85972 4.31505C2.85907 3.51102 3.51102 2.85907 4.31505 2.85972L5.26745 2.8605C5.65393 2.86082 6.02464 2.70727 6.29771 2.43375L6.97061 1.75975Z" stroke="#B0B0B0"/>
                    <path d="M6.66699 6.00033C6.66699 5.26395 7.26393 4.66699 8.00033 4.66699C8.73673 4.66699 9.33366 5.26395 9.33366 6.00033C9.33366 6.26576 9.25613 6.51308 9.12239 6.72086C8.72393 7.34013 8.00033 7.93059 8.00033 8.66699V9.00033" stroke="#B0B0B0" strokeLinecap="round"/>
                    <path d="M7.99512 11.333H8.00112" stroke="#B0B0B0" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <svg className="h-24 w-24" viewBox="0 0 96 96" fill="none">
                  <path d="M0 48C0 21.4903 21.4903 0 48 0C74.5097 0 96 21.4903 96 48C96 74.5097 74.5097 96 48 96C21.4903 96 0 74.5097 0 48ZM79.2 48C79.2 30.7687 65.2313 16.8 48 16.8C30.7687 16.8 16.8 30.7687 16.8 48C16.8 65.2313 30.7687 79.2 48 79.2C65.2313 79.2 79.2 65.2313 79.2 48Z" fill="#A06AFF"/>
                  <path d="M0 48C0 60.2195 4.66032 71.9789 13.0309 80.8811C21.4015 89.7832 32.8522 95.1578 45.0485 95.9092C57.2448 96.6605 69.2686 92.7321 78.6686 84.9247C88.0686 77.1174 94.1371 66.0189 95.637 53.8918L78.9641 51.8297C77.9891 59.7123 74.0446 66.9263 67.9346 72.0011C61.8246 77.0759 54.0092 79.6293 46.0815 79.141C38.1539 78.6526 30.711 75.1591 25.2701 69.3727C19.8292 63.5863 16.8 55.9426 16.8 48H0Z" fill="#6AA5FF"/>
                  <path d="M0 48C0 55.3304 1.67893 62.5635 4.90804 69.1444C8.13715 75.7252 12.8306 81.4791 18.6285 85.9646C24.4263 90.4502 31.1745 93.5482 38.3555 95.0211C45.5364 96.494 52.9593 96.3026 60.0548 94.4616L55.8356 78.2001C51.2235 79.3967 46.3987 79.5211 41.731 78.5637C37.0634 77.6063 32.6771 75.5926 28.9085 72.677C25.1399 69.7614 22.0891 66.0214 19.9902 61.7438C17.8913 57.4663 16.8 52.7648 16.8 48H0Z" fill="#FFA800"/>
                </svg>
                <p className="text-center text-xs font-bold text-white">111 out of 128<br />profitable transactions</p>
              </div>

              {/* Average Return Card */}
              <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Average Return</span>
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path d="M6.97061 1.75975C7.53867 1.19076 8.46067 1.19076 9.02874 1.75975L9.70167 2.43375C9.97467 2.70727 10.3454 2.86082 10.7319 2.8605L11.6843 2.85972C12.4883 2.85907 13.1403 3.51102 13.1396 4.31505L13.1389 5.26745C13.1385 5.65393 13.2921 6.02464 13.5656 6.29771L14.2396 6.97061C14.8086 7.53867 14.8086 8.46067 14.2396 9.02874L13.5656 9.70167C13.2921 9.97467 13.1385 10.3454 13.1389 10.7319L13.1396 11.6843C13.1403 12.4883 12.4883 13.1403 11.6843 13.1396L10.7319 13.1389C10.3454 13.1385 9.97467 13.2921 9.70167 13.5656L9.02874 14.2396C8.46067 14.8086 7.53867 14.8086 6.97061 14.2396L6.29771 13.5656C6.02464 13.2921 5.65393 13.1385 5.26745 13.1389L4.31505 13.1396C3.51102 13.1403 2.85907 12.4883 2.85972 11.6843L2.8605 10.7319C2.86082 10.3454 2.70727 9.97467 2.43375 9.70167L1.75975 9.02874C1.19076 8.46067 1.19076 7.53867 1.75975 6.97061L2.43375 6.29771C2.70727 6.02464 2.86082 5.65393 2.8605 5.26745L2.85972 4.31505C2.85907 3.51102 3.51102 2.85907 4.31505 2.85972L5.26745 2.8605C5.65393 2.86082 6.02464 2.70727 6.29771 2.43375L6.97061 1.75975Z" stroke="#B0B0B0"/>
                    <path d="M6.66699 6.00033C6.66699 5.26395 7.26393 4.66699 8.00033 4.66699C8.73673 4.66699 9.33366 5.26395 9.33366 6.00033C9.33366 6.26576 9.25613 6.51308 9.12239 6.72086C8.72393 7.34013 8.00033 7.93059 8.00033 8.66699V9.00033" stroke="#B0B0B0" strokeLinecap="round"/>
                    <path d="M7.99512 11.333H8.00112" stroke="#B0B0B0" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-center text-[31px] font-bold text-[#2EBD85]">111.14%</div>
                <p className="text-center text-xs font-bold text-white">Average return<br />per transaction</p>
              </div>
            </div>

            {/* Portfolio Gain */}
            <div className="flex w-full flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] lg:max-w-[339px]">
              <div className="flex items-center border-b border-[#181B22] p-4">
                <h3 className="text-[19px] font-bold text-[#A06AFF]">Portfolio Gain</h3>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">1-Month Return</span>
                <div className="rounded bg-[#1C3430] px-1 py-0.5">
                  <span className="text-xs font-bold text-[#2EBD85]">+0.14%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">6-Month Return</span>
                <div className="rounded bg-[#1C3430] px-1 py-0.5">
                  <span className="text-xs font-bold text-[#2EBD85]">+0.14%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">12-Month Return</span>
                <div className="rounded bg-[#1C3430] px-1 py-0.5">
                  <span className="text-xs font-bold text-[#2EBD85]">+0.14%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">YTD Return</span>
                <div className="rounded bg-[#1C3430] px-1 py-0.5">
                  <span className="text-xs font-bold text-[#2EBD85]">+0.14%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">Total Return</span>
                <div className="rounded bg-[#1C3430] px-1 py-0.5">
                  <span className="text-xs font-bold text-[#2EBD85]">+0.14%</span>
                </div>
              </div>
            </div>

            {/* Best Trade */}
            <div className="flex w-full flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] lg:max-w-[339px]">
              <div className="flex items-center border-b border-[#181B22] p-4">
                <h3 className="text-[19px] font-bold text-[#A06AFF]">Best Trade</h3>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">Asset</span>
                <span className="text-[15px] font-bold text-[#6AA5FF]">Broadcom (AVGO)</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">Opened at</span>
                <span className="text-[15px] font-bold text-white">April 06, 2020</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">Closed at</span>
                <span className="text-[15px] font-bold text-white">-</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[15px] text-[#B0B0B0]">Gain</span>
                <div className="rounded bg-[#1C3430] px-1 py-0.5">
                  <span className="text-xs font-bold text-[#2EBD85]">+718.00%</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="flex w-full flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] lg:max-w-[339px]">
              <div className="flex flex-col gap-4 border-b border-[#181B22] p-4 max-[360px]:gap-3 max-[360px]:p-3">
                <h3 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Reviews</h3>
                <div className="flex items-center gap-4 max-[360px]:gap-3">
                  <span className="text-[31px] font-bold leading-none text-[#A06AFF] max-[360px]:text-2xl">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-0.5">
                      {renderStars(averageRating)}
                    </div>
                    <p className="text-xs font-bold text-[#B0B0B0]">
                      Based on {totalReviews} reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, index) => (
                  <div key={review.id} className="flex flex-col">
                    {index > 0 && (
                      <div className="px-4 py-2 max-[360px]:px-3">
                        <div className="h-px bg-[#181B22]" />
                      </div>
                    )}

                    <div className="flex justify-between gap-3 px-4 pb-2 pt-4 max-[360px]:px-3 max-[360px]:pt-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="h-11 w-11 rounded-full object-cover max-[360px]:h-10 max-[360px]:w-10"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                            {review.author}
                          </span>
                          <span className="text-xs font-bold text-[#B0B0B0]">
                            {review.postedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 px-4 pb-4 max-[360px]:gap-1.5 max-[360px]:px-3 max-[360px]:pb-3">
                      <h4 className="text-[15px] font-bold text-white max-[360px]:text-sm">
                        {review.title}
                      </h4>
                      <p className="text-[15px] font-normal text-[#B0B0B0] max-[360px]:text-sm">
                        {review.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length > 0 && (
                <div className="p-4 max-[360px]:p-3">
                  <button
                    type="button"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="flex h-[26px] w-full items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-4 text-center text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:text-sm"
                  >
                    {showAllReviews ? "Show Less Reviews" : "Show More Reviews"}
                  </button>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex w-full flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] lg:max-w-[339px]">
              <div className="flex items-center border-b border-[#181B22] p-4">
                <h3 className="text-[19px] font-bold text-[#A06AFF]">Disclaimer</h3>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <p className="text-[15px] text-[#B0B0B0]">
                  The information and publications are not meant to be, and do not constitute, financial, investment, trading, or other types of advice or recommendations supplied or endorsed by TyrianTrade. Read more in the{" "}
                  <a href="#" className="text-[#A06AFF] underline">Terms of Use</a>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Detailed Information (Figma Design) */}
          <div className="flex flex-1 flex-col gap-6 min-w-0 max-[360px]:gap-4">
            {/* Stats Header */}
            <div className="relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] sm:flex-row sm:items-center">
              <div className="flex w-full flex-col gap-6 sm:w-auto sm:flex-1">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Followers</span>
                    <span className="text-[15px] font-bold text-white">85</span>
                  </div>
                  <div className="h-9 w-px bg-[#2E2744]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Trading Days</span>
                    <span className="text-[15px] font-bold text-white">438</span>
                  </div>
                  <div className="h-9 w-px bg-[#2E2744]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Stability Index</span>
                    <span className="text-[15px] font-bold text-white">5.0/5.0</span>
                  </div>
                  <div className="h-9 w-px bg-[#2E2744]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-[#B0B0B0]">Views (7d)</span>
                    <span className="text-[15px] font-bold text-white">776</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-white whitespace-nowrap">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.86667 6.00043C9.7459 5.79094 9.57043 5.61823 9.35905 5.5008C9.14768 5.38337 8.90834 5.32563 8.66667 5.33376H7.33333C6.97971 5.33376 6.64057 5.47424 6.39052 5.72429C6.14048 5.97434 6 6.31347 6 6.6671C6 7.02072 6.14048 7.35986 6.39052 7.6099C6.64057 7.85995 6.97971 8.00043 7.33333 8.00043H8.66667C9.02029 8.00043 9.35943 8.14091 9.60948 8.39095C9.85952 8.641 10 8.98014 10 9.33376C10 9.68738 9.85952 10.0265 9.60948 10.2766C9.35943 10.5266 9.02029 10.6671 8.66667 10.6671H7.33333C7.09166 10.6752 6.85232 10.6175 6.64095 10.5001C6.42957 10.3826 6.2541 10.2099 6.13333 10.0004" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 4.66699V11.3337" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    AUM 210,390.40 USDT
                  </div>
                  <div className="h-5 w-px bg-[#2E2744]" />
                  <div className="flex items-center gap-1 text-xs font-bold text-white whitespace-nowrap">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M11.3337 5.33366V3.33366C11.3337 3.15685 11.2634 2.98728 11.1384 2.86225C11.0134 2.73723 10.8438 2.66699 10.667 2.66699H4.00033C3.6467 2.66699 3.30756 2.80747 3.05752 3.05752C2.80747 3.30756 2.66699 3.6467 2.66699 4.00033M2.66699 4.00033C2.66699 4.35395 2.80747 4.69309 3.05752 4.94313C3.30756 5.19318 3.6467 5.33366 4.00033 5.33366H12.0003C12.1771 5.33366 12.3467 5.4039 12.4717 5.52892C12.5968 5.65395 12.667 5.82351 12.667 6.00033V8.00033M2.66699 4.00033V12.0003C2.66699 12.3539 2.80747 12.6931 3.05752 12.9431C3.30756 13.1932 3.6467 13.3337 4.00033 13.3337H12.0003C12.1771 13.3337 12.3467 13.2634 12.4717 13.1384C12.5968 13.0134 12.667 12.8438 12.667 12.667V10.667" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.333 8V10.6667H10.6663C10.3127 10.6667 9.97358 10.5262 9.72353 10.2761C9.47348 10.0261 9.33301 9.68696 9.33301 9.33333C9.33301 8.97971 9.47348 8.64057 9.72353 8.39052C9.97358 8.14048 10.3127 8 10.6663 8H13.333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Total Assets: 25,020.85 USDT
                  </div>
                  <div className="h-5 w-px bg-[#2E2744]" />
                  <div className="flex items-center gap-1 text-xs font-bold text-white whitespace-nowrap">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2V8H14" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Profit Sharing: 10%
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {TRAIT_BADGES.map((badge) => (
                    <span
                      key={badge.label}
                      className={`rounded px-2 py-0.5 text-xs font-bold uppercase leading-none ${badge.backgroundClass} ${badge.textClass}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:min-w-[260px] sm:max-w-none sm:items-end sm:self-start sm:px-6">
                <div className="flex w-full items-center justify-center gap-4 self-end sm:w-full sm:justify-between sm:gap-8">
                  <button className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold text-white transition-colors hover:text-[#A06AFF]">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M12.9747 2.66277C11.1869 1.56615 9.62661 2.00807 8.68927 2.71201C8.30487 3.00064 8.11274 3.14495 7.99967 3.14495C7.88661 3.14495 7.69447 3.00064 7.31007 2.71201C6.37275 2.00807 4.8124 1.56615 3.02463 2.66277C0.678387 4.10196 0.147488 8.84993 5.55936 12.8556C6.59015 13.6185 7.10554 14 7.99967 14C8.89381 14 9.40921 13.6185 10.44 12.8556C15.8519 8.84993 15.3209 4.10196 12.9747 2.66277Z" stroke="white" strokeLinecap="round"/>
                    </svg>
                    Subscribe
                  </button>
                  <div className="h-5 w-px bg-white/24" />
                  <button className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold text-white transition-colors hover:text-[#A06AFF]">
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M12.7945 6.29445L11.4843 4.97965C10.5403 4.03232 10.1703 3.52271 9.65907 3.70287C9.02167 3.92751 9.23147 5.34494 9.23147 5.82347C8.24047 5.82347 7.21013 5.73539 6.23323 5.91891C3.00839 6.52475 2 9.14386 2 12.0003C2.91273 11.3538 3.82455 10.665 4.92155 10.3654C6.29091 9.99133 7.82027 10.1698 9.23147 10.1698C9.23147 10.6483 9.02167 12.0658 9.65907 12.2904C10.2383 12.4945 10.5403 11.9609 11.4843 11.0136L12.7945 9.69879C13.5982 8.89233 14 8.48913 14 7.99666C14 7.50419 13.5982 7.10093 12.7945 6.29445Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Bio</h2>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-normal text-white">{trader.description}</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 rounded-[36px] border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("statistics")}
                  className={`rounded-full px-4 py-3 text-[15px] font-bold text-white transition-colors ${
                    activeTab === "statistics"
                      ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] backdrop-blur-[58px]"
                      : "border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[58px] hover:border-[#1F2230]"
                  }`}
                >
                  Statistics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("trades")}
                  className={`rounded-full px-4 py-3 text-[15px] font-bold text-white transition-colors ${
                    activeTab === "trades"
                      ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] backdrop-blur-[58px]"
                      : "border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[58px] hover:border-[#1F2230]"
                  }`}
                >
                  Trades
                </button>
              </div>
              <div className="flex gap-2 rounded-[36px] border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px]">
                {CONTENT_FILTERS.map(({ id, label }) => {
                  const isActive = activeFilter === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveFilter(id)}
                      aria-pressed={isActive}
                      className={`rounded-full px-4 py-2 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014] backdrop-blur-[58px] ${
                        isActive
                          ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                          : "border border-[#181B22] bg-[#0C1014]/50 text-white/80 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allocation Section */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Allocation</h2>
              <div className="h-px w-full bg-[#181B22]" />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* By Stocks */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-[15px] font-bold text-white">By Stocks:</h3>
                  <div className="flex justify-center">
                    <svg className="h-32 w-32" viewBox="0 0 128 128" fill="none">
                      <path d="M64 0C99.3462 0 128 28.6538 128 64C128 99.3462 99.3462 128 64 128C28.6538 128 0 99.3462 0 64C0 28.6538 28.6538 0 64 0ZM64 105.6C86.9751 105.6 105.6 86.975 105.6 64C105.6 41.0249 86.9751 22.4 64 22.4C41.025 22.4 22.4 41.0249 22.4 64C22.4 86.975 41.025 105.6 64 105.6Z" fill="#A06AFF"/>
                      <path d="M64 0C50.7582 0 37.8423 4.10739 27.0329 11.756C16.2234 19.4047 8.05254 30.2179 3.64658 42.7053C-0.759374 55.1926 -1.18348 68.7392 2.43272 81.4777C6.04892 94.2162 13.5274 105.519 23.8372 113.829C34.1471 122.139 46.7807 127.046 59.9966 127.875C73.2125 128.703 86.36 125.412 97.6267 118.454C108.893 111.497 117.725 101.216 122.903 89.0283C128.082 76.841 129.352 63.3475 126.54 50.4078L104.651 55.165C106.479 63.5759 105.653 72.3467 102.287 80.2684C98.9211 88.1901 93.1807 94.8728 85.8574 99.3951C78.534 103.918 69.9881 106.057 61.3978 105.519C52.8074 104.98 44.5956 101.79 37.8942 96.389C31.1928 90.9876 26.3318 83.6405 23.9813 75.3605C21.6307 67.0805 21.9064 58.2752 24.7703 50.1584C27.6342 42.0416 32.9452 35.013 39.9714 30.0414C46.9975 25.0698 55.3928 22.4 64 22.4L64 0Z" fill="#6AA5FF"/>
                      <path d="M64 0C54.2299 0 44.5895 2.23684 35.8176 6.53912C27.0457 10.8414 19.3753 17.0949 13.3942 24.8203C7.41308 32.5457 3.28008 41.5379 1.31197 51.1077C-0.656141 60.6775 -0.407125 70.5709 2.03993 80.0297C4.48699 89.4884 9.06713 98.2613 15.4293 105.676C21.7915 113.091 29.7668 118.95 38.744 122.806C47.7212 126.661 57.462 128.41 67.2197 127.919C76.9775 127.427 86.4932 124.708 95.0375 119.97L84.1744 100.381C78.6206 103.46 72.4354 105.228 66.0928 105.547C59.7503 105.867 53.4188 104.73 47.5836 102.224C41.7484 99.7177 36.5645 95.9089 32.4291 91.0894C28.2936 86.2698 25.3165 80.5674 23.726 74.4193C22.1354 68.2711 21.9735 61.8404 23.2528 55.62C24.5321 49.3996 27.2185 43.5547 31.1062 38.5332C34.9939 33.5117 39.9797 29.4469 45.6814 26.6504C51.3831 23.854 57.6494 22.4 64 22.4L64 0Z" fill="#FF6A79"/>
                      <path d="M64 0C50.4163 0 37.1848 4.32198 26.2203 12.3406C15.2558 20.3591 7.127 31.6584 3.01012 44.6032C-1.10676 57.5481 -0.998156 71.4671 3.32023 84.3461C7.63861 97.2252 15.9428 108.396 27.0311 116.243L39.9702 97.9577C32.7628 92.8575 27.3651 85.5963 24.5582 77.225C21.7512 68.8536 21.6806 59.8063 24.3566 51.3921C27.0326 42.9779 32.3163 35.6334 39.4432 30.4214C46.5701 25.2093 55.1706 22.4 64 22.4L64 0Z" fill="#6AFF9C"/>
                      <path d="M64 0C54.2261 0 44.582 2.23857 35.8075 6.54405C27.033 10.8495 19.3612 17.1075 13.3805 24.838C7.39976 32.5685 3.26906 41.566 1.30521 51.1406C-0.658636 60.7152 -0.403461 70.6124 2.05117 80.073L23.7333 74.4475C22.1378 68.298 21.9719 61.8649 23.2484 55.6414C24.5249 49.4179 27.2098 43.5695 31.0973 38.5447C34.9848 33.5199 39.9715 29.4522 45.6749 26.6536C51.3783 23.8551 57.647 22.4 64 22.4L64 0Z" fill="#FFB46A"/>
                      <path d="M64 0C50.4845 0 37.316 4.2787 26.3817 12.2229C15.4475 20.1671 7.30889 31.3689 3.13238 44.2229L24.4361 51.1449C27.1508 42.7898 32.4409 35.5086 39.5481 30.3449C46.6554 25.1812 55.215 22.4 64 22.4L64 0Z" fill="#8A3F66"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#A06AFF]" />
                      <span className="text-xs font-bold uppercase text-white">IVE</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#6AA5FF]" />
                      <span className="text-xs font-bold uppercase text-white">BTC-USD</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#FF6A79]" />
                      <span className="text-xs font-bold uppercase text-white">TSLA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#6AFF9C]" />
                      <span className="text-xs font-bold uppercase text-white">SPY</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#FFB56A]" />
                      <span className="text-xs font-bold uppercase text-white">VOO</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#8A3F66]" />
                      <span className="text-xs font-bold uppercase text-white">Others</span>
                    </div>
                  </div>
                </div>

                {/* By Assets */}
                <div className="flex flex-col gap-4 border-l-0 lg:border-l-2 lg:border-[#181B22] lg:pl-4">
                  <h3 className="text-[15px] font-bold text-white">By Assets:</h3>
                  <div className="flex justify-center">
                    <svg className="h-32 w-32" viewBox="0 0 128 128" fill="none">
                      <path d="M64 0C99.3462 0 128 28.6538 128 64C128 99.3462 99.3462 128 64 128C28.6538 128 0 99.3462 0 64C0 28.6538 28.6538 0 64 0ZM64 105.6C86.9751 105.6 105.6 86.975 105.6 64C105.6 41.0249 86.9751 22.4 64 22.4C41.025 22.4 22.4 41.0249 22.4 64C22.4 86.975 41.025 105.6 64 105.6Z" fill="#A06AFF"/>
                      <path d="M64 0C50.7582 0 37.8423 4.10739 27.0329 11.756C16.2234 19.4047 8.05254 30.2179 3.64658 42.7053C-0.759374 55.1926 -1.18348 68.7392 2.43272 81.4777C6.04892 94.2162 13.5274 105.519 23.8372 113.829C34.1471 122.139 46.7807 127.046 59.9966 127.875C73.2125 128.703 86.36 125.412 97.6267 118.454C108.893 111.497 117.725 101.216 122.903 89.0283C128.082 76.841 129.352 63.3475 126.54 50.4078L104.651 55.165C106.479 63.5759 105.653 72.3467 102.287 80.2684C98.9211 88.1901 93.1807 94.8728 85.8574 99.3951C78.534 103.918 69.9881 106.057 61.3978 105.519C52.8074 104.98 44.5956 101.79 37.8942 96.389C31.1928 90.9876 26.3318 83.6405 23.9813 75.3605C21.6307 67.0805 21.9064 58.2752 24.7703 50.1584C27.6342 42.0416 32.9452 35.013 39.9714 30.0414C46.9975 25.0698 55.3928 22.4 64 22.4L64 0Z" fill="#6AA5FF"/>
                      <path d="M64 0C54.2299 0 44.5895 2.23684 35.8176 6.53912C27.0457 10.8414 19.3753 17.0949 13.3942 24.8203C7.41308 32.5457 3.28008 41.5379 1.31197 51.1077C-0.656141 60.6775 -0.407125 70.5709 2.03993 80.0297C4.48699 89.4884 9.06713 98.2613 15.4293 105.676C21.7915 113.091 29.7668 118.95 38.744 122.806C47.7212 126.661 57.462 128.41 67.2197 127.919C76.9775 127.427 86.4932 124.708 95.0375 119.97L84.1744 100.381C78.6206 103.46 72.4354 105.228 66.0928 105.547C59.7503 105.867 53.4188 104.73 47.5836 102.224C41.7484 99.7177 36.5645 95.9089 32.4291 91.0894C28.2936 86.2698 25.3165 80.5674 23.726 74.4193C22.1354 68.2711 21.9735 61.8404 23.2528 55.62C24.5321 49.3996 27.2185 43.5547 31.1062 38.5332C34.9939 33.5117 39.9797 29.4469 45.6814 26.6504C51.3831 23.854 57.6494 22.4 64 22.4L64 0Z" fill="#FF6A79"/>
                      <path d="M64 0C50.4163 0 37.1848 4.32198 26.2203 12.3406C15.2558 20.3591 7.127 31.6584 3.01012 44.6032C-1.10676 57.5481 -0.998156 71.4671 3.32023 84.3461C7.63861 97.2252 15.9428 108.396 27.0311 116.243L39.9702 97.9577C32.7628 92.8575 27.3651 85.5963 24.5582 77.225C21.7512 68.8536 21.6806 59.8063 24.3566 51.3921C27.0326 42.9779 32.3163 35.6334 39.4432 30.4214C46.5701 25.2093 55.1706 22.4 64 22.4L64 0Z" fill="#6AFF9C"/>
                      <path d="M64 0C54.2261 0 44.582 2.23857 35.8075 6.54405C27.033 10.8495 19.3612 17.1075 13.3805 24.838C7.39976 32.5685 3.26906 41.566 1.30521 51.1406C-0.658636 60.7152 -0.403461 70.6124 2.05117 80.073L23.7333 74.4475C22.1378 68.298 21.9719 61.8649 23.2484 55.6414C24.5249 49.4179 27.2098 43.5695 31.0973 38.5447C34.9848 33.5199 39.9715 29.4522 45.6749 26.6536C51.3783 23.8551 57.647 22.4 64 22.4L64 0Z" fill="#FFB46A"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#A06AFF]" />
                      <span className="text-xs font-bold uppercase text-white">ETFs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#6AA5FF]" />
                      <span className="text-xs font-bold uppercase text-white">Cash</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#FF6A79]" />
                      <span className="text-xs font-bold uppercase text-white">Stocks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#6AFF9C]" />
                      <span className="text-xs font-bold uppercase text-white">Cryptocurrency</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#FFB56A]" />
                      <span className="text-xs font-bold uppercase text-white">Funds</span>
                    </div>
                  </div>
                </div>

                {/* By Sector */}
                <div className="flex flex-col gap-4 border-l-0 lg:border-l-2 lg:border-[#181B22] lg:pl-4">
                  <h3 className="text-[15px] font-bold text-white">By Sector:</h3>
                  <div className="flex justify-center">
                    <svg className="h-32 w-32" viewBox="0 0 128 128" fill="none">
                      <path d="M64 0C99.3462 0 128 28.6538 128 64C128 99.3462 99.3462 128 64 128C28.6538 128 0 99.3462 0 64C0 28.6538 28.6538 0 64 0ZM64 105.6C86.9751 105.6 105.6 86.975 105.6 64C105.6 41.0249 86.9751 22.4 64 22.4C41.025 22.4 22.4 41.0249 22.4 64C22.4 86.975 41.025 105.6 64 105.6Z" fill="#A06AFF"/>
                      <path d="M64 0C50.7582 0 37.8423 4.10739 27.0329 11.756C16.2234 19.4047 8.05254 30.2179 3.64658 42.7053C-0.759374 55.1926 -1.18348 68.7392 2.43272 81.4777C6.04892 94.2162 13.5274 105.519 23.8372 113.829C34.1471 122.139 46.7807 127.046 59.9966 127.875C73.2125 128.703 86.36 125.412 97.6267 118.454C108.893 111.497 117.725 101.216 122.903 89.0283C128.082 76.841 129.352 63.3475 126.54 50.4078L104.651 55.165C106.479 63.5759 105.653 72.3467 102.287 80.2684C98.9211 88.1901 93.1807 94.8728 85.8574 99.3951C78.534 103.918 69.9881 106.057 61.3978 105.519C52.8074 104.98 44.5956 101.79 37.8942 96.389C31.1928 90.9876 26.3318 83.6405 23.9813 75.3605C21.6307 67.0805 21.9064 58.2752 24.7703 50.1584C27.6342 42.0416 32.9452 35.013 39.9714 30.0414C46.9975 25.0698 55.3928 22.4 64 22.4L64 0Z" fill="#6AA5FF"/>
                      <path d="M64 0C54.2299 0 44.5895 2.23684 35.8176 6.53912C27.0457 10.8414 19.3753 17.0949 13.3942 24.8203C7.41308 32.5457 3.28008 41.5379 1.31197 51.1077C-0.656141 60.6775 -0.407125 70.5709 2.03993 80.0297C4.48699 89.4884 9.06713 98.2613 15.4293 105.676C21.7915 113.091 29.7668 118.95 38.744 122.806C47.7212 126.661 57.462 128.41 67.2197 127.919C76.9775 127.427 86.4932 124.708 95.0375 119.97L84.1744 100.381C78.6206 103.46 72.4354 105.228 66.0928 105.547C59.7503 105.867 53.4188 104.73 47.5836 102.224C41.7484 99.7177 36.5645 95.9089 32.4291 91.0894C28.2936 86.2698 25.3165 80.5674 23.726 74.4193C22.1354 68.2711 21.9735 61.8404 23.2528 55.62C24.5321 49.3996 27.2185 43.5547 31.1062 38.5332C34.9939 33.5117 39.9797 29.4469 45.6814 26.6504C51.3831 23.854 57.6494 22.4 64 22.4L64 0Z" fill="#FF6A79"/>
                      <path d="M64 0C50.4163 0 37.1848 4.32198 26.2203 12.3406C15.2558 20.3591 7.127 31.6584 3.01012 44.6032C-1.10676 57.5481 -0.998156 71.4671 3.32023 84.3461C7.63861 97.2252 15.9428 108.396 27.0311 116.243L39.9702 97.9577C32.7628 92.8575 27.3651 85.5963 24.5582 77.225C21.7512 68.8536 21.6806 59.8063 24.3566 51.3921C27.0326 42.9779 32.3163 35.6334 39.4432 30.4214C46.5701 25.2093 55.1706 22.4 64 22.4L64 0Z" fill="#6AFF9C"/>
                      <path d="M64 0C54.2261 0 44.582 2.23857 35.8075 6.54405C27.033 10.8495 19.3612 17.1075 13.3805 24.838C7.39976 32.5685 3.26906 41.566 1.30521 51.1406C-0.658636 60.7152 -0.403461 70.6124 2.05117 80.073L23.7333 74.4475C22.1378 68.298 21.9719 61.8649 23.2484 55.6414C24.5249 49.4179 27.2098 43.5695 31.0973 38.5447C34.9848 33.5199 39.9715 29.4522 45.6749 26.6536C51.3783 23.8551 57.647 22.4 64 22.4L64 0Z" fill="#FFB46A"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#A06AFF]" />
                      <span className="text-xs font-bold uppercase text-white">General</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#6AA5FF]" />
                      <span className="text-xs font-bold uppercase text-white">Crypto</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#FF6A79]" />
                      <span className="text-xs font-bold uppercase text-white">Consumer Cyclical</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#6AFF9C]" />
                      <span className="text-xs font-bold uppercase text-white">Technology</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[#FFB56A]" />
                      <span className="text-xs font-bold uppercase text-white">Other</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PerformanceChartCard
              levels={PERFORMANCE_LEVELS}
              months={PERFORMANCE_MONTHS}
              highlightValue="$507K"
              title="Performance"
            />

            <PerformanceChartCard
              levels={PERFORMANCE_LEVELS}
              months={PERFORMANCE_MONTHS}
              highlightValue="$507K"
              title="Index Performance"
            />

            {/* Portfolio Performance Chart */}
            <div className="hidden flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Portfolio Performance</h2>
              <div className="h-px w-full bg-[#181B22]" />

              <div className="relative h-64 w-full pt-2">
                {/* Y-axis labels */}
                <div className="absolute right-0 top-0 flex h-full flex-col justify-between py-2 pr-2 text-right">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$500K</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$100K</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$10K</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$100</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$1</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$0.01</span>
                </div>

                {/* Chart with grid lines */}
                <svg className="h-full w-full pr-16" viewBox="0 0 712 291" fill="none" preserveAspectRatio="none">
                  <defs>
                    <filter id="chartGlow1" x="0" y="0" width="100%" height="100%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.24"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Grid lines */}
                  <line x1="16" y1="67" x2="654" y2="67" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="107" x2="654" y2="107" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="147" x2="654" y2="147" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="187" x2="654" y2="187" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="227" x2="654" y2="227" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="267" x2="654" y2="267" stroke="#523A83" strokeWidth="1"/>

                  {/* Value badge */}
                  <rect x="656" y="57" width="45" height="20" rx="4" fill="#A06AFF"/>
                  <text x="678" y="71" fill="white" fontSize="12" fontWeight="700" textAnchor="middle">$507K</text>

                  {/* Chart line */}
                  <path d="M8.75 208.213L16.204 211.302L20.7591 205.123L24.9002 207.33L26.1426 203.8L29.4554 205.123L33.5965 201.593L37.3235 203.8L49.3326 184.382L50.9891 185.706L56.3725 175.997L58.0289 179.528L60.0994 177.321L62.17 179.528L63.8264 175.997L66.7252 178.645L69.6239 175.997L72.1086 177.321C73.3509 173.35 75.8356 165.318 75.8356 164.965C75.8356 164.612 75.8356 156.58 75.8356 152.608L79.1484 156.58L81.6331 152.608C81.6331 153.491 81.6331 154.903 81.6331 153.491C81.6331 152.079 84.3938 142.311 85.7742 137.604L89.087 150.402L93.6422 139.369L96.9551 138.487L98.1974 130.984L100.682 132.308L101.924 127.895L105.237 135.839L106.894 145.106L108.55 136.721L110.207 141.576L111.863 153.491L113.934 138.487L117.661 149.078L122.63 130.984L126.771 134.515L128.427 130.102L130.498 133.632L133.811 129.219L138.366 144.224L140.851 136.721L144.578 139.369L147.476 129.219L148.305 134.515L151.203 130.102L155.344 146.871L157.415 142.458L158.243 146.871L161.97 144.224L163.212 152.167L164.869 145.989L168.596 142.458L170.252 145.106L171.495 139.369L174.807 146.871L177.292 145.989L181.019 152.167L183.504 145.989L186.817 160.993L190.129 159.669V150.402L192.614 147.754L198.826 157.021L201.725 149.078L202.967 157.021L205.452 156.139L207.936 152.167L209.593 156.139L211.249 144.224L212.491 146.871L214.562 141.576C215.942 144.518 218.703 149.872 218.703 147.754C218.703 145.636 219.531 137.163 219.945 133.191L225.329 141.576L227.813 142.458L228.642 140.693H231.126L234.439 144.224L237.338 145.106L238.166 140.693L240.237 143.341L245.62 142.458L248.933 135.839L252.246 142.458H253.902L255.145 139.369L258.457 145.989L260.114 142.458L263.013 149.078L269.638 147.754L272.123 161.876L274.193 154.373L277.92 152.167L281.233 165.406L283.304 160.993L287.859 167.613C289.654 164.523 293.325 158.61 293.657 159.669C293.988 160.728 297.936 168.642 299.868 172.467L302.353 168.937L303.595 174.232H306.08L308.565 169.819L309.807 173.35L316.847 164.523L318.917 152.167L321.816 155.697L323.887 150.402L328.442 145.989C330.65 150.255 335.067 158.698 335.067 158.345C335.067 157.992 336.172 152.902 336.724 150.402H339.209L340.451 149.078L345.006 159.669L346.662 157.021L348.733 165.406L350.804 167.613L353.288 183.5L355.359 177.763L357.843 179.528L359.914 162.758L360.742 165.406L363.227 164.523L364.883 169.819L365.297 162.758L368.61 159.669L371.923 169.819L374.408 163.641L377.307 168.937L379.377 162.758H381.033L382.276 157.021L382.69 159.228L385.175 149.078H390.144L392.214 160.552L393.871 162.317L395.527 160.552L400.497 166.73L402.567 164.082L404.224 172.026L406.294 170.702L409.607 176.88L412.092 176.439L414.162 173.791L417.061 165.406L420.788 168.937L422.444 160.552L427.414 163.641L430.726 152.167L437.766 149.078L439.837 152.167L441.079 147.313L443.15 150.843L446.049 140.252L448.947 139.81L451.432 149.078L456.401 153.491L459.3 148.195H460.956L461.785 145.989H466.754L468.824 150.843L471.723 144.224L474.208 145.989L474.622 139.369L479.591 130.102L485.389 132.308L486.217 128.778L491.6 136.28L492.429 131.867L494.499 133.632L499.883 128.778L501.953 115.539L508.165 125.247L513.134 127.454L515.205 125.247L516.861 108.037L519.76 106.271L522.659 104.947L525.143 78.0278L528.456 66.1126L530.527 74.9387L530.941 63.9061L535.082 66.5539L540.465 53.3148L543.778 30.367L547.091 33.8974L550.404 48.0192L552.474 14.9213L554.959 30.367L556.201 28.6018L557.444 31.6909L559.928 25.5126L562.827 36.9865L564.898 28.6018L565.726 44.4887L568.21 36.9865L572.352 38.7518L573.594 45.8126L577.321 20.217L578.563 25.5126L580.22 22.4235H582.29L588.502 8.30176L590.572 36.9865L594.713 40.0757L598.026 51.1083L600.511 40.517C601.339 43.7532 602.996 50.3139 602.996 50.667C602.996 51.02 604.928 41.3996 605.894 36.5452L608.379 41.8409L611.692 20.6583L617.904 15.8039L620.802 18.4518L622.459 12.7148L627.428 53.7561L629.499 49.3431L633.64 50.667L637.367 30.367L642.75 18.4518"
                    stroke="#A06AFF" strokeWidth="1.5" strokeLinecap="round" filter="url(#chartGlow1)" transform="translate(10, 16)"/>
                </svg>
              </div>

              <div className="flex justify-between pr-16 text-xs font-bold uppercase text-[#B0B0B0]">
                <span>'11</span>
                <span>'12</span>
                <span>'13</span>
                <span>'14</span>
                <span>'15</span>
                <span>'16</span>
                <span>'17</span>
                <span>'18</span>
                <span>'19</span>
                <span>'20</span>
                <span>'21</span>
                <span>'22</span>
                <span>'23</span>
                <span>'24</span>
                <span>'25</span>
              </div>
            </div>

            {/* Index Performance Chart */}
            <div className="hidden flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Index Performance</h2>
              <div className="h-px w-full bg-[#2E2744]" />

              <div className="relative h-64 w-full pt-2">
                {/* Y-axis labels */}
                <div className="absolute right-0 top-0 flex h-full flex-col justify-between py-2 pr-2 text-right">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$500K</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$100K</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$10K</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$100</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$1</span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">$0.01</span>
                </div>

                {/* Chart with grid lines */}
                <svg className="h-full w-full pr-16" viewBox="0 0 712 291" fill="none" preserveAspectRatio="none">
                  <defs>
                    <filter id="chartGlow2" x="0" y="0" width="100%" height="100%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.24"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Grid lines */}
                  <line x1="16" y1="67" x2="654" y2="67" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="107" x2="654" y2="107" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="147" x2="654" y2="147" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="187" x2="654" y2="187" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="227" x2="654" y2="227" stroke="#2E2744" strokeWidth="1"/>
                  <line x1="16" y1="267" x2="654" y2="267" stroke="#523A83" strokeWidth="1"/>

                  {/* Value badge */}
                  <rect x="656" y="57" width="45" height="20" rx="4" fill="#A06AFF"/>
                  <text x="678" y="71" fill="white" fontSize="12" fontWeight="700" textAnchor="middle">$507K</text>

                  {/* Chart line */}
                  <path d="M8.75 208.213L16.204 211.302L20.7591 205.123L24.9002 207.33L26.1426 203.8L29.4554 205.123L33.5965 201.593L37.3235 203.8L49.3326 184.382L50.9891 185.706L56.3725 175.997L58.0289 179.528L60.0994 177.321L62.17 179.528L63.8264 175.997L66.7252 178.645L69.6239 175.997L72.1086 177.321C73.3509 173.35 75.8356 165.318 75.8356 164.965C75.8356 164.612 75.8356 156.58 75.8356 152.608L79.1484 156.58L81.6331 152.608C81.6331 153.491 81.6331 154.903 81.6331 153.491C81.6331 152.079 84.3938 142.311 85.7742 137.604L89.087 150.402L93.6422 139.369L96.9551 138.487L98.1974 130.984L100.682 132.308L101.924 127.895L105.237 135.839L106.894 145.106L108.55 136.721L110.207 141.576L111.863 153.491L113.934 138.487L117.661 149.078L122.63 130.984L126.771 134.515L128.427 130.102L130.498 133.632L133.811 129.219L138.366 144.224L140.851 136.721L144.578 139.369L147.476 129.219L148.305 134.515L151.203 130.102L155.344 146.871L157.415 142.458L158.243 146.871L161.97 144.224L163.212 152.167L164.869 145.989L168.596 142.458L170.252 145.106L171.495 139.369L174.807 146.871L177.292 145.989L181.019 152.167L183.504 145.989L186.817 160.993L190.129 159.669V150.402L192.614 147.754L198.826 157.021L201.725 149.078L202.967 157.021L205.452 156.139L207.936 152.167L209.593 156.139L211.249 144.224L212.491 146.871L214.562 141.576C215.942 144.518 218.703 149.872 218.703 147.754C218.703 145.636 219.531 137.163 219.945 133.191L225.329 141.576L227.813 142.458L228.642 140.693H231.126L234.439 144.224L237.338 145.106L238.166 140.693L240.237 143.341L245.62 142.458L248.933 135.839L252.246 142.458H253.902L255.145 139.369L258.457 145.989L260.114 142.458L263.013 149.078L269.638 147.754L272.123 161.876L274.193 154.373L277.92 152.167L281.233 165.406L283.304 160.993L287.859 167.613C289.654 164.523 293.325 158.61 293.657 159.669C293.988 160.728 297.936 168.642 299.868 172.467L302.353 168.937L303.595 174.232H306.08L308.565 169.819L309.807 173.35L316.847 164.523L318.917 152.167L321.816 155.697L323.887 150.402L328.442 145.989C330.65 150.255 335.067 158.698 335.067 158.345C335.067 157.992 336.172 152.902 336.724 150.402H339.209L340.451 149.078L345.006 159.669L346.662 157.021L348.733 165.406L350.804 167.613L353.288 183.5L355.359 177.763L357.843 179.528L359.914 162.758L360.742 165.406L363.227 164.523L364.883 169.819L365.297 162.758L368.61 159.669L371.923 169.819L374.408 163.641L377.307 168.937L379.377 162.758H381.033L382.276 157.021L382.69 159.228L385.175 149.078H390.144L392.214 160.552L393.871 162.317L395.527 160.552L400.497 166.73L402.567 164.082L404.224 172.026L406.294 170.702L409.607 176.88L412.092 176.439L414.162 173.791L417.061 165.406L420.788 168.937L422.444 160.552L427.414 163.641L430.726 152.167L437.766 149.078L439.837 152.167L441.079 147.313L443.15 150.843L446.049 140.252L448.947 139.81L451.432 149.078L456.401 153.491L459.3 148.195H460.956L461.785 145.989H466.754L468.824 150.843L471.723 144.224L474.208 145.989L474.622 139.369L479.591 130.102L485.389 132.308L486.217 128.778L491.6 136.28L492.429 131.867L494.499 133.632L499.883 128.778L501.953 115.539L508.165 125.247L513.134 127.454L515.205 125.247L516.861 108.037L519.76 106.271L522.659 104.947L525.143 78.0278L528.456 66.1126L530.527 74.9387L530.941 63.9061L535.082 66.5539L540.465 53.3148L543.778 30.367L547.091 33.8974L550.404 48.0192L552.474 14.9213L554.959 30.367L556.201 28.6018L557.444 31.6909L559.928 25.5126L562.827 36.9865L564.898 28.6018L565.726 44.4887L568.21 36.9865L572.352 38.7518L573.594 45.8126L577.321 20.217L578.563 25.5126L580.22 22.4235H582.29L588.502 8.30176L590.572 36.9865L594.713 40.0757L598.026 51.1083L600.511 40.517C601.339 43.7532 602.996 50.3139 602.996 50.667C602.996 51.02 604.928 41.3996 605.894 36.5452L608.379 41.8409L611.692 20.6583L617.904 15.8039L620.802 18.4518L622.459 12.7148L627.428 53.7561L629.499 49.3431L633.64 50.667L637.367 30.367L642.75 18.4518"
                    stroke="#A06AFF" strokeWidth="1.5" strokeLinecap="round" filter="url(#chartGlow2)" transform="translate(10, 16)"/>
                </svg>
              </div>

              <div className="flex justify-between pr-16 text-xs font-bold uppercase text-[#B0B0B0]">
                <span>'11</span>
                <span>'12</span>
                <span>'13</span>
                <span>'14</span>
                <span>'15</span>
                <span>'16</span>
                <span>'17</span>
                <span>'18</span>
                <span>'19</span>
                <span>'20</span>
                <span>'21</span>
                <span>'22</span>
                <span>'23</span>
                <span>'24</span>
                <span>'25</span>
              </div>
            </div>

            {/* Trade Table */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] overflow-hidden">
              <div className="px-4 pt-4 pb-4">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">John Smith: Stock Buying and Selling in Portfolio</h2>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#181B22]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#B0B0B0]">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#B0B0B0]">% Hold</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#B0B0B0]">Return</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#B0B0B0]">№ of trnx</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#B0B0B0]">Last trnx</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-[#B0B0B0]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1,2,3,4,5,6,7,8,9].map((i) => (
                      <tr key={i} className="border-b border-[#181B22]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={PORTFOLIO_COMPANY_AVATAR}
                              alt="Portfolio company logo"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="text-[15px] font-bold text-white">LNZL</span>
                              <span className="text-xs font-bold uppercase text-[#B0B0B0]">Lenzoloto</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-bold uppercase text-white">0%</td>
                        <td className="px-4 py-4">
                          <div className="inline-flex rounded border border-[#181B22] bg-[#1C3430] px-1 py-0.5">
                            <span className="text-xs font-bold text-[#2EBD85]">+15.22 %</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-bold uppercase text-white">1</td>
                        <td className="px-4 py-4 text-xs font-bold uppercase text-white">Open</td>
                        <td className="px-4 py-4 text-xs font-bold uppercase text-white">12.05.25</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-center gap-1 px-4 py-4">
                <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5 text-[#B0B0B0]" viewBox="0 0 20 20" fill="none">
                    <path d="M14.658 15L15.833 13.825L12.0163 10L15.833 6.175L14.658 5L9.65801 10L14.658 15Z" fill="currentColor"/>
                    <path d="M9.1668 15L10.3418 13.825L6.52513 10L10.3418 6.175L9.1668 5L4.1668 10L9.1668 15Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5 text-[#B0B0B0]" viewBox="0 0 20 20" fill="none">
                    <path d="M12.575 15L13.75 13.825L9.93333 10L13.75 6.175L12.575 5L7.575 10L12.575 15Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="flex h-[26px] min-w-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-2">
                  <span className="text-[15px] font-bold text-white">1</span>
                </button>
                <button className="flex h-[26px] min-w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] px-2">
                  <span className="text-[15px] font-bold text-[#B0B0B0]">2</span>
                </button>
                <button className="flex h-[26px] min-w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] px-2">
                  <span className="text-[15px] font-bold text-[#B0B0B0]">3</span>
                </button>
                <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5 text-[#B0B0B0]" viewBox="0 0 20 20" fill="none">
                    <path d="M8.675 5L7.5 6.175L11.3167 10L7.5 13.825L8.675 15L13.675 10L8.675 5Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                  <svg className="h-5 w-5 text-[#B0B0B0]" viewBox="0 0 20 20" fill="none">
                    <path d="M5.34199 5L4.16699 6.175L7.98366 10L4.16699 13.825L5.34199 15L10.342 10L5.34199 5Z" fill="currentColor"/>
                    <path d="M10.8332 5L9.6582 6.175L13.4749 10L9.6582 13.825L10.8332 15L15.8332 10L10.8332 5Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-4 max-[360px]:p-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white max-[360px]:text-xl">{TOTAL_COMMENTS_COUNT} comments</h2>
                <div className="flex items-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px] max-[360px]:p-0.5">
                  <button
                    type="button"
                    aria-label="Sort comments"
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_trader_clock)">
                        <path d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 5.33301V7.99967L9.33333 9.33301" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_trader_clock">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Show trending comments"
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.23732 14.6663C17.3855 12.6663 12.8225 4.66634 7.28172 1.33301C6.63012 3.66634 5.65217 4.33301 3.69657 6.66634C1.10739 9.75561 2.39292 13.333 5.97805 14.6663C5.43485 13.9997 4.03297 12.6002 4.99992 10.6663C5.33325 9.99967 5.99992 9.33301 5.66659 7.99967C6.31844 8.33301 7.66659 8.66634 7.99992 10.333C8.54312 9.66634 9.10685 8.26634 8.58545 6.66634C12.6666 9.66634 10.9999 12.6663 9.23732 14.6663Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 max-[360px]:gap-3">
                <textarea
                  className="h-[88px] w-full resize-none rounded-2xl border border-[#181B22] bg-[#0C1014]/30 px-4 py-3 text-[15px] font-medium text-white placeholder-[#B0B0B0] focus:border-[#A06AFF] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]/40 max-[360px]:h-[72px] max-[360px]:px-3 max-[360px]:py-2 max-[360px]:text-sm"
                  placeholder="Comment..."
                  aria-label="Add a comment"
                />
                <button
                  type="button"
                  className="flex h-[26px] w-[180px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-l from-[#482090] to-[#A06AFF] px-6 py-2.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.02] max-[360px]:w-auto max-[360px]:px-4 max-[360px]:py-2 max-[360px]:text-sm"
                >
                  Send
                </button>
              </div>

              <div className="flex flex-col gap-4 max-[360px]:gap-3">
                {comments.map((comment) => renderComment(comment))}
                <div className="flex justify-center">
                  <button className="flex h-[26px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2.5 max-[360px]:px-4 max-[360px]:py-2">
                    <span className="text-center text-[15px] font-bold text-white max-[360px]:text-sm">16 more comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#A06AFF" />
            <stop offset="50%" stopColor="#2E2744" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AnalystDetailLanding;
