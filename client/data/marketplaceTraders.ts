export type Trader = {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  followers: string;
  publications: string;
  trades30Days: string;
  experience: string;
  roiMonth: string;
  roiQuarter: string;
  avgProfitability: string;
  accuracy: string;
  certification: string;
  rating: string;
};

export const baseTraders: Trader[] = [
  {
    id: "sarah-lee-primary",
    name: "Sarah Lee",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    badge: "Securities trading (USA)",
    followers: "15,054",
    publications: "983",
    trades30Days: "45",
    experience: "5 years",
    roiMonth: "+28.4%",
    roiQuarter: "+28.4%",
    avgProfitability: "+4.2%",
    accuracy: "74%",
    certification: "Series 7 (General Securities Representative)",
    rating: "5.0",
  },
  {
    id: "sarah-lee-secondary",
    name: "Sarah Lee",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=800",
    badge: "Securities trading (USA)",
    followers: "12,903",
    publications: "742",
    trades30Days: "39",
    experience: "5 years",
    roiMonth: "+24.1%",
    roiQuarter: "+31.7%",
    avgProfitability: "+3.8%",
    accuracy: "71%",
    certification: "Series 7 (General Securities Representative)",
    rating: "4.9",
  },
];
