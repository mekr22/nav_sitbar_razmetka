import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
  ProductType,
} from "@/lib/supabaseFavorites";
import { useAuth } from "@/providers/AuthProvider";

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

export function useFavorite(productType: ProductType, productId: string) {
  const { user, loading: authLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsFavorite(false);
      setLoading(false);
      return;
    }

    if (authLoading) {
      return;
    }

    if (!user) {
      setIsFavorite(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadFavorite = async () => {
      setLoading(true);
      try {
        const result = await checkFavorite(user.id, productType, productId);
        if (!cancelled) {
          setIsFavorite(result);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "[useFavorite] Error checking favorite:",
            toErrorMessage(error),
            error,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFavorite();

    return () => {
      cancelled = true;
    };
  }, [authLoading, productId, productType, user?.id]);

  const toggle = useCallback(async () => {
    if (!supabase) {
      console.warn("[useFavorite] Supabase client not configured");
      return;
    }

    if (!user) {
      console.warn("[useFavorite] User not authenticated");
      return;
    }

    try {
      if (isFavorite) {
        const success = await removeFavorite(user.id, productType, productId);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        const success = await addFavorite(user.id, productType, productId);
        if (success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error(
        "[useFavorite] Error toggling favorite:",
        toErrorMessage(error),
        error,
      );
    }
  }, [isFavorite, productId, productType, user]);

  return {
    isFavorite,
    loading: loading || authLoading,
    toggle,
    userId: user?.id ?? null,
  };
}

export function useFavoriteMultiple(productType?: ProductType) {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const userId = user?.id ?? null;

  const refresh = useCallback(async () => {
    if (!supabase) {
      console.warn("[useFavoriteMultiple] Supabase client not configured");
      setFavorites(new Set());
      setLoading(false);
      return;
    }

    if (!userId) {
      setFavorites(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);

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
          "[useFavoriteMultiple] Query error:",
          toErrorMessage(error),
          error,
        );
        setFavorites(new Set());
        return;
      }

      const records = Array.isArray(data) ? data : [];
      const next = new Set(
        records.map((fav) => `${fav.product_type}:${fav.product_id}`),
      );

      setFavorites(next);
    } catch (error) {
      console.error(
        "[useFavoriteMultiple] Unexpected error loading favorites:",
        toErrorMessage(error),
        error,
      );
      setFavorites(new Set());
    } finally {
      setLoading(false);
    }
  }, [productType, userId]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void refresh();
  }, [authLoading, refresh]);

  const isFavorite = useCallback(
    (type: ProductType, id: string) => favorites.has(`${type}:${id}`),
    [favorites],
  );

  const toggle = useCallback(
    async (type: ProductType, id: string) => {
      if (!supabase) {
        console.warn("[useFavoriteMultiple.toggle] Supabase not configured");
        return;
      }

      if (!userId) {
        console.warn("[useFavoriteMultiple.toggle] User not authenticated");
        return;
      }

      const key = `${type}:${id}`;
      const currentlyFavorite = favorites.has(key);

      try {
        if (currentlyFavorite) {
          const success = await removeFavorite(userId, type, id);
          if (success) {
            setFavorites((prev) => {
              const next = new Set(prev);
              next.delete(key);
              return next;
            });
          }
        } else {
          const success = await addFavorite(userId, type, id);
          if (success) {
            setFavorites((prev) => {
              const next = new Set(prev);
              next.add(key);
              return next;
            });
          }
        }
      } catch (error) {
        console.error(
          "[useFavoriteMultiple.toggle] Error toggling favorite:",
          toErrorMessage(error),
          error,
        );
      }
    },
    [favorites, userId],
  );

  return {
    favorites,
    isFavorite,
    loading: loading || authLoading,
    toggle,
    userId,
    refresh,
  };
}
