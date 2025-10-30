import { supabase } from "@/lib/supabaseClient";
import { supabase } from "@/lib/supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";
import type { ProductType } from "@/lib/supabaseFavorites";
import type { CartInsertPayload } from "@/lib/cartUtils";

const TABLE_NAME = "cart_items";

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

  const message = (error as { message?: unknown }).message;
  if (typeof message === "string") {
    return message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

export type CartItemRow = {
  id: string;
  user_id: string;
  product_type: ProductType;
  product_id: string;
  title: string;
  subtitle: string | null;
  price_cents: number;
  price_currency: string;
  quantity: number;
  image_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CartItem = {
  id: string;
  userId: string;
  productType: ProductType;
  productId: string;
  title: string;
  subtitle: string | null;
  priceCents: number;
  priceCurrency: string;
  quantity: number;
  imageUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AddCartItemInput = CartInsertPayload & {
  userId: string;
};

export type UpdateQuantityInput = {
  userId: string;
  cartItemId: string;
  quantity: number;
};

export type RemoveCartItemInput = {
  userId: string;
  cartItemId?: string;
  productType?: ProductType;
  productId?: string;
};

const mapRowToCartItem = (row: CartItemRow): CartItem => ({
  id: row.id,
  userId: row.user_id,
  productType: row.product_type,
  productId: row.product_id,
  title: row.title,
  subtitle: row.subtitle,
  priceCents: row.price_cents,
  priceCurrency: row.price_currency,
  quantity: row.quantity,
  imageUrl: row.image_url,
  metadata: row.metadata,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const logSupabaseError = (context: string, error: PostgrestError) => {
  console.error(context, {
    message: toErrorMessage(error),
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
};

const shouldRetryWithoutOrder = (error: PostgrestError): boolean => {
  if (!error) {
    return false;
  }

  if (error.code === "42703" || error.code === "42P01") {
    return true;
  }

  const message = error.message?.toLowerCase?.() ?? "";
  if (!message) {
    return false;
  }

  return (
    message.includes("created_at") ||
    (message.includes("column") && message.includes("does not exist"))
  );
};

const fetchExistingCartItem = async (
  userId: string,
  productType: ProductType,
  productId: string,
): Promise<CartItemRow | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .eq("product_type", productType)
    .eq("product_id", productId)
    .limit(1);

  if (error) {
    console.error("[supabaseCart] Error fetching existing cart item", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  if (!supabase) {
    console.warn("[supabaseCart] Supabase client not configured");
    return [];
  }

  const buildSelectQuery = () =>
    supabase.from(TABLE_NAME).select("*").eq("user_id", userId);

  try {
    const { data, error } = await buildSelectQuery().order("created_at", {
      ascending: false,
    });

    if (error) {
      if (shouldRetryWithoutOrder(error)) {
        console.warn(
          "[supabaseCart] Falling back to unordered cart items query",
          {
            message: error.message,
            code: error.code,
          },
        );
        const { data: fallbackData, error: fallbackError } =
          await buildSelectQuery();

        if (!fallbackError) {
          return (fallbackData ?? []).map(mapRowToCartItem);
        }

        logSupabaseError(
          "[supabaseCart] Error loading cart items (fallback)",
          fallbackError,
        );
        return [];
      }

      logSupabaseError("[supabaseCart] Error loading cart items", error);
      return [];
    }

    return (data ?? []).map(mapRowToCartItem);
  } catch (error) {
    console.error(
      "[supabaseCart] Unexpected error loading cart items",
      toErrorMessage(error),
      error,
    );
    return [];
  }
};

export const addCartItem = async (
  input: AddCartItemInput,
): Promise<CartItem | null> => {
  if (!supabase) {
    console.warn("[supabaseCart] Supabase client not configured");
    return null;
  }

  try {
    const {
      userId,
      productType,
      productId,
      title,
      subtitle,
      priceCents,
      priceCurrency,
      quantity,
      imageUrl,
      metadata,
    } = input;

    const existing = await fetchExistingCartItem(
      userId,
      productType,
      productId,
    );

    if (existing) {
      const mergedMetadata = metadata
        ? { ...(existing.metadata ?? {}), ...metadata }
        : existing.metadata;

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          title,
          subtitle,
          price_cents: priceCents,
          price_currency: priceCurrency,
          quantity: existing.quantity + quantity,
          image_url: imageUrl ?? existing.image_url,
          metadata: mergedMetadata,
        })
        .eq("id", existing.id)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (error) {
        console.error("[supabaseCart] Error updating cart item", error);
        return null;
      }

      return mapRowToCartItem(data as CartItemRow);
    }

    const performUpdateForExisting = async (): Promise<CartItem | null> => {
      const latest = await fetchExistingCartItem(
        userId,
        productType,
        productId,
      );
      if (!latest) {
        return null;
      }

      const mergedMetadata = metadata
        ? { ...(latest.metadata ?? {}), ...metadata }
        : latest.metadata;

      const { data: updateData, error: updateError } = await supabase
        .from(TABLE_NAME)
        .update({
          title,
          subtitle,
          price_cents: priceCents,
          price_currency: priceCurrency,
          quantity: latest.quantity + quantity,
          image_url: imageUrl ?? latest.image_url,
          metadata: mergedMetadata,
        })
        .eq("id", latest.id)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (updateError) {
        console.error(
          "[supabaseCart] Error updating cart item after conflict",
          updateError,
        );
        return null;
      }

      return mapRowToCartItem(updateData);
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        user_id: userId,
        product_type: productType,
        product_id: productId,
        title,
        subtitle,
        price_cents: priceCents,
        price_currency: priceCurrency,
        quantity,
        image_url: imageUrl ?? null,
        metadata: metadata ?? null,
      })
      .select("*")
      .single();

    if (error) {
      if (error && "code" in error && error.code === "23505") {
        const updated = await performUpdateForExisting();
        if (updated) {
          return updated;
        }
      }

      console.error(
        "[supabaseCart] Error inserting cart item",
        error,
        ("message" in error && error.message) || undefined,
        ("details" in error && error.details) || undefined,
      );
      return null;
    }

    return mapRowToCartItem(data as CartItemRow);
  } catch (err) {
    console.error("[supabaseCart] Unexpected error adding cart item", err);
    return null;
  }
};

export const updateCartItemQuantity = async (
  input: UpdateQuantityInput,
): Promise<CartItem | null> => {
  if (!supabase) {
    console.warn("[supabaseCart] Supabase client not configured");
    return null;
  }

  try {
    const { userId, cartItemId, quantity } = input;
    if (quantity <= 0) {
      const removed = await removeCartItem({ userId, cartItemId });
      return removed ? null : null;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      console.error("[supabaseCart] Error updating quantity", error);
      return null;
    }

    return mapRowToCartItem(data as CartItemRow);
  } catch (err) {
    console.error("[supabaseCart] Unexpected error updating quantity", err);
    return null;
  }
};

export const removeCartItem = async (
  input: RemoveCartItemInput,
): Promise<boolean> => {
  if (!supabase) {
    console.warn("[supabaseCart] Supabase client not configured");
    return false;
  }

  const { userId, cartItemId, productType, productId } = input;

  if (!cartItemId && (!productType || !productId)) {
    console.error(
      "[supabaseCart] removeCartItem called without identifier",
      input,
    );
    return false;
  }

  let query = supabase.from(TABLE_NAME).delete().eq("user_id", userId);

  if (cartItemId) {
    query = query.eq("id", cartItemId);
  }

  if (productType) {
    query = query.eq("product_type", productType);
  }

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { error } = await query;

  if (error) {
    console.error("[supabaseCart] Error removing cart item", error);
    return false;
  }

  return true;
};

export const clearCart = async (userId: string): Promise<boolean> => {
  if (!supabase) {
    console.warn("[supabaseCart] Supabase client not configured");
    return false;
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("[supabaseCart] Error clearing cart", error);
    return false;
  }

  return true;
};
