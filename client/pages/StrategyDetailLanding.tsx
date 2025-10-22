import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Aperture,
  ArrowUpRight,
  Bell,
  Bookmark,
  Check,
  ExternalLink,
  Globe2,
  HelpCircle,
  Layers,
  LineChart,
  MapPin,
  Network,
  PieChart,
  Play,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { Strategy } from "@/data/marketplaceStrategies";
import { baseStrategies } from "@/data/marketplaceStrategies";

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
  MEDIUM: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80",
  HIGH: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
};

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

  const locationState = location.state as
    | {
        strategy?: Strategy;
        isFavorite?: boolean;
      }
    | null;

  const [isFavorite, setIsFavorite] = useState(Boolean(locationState?.isFavorite));
  const [comments, setComments] = useState<CommentNode[]>(() => INITIAL_COMMENTS);
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
    const numeric = Number.parseFloat(strategy.minCapital.replace(/[^0-9.]/g, ""));
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

  const heroTagline = useMemo(
    () =>
      `${strategy.strategy} engine with ${strategy.riskLevel.toLowerCase()} risk controls and ${strategy.profitSharing.toLowerCase()}.`,
    [strategy.profitSharing, strategy.riskLevel, strategy.strategy],
  );

  const description = useMemo(
    () =>
      `${strategy.name} allocates across ${assetsSummary.toLowerCase()} while monitoring ${strategy.exchangesCount}+ venues including ${exchangesSummary}. The playbook emphasises disciplined position sizing and adaptive hedging to keep drawdowns near ${strategy.maxDrawdown}.`,
    [assetsSummary, exchangesSummary, strategy.exchangesCount, strategy.maxDrawdown, strategy.name],
  );

  const performanceMetrics = useMemo(
    () => [
      {
        icon: TrendingUp,
        label: "30 day ROI",
        value: strategy.roi30d,
        description: "Trailing performance across the last 30 trading sessions.",
      },
      {
        icon: ArrowUpRight,
        label: "1 year ROI",
        value: strategy.roi1y,
        description: "Total net return generated over the previous 12 months.",
      },
      {
        icon: Activity,
        label: "Risk level",
        value: strategy.riskLevel,
        description: "Target volatility profile applied to the managed basket.",
      },
      {
        icon: Layers,
        label: "Asset mix",
        value: assetsSummary,
        description: "Primary instruments included in the core rotation.",
      },
    ],
    [assetsSummary, strategy.riskLevel, strategy.roi1y, strategy.roi30d],
  );

  const quickStats = useMemo(
    () => [
      { label: "Users", value: usersCount ? usersCount.toLocaleString() : "N/A" },
      { label: "Profit sharing", value: strategy.profitSharing },
      { label: "Min capital", value: strategy.minCapital },
      { label: "Max drawdown", value: strategy.maxDrawdown },
    ],
    [strategy.maxDrawdown, strategy.minCapital, strategy.profitSharing, usersCount],
  );

  const highlights = useMemo(
    () => [
      {
        title: "Multi-venue coverage",
        description: `Signals aggregate order flow from ${strategy.exchangesCount}+ listed venues such as ${exchangesSummary}.`,
      },
      {
        title: "Capital efficiency",
        description: `Optimised for allocations starting at ${strategy.minCapital}, scaling position sizes relative to volatility.`,
      },
      {
        title: "Playbook templates",
        description: "Comes with weekly rebalancing checklists, portfolio drift alerts, and scenario drills for macro shocks.",
      },
    ],
    [exchangesSummary, strategy.exchangesCount, strategy.minCapital],
  );


  const tags = useMemo(
    () =>
      [strategy.strategy, strategy.riskLevel, strategy.profitSharing, ...strategy.assets]
        .map((entry) => entry.toUpperCase())
        .slice(0, 8),
    [strategy.assets, strategy.profitSharing, strategy.riskLevel, strategy.strategy],
  );

  const coverImage = useMemo(
    () => COVER_IMAGE_BY_RISK[strategy.riskLevel] ?? COVER_IMAGE_BY_RISK.MEDIUM,
    [strategy.riskLevel],
  );

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
              <span className="text-[15px] font-bold text-white">{comment.author}</span>
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
          <button type="button" className="rounded-full px-4 py-2 text-[15px] font-bold text-white max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm">
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

  const commentCount = useMemo(() => {
    const countNodes = (nodes: CommentNode[]): number =>
      nodes.reduce(
        (total, node) =>
          total + 1 + (node.replies && node.replies.length > 0 ? countNodes(node.replies) : 0),
        0,
      );

    return countNodes(comments);
  }, [comments]);

  const remainingComments = Math.max(commentCount - comments.length, 0);
  const commentCountLabel = commentCount === 1 ? "1 comment" : `${commentCount} comments`;

  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
  }, []);

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

      <header className="mb-6 flex flex-col gap-3 rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px] sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-[31px] font-bold leading-tight text-white">{strategy.name}</h1>
          <p className="max-w-[620px] text-[15px] font-medium text-[#B0B0B0]">{heroTagline}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold uppercase text-white">
              <LineChart className="h-3.5 w-3.5 text-[#A06AFF]" />
              {strategy.strategy}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold uppercase text-white">
              <Aperture className="h-3.5 w-3.5 text-[#A06AFF]" />
              {strategy.profitSharing}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold uppercase text-white">
              <Globe2 className="h-3.5 w-3.5 text-[#A06AFF]" />
              {distribution}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#181B22] text-[#808283] transition-colors hover:border-[#A06AFF] hover:text-[#A06AFF]"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove strategy from favourites" : "Add strategy to favourites"}
        >
          <Star className={`h-5 w-5 ${isFavorite ? "fill-[#A06AFF] text-[#A06AFF]" : ""}`} />
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_339px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px]">
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                        <metric.icon className="h-4 w-4 text-[#A06AFF]" />
                        {metric.label}
                      </div>
                      <div className="text-[21px] font-bold text-white">{metric.value}</div>
                      <p className="mt-2 text-[13px] font-medium text-[#B0B0B0]">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="flex flex-col gap-3 rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4">
                <h3 className="text-[15px] font-semibold text-white">Snapshot</h3>
                <div className="grid gap-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#B0B0B0]">{stat.label}</span>
                      <span className="text-[15px] font-bold text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-[#181B22] bg-[#0C1014]/70 p-3 text-xs font-semibold text-[#B0B0B0]">
                  <HelpCircle className="mr-2 inline h-4 w-4 text-[#A06AFF]" />
                  Subscribers receive weekly recap videos, executable checklists, and direct access to team office hours.
                </div>
              </aside>
            </div>

            <div className="mt-6 relative aspect-video w-full overflow-hidden rounded-2xl border border-[#181B22] bg-[#0C1014]/60">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Strategy preview"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/80 px-3 py-1 text-xs font-semibold uppercase text-white backdrop-blur transition-colors hover:border-[#A06AFF]"
              >
                External preview
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Strategy overview</h2>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-[15px] font-normal text-white">{description}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {highlights.map((highlight) => (
                  <div key={highlight.title} className="rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#A06AFF]" />
                      <span className="text-[15px] font-semibold text-white">{highlight.title}</span>
                    </div>
                    <p className="text-[13px] font-medium text-[#B0B0B0]">{highlight.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-semibold uppercase text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-4 max-[360px]:p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white max-[360px]:text-xl">{commentCountLabel}</h2>
              <div className="flex items-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px] max-[360px]:p-0.5">
                <button
                  type="button"
                  aria-label="Sort comments"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_strategy_comments_sort)">
                      <path d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 5.33301V7.99967L9.33333 9.33301" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              {remainingComments > 0 && (
                <div className="flex justify-center">
                  <button className="flex h-[26px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2.5 max-[360px]:px-4 max-[360px]:py-2">
                    <span className="text-center text-[15px] font-bold text-white max-[360px]:text-sm">{remainingComments} more comments</span>
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
                src={coverImage}
                alt={strategy.name}
                className="h-[332px] w-full rounded-t-3xl border border-[#181B22] object-cover"
              />
              <button
                type="button"
                onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white shadow-[0_12px_24px_0_rgba(0,0,0,0.48)]"
              >
                <Play className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase text-[#B0B0B0]">Subscription</div>
                  <div className="text-2xl font-bold text-white">{subscriptionPrice}</div>
                </div>
                <div className="flex items-center gap-1 rounded bg-[#2E2744] px-2 py-0.5 text-xs font-semibold uppercase text-white">
                  <Star className="h-3.5 w-3.5 text-[#A06AFF]" />
                  {strategy.riskLevel}
                </div>
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
                  Subscribe now
                </button>
                <button className="flex h-[46px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                  Chat with team
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">What you receive</h2>
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
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Disclaimer</h2>
            </div>
            <div className="p-4">
              <p className="text-[15px] font-normal text-[#B0B0B0]">
                Educational content is provided for instructional purposes only and does not constitute financial or investment advice. Review the
                <a href="#" className="text-[#A06AFF] underline"> Terms of Use</a> for additional details.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StrategyDetailLanding;
