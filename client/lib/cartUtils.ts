import {
  type Analyst,
  type InvestmentConsultant,
  type Trader,
  type Signal,
  type Strategy,
  type TradingRobot,
  type Course,
  type ScriptProduct,
  type OtherProduct,
} from "@/data/marketplaceTypes";
import type { ProductType } from "@/lib/supabaseFavorites";

export type ProductTypeMap = {
  analyst: Analyst;
  "investment-consultant": InvestmentConsultant;
  trader: Trader;
  signal: Signal;
  strategy: Strategy;
  "trading-robot": TradingRobot;
  course: Course;
  script: ScriptProduct;
  other: OtherProduct;
};

export type CartBuilderOptions = {
  price?: string | number;
  priceCents?: number;
  quantity?: number;
  imageUrl?: string | null;
  subtitle?: string | null;
  metadata?: Record<string, unknown>;
};

export type CartInsertPayload = {
  productType: ProductType;
  productId: string;
  title: string;
  subtitle: string | null;
  priceCents: number;
  priceCurrency: string;
  quantity: number;
  imageUrl: string | null;
  metadata: Record<string, unknown> | null;
};

const DEFAULT_PRICE_CENTS: Record<ProductType, number> = {
  analyst: 14900,
  "investment-consultant": 21900,
  trader: 12900,
  signal: 9900,
  strategy: 29900,
  "trading-robot": 34900,
  course: 15900,
  script: 8900,
  other: 10900,
};

const DEFAULT_CURRENCY = "USD";

const SAFE_NUMBER_REGEX = /-?\d+(?:[.,]\d+)?/;

function clampQuantity(value: number | undefined): number {
  if (value === undefined || Number.isNaN(value) || !Number.isFinite(value)) {
    return 1;
  }
  return Math.max(1, Math.floor(value));
}

function parsePriceToCents(price: string | number | undefined): number | null {
  if (typeof price === "number" && Number.isFinite(price) && price >= 0) {
    return Math.round(price * 100);
  }

  if (typeof price === "string") {
    const sanitized = price.replace(/,/g, "");
    const match = sanitized.match(SAFE_NUMBER_REGEX);
    if (!match) {
      return null;
    }
    const parsed = Number.parseFloat(match[0]);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return null;
    }
    return Math.round(parsed * 100);
  }

  return null;
}

function resolvePriceCents(
  productType: ProductType,
  options?: CartBuilderOptions,
): number {
  if (options?.priceCents !== undefined) {
    return Math.max(0, Math.round(options.priceCents));
  }

  const parsed = parsePriceToCents(options?.price);
  if (parsed !== null) {
    return parsed;
  }

  return DEFAULT_PRICE_CENTS[productType];
}

function mergeMetadata(
  base: Record<string, unknown>,
  overrides: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!overrides || Object.keys(overrides).length === 0) {
    return Object.keys(base).length > 0 ? base : null;
  }
  return { ...base, ...overrides };
}

function resolveSubtitle(
  fallback: string | null,
  override: string | null | undefined,
): string | null {
  if (override !== undefined) {
    return override;
  }
  return fallback;
}

function resolveImage(
  fallback: string | null,
  override: string | null | undefined,
): string | null {
  if (override !== undefined) {
    return override;
  }
  return fallback;
}

export function buildCartInsertPayload<K extends ProductType>(
  productType: K,
  product: ProductTypeMap[K],
  options?: CartBuilderOptions,
): CartInsertPayload {
  const quantity = clampQuantity(options?.quantity);

  switch (productType) {
    case "analyst": {
      const analyst = product as Analyst;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: analyst.id,
        title: analyst.name,
        subtitle: resolveSubtitle(analyst.company, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(analyst.avatar ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            rating: analyst.rating,
            followers: analyst.followers,
            role: analyst.role,
          },
          options?.metadata,
        ),
      };
    }

    case "investment-consultant": {
      const consultant = product as InvestmentConsultant;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: consultant.id,
        title: consultant.name,
        subtitle: resolveSubtitle(consultant.company, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(consultant.avatar ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            riskLevel: consultant.riskLevel,
            clients: consultant.clients,
            portfolioReturn: consultant.portfolioReturn,
          },
          options?.metadata,
        ),
      };
    }

    case "trader": {
      const trader = product as Trader;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: trader.id,
        title: trader.name,
        subtitle: resolveSubtitle(trader.badge, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(trader.avatar ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            roiMonth: trader.roiMonth,
            roiQuarter: trader.roiQuarter,
            accuracy: trader.accuracy,
          },
          options?.metadata,
        ),
      };
    }

    case "signal": {
      const signal = product as Signal;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: signal.id,
        title: signal.name,
        subtitle: resolveSubtitle(signal.type, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(signal.icon ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            riskLevel: signal.riskLevel,
            platforms: signal.platforms,
          },
          options?.metadata,
        ),
      };
    }

    case "strategy": {
      const strategy = product as Strategy;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: strategy.id,
        title: strategy.name,
        subtitle: resolveSubtitle(strategy.strategy, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(strategy.icon ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            riskLevel: strategy.riskLevel,
            minCapital: strategy.minCapital,
            roi30d: strategy.roi30d,
          },
          options?.metadata,
        ),
      };
    }

    case "trading-robot": {
      const robot = product as TradingRobot;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: robot.id,
        title: robot.name,
        subtitle: resolveSubtitle(robot.strategy, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(robot.icon ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            accuracyLabel: robot.accuracyLabel,
            market: robot.market,
            automationStyle: robot.automationStyle,
          },
          options?.metadata,
        ),
      };
    }

    case "course": {
      const course = product as Course;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: course.id,
        title: course.title,
        subtitle: resolveSubtitle(course.subtitle, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(course.image ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            duration: course.duration,
            format: course.format,
            level: course.level,
          },
          options?.metadata,
        ),
      };
    }

    case "script": {
      const script = product as ScriptProduct;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: script.id,
        title: script.title,
        subtitle: resolveSubtitle(script.typeLabel, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(script.heroImage ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            revenueLabel: script.revenueLabel,
            ratingScore: script.ratingScore,
            creatorName: script.creator?.name,
          },
          options?.metadata,
        ),
      };
    }

    case "other": {
      const other = product as OtherProduct;
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: other.id,
        title: other.title,
        subtitle: resolveSubtitle(other.label, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(other.image ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            rating: other.rating,
            ratingTag: other.ratingTag,
            industry: other.industryLabel,
          },
          options?.metadata,
        ),
      };
    }

    default: {
      const exhaustiveCheck: never = productType;
      throw new Error(`Unsupported product type "${exhaustiveCheck}"`);
    }
  }
}
