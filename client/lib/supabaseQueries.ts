import { supabase } from "./supabaseClient";
import type {
  Analyst,
  InvestmentConsultant,
  Trader,
  Signal,
  Strategy,
  TradingRobot,
  Course,
  ScriptProduct,
  OtherProduct,
} from "@/data/marketplaceTypes";

export async function getAnalysts(): Promise<Analyst[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("analysts")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false });

  if (error) {
    console.error("Error fetching analysts:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    company: row.company,
    role: row.role,
    rating: row.rating,
    followers: row.followers,
    publications: row.publications,
    markets: row.markets,
    assets: row.assets,
    analysis: row.analysis,
    forecastAccuracy: row.forecast_accuracy,
    featured: row.featured,
  }));
}

export async function getInvestmentConsultants(): Promise<InvestmentConsultant[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("investment_consultants")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false });

  if (error) {
    console.error("Error fetching investment consultants:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    credentials: row.credentials,
    avatar: row.avatar,
    company: row.company,
    location: row.location,
    nationwide: row.nationwide,
    description: row.description,
    clients: row.clients,
    riskLevel: row.risk_level,
    aum: row.aum,
    portfolioReturn: row.portfolio_return,
    featured: row.featured,
  }));
}

export async function getTraders(): Promise<Trader[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("traders")
    .select("*")
    .eq("status", "published")
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching traders:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    badge: row.badge,
    followers: row.followers,
    publications: row.publications,
    trades30Days: row.trades_30_days,
    experience: row.experience,
    roiMonth: row.roi_month,
    roiQuarter: row.roi_quarter,
    avgProfitability: row.avg_profitability,
    accuracy: row.accuracy,
    certification: row.certification,
    rating: row.rating,
  }));
}

export async function getSignals(): Promise<Signal[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .or("status.eq.published,status.is.null")
    .order("risk_level", { ascending: true });

  if (error) {
    console.error("Supabase error fetching signals:", error.message || error);
    return [];
  }

  if (!data || !Array.isArray(data)) {
    console.warn("No signals data returned from Supabase");
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    icon: row.icon,
    users: row.users,
    riskLevel: row.risk_level,
    platforms: row.platforms,
    assets: row.assets,
    type: row.type,
    timeframes: row.timeframes,
    use: row.use,
    accuracy: row.accuracy,
    chartImage: row.chart_image,
  }));
}

export async function getStrategies(): Promise<Strategy[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("status", "published")
    .order("risk_level", { ascending: true });

  if (error) {
    console.error("Error fetching strategies:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    icon: row.icon,
    users: row.users,
    riskLevel: row.risk_level as "LOW" | "MEDIUM" | "HIGH",
    profitSharing: row.profit_sharing,
    exchanges: row.exchanges,
    exchangesCount: row.exchanges_count,
    assets: row.assets,
    strategy: row.strategy,
    maxDrawdown: row.max_drawdown,
    minCapital: row.min_capital,
    roi30d: row.roi_30d,
    roi1y: row.roi_1y,
  }));
}

export async function getTradingRobots(): Promise<TradingRobot[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("trading_robots")
    .select("*")
    .eq("status", "published")
    .order("accuracy_level", { ascending: false });

  if (error) {
    console.error("Error fetching trading robots:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    icon: row.icon,
    users: row.users,
    accuracyLabel: row.accuracy_label,
    accuracyLevel: row.accuracy_level as "LOW" | "MEDIUM" | "HIGH",
    profitSharing: row.profit_sharing,
    exchanges: row.exchanges,
    pair: row.pair,
    maxDrawdown: row.max_drawdown,
    market: row.market,
    assetTags: row.asset_tags,
    strategy: row.strategy,
    settingsTag: row.settings_tag,
    roi30d: row.roi_30d,
    roi90d: row.roi_90d,
    roi1y: row.roi_1y,
    automationStyle: row.automation_style as
      | "trend"
      | "grid"
      | "arbitrage"
      | "scalping",
    marketCategory: row.market_category as "spot" | "futures" | "derivatives",
    leverageCategory: row.leverage_category as "low" | "moderate" | "high",
  }));
}

export async function getCourses(): Promise<Course[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image,
    host: row.host,
    students: row.students,
    rating: row.rating,
    duration: row.duration,
    lectures: row.lectures,
    level: row.level,
    levelCategory: row.level_category as
      | "beginner"
      | "intermediate"
      | "advanced"
      | "all",
    materialType: row.material_type as "course" | "training",
    releaseWindow: row.release_window as "24h" | "7d" | "30d",
    format: row.format as "video" | "ebook" | "live",
    focusArea: row.focus_area as
      | "stocks"
      | "forex"
      | "crypto"
      | "options"
      | "macro"
      | "futures",
    language: row.language as "english" | "spanish" | "german",
  }));
}

export async function getScriptProducts(): Promise<ScriptProduct[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("script_products")
    .select("*")
    .eq("status", "published")
    .order("rating_score", { ascending: false });

  if (error) {
    console.error("Error fetching script products:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    heroImage: row.hero_image,
    heroAlt: row.hero_alt,
    typeLabel: row.type_label,
    industryLabel: row.industry_label,
    revenueLabel: row.revenue_label,
    purchases: row.purchases,
    views: row.views,
    creator: {
      name: row.creator_name,
      avatar: row.creator_avatar,
      followers: row.creator_followers,
      tags: row.creator_tags,
    },
    location: row.location,
    verificationLabel: row.verification_label,
    compatibility: row.compatibility,
    requirements: row.requirements,
    ratingScore: row.rating_score,
  }));
}

export async function getOtherProducts(): Promise<OtherProduct[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("other_products")
    .select("*")
    .eq("status", "published")
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching other products:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    label: row.label,
    location: row.location,
    rating: row.rating,
    ratingTag: row.rating_tag,
    typeLabel: row.type_label,
    industryLabel: row.industry_label,
    compatibility: row.compatibility,
    requirements: row.requirements,
  }));
}

export async function getAnalystById(id: string): Promise<Analyst | null> {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("analysts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching analyst:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar,
    company: data.company,
    role: data.role,
    rating: data.rating,
    followers: data.followers,
    publications: data.publications,
    markets: data.markets,
    assets: data.assets,
    analysis: data.analysis,
    forecastAccuracy: data.forecast_accuracy,
    featured: data.featured,
  };
}

export async function getSignalById(id: string): Promise<Signal | null> {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching signal:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    users: data.users,
    riskLevel: data.risk_level,
    platforms: data.platforms,
    assets: data.assets,
    type: data.type,
    timeframes: data.timeframes,
    use: data.use,
    accuracy: data.accuracy,
    chartImage: data.chart_image,
  };
}

export async function getStrategyById(id: string): Promise<Strategy | null> {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching strategy:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    users: data.users,
    riskLevel: data.risk_level as "LOW" | "MEDIUM" | "HIGH",
    profitSharing: data.profit_sharing,
    exchanges: data.exchanges,
    exchangesCount: data.exchanges_count,
    assets: data.assets,
    strategy: data.strategy,
    maxDrawdown: data.max_drawdown,
    minCapital: data.min_capital,
    roi30d: data.roi_30d,
    roi1y: data.roi_1y,
  };
}

export async function getTradingRobotById(
  id: string
): Promise<TradingRobot | null> {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("trading_robots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching trading robot:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    users: data.users,
    accuracyLabel: data.accuracy_label,
    accuracyLevel: data.accuracy_level as "LOW" | "MEDIUM" | "HIGH",
    profitSharing: data.profit_sharing,
    exchanges: data.exchanges,
    pair: data.pair,
    maxDrawdown: data.max_drawdown,
    market: data.market,
    assetTags: data.asset_tags,
    strategy: data.strategy,
    settingsTag: data.settings_tag,
    roi30d: data.roi_30d,
    roi90d: data.roi_90d,
    roi1y: data.roi_1y,
    automationStyle: data.automation_style as
      | "trend"
      | "grid"
      | "arbitrage"
      | "scalping",
    marketCategory: data.market_category as "spot" | "futures" | "derivatives",
    leverageCategory: data.leverage_category as "low" | "moderate" | "high",
  };
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    image: data.image,
    host: data.host,
    students: data.students,
    rating: data.rating,
    duration: data.duration,
    lectures: data.lectures,
    level: data.level,
    levelCategory: data.level_category as
      | "beginner"
      | "intermediate"
      | "advanced"
      | "all",
    materialType: data.material_type as "course" | "training",
    releaseWindow: data.release_window as "24h" | "7d" | "30d",
    format: data.format as "video" | "ebook" | "live",
    focusArea: data.focus_area as
      | "stocks"
      | "forex"
      | "crypto"
      | "options"
      | "macro"
      | "futures",
    language: data.language as "english" | "spanish" | "german",
  };
}

export async function getScriptProductById(
  id: string
): Promise<ScriptProduct | null> {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("script_products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching script product:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    heroImage: data.hero_image,
    heroAlt: data.hero_alt,
    typeLabel: data.type_label,
    industryLabel: data.industry_label,
    revenueLabel: data.revenue_label,
    purchases: data.purchases,
    views: data.views,
    creator: {
      name: data.creator_name,
      avatar: data.creator_avatar,
      followers: data.creator_followers,
      tags: data.creator_tags,
    },
    location: data.location,
    verificationLabel: data.verification_label,
    compatibility: data.compatibility,
    requirements: data.requirements,
    ratingScore: data.rating_score,
  };
}

export async function getOtherProductById(
  id: string
): Promise<OtherProduct | null> {
  if (!supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("other_products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching other product:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    image: data.image,
    imageAlt: data.image_alt,
    label: data.label,
    location: data.location,
    rating: data.rating,
    ratingTag: data.rating_tag,
    typeLabel: data.type_label,
    industryLabel: data.industry_label,
    compatibility: data.compatibility,
    requirements: data.requirements,
  };
}
