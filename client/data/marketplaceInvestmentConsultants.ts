export type InvestmentConsultant = {
  id: string;
  name: string;
  icon: string;
  expertise: string;
  clients: string;
  experience: string;
  certifications: string[];
  specialties: string[];
  languages: string[];
  consultationFee: string;
  responseTime: string;
};

export const baseInvestmentConsultants: InvestmentConsultant[] = [
  {
    id: "consultant-douglas",
    name: "Douglas Reed",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
    expertise: "Global Portfolio Structuring",
    clients: "172",
    experience: "12 years",
    certifications: ["CFA", "FRM"],
    specialties: ["Portfolio Allocation", "Risk Hedging", "Yield Strategies"],
    languages: ["English", "German"],
    consultationFee: "$299 / session",
    responseTime: "within 2 hours",
  },
  {
    id: "consultant-vera",
    name: "Vera Collins",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
    expertise: "Income Portfolio Optimization",
    clients: "248",
    experience: "9 years",
    certifications: ["CPA", "CFA"],
    specialties: ["Dividend Strategies", "Retirement Planning", "Tax-Efficient Investing"],
    languages: ["English", "Spanish"],
    consultationFee: "$249 / session",
    responseTime: "within 4 hours",
  },
  {
    id: "consultant-raj",
    name: "Rajesh Patel",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
    expertise: "Alternative Investments Advisory",
    clients: "198",
    experience: "11 years",
    certifications: ["CAIA", "MBA"],
    specialties: ["Private Equity", "Real Assets", "Hedge Funds"],
    languages: ["English", "Hindi"],
    consultationFee: "$329 / session",
    responseTime: "within 6 hours",
  },
  {
    id: "consultant-nina",
    name: "Nina Volkov",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
    expertise: "Wealth Preservation & Legacy",
    clients: "156",
    experience: "15 years",
    certifications: ["CFP", "STEP"],
    specialties: ["Estate Planning", "Family Offices", "Succession"],
    languages: ["English", "Russian"],
    consultationFee: "$359 / session",
    responseTime: "within 3 hours",
  },
  {
    id: "consultant-maria",
    name: "Maria Sousa",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
    expertise: "Emerging Markets Wealth",
    clients: "184",
    experience: "10 years",
    certifications: ["CFA", "CMT"],
    specialties: ["Latin America", "FX Hedging", "Thematic Investing"],
    languages: ["English", "Portuguese", "Spanish"],
    consultationFee: "$279 / session",
    responseTime: "within 3 hours",
  },
  {
    id: "consultant-james",
    name: "James Porter",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
    expertise: "Institutional Advisory",
    clients: "204",
    experience: "13 years",
    certifications: ["MBA", "CFA"],
    specialties: ["Pension Funds", "Asset Liability", "Governance"],
    languages: ["English", "French"],
    consultationFee: "$349 / session",
    responseTime: "within 5 hours",
  },
];
