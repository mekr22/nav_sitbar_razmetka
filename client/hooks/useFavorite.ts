import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
  ProductType,
} from "@/lib/supabaseFavorites";

export function useFavorite(productType: ProductType, productId: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFavorite = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[useFavorite] Session error:", sessionError.message);
          setLoading(false);
          return;
        }

        const user = session?.user;

        if (!user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const isFav = await checkFavorite(user.id, productType, productId);
        setIsFavorite(isFav);
      } catch (err) {
        console.error("Error checking favorite:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFavorite();
  }, [productType, productId]);

  const toggle = useCallback(async () => {
    if (!userId) {
      console.warn("User not authenticated");
      return;
    }

    try {
      if (isFavorite) {
        const success = await removeFavorite(userId, productType, productId);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        const success = await addFavorite(userId, productType, productId);
        if (success) {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  }, [userId, productType, productId, isFavorite]);

  return {
    isFavorite,
    loading,
    toggle,
    userId,
  };
}

export function useFavoriteMultiple(productType?: ProductType) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndLoadFavorites = async () => {
      if (!supabase) {
        console.log("[useFavoriteMultiple] Supabase not configured");
        setLoading(false);
        return;
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            "[useFavoriteMultiple] Session error:",
            sessionError.message,
          );
          setLoading(false);
          return;
        }

        const user = session?.user;

        if (!user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        let query = supabase
          .from("user_favorites")
          .select("product_id, product_type")
          .eq("user_id", user.id);

        if (productType) {
          query = query.eq("product_type", productType);
        }

        const { data, error: queryError } = await query;

        if (queryError) {
          console.error(
            "[useFavoriteMultiple] Query error:",
            queryError.message,
          );
          setLoading(false);
          return;
        }

        console.log("[useFavoriteMultiple] Loaded favorites:", data);
        const favoriteSet = new Set(
          data.map((fav) => `${fav.product_type}:${fav.product_id}`),
        );
        console.log(
          "[useFavoriteMultiple] Favorite set:",
          Array.from(favoriteSet),
        );
        setFavorites(favoriteSet);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndLoadFavorites();
  }, [productType]);

  const isFavorite = useCallback(
    (type: ProductType, id: string) => {
      return favorites.has(`${type}:${id}`);
    },
    [favorites],
  );

  const toggle = useCallback(
    async (type: ProductType, id: string) => {
      console.log("[useFavoriteMultiple.toggle] Starting toggle:", {
        type,
        id,
        userId,
      });

      if (!userId) {
        console.warn("[useFavoriteMultiple.toggle] User not authenticated!");
        return;
      }

      try {
        const isFav = isFavorite(type, id);
        console.log(
          "[useFavoriteMultiple.toggle] Current favorite status:",
          isFav,
        );

        if (isFav) {
          console.log("[useFavoriteMultiple.toggle] Removing favorite...");
          const success = await removeFavorite(userId, type, id);
          console.log("[useFavoriteMultiple.toggle] Remove result:", success);
          if (success) {
            setFavorites((prev) => {
              const next = new Set(prev);
              next.delete(`${type}:${id}`);
              return next;
            });
          }
        } else {
          console.log("[useFavoriteMultiple.toggle] Adding favorite...");
          const success = await addFavorite(userId, type, id);
          console.log("[useFavoriteMultiple.toggle] Add result:", success);
          if (success) {
            setFavorites((prev) => {
              const next = new Set(prev);
              next.add(`${type}:${id}`);
              return next;
            });
          }
        }
      } catch (err) {
        console.error("[useFavoriteMultiple.toggle] Exception:", err);
      }
    },
    [userId, isFavorite],
  );

  return {
    favorites,
    isFavorite,
    loading,
    toggle,
    userId,
  };
}
