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
