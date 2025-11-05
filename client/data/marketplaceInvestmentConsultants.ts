export type InvestmentConsultant = {
  id: string;
  name: string;
  credentials: string;
  avatar: string;
  company: string;
  location: string;
  nationwide: boolean;
  description: string;
  clients: string;
  riskLevel: string;
  aum: string;
  portfolioReturn: string;
  featured?: boolean;
};

export const baseInvestmentConsultants: InvestmentConsultant[] = [
  {
    id: "consultant-sarah-lee",
    name: "Sarah Lee",
    credentials: "CFP®",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "SONMORE FINANCIAL",
    location: "Chandler, AZ",
    nationwide: true,
    description:
      "Helping Retirees and Professionals in Aerospace and Tech Minimize Taxes",
    clients: "232",
    riskLevel: "Moderate",
    aum: "$4.2M",
    portfolioReturn: "+0.00%",
    featured: true,
  },
  {
    id: "consultant-james-wilson",
    name: "James Wilson",
    credentials: "CFA",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "WEALTH ADVISORS GROUP",
    location: "New York, NY",
    nationwide: true,
    description:
      "Specialized in High Net Worth Portfolio Management and Estate Planning",
    clients: "187",
    riskLevel: "Conservative",
    aum: "$6.8M",
    portfolioReturn: "+2.4%",
  },
  {
    id: "consultant-emma-cooper",
    name: "Emma Cooper",
    credentials: "CFA",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "COOPER WEALTH PARTNERS",
    location: "Austin, TX",
    nationwide: false,
    description:
      "Navigating growth portfolios with a focus on sustainable returns",
    clients: "143",
    riskLevel: "Balanced",
    aum: "$3.1M",
    portfolioReturn: "+5.2%",
  },
  {
    id: "consultant-hannah-larsen",
    name: "Hannah Larsen",
    credentials: "CFP®",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "LARSEN FAMILY OFFICES",
    location: "Seattle, WA",
    nationwide: true,
    description:
      "Legacy planning and wealth preservation for multigenerational families",
    clients: "165",
    riskLevel: "Conservative",
    aum: "$8.7M",
    portfolioReturn: "+3.1%",
  },
  {
    id: "consultant-omar-saeed",
    name: "Omar Saeed",
    credentials: "MBA",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "SAEED CAPITAL",
    location: "Dubai, UAE",
    nationwide: false,
    description: "Cross-border investment strategies for emerging markets",
    clients: "214",
    riskLevel: "Moderate",
    aum: "$5.4M",
    portfolioReturn: "+4.8%",
  },
  {
    id: "consultant-lisa-chen",
    name: "Lisa Chen",
    credentials: "CPA",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    company: "CHEN STRATEGIC ADVISORY",
    location: "San Francisco, CA",
    nationwide: true,
    description: "Tax-optimized strategies for tech executives and founders",
    clients: "201",
    riskLevel: "Growth",
    aum: "$7.6M",
    portfolioReturn: "+6.4%",
  },
];
