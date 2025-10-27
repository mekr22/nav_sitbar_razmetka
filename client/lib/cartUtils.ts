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
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.name,
        subtitle: resolveSubtitle(product.type, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.icon ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            riskLevel: product.riskLevel,
            platforms: product.platforms,
          },
          options?.metadata,
        ),
      };
    }

    case "strategy": {
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.name,
        subtitle: resolveSubtitle(product.strategy, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.icon ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            riskLevel: product.riskLevel,
            minCapital: product.minCapital,
            roi30d: product.roi30d,
          },
          options?.metadata,
        ),
      };
    }

    case "trading-robot": {
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.name,
        subtitle: resolveSubtitle(product.strategy, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.icon ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            accuracyLabel: product.accuracyLabel,
            market: product.market,
            automationStyle: product.automationStyle,
          },
          options?.metadata,
        ),
      };
    }

    case "course": {
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.title,
        subtitle: resolveSubtitle(product.subtitle, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.image ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            duration: product.duration,
            format: product.format,
            level: product.level,
          },
          options?.metadata,
        ),
      };
    }

    case "script": {
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.title,
        subtitle: resolveSubtitle(product.typeLabel, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.heroImage ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            revenueLabel: product.revenueLabel,
            ratingScore: product.ratingScore,
            creatorName: product.creator?.name,
          },
          options?.metadata,
        ),
      };
    }

    case "other": {
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.title,
        subtitle: resolveSubtitle(product.label, options?.subtitle),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.image ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            rating: product.rating,
            ratingTag: product.ratingTag,
            industry: product.industryLabel,
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
