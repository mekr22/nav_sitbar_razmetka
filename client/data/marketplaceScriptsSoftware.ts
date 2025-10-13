export type ScriptProduct = {
  id: string;
  title: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  typeLabel: string;
  industryLabel: string;
  revenueLabel: string;
  purchases: string;
  views: string;
  creator: {
    name: string;
    avatar: string;
    followers: string;
    tags: string[];
  };
  location: string;
  verificationLabel: string;
  compatibility: string[];
  requirements: string[];
  ratingScore: string;
};

export const baseScriptProducts: ScriptProduct[] = [
  {
    id: "script-1",
    title: "RiskMaster - Trading risk calculation script",
    description:
      "RiskMaster automatically computes optimal position sizes, stop-loss levels, and capital at risk for every trade. Reduce losses and keep sizing consistent across your portfolio.",
    heroImage: "https://api.builder.io/api/v1/image/assets/TEMP/7825b04c53855449a418b331c5ca1f44ac396b69?width=640",
    heroAlt: "RiskMaster script dashboard preview",
    typeLabel: "Script",
    industryLabel: "Trading and Finance",
    revenueLabel: "USD $15,000/Month",
    purchases: "1.5K",
    views: "563",
    creator: {
      name: "Sarah Lee",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F4a0f255d9e9940ecaf46e40918c30f1f?format=webp&width=800",
      followers: "1,748",
      tags: ["Windows/Mac", "Top Seller"],
    },
    location: "🌍 Australia",
    verificationLabel: "Verified Listing",
    compatibility: ["MetaTrader 4", "MetaTrader 5", "TradingView"],
    requirements: ["Python 3.8+", "numpy", "pandas"],
    ratingScore: "5/5",
  },
  {
    id: "script-2",
    title: "AutoPilot Scalper - High frequency toolkit",
    description:
      "AutoPilot Scalper streams low-latency market data to execute predefined scalping strategies with built-in risk parameters and broker integrations.",
    heroImage: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Faaed2f3b32ce408db3c465b0df120fa4?format=webp&width=800",
    heroAlt: "AutoPilot Scalper interface preview",
    typeLabel: "Software",
    industryLabel: "Quantitative Trading",
    revenueLabel: "USD $11,800/Month",
    purchases: "1.2K",
    views: "742",
    creator: {
      name: "Marcus Boyd",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1360404856214d8bb8f52af8e17826d4?format=webp&width=400",
      followers: "2,304",
      tags: ["Windows/Linux", "Broker Certified"],
    },
    location: "🇬🇧 United Kingdom",
    verificationLabel: "FINTRAC Reviewed",
    compatibility: ["MetaTrader 5", "cTrader", "FIX API"],
    requirements: ["Docker", "Redis", "Node.js 18"],
    ratingScore: "4.8/5",
  },
  {
    id: "script-3",
    title: "SentimentPulse - News analytics engine",
    description:
      "SentimentPulse pulls global headlines and social chatter to score sentiment shifts, triggering alerts when probabilities cross configurable thresholds.",
    heroImage: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F0a7e98b457104686823b8736b17b7f0e?format=webp&width=800",
    heroAlt: "SentimentPulse analytics dashboard",
    typeLabel: "Platform",
    industryLabel: "Analytics",
    revenueLabel: "USD $7,450/Month",
    purchases: "846",
    views: "412",
    creator: {
      name: "Lina Ortega",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fd21757861c5e4dba872f4c3bbcbc54ce?format=webp&width=400",
      followers: "1,105",
      tags: ["Web App", "Real-time"],
    },
    location: "🇪🇸 Spain",
    verificationLabel: "Verified Listing",
    compatibility: ["REST API", "TradingView Webhooks", "Slack"],
    requirements: ["PostgreSQL", "Python 3.9", "spaCy"],
    ratingScore: "4.6/5",
  },
  {
    id: "script-4",
    title: "GridGuru - Automated grid trading suite",
    description:
      "GridGuru deploys adaptive grid strategies with risk caps, market regime detection, and automated rollover management across FX pairs.",
    heroImage: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fd71456683a7f4662a871d57ea9e6c0f1?format=webp&width=800",
    heroAlt: "GridGuru trading suite preview",
    typeLabel: "Script",
    industryLabel: "Forex",
    revenueLabel: "USD $9,920/Month",
    purchases: "1.0K",
    views: "503",
    creator: {
      name: "Priya Desai",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F9541eb0bad6048628c81c4ff80a736f8?format=webp&width=400",
      followers: "1,689",
      tags: ["MetaTrader", "Top Seller"],
    },
    location: "🇸🇬 Singapore",
    verificationLabel: "Certified Vendor",
    compatibility: ["MetaTrader 4", "MetaTrader 5", "NinjaTrader"],
    requirements: ["Windows 10", ".NET 6", "MS SQL"],
    ratingScore: "4.9/5",
  },
  {
    id: "script-5",
    title: "VolatilityVault - Options hedging toolkit",
    description:
      "VolatilityVault automates delta-hedging and volatility arbitrage strategies with broker integrations and customizable hedging rules.",
    heroImage: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F0fdfd1749a3b4dc6a81c8fcb1124f378?format=webp&width=800",
    heroAlt: "VolatilityVault hedging toolkit screens",
    typeLabel: "Software",
    industryLabel: "Derivatives",
    revenueLabel: "USD $13,400/Month",
    purchases: "1.7K",
    views: "689",
    creator: {
      name: "Omar Singh",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F3fd3fb23ae994d01abe69bbd1dc62164?format=webp&width=400",
      followers: "2,421",
      tags: ["Mac/Windows", "Option Desk"],
    },
    location: "🇺🇸 United States",
    verificationLabel: "Verified Listing",
    compatibility: ["Interactive Brokers", "Thinkorswim", "Spreadsheet Export"],
    requirements: ["Python 3.10", "Pandas", "Redis"],
    ratingScore: "4.7/5",
  },
  {
    id: "script-6",
    title: "AlgoFabric - Strategy deployment pipeline",
    description:
      "AlgoFabric packages, backtests, and deploys algorithmic strategies with CI/CD integrations and parameter sweeps for quant teams.",
    heroImage: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Faa4b7d61dc6f474eb35c27fbbcceb847?format=webp&width=800",
    heroAlt: "AlgoFabric deployment pipeline UI",
    typeLabel: "Platform",
    industryLabel: "Quant DevOps",
    revenueLabel: "USD $10,600/Month",
    purchases: "932",
    views: "544",
    creator: {
      name: "Elena Markov",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F86d719d160f04d789c8777324569a25f?format=webp&width=400",
      followers: "1,312",
      tags: ["Kubernetes", "CI/CD"],
    },
    location: "🇩🇪 Germany",
    verificationLabel: "Enterprise Ready",
    compatibility: ["GitHub Actions", "AWS Batch", "Kubernetes"],
    requirements: ["Docker", "Python 3.11", "AWS Account"],
    ratingScore: "4.5/5",
  },
  {
    id: "script-7",
    title: "MacroSpark - Macro event playbook",
    description:
      "MacroSpark aggregates macro calendars and runs scenario backtests. Alerts traders with playbooks and risk guidelines ahead of each major event.",
    heroImage: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1ec47cb3bc8e46079d55a3d1fa8c0704?format=webp&width=800",
    heroAlt: "MacroSpark macro event playbook dashboard",
    typeLabel: "Toolkit",
    industryLabel: "Macro Strategy",
    revenueLabel: "USD $6,850/Month",
    purchases: "768",
    views: "333",
    creator: {
      name: "Nina Patel",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F3f582bb4062345dba9d3a58f06d2760a?format=webp&width=400",
      followers: "1,028",
      tags: ["Calendar", "Live Alerts"],
    },
    location: "🇮🇳 India",
    verificationLabel: "Verified Listing",
    compatibility: ["Excel", "Notion", "Slack"],
    requirements: ["Zapier", "Google Sheets", "REST API"],
    ratingScore: "4.4/5",
  },
  {
    id: "script-8",
    title: "CryptoGuardian - DeFi risk assessor",
    description:
      "CryptoGuardian monitors smart contracts, calculates protocol risk, and pushes emergency alerts with recommended hedges for treasury managers.",
    heroImage: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Ff7f47867aa1a439b9a56c393c5ae9638?format=webp&width=800",
    heroAlt: "CryptoGuardian defi monitoring dashboard",
    typeLabel: "Software",
    industryLabel: "Crypto",
    revenueLabel: "USD $8,300/Month",
    purchases: "1.1K",
    views: "476",
    creator: {
      name: "David Romero",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F4f4fd74771f24b32b74ffc1adc177a5f?format=webp&width=400",
      followers: "1,564",
      tags: ["DeFi", "Security"],
    },
    location: "🇨🇦 Canada",
    verificationLabel: "Security Reviewed",
    compatibility: ["Ethereum", "Arbitrum", "Telegram"],
    requirements: ["Node.js 18", "MongoDB", "Infura Key"],
    ratingScore: "4.8/5",
  },
];
