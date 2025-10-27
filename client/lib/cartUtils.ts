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
  description?: string | null;
};

export type CartInsertPayload = {
  productType: ProductType;
  productId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
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
  if (Number.isNaN(value) || !Number.isFinite(value as number)) {
    return 1;
  }
  const normalized = Math.floor(Math.max(1, value as number));
  return normalized;
}

function parsePriceToCents(price: string | number | undefined): number | null {
  if (typeof price === "number" && Number.isFinite(price)) {
    if (price >= 1) {
      return Math.round(price * 100);
    }
    if (price >= 0) {
      return Math.round(price * 100);
    }
    return null;
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
    const normalized = Math.max(0, Math.round(options.priceCents));
    return normalized;
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

function resolveDescription(
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
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.name,
        subtitle: resolveSubtitle(product.company, options?.subtitle),
        description: resolveDescription(product.analysis ?? null, options?.description),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.avatar ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            rating: product.rating,
            followers: product.followers,
            role: product.role,
          },
          options?.metadata,
        ),
      };
    }

    case "investment-consultant": {
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.name,
        subtitle: resolveSubtitle(product.company, options?.subtitle),
        description: resolveDescription(product.description ?? null, options?.description),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.avatar ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            riskLevel: product.riskLevel,
            clients: product.clients,
            portfolioReturn: product.portfolioReturn,
          },
          options?.metadata,
        ),
      };
    }

    case "trader": {
      const pricing = resolvePriceCents(productType, options);
      return {
        productType,
        productId: product.id,
        title: product.name,
        subtitle: resolveSubtitle(product.badge, options?.subtitle),
        description: resolveDescription(product.experience ?? null, options?.description),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.avatar ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            roiMonth: product.roiMonth,
            roiQuarter: product.roiQuarter,
            accuracy: product.accuracy,
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
        description: resolveDescription(product.use ?? null, options?.description),
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
        description: resolveDescription(product.profitSharing ?? null, options?.description),
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
        description: resolveDescription(product.profitSharing ?? null, options?.description),
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
        description: resolveDescription(product.host ?? null, options?.description),
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
        description: resolveDescription(product.description ?? null, options?.description),
        priceCents: pricing,
        priceCurrency: DEFAULT_CURRENCY,
        quantity,
        imageUrl: resolveImage(product.heroImage ?? null, options?.imageUrl),
        metadata: mergeMetadata(
          {
            revenueLabel: product.revenueLabel,
            ratingScore: product.ratingScore,
            creatorName: product.creator?.name ?? product.creatorName,
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
        description: resolveDescription(product.description ?? null, options?.description),
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
