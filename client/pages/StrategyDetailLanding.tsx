import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Check,
  Globe2,
  HelpCircle,
  MapPin,
  Network,
  PieChart,
  Play,
  Settings,
  Star,
  Zap,
} from "lucide-react";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import StrategyGalleryCarousel from "@/components/marketplace/StrategyGalleryCarousel";
import type { Strategy } from "@/data/marketplaceStrategies";
import { baseStrategies } from "@/data/marketplaceStrategies";
import { useFavorite } from "@/hooks/useFavorite";
import { extractOriginalProductId } from "@/lib/utils";

const AVATAR_PLACEHOLDER =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=160";

const COMMENT_AVATAR =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=800";

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

type StrategyReview = {
  id: string;
  author: string;
  avatar: string;
  postedAt: string;
  rating: number;
  title: string;
  message: string;
};

type StrategyAuthor = {
  name: string;
  avatar: string;
  bio: string;
  communityLink?: string;
  socials?: string[];
};

const STRATEGY_AUTHOR: StrategyAuthor = {
  name: "Sarah Lee",
  avatar:
    "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=160",
  bio: "Systematic strategist focused on momentum and macro overlays with 12+ years across New York and Singapore trading desks.",
  communityLink: "https://example.com",
  socials: ["twitter", "youtube", "instagram", "web"],
};

const STRATEGY_REVIEWS: StrategyReview[] = [
  {
    id: "strategy-review-1",
    author: "Morgan Patel",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
    postedAt: "2 days ago",
    rating: 4.5,
    title: "Disciplined playbook with strong context",
    message:
      "Subscribed for our mid-cap book. Guidance around hedging cadence has helped us reduce reactive trades during macro events.",
  },
  {
    id: "strategy-review-2",
    author: "Noah Kim",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
    postedAt: "1 week ago",
    rating: 5,
    title: "Automation workflows are on point",
    message:
      "The rebalancing templates plug straight into our ops runbooks. Execution risk dropped noticeably after two cycles.",
  },
  {
    id: "strategy-review-3",
    author: "Jordan Singh",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
    postedAt: "3 weeks ago",
    rating: 4,
    title: "Great for capital efficiency",
    message:
      "Would love deeper overnight positioning notes, but the current toolkit already keeps our drawdown guardrails intact.",
  },
];

const INITIAL_COMMENTS: CommentNode[] = [
  {
    id: "comment-1",
    author: "Avery Collins",
    time: "3 hours ago",
    text: "Appreciate the transparency around drawdown triggers. The weekly playbook templates have made our post-trade reviews far more actionable.",
    likes: 18,
    canHide: true,
    replies: [
      {
        id: "comment-1-1",
        author: "Noah Kim",
        time: "2 hours ago",
        text: "Glad it helps, Avery. We just added fresh macro stress paths—let us know how they perform for your desks.",
        likes: 12,
        canHide: true,
        replies: [
          {
            id: "comment-1-1-1",
            author: "Avery Collins",
            time: "1 hour ago",
            text: "Perfect timing ahead of the earnings cycle. Thanks team!",
            likes: 7,
            likeColor: "#B0B0B0",
          },
        ],
      },
    ],
  },
  {
    id: "comment-2",
    author: "Morgan Patel",
    time: "5 hours ago",
    text: "Subscribed last month. The capital efficiency drills alone justified the subscription—curious if automation coverage is expanding to Asia sessions?",
    likes: 9,
    likeColor: "#808283",
    timeColor: "#808283",
  },
  {
    id: "comment-3",
    author: "Jordan Singh",
    time: "1 day ago",
    text: "Could we get deeper dives on hedging tactics during CPI weeks? The alerts have been solid but more context would be great.",
    likes: 11,
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

const COVER_IMAGE_BY_RISK: Record<Strategy["riskLevel"], string> = {
  LOW: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1400&q=80",
  MEDIUM:
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80",
  HIGH: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
};

const STRATEGY_GALLERY_BY_RISK: Record<Strategy["riskLevel"], string[]> = {
  LOW: [
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
  ],
  MEDIUM: [
    "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1521540216272-a50305cd4421?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80",
  ],
  HIGH: [
    "https://images.unsplash.com/photo-1518544889280-60fc7827f23b?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
  ],
};

const DEFAULT_STRATEGY_GALLERY: string[] = [
  "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1521790360789-7d05c45a95a6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1400&q=80",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const StrategyDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as {
    strategy?: Strategy;
    isFavorite?: boolean;
  } | null;

  const [comments, setComments] = useState<CommentNode[]>(
    () => INITIAL_COMMENTS,
  );
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const strategy = useMemo<Strategy>(() => {
    if (locationState?.strategy) {
      return locationState.strategy;
    }
    return baseStrategies[0];
  }, [locationState]);

  const usersCount = useMemo(() => {
    const parsed = Number.parseInt(strategy.users.replace(/[^0-9]/g, ""), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [strategy.users]);

  const minCapitalValue = useMemo(() => {
    const numeric = Number.parseFloat(
      strategy.minCapital.replace(/[^0-9.]/g, ""),
    );
    return Number.isNaN(numeric) ? 0 : numeric;
  }, [strategy.minCapital]);

  const subscriptionPrice = useMemo(() => {
    if (!minCapitalValue) {
      return "$249.00";
    }
    const suggested = Math.max(89, Math.round(minCapitalValue * 0.06));
    return formatCurrency(suggested);
  }, [minCapitalValue]);

  const exchangesSummary = useMemo(
    () => strategy.exchanges.slice(0, 3).join(", "),
    [strategy.exchanges],
  );

  const assetsSummary = useMemo(
    () => strategy.assets.join(", "),
    [strategy.assets],
  );

  const description = useMemo(
    () =>
      `${strategy.name} allocates across ${assetsSummary.toLowerCase()} while monitoring ${strategy.exchangesCount}+ venues including ${exchangesSummary}. The playbook emphasises disciplined position sizing and adaptive hedging to keep drawdowns near ${strategy.maxDrawdown}.`,
    [
      assetsSummary,
      exchangesSummary,
      strategy.exchangesCount,
      strategy.maxDrawdown,
      strategy.name,
    ],
  );

  const strategyAuthor = useMemo(() => STRATEGY_AUTHOR, []);
  const strategyReviews = useMemo(() => STRATEGY_REVIEWS, []);

  const averageRating = useMemo(() => {
    if (strategyReviews.length === 0) {
      return 0;
    }

    const total = strategyReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    return total / strategyReviews.length;
  }, [strategyReviews]);

  const totalReviews = useMemo(() => strategyReviews.length, [strategyReviews]);

  const reviewsToDisplay = useMemo(
    () => (showAllReviews ? strategyReviews : strategyReviews.slice(0, 3)),
    [showAllReviews, strategyReviews],
  );

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      const halfFilled = !filled && index < rating;

      return (
        <Star
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
  }, []);

  const automationLevel = useMemo(() => {
    switch (strategy.riskLevel) {
      case "LOW":
        return "Guided automation";
      case "HIGH":
        return "Fully automated entries";
      default:
        return "Auto + manual overrides";
    }
  }, [strategy.riskLevel]);

  const alertsPerWeek = useMemo(() => {
    switch (strategy.riskLevel) {
      case "LOW":
        return "3-4 alerts";
      case "HIGH":
        return "10+ alerts";
      default:
        return "6-8 alerts";
    }
  }, [strategy.riskLevel]);

  const strategySpecifications = useMemo(
    () => [
      `Strategy type: ${strategy.strategy}`,
      `Risk profile: ${strategy.riskLevel} (max drawdown ${strategy.maxDrawdown})`,
      `Profit sharing: ${strategy.profitSharing}`,
      `Minimum capital: ${strategy.minCapital}`,
      `User base: ${usersCount ? usersCount.toLocaleString() : "N/A"} subscribers`,
      `Primary assets: ${assetsSummary}`,
      `Exchange coverage: ${strategy.exchangesCount}+ venues including ${exchangesSummary}`,
      `Automation: ${automationLevel}`,
      `Alert cadence: ${alertsPerWeek}`,
    ],
    [
      alertsPerWeek,
      assetsSummary,
      automationLevel,
      exchangesSummary,
      strategy.exchangesCount,
      strategy.maxDrawdown,
      strategy.minCapital,
      strategy.profitSharing,
      strategy.riskLevel,
      strategy.strategy,
      usersCount,
    ],
  );

  const coverImage = useMemo(
    () => COVER_IMAGE_BY_RISK[strategy.riskLevel] ?? COVER_IMAGE_BY_RISK.MEDIUM,
    [strategy.riskLevel],
  );

  const strategyGallery = useMemo(
    () =>
      (STRATEGY_GALLERY_BY_RISK[strategy.riskLevel] ?? DEFAULT_STRATEGY_GALLERY).map(
        (src, index) => ({
          src,
          alt: `${strategy.name} preview ${index + 1}`,
        }),
      ),
    [strategy.name, strategy.riskLevel],
  );

  const heroMediaImage = strategyGallery[0]?.src ?? coverImage;
  const galleryLaunchTarget = strategyGallery[0]?.src ?? coverImage;

  const focusArea = useMemo(
    () => `${strategy.strategy} | ${strategy.riskLevel} risk`,
    [strategy.riskLevel, strategy.strategy],
  );

  const distribution = useMemo(
    () => `Deploys across ${strategy.exchangesCount}+ venues`,
    [strategy.exchangesCount],
  );

  const portfolioSlots = useMemo(
    () => `${Math.max(40, usersCount + 20)} seats`,
    [usersCount],
  );

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

  const handleToggleLike = useCallback((id: string) => {
    setComments((prev) => toggleLikeInTree(prev, id));
  }, []);

  const handleToggleHidden = useCallback((id: string) => {
    setComments((prev) => toggleHiddenInTree(prev, id));
  }, []);

  const renderComment = (comment: CommentNode, depth = 0): JSX.Element => {
    const indentStep = isCompactLayout ? 16 : 24;
    const indent = depth * indentStep;
    const timeColor = comment.timeColor ?? "#B0B0B0";
    const hasReplies =
      Array.isArray(comment.replies) && comment.replies.length > 0;
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
          <span className="text-sm font-bold text-[#B0B0B0] max-[360px]:text-xs">
            {hiddenLabel}
          </span>
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
              <span className="text-[15px] font-bold text-white">
                {comment.author}
              </span>
              <span className="text-xs font-bold" style={{ color: timeColor }}>
                {comment.time}
              </span>
            </div>
          </div>
          <p className="text-[15px] font-medium text-white max-[360px]:text-sm">
            {comment.text}
          </p>
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
          <span className="text-xs font-bold">{comment.likes}</span>
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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

  const commentCount = useMemo(() => {
    const countNodes = (nodes: CommentNode[]): number =>
      nodes.reduce(
        (total, node) =>
          total +
          1 +
          (node.replies && node.replies.length > 0
            ? countNodes(node.replies)
            : 0),
        0,
      );

    return countNodes(comments);
  }, [comments]);

  const remainingComments = Math.max(commentCount - comments.length, 0);
  const commentCountLabel =
    commentCount === 1 ? "1 comment" : `${commentCount} comments`;

  const originalStrategyId = useMemo(() => extractOriginalProductId(strategy.id), [strategy.id]);
  const { isFavorite, toggle: toggleFavorite } = useFavorite("strategy", originalStrategyId);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite();
  }, [toggleFavorite]);

  const handleNavigateBack = useCallback(() => {
    navigate("/marketplace/strategies", {
      state: {
        scrollToTop: true,
        category: "Strategies and Portfolios",
      },
    });
  }, [navigate]);

  return (
    <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
      <nav className="mb-6 flex items-center gap-2 text-[15px] font-bold">
        <button
          type="button"
          onClick={handleNavigateBack}
          className="rounded-full text-[15px] font-normal text-[#B0B0B0] transition-colors hover:text-white"
        >
          Strategies and Portfolios
        </button>
        <span className="text-[#808283]">/</span>
        <span className="text-white">{strategy.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_339px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px]">
            <StrategyGalleryCarousel items={strategyGallery} />
          </section>
          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Description</h2>
            </div>
            <div className="space-y-4 p-4">
              <p className="text-[15px] font-normal text-white">{description}</p>
              <p className="text-[15px] font-normal text-[#B0B0B0]">
                The playbook runs with {automationLevel.toLowerCase()} execution support, delivering
                {" "}
                {alertsPerWeek.toLowerCase()} and capital deployment guidance across
                {" "}
                {strategy.exchangesCount}+ monitored venues. Weekly updates keep
                subscribers aligned on hedge posture, rebalancing cadence, and drawdown
                guardrails across the {assetsSummary.toLowerCase()} mix.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Specifications</h2>
            </div>
            <div className="flex flex-col gap-4 p-4">
              {strategySpecifications.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                  </div>
                  <p className="flex-1 text-[15px] font-medium text-white max-[360px]:text-sm">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-4 max-[360px]:p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white max-[360px]:text-xl">
                {commentCountLabel}
              </h2>
              <div className="flex items-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px] max-[360px]:p-0.5">
                <button
                  type="button"
                  aria-label="Sort comments"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_strategy_comments_sort)">
                      <path
                        d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928"
                        stroke="#B0B0B0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 5.33301V7.99967L9.33333 9.33301"
                        stroke="#B0B0B0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_strategy_comments_sort">
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.23732 14.6663C17.3855 12.6663 12.8225 4.66634 7.28172 1.33301C6.63012 3.66634 5.65217 4.33301 3.69657 6.66634C1.10739 9.75561 2.39292 13.333 5.97805 14.6663C5.43485 13.9997 4.03297 12.6002 4.99992 10.6663C5.33325 9.99967 5.99992 9.33301 5.66659 7.99967C6.31844 8.33301 7.66659 8.66634 7.99992 10.333C8.54312 9.66634 9.10685 8.26634 8.58545 6.66634C12.6666 9.66634 10.9999 12.6663 9.23732 14.6663Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
              {remainingComments > 0 && (
                <div className="flex justify-center">
                  <button className="flex h-[26px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2.5 max-[360px]:px-4 max-[360px]:py-2">
                    <span className="text-center text-[15px] font-bold text-white max-[360px]:text-sm">
                      {remainingComments} more comments
                    </span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="relative">
              <img
                src={heroMediaImage}
                alt={strategy.name}
                className="h-[332px] w-full rounded-t-3xl border border-[#181B22] object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  if (!galleryLaunchTarget) {
                    return;
                  }
                  window.open(galleryLaunchTarget, "_blank", "noopener,noreferrer");
                }}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white shadow-[0_12px_24px_0_rgba(0,0,0,0.48)] transition-opacity hover:opacity-90"
                aria-label="Open gallery preview"
              >
                <Play className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase text-[#B0B0B0]">
                    Subscription
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {subscriptionPrice}
                  </div>
                </div>
                <FavoriteStarButton
                  pressed={isFavorite}
                  onToggle={handleToggleFavorite}
                  className="focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                />
              </div>

              <div className="space-y-2 text-[13px] font-semibold text-white">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#A06AFF]" />
                  {distribution}
                </div>
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-[#A06AFF]" />
                  {focusArea}
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-[#A06AFF]" />
                  Portfolio slots: {portfolioSlots}
                </div>
              </div>

              <div className="space-y-2 text-[13px] font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#A06AFF]" />
                  Automation level: {automationLevel}
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#A06AFF]" />
                  Alerts per week: {alertsPerWeek}
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-[#A06AFF]" />
                  Templates included: Playbooks + KPI sheets
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="flex h-[46px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] text-[15px] font-bold text-white">
                  Subscribe
                </button>
                <button className="flex h-[46px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                  Chat
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
            <div className="flex items-center gap-2 p-4 max-[360px]:gap-2 max-[360px]:p-3">
              <img
                src={strategyAuthor.avatar}
                alt={strategyAuthor.name}
                className="h-20 w-20 flex-shrink-0 rounded-full object-cover max-[360px]:h-16 max-[360px]:w-16"
              />
              <div className="flex flex-1 flex-col gap-2 max-[360px]:gap-1.5">
                <h3 className="text-[15px] font-bold text-white max-[360px]:text-sm">
                  {strategyAuthor.name}
                </h3>
                <button
                  type="button"
                  className="flex h-[26px] w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] text-xs font-bold text-white transition-opacity hover:opacity-90 max-[360px]:w-16 max-[360px]:text-[11px]"
                >
                  Follow
                </button>
              </div>
            </div>

            {strategyAuthor.communityLink && (
              <div className="px-4 pb-4 max-[360px]:px-3 max-[360px]:pb-3">
                <p className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                  Join our 10k+ community:{" "}
                  <a
                    href={strategyAuthor.communityLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A06AFF] underline"
                  >
                    {strategyAuthor.communityLink
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")}
                  </a>
                </p>
              </div>
            )}

            <div className="px-4 pb-4 max-[360px]:px-3 max-[360px]:pb-3">
              <p className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                {strategyAuthor.bio}
              </p>
            </div>

            {strategyAuthor.socials && strategyAuthor.socials.length > 0 && (
              <div className="flex items-center gap-3 px-4 pb-4 max-[360px]:gap-2 max-[360px]:px-3 max-[360px]:pb-3">
                <span className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                  Also on:
                </span>
                <div className="flex items-center gap-3">
                  {strategyAuthor.socials.includes("twitter") && (
                    <svg
                      className="h-4 w-4 text-white"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M12.2174 1.26953H14.4663L9.55298 6.88519L15.3332 14.5268H10.8073L7.26253 9.89222L3.20647 14.5268H0.956125L6.21146 8.52026L0.666504 1.26953H5.30724L8.51143 5.50575L12.2174 1.26953ZM11.428 13.1807H12.6742L4.6301 2.54495H3.29281L11.428 13.1807Z" />
                    </svg>
                  )}
                  {strategyAuthor.socials.includes("youtube") && (
                    <svg
                      className="h-4 w-4 text-white"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M15.8406 4.8002C15.8406 4.8002 15.6844 3.69707 15.2031 3.2127C14.5938 2.5752 13.9125 2.57207 13.6 2.53457C11.3625 2.37207 8.00313 2.37207 8.00313 2.37207H7.99687C7.99687 2.37207 4.6375 2.37207 2.4 2.53457C2.0875 2.57207 1.40625 2.5752 0.796875 3.2127C0.315625 3.69707 0.1625 4.8002 0.1625 4.8002C0.1625 4.8002 0 6.09707 0 7.39082V8.60332C0 9.89707 0.159375 11.1939 0.159375 11.1939C0.159375 11.1939 0.315625 12.2971 0.79375 12.7814C1.40313 13.4189 2.20313 13.3971 2.55938 13.4658C3.84063 13.5877 8 13.6252 8 13.6252C8 13.6252 11.3625 13.6189 13.6 13.4596C13.9125 13.4221 14.5938 13.4189 15.2031 12.7814C15.6844 12.2971 15.8406 11.1939 15.8406 11.1939C15.8406 11.1939 16 9.90019 16 8.60332V7.39082C16 6.09707 15.8406 4.8002 15.8406 4.8002ZM6.34688 10.0752V5.57832L10.6687 7.83457L6.34688 10.0752Z" />
                    </svg>
                  )}
                  {strategyAuthor.socials.includes("instagram") && (
                    <svg
                      className="h-4 w-4 text-white"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 1.44062C10.1375 1.44062 10.3906 1.45 11.2313 1.4875C12.0125 1.52187 12.4344 1.65313 12.7156 1.7625C13.0875 1.90625 13.3563 2.08125 13.6344 2.35938C13.9156 2.64063 14.0875 2.90625 14.2313 3.27813C14.3406 3.55938 14.4719 3.98437 14.5063 4.7625C14.5438 5.60625 14.5531 5.85938 14.5531 7.99375C14.5531 10.1313 14.5438 10.3844 14.5063 11.225C14.4719 12.0063 14.3406 12.4281 14.2313 12.7094C14.0875 13.0813 13.9125 13.35 13.6344 13.6281C13.3531 13.9094 13.0875 14.0813 12.7156 14.225C12.4344 14.3344 12.0094 14.4656 11.2313 14.5C10.3875 14.5375 10.1344 14.5469 8 14.5469C5.8625 14.5469 5.60938 14.5375 4.76875 14.5C3.9875 14.4656 3.56563 14.3344 3.28438 14.225C2.9125 14.0813 2.64375 13.9063 2.36563 13.6281C2.08438 13.3469 1.9125 13.0813 1.76875 12.7094C1.65938 12.4281 1.52813 12.0031 1.49375 11.225C1.45625 10.3813 1.44688 10.1281 1.44688 7.99375C1.44688 5.85625 1.45625 5.60312 1.49375 4.7625C1.52813 3.98125 1.65938 3.55938 1.76875 3.27813C1.9125 2.90625 2.0875 2.6375 2.36563 2.35938C2.64688 2.07813 2.9125 1.90625 3.28438 1.7625C3.56563 1.65313 3.99063 1.52187 4.76875 1.4875C5.60938 1.45 5.8625 1.44062 8 1.44062Z" />
                    </svg>
                  )}
                  {strategyAuthor.socials.includes("web") && (
                    <svg
                      className="h-4 w-4 text-white"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M8.00016 14.6663C4.31826 14.6663 1.3335 11.6815 1.3335 7.99967C1.3335 6.13798 2.0966 4.45452 3.32708 3.24502M8.00016 14.6663C7.35816 14.1906 7.46063 13.6367 7.7827 13.0828C8.2779 12.2313 8.2779 12.2313 8.2779 11.0959C8.2779 9.96061 8.95256 9.42827 11.3335 9.90441C12.4033 10.1184 13.1829 8.64027 14.5717 9.12834M8.00016 14.6663C11.2974 14.6663 14.0355 12.2727 14.5717 9.12834M3.32708 3.24502C3.89327 3.30477 4.21028 3.6081 4.7368 4.16445C5.73643 5.22069 6.73603 5.30882 7.4025 4.95674C8.4021 4.42863 7.5621 3.57321 8.7353 3.10833C9.45456 2.82335 9.59163 2.077 9.25123 1.4502M3.32708 3.24502C4.53013 2.06248 6.17996 1.33301 8.00016 1.33301C8.42776 1.33301 8.84596 1.37327 9.25123 1.4502M14.5717 9.12834C14.6342 8.76147 14.6668 8.38441 14.6668 7.99967C14.6668 4.74539 12.3351 2.03571 9.25123 1.4502"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
            <div className="flex flex-col gap-4 border-b border-[#181B22] p-4 max-[360px]:gap-3 max-[360px]:p-3">
              <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">
                Reviews
              </h2>

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
              {reviewsToDisplay.map((review, index) => (
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

            {strategyReviews.length > 3 && (
              <div className="p-4 max-[360px]:p-3">
                <button
                  type="button"
                  onClick={() => setShowAllReviews((prev) => !prev)}
                  className="flex h-[26px] w-full items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-4 text-center text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:text-sm"
                >
                  {showAllReviews ? "Show Less Reviews" : "Show More Reviews"}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">
                What you receive
              </h2>
            </div>
            <div className="space-y-3 p-4 text-[13px] font-semibold text-white">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#A06AFF]" />
                Real-time trade and hedge alerts
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#A06AFF]" />
                Weekly model updates with rationale
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#A06AFF]" />
                Office hours with the portfolio team
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">
                Disclaimer
              </h2>
            </div>
            <div className="p-4">
              <p className="text-[15px] font-normal text-[#B0B0B0]">
                Educational content is provided for instructional purposes only
                and does not constitute financial or investment advice. Review
                the
                <a href="#" className="text-[#A06AFF] underline">
                  {" "}
                  Terms of Use
                </a>{" "}
                for additional details.
              </p>
            </div>
          </div>
        </aside>
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

export default StrategyDetailLanding;
