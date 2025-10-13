export type OtherProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label: string;
  location: string;
  rating: string;
  ratingTag: string;
  typeLabel: string;
  industryLabel: string;
  compatibility: string[];
  requirements: string[];
};

export const baseOtherProducts: OtherProduct[] = [
  {
    id: "other-1",
    title: "Auto Script - Automation script",
    description:
      "Auto Script orchestrates multi-broker automation with granular execution control, built for multi-asset desks managing complex workflows.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902",
    imageAlt: "Automation script dashboard",
    label: "Windows/MAC",
    location: "🌍 Australia",
    rating: "4.8",
    ratingTag: "Individual Analyst",
    typeLabel: "Script",
    industryLabel: "Automation",
    compatibility: ["MetaTrader 4", "MetaTrader 5", "TradingView"],
    requirements: ["Python 3.8+", "numpy", "pandas"],
  },
  {
    id: "other-2",
    title: "EventFlow - Research collaboration hub",
    description:
      "Centralize qualitative research, approvals, and compliance workflows with secure permissioning suited for boutique advisory teams.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1d6ae4f3ba95466a9f572bbc22b1ecdd?format=webp&width=900",
    imageAlt: "EventFlow collaboration workspace",
    label: "Web Platform",
    location: "🇬🇧 United Kingdom",
    rating: "4.6",
    ratingTag: "Research Collective",
    typeLabel: "Workspace",
    industryLabel: "Operations",
    compatibility: ["Slack", "Notion", "Google Drive"],
    requirements: ["OAuth Access", "SAML", "REST API"],
  },
  {
    id: "other-3",
    title: "SignalForge - Strategy marketplace",
    description:
      "Curate high-conviction trading ideas with integrated billing, client analytics, and gated content delivery in one branded space.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F6a23e2cb24c04079a9cf5fb82935df6b?format=webp&width=900",
    imageAlt: "Signal marketplace interface",
    label: "Brand Ready",
    location: "🇸🇬 Singapore",
    rating: "4.7",
    ratingTag: "Creator Vault",
    typeLabel: "Platform",
    industryLabel: "Content",
    compatibility: ["Stripe", "Zapier", "Discord"],
    requirements: ["Custom Domain", "Webhooks", "Analytics"],
  },
  {
    id: "other-4",
    title: "CapitalSuite - Investor relations hub",
    description:
      "CapitalSuite streamlines LP communication with live updates, document rooms, and analytics for venture, hedge, and private equity funds.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2Fe0e3ee4a1dd14c12993893ca022cccbe?format=webp&width=900",
    imageAlt: "Investor relations portal",
    label: "Enterprise",
    location: "🇺🇸 United States",
    rating: "4.9",
    ratingTag: "Investor Suite",
    typeLabel: "Portal",
    industryLabel: "Investor Relations",
    compatibility: ["DocuSign", "Snowflake", "Salesforce"],
    requirements: ["SSO", "Audit Logs", "Compliance"],
  },
  {
    id: "other-5",
    title: "QuantDocs - Policy automation",
    description:
      "QuantDocs automates documentation, risk attestations, and compliance reporting for systematic trading firms and emerging managers.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F52bdea3a2a71449a900533a9e2f5e4b0?format=webp&width=900",
    imageAlt: "Compliance documentation tooling",
    label: "Policy Engine",
    location: "🇨🇦 Canada",
    rating: "4.5",
    ratingTag: "Compliance Ready",
    typeLabel: "Automation",
    industryLabel: "Compliance",
    compatibility: ["Slack", "Teams", "Email"],
    requirements: ["Templates", "Legal Review", "SFTP"],
  },
  {
    id: "other-6",
    title: "EdgeBoard - Execution analytics",
    description:
      "EdgeBoard gives execution desks granular metrics across brokers, venues, and algorithms, surfacing slippage and routing insights.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68f20c6547ae4b12afa37a8c090b7b36?format=webp&width=900",
    imageAlt: "Execution analytics dashboard",
    label: "Broker Neutral",
    location: "🇩🇪 Germany",
    rating: "4.6",
    ratingTag: "Desk Intelligence",
    typeLabel: "Analytics",
    industryLabel: "Execution",
    compatibility: ["FIX Logs", "CSV Upload", "REST"],
    requirements: ["Data Warehouse", "ETL", "Permissions"],
  },
];
