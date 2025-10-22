import { FC, useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Aperture,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  Calendar,
  ExternalLink,
  Globe2,
  HelpCircle,
  Layers,
  LineChart,
  Lock,
  MapPin,
  Network,
  PieChart,
  Play,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Triangle,
  Users,
  Zap,
} from "lucide-react";

import type { Strategy } from "@/data/marketplaceStrategies";
import { baseStrategies } from "@/data/marketplaceStrategies";

const AVATAR_PLACEHOLDER =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=160";

const COMMENT_AVATAR =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=800";

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

  const riskHighlights = useMemo(
    () => [
      {
        title: "Drawdown guardrails",
        description: `Hard stops and soft throttles trigger when drawdown approaches ${strategy.maxDrawdown}.`,
      },
      {
        title: "Capital buffers",
        description: `Recommended minimum capital of ${strategy.minCapital} keeps hedges funded even during stress events.`,
      },
      {
        title: "Review cadence",
        description: `Risk committee reviews occur ${strategy.profitSharing.includes("25") ? "bi-weekly" : "weekly"} with auto-escalations for overnight gaps.`,
      },
    ],
    [strategy.maxDrawdown, strategy.minCapital, strategy.profitSharing],
  );

  const requirements = useMemo(
    () => [
      { label: "Min capital", value: strategy.minCapital },
      { label: "Access tier", value: strategy.profitSharing },
      { label: "Risk posture", value: strategy.riskLevel },
    ],
    [strategy.minCapital, strategy.profitSharing, strategy.riskLevel],
  );

  const timeline = useMemo(
    () => [
      {
        title: "Strategy launch",
        description: `${strategy.name} rolled out privately in 2021 to seed clients using a ${strategy.strategy.toLowerCase()} framework.`,
      },
      {
        title: "Automation milestone",
        description: "2022 introduced automated rebalance tickets and portfolio drift alerts across the book.",
      },
      {
        title: "Live subscriber program",
        description: "2023 expanded access to managed accounts with real-time reporting dashboards.",
      },
    ],
    [strategy.name, strategy.strategy],
  );

  const teamMembers = useMemo(
    () => [
      {
        name: "Avery Collins",
        role: "Lead Strategist",
        summary: `${strategy.name} playbook owner with 12 years overseeing systematic ${strategy.strategy.toLowerCase()} desks across New York and Singapore.`,
      },
      {
        name: "Noah Kim",
        role: "Quant Research",
        summary: "Builds scenario tests, stress paths, and factor dashboards that keep the portfolio responsive during regime shifts.",
      },
      {
        name: "Leah Ortiz",
        role: "Client Success",
        summary: "Hosts onboarding workshops and weekly office hours focused on execution hygiene and capital efficiency.",
      },
    ],
    [strategy.name, strategy.strategy],
  );

  const faqs = useMemo(
    () => [
      {
        question: "How often are adjustments published?",
        answer:
          "Model updates are posted every Sunday night with intra-week alerts if volatility exceeds predefined guardrails.",
      },
      {
        question: "Can I copy trades automatically?",
        answer:
          "Yes. API keys can be linked to supported brokers. Execution remains under your control with optional mirror-trading flows.",
      },
      {
        question: "What should I expect around drawdowns?",
        answer:
          `Soft drawdown alerts start at 50% of the ${strategy.maxDrawdown} cap. Hard exits deploy if risk breaches the ceiling.`,
      },
    ],
    [strategy.maxDrawdown],
  );

  const liveSignals = useMemo(
    () => [
      {
        title: "Rotation into momentum basket",
        timeAgo: "35 minutes ago",
        description: "Rebalanced mid-cap tech sleeve after liquidity surge. Scaling into outperforming constituents with trailing stops.",
        tags: ["execution", "rebalance"],
      },
      {
        title: "Macro hedge adjustment",
        timeAgo: "2 hours ago",
        description: "Rolled protective put spread ahead of CPI release. Volatility premium provides downside insurance.",
        tags: ["risk", "volatility"],
      },
      {
        title: "Income sleeve update",
        timeAgo: "6 hours ago",
        description: "Added covered call overlay to dividend holdings to enhance carry whilst preserving downside buffers.",
        tags: ["income", "options"],
      },
    ],
    [],
  );

  const changelog = useMemo(
    () => [
      {
        date: "Apr 14, 2024",
        title: "Added dynamic hedging rules",
        summary: "Introduced adaptive delta thresholds that reset after macro events to keep drawdown risk inside limits.",
      },
      {
        date: "Mar 29, 2024",
        title: "Expanded exchange coverage",
        summary: "Connected to two additional derivatives venues improving futures liquidity during European hours.",
      },
      {
        date: "Mar 08, 2024",
        title: "Automation pack v2",
        summary: "Released checklist templates, execution scripts, and workbook for quarterly rebalance workflows.",
      },
    ],
    [],
  );

  const communityComments = useMemo(
    () => [
      {
        id: "comment-1",
        author: "Harper Mills",
        role: "Family office PM",
        timeAgo: "1 day ago",
        text: "Appreciate the pre-trade context in each alert. Helps our ops desk prepare hedges before liquidity dries up.",
        tags: ["ops", "hedging"],
      },
      {
        id: "comment-2",
        author: "Jordan Singh",
        role: "Crypto desk lead",
        timeAgo: "3 days ago",
        text: "The traffic-light risk dashboard prevented us from oversizing during the recent volatility spike.",
        tags: ["risk", "dashboard"],
      },
    ],
    [],
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

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Risk management & requirements</h2>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#B0B0B0]">
                <AlertTriangle className="h-4 w-4 text-[#A06AFF]" />
                Updated weekly
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                {riskHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#A06AFF]" />
                      <span className="text-[15px] font-semibold text-white">{item.title}</span>
                    </div>
                    <p className="text-[13px] font-medium text-[#B0B0B0]">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {requirements.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-3">
                    <div className="flex items-center gap-2">
                      {item.label === "Min capital" ? (
                        <DollarSign className="h-4 w-4 text-[#A06AFF]" />
                      ) : item.label === "Access tier" ? (
                        <Lock className="h-4 w-4 text-[#A06AFF]" />
                      ) : (
                        <Activity className="h-4 w-4 text-[#A06AFF]" />
                      )}
                      <span className="text-[15px] font-semibold text-white">{item.label}</span>
                    </div>
                    <span className="text-[15px] font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Implementation timeline</h2>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#B0B0B0]">
                  <Clock className="h-4 w-4 text-[#A06AFF]" />
                  Updated quarterly
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-3">
              {timeline.map((entry) => (
                <div key={entry.title} className="rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#2E2744]">
                    <Calendar className="h-5 w-5 text-[#A06AFF]" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white">{entry.title}</h3>
                  <p className="text-[13px] font-medium text-[#B0B0B0]">{entry.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Team & story</h2>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex flex-col gap-3 rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-3">
                  <div className="flex items-center gap-3">
                    <img src={AVATAR_PLACEHOLDER} alt={member.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <div className="text-[15px] font-semibold text-white">{member.name}</div>
                      <div className="text-xs font-semibold uppercase text-[#B0B0B0]">{member.role}</div>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-[#B0B0B0]">{member.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Frequently asked questions</h2>
                <button
                  type="button"
                  onClick={() => navigate("/marketplace/strategies", { state: { scrollToTop: true } })}
                  className="flex items-center gap-1 rounded-full border border-[#181B22] px-3 py-1 text-xs font-semibold text-[#A06AFF] transition-colors hover:border-[#A06AFF]"
                >
                  Support
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                    <span className="text-[15px] font-semibold text-white">{faq.question}</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#181B22] transition-colors group-open:border-[#A06AFF]">
                      <Plus className="h-4 w-4 text-[#A06AFF] transition-transform group-open:rotate-45" />
                    </div>
                  </summary>
                  <div className="mt-3 text-[13px] font-medium text-[#B0B0B0]">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Live signals feed</h2>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#B0B0B0]">
                  <Zap className="h-4 w-4 text-[#A06AFF]" />
                  Streaming
                </div>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {liveSignals.map((signal) => (
                <div key={signal.title} className="rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-white">
                      <Bell className="h-4 w-4 text-[#A06AFF]" />
                      {signal.title}
                    </div>
                    <span className="text-xs font-semibold uppercase text-[#B0B0B0]">{signal.timeAgo}</span>
                  </div>
                  <p className="text-[13px] font-medium text-[#B0B0B0]">{signal.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {signal.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-semibold uppercase text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Changelog</h2>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#B0B0B0]">
                  <RefreshCcw className="h-4 w-4 text-[#A06AFF]" />
                  Last synced 3 days ago
                </div>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {changelog.map((entry) => (
                <div key={entry.date + entry.title} className="rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-[15px] font-semibold text-white">{entry.title}</div>
                      <div className="text-xs font-semibold uppercase text-[#B0B0B0]">{entry.date}</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-[#181B22] px-3 py-1 text-xs font-semibold text-[#A06AFF] transition-colors hover:border-[#A06AFF]"
                    >
                      View log
                    </button>
                  </div>
                  <p className="mt-2 text-[13px] font-medium text-[#B0B0B0]">{entry.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)]">
            <div className="border-b border-[#181B22] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF]">Community comments</h2>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#B0B0B0]">
                  <Users className="h-4 w-4 text-[#A06AFF]" />
                  {communityComments.length} contributions
                </div>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {communityComments.map((comment) => (
                <article key={comment.id} className="rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4">
                  <header className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img src={COMMENT_AVATAR} alt={comment.author} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <div className="text-[15px] font-semibold text-white">{comment.author}</div>
                        <div className="text-xs font-semibold uppercase text-[#B0B0B0]">{comment.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#B0B0B0]">
                      <Clock className="h-4 w-4 text-[#A06AFF]" />
                      {comment.timeAgo}
                    </div>
                  </header>
                  <p className="text-[13px] font-medium text-[#B0B0B0]">{comment.text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {comment.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-semibold uppercase text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
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
