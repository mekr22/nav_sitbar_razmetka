import { supabase } from "./supabaseClient";
import {
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

const toErrorMessage = (error: unknown): string => {
  if (!error) {
    return "Unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
};

const isLikelyNetworkError = (message: string): boolean =>
  message.toLowerCase().includes("failed to fetch");

export type ProductType =
  | "analyst"
  | "investment-consultant"
  | "trader"
  | "signal"
  | "strategy"
  | "trading-robot"
  | "course"
  | "script"
  | "other";

export type FavoriteProduct =
  | (Analyst & { type: "analyst" })
  | (InvestmentConsultant & { type: "investment-consultant" })
  | (Trader & { type: "trader" })
  | (Signal & { type: "signal" })
  | (Strategy & { type: "strategy" })
  | (TradingRobot & { type: "trading-robot" })
  | (Course & { type: "course" })
  | (ScriptProduct & { type: "script" })
  | (OtherProduct & { type: "other" });

export async function addFavorite(
  userId: string,
  productType: ProductType,
  productId: string,
): Promise<boolean> {
  if (!supabase) {
    console.warn("Supabase client not configured");
    return false;
  }

  console.log("[addFavorite] Adding favorite:", {
    userId,
    productType,
    productId,
  });

  try {
    const { data, error } = await supabase.from("user_favorites").insert({
      user_id: userId,
      product_type: productType,
      product_id: productId,
    });

    if (error) {
      if (error.code === "23505") {
        console.log("[addFavorite] Already favorited");
        return true;
      }
      console.error(
        "[addFavorite] Database error:",
        toErrorMessage(error),
        error.code,
        error.details,
      );
      return false;
    }

    console.log("[addFavorite] Successfully added");
    return true;
  } catch (err) {
    console.error("[addFavorite] Exception:", err);
    return false;
  }
}

export async function removeFavorite(
  userId: string,
  productType: ProductType,
  productId: string,
): Promise<boolean> {
  if (!supabase) {
    console.warn("Supabase client not configured");
    return false;
  }

  console.log("[removeFavorite] Removing favorite:", {
    userId,
    productType,
    productId,
  });

  try {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_type", productType)
      .eq("product_id", productId);

    if (error) {
      const message = toErrorMessage(error);
      if (isLikelyNetworkError(message)) {
        console.warn(
          "[removeFavorite] Network issue while removing favorite:",
          message,
        );
      } else {
        console.error(
          "[removeFavorite] Database error:",
          message,
          error.code,
          error.details,
        );
      }
      return false;
    }

    console.log("[removeFavorite] Successfully removed");
    return true;
  } catch (err) {
    const message = toErrorMessage(err);
    if (isLikelyNetworkError(message)) {
      console.warn("[removeFavorite] Network exception:", message);
    } else {
      console.error("[removeFavorite] Exception:", message, err);
    }
    return false;
  }
}

export async function toggleFavorite(
  userId: string,
  productType: ProductType,
  productId: string,
): Promise<boolean> {
  const isFav = await checkFavorite(userId, productType, productId);

  if (isFav) {
    return removeFavorite(userId, productType, productId);
  } else {
    return addFavorite(userId, productType, productId);
  }
}

export async function checkFavorite(
  userId: string,
  productType: ProductType,
  productId: string,
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("product_type", productType)
      .eq("product_id", productId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(
        "[checkFavorite] Database error:",
        toErrorMessage(error),
        error.code,
      );
      return false;
    }

    console.log("[checkFavorite] Result:", !!data, "for", {
      productType,
      productId,
    });
    return !!data;
  } catch (err) {
    console.error("[checkFavorite] Exception:", toErrorMessage(err), err);
    return false;
  }
}

export async function getUserFavoriteIds(
  userId: string,
  productType?: ProductType,
): Promise<Set<string>> {
  if (!supabase) {
    return new Set();
  }

  try {
    let query = supabase
      .from("user_favorites")
      .select("product_id, product_type")
      .eq("user_id", userId);

    if (productType) {
      query = query.eq("product_type", productType);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        "Error fetching user favorites:",
        toErrorMessage(error),
        error,
      );
      return new Set();
    }

    return new Set(data.map((fav) => `${fav.product_type}:${fav.product_id}`));
  } catch (err) {
    console.error("Error fetching user favorites:", toErrorMessage(err), err);
    return new Set();
  }
}

export async function getUserFavorites(
  userId: string,
): Promise<FavoriteProduct[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data: favorites, error } = await supabase
      .from("user_favorites")
      .select("product_type, product_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Error fetching user favorites:",
        toErrorMessage(error),
        error,
      );
      return [];
    }

    const result: FavoriteProduct[] = [];

    for (const fav of favorites) {
      const product = await fetchProductByType(
        fav.product_type as ProductType,
        fav.product_id,
      );

      if (product) {
        result.push({
          ...product,
          type: fav.product_type as ProductType,
        } as FavoriteProduct);
      } else {
        console.warn(
          `Removing orphaned favorite: ${fav.product_type} with id ${fav.product_id}`,
        );
        const removed = await removeFavorite(
          userId,
          fav.product_type as ProductType,
          fav.product_id,
        );
        if (!removed) {
          console.warn(
            "[getUserFavorites] Unable to remove orphaned favorite due to network or permission issue",
          );
        }
      }
    }

    return result;
  } catch (err) {
    console.error("Error fetching user favorites:", toErrorMessage(err), err);
    return [];
  }
}

async function fetchProductByType(
  productType: ProductType,
  productId: string,
): Promise<any> {
  if (!supabase) {
    return null;
  }

  try {
    let tableName = "";

    switch (productType) {
      case "analyst":
        tableName = "analysts";
        break;
      case "investment-consultant":
        tableName = "investment_consultants";
        break;
      case "trader":
        tableName = "traders";
        break;
      case "signal":
        tableName = "signals";
        break;
      case "strategy":
        tableName = "strategies";
        break;
      case "trading-robot":
        tableName = "trading_robots";
        break;
      case "course":
        tableName = "courses";
        break;
      case "script":
        tableName = "script_products";
        break;
      case "other":
        tableName = "other_products";
        break;
      default:
        return null;
    }

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.warn(`Product not found: ${productType} with id ${productId}`);
      } else {
        console.error(
          `Error fetching ${productType}:`,
          toErrorMessage(error),
          error,
        );
      }
      return null;
    }

    return mapDatabaseRowToType(productType, data);
  } catch (err) {
    console.error("Error fetching product:", toErrorMessage(err), err);
    return null;
  }
}

function mapDatabaseRowToType(productType: ProductType, row: any): any {
  switch (productType) {
    case "analyst":
      return {
        ...row,
        forecastAccuracy: row.forecast_accuracy,
      };
    case "investment-consultant":
      return {
        ...row,
        riskLevel: row.risk_level,
        portfolioReturn: row.portfolio_return,
      };
    case "trader":
      return {
        ...row,
        trades30Days: row.trades_30_days,
        roiMonth: row.roi_month,
        roiQuarter: row.roi_quarter,
        avgProfitability: row.avg_profitability,
      };
    case "signal":
      return {
        ...row,
        riskLevel: row.risk_level,
        chartImage: row.chart_image,
      };
    case "strategy":
      return {
        ...row,
        riskLevel: row.risk_level,
        profitSharing: row.profit_sharing,
        maxDrawdown: row.max_drawdown,
        minCapital: row.min_capital,
        roi30d: row.roi_30d,
        roi1y: row.roi_1y,
      };
    case "trading-robot":
      return {
        ...row,
        accuracyLabel: row.accuracy_label,
        accuracyLevel: row.accuracy_level,
        profitSharing: row.profit_sharing,
        assetTags: row.asset_tags,
        settingsTag: row.settings_tag,
        roi30d: row.roi_30d,
        roi90d: row.roi_90d,
        roi1y: row.roi_1y,
        automationStyle: row.automation_style,
        marketCategory: row.market_category,
        leverageCategory: row.leverage_category,
      };
    case "course":
      return {
        ...row,
        levelCategory: row.level_category,
        materialType: row.material_type,
        releaseWindow: row.release_window,
        focusArea: row.focus_area,
      };
    case "script":
      return {
        ...row,
        heroImage: row.hero_image,
        heroAlt: row.hero_alt,
        typeLabel: row.type_label,
        industryLabel: row.industry_label,
        revenueLabel: row.revenue_label,
        creatorName: row.creator_name,
        creatorAvatar: row.creator_avatar,
        creatorFollowers: row.creator_followers,
        creatorTags: row.creator_tags,
        verificationLabel: row.verification_label,
        ratingScore: row.rating_score,
        creator: {
          name: row.creator_name,
          avatar: row.creator_avatar,
          followers: row.creator_followers,
          tags: row.creator_tags,
        },
      };
    case "other":
      return {
        ...row,
        imageAlt: row.image_alt,
        ratingTag: row.rating_tag,
        typeLabel: row.type_label,
        industryLabel: row.industry_label,
      };
    default:
      return row;
  }
}
