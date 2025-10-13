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
    title: "Auto Script - Automation",
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
    compatibility: ["MetaTrader 4", "MetaTrader 5"],
    requirements: ["Python 3.8+", "numpy", "pandas"],
  },
  {
    id: "other-2",
    title: "EventFlow - Research collaboration",
    description:
      "Centralize qualitative research, approvals, and compliance workflows with secure permissioning suited for boutique advisory teams.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902",
    imageAlt: "Automation script dashboard",
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
    image: "https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902",
    imageAlt: "Automation script dashboard",
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
    image: "https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902",
    imageAlt: "Automation script dashboard",
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
    image: "https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902",
    imageAlt: "Automation script dashboard",
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
    image: "https://api.builder.io/api/v1/image/assets/TEMP/11be63f95ae12fcb0e993c20038328c213b1b15f?width=902",
    imageAlt: "Automation script dashboard",
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
