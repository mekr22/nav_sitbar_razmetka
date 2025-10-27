import { useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import {
  addCartItem,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  type AddCartItemInput,
  type CartItem,
  type RemoveCartItemInput,
  type UpdateQuantityInput,
} from "@/lib/supabaseCart";
import { useAuth } from "@/providers/AuthProvider";
import {
  buildCartInsertPayload,
  type CartBuilderOptions,
  type CartInsertPayload,
  type ProductTypeMap,
} from "@/lib/cartUtils";
import type { ProductType } from "@/lib/supabaseFavorites";
import { useToast } from "@/hooks/use-toast";

export type CartAddResult = {
  success: boolean;
  reason?: "auth" | "error" | "config";
  item?: CartItem | null;
};

type AddPayloadWithoutUser = Omit<AddCartItemInput, "userId">;

type CartState = {
  items: CartItem[];
  loading: boolean;
  userId: string | null;
};

const mergeItems = (items: CartItem[], next: CartItem): CartItem[] => {
  const index = items.findIndex((item) => item.id === next.id);
  if (index === -1) {
    return [next, ...items];
  }
  const updated = [...items];
  updated[index] = next;
  return updated;
};

export const useCart = () => {
  const [state, setState] = useState<CartState>({
    items: [],
    loading: true,
    userId: null,
  });
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const loadCartItems = useCallback(
    async (userId: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      const items = await getCartItems(userId);
      setState({ items, loading: false, userId });
    },
    [],
  );

  useEffect(() => {
    if (!supabase) {
      console.warn("[useCart] Supabase client not configured");
      setState({ items: [], loading: false, userId: null });
      return;
    }

    if (authLoading) {
      return;
    }

    if (!user) {
      setState({ items: [], loading: false, userId: null });
      return;
    }

    void loadCartItems(user.id);
  }, [authLoading, loadCartItems, user]);

  const ensureUserAndClient = useCallback((): {
    supabaseAvailable: boolean;
    userId: string | null;
  } => {
    if (!supabase) {
      toast({
        title: "Service unavailable",
        description: "Cart features require a configured backend.",
        variant: "destructive",
      });
      return { supabaseAvailable: false, userId: null };
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
      });
      return { supabaseAvailable: true, userId: null };
    }

    return { supabaseAvailable: true, userId: user.id };
  }, [toast, user]);

  const refresh = useCallback(async () => {
    if (!user) {
      return;
    }
    await loadCartItems(user.id);
  }, [loadCartItems, user]);

  const addPayloadToCart = useCallback(
    async (payload: AddPayloadWithoutUser): Promise<CartAddResult> => {
      const { supabaseAvailable, userId } = ensureUserAndClient();
      if (!supabaseAvailable) {
        return { success: false, reason: "config" };
      }

      if (!userId) {
        return { success: false, reason: "auth" };
      }

      const result = await addCartItem({ ...payload, userId });

      if (!result) {
        toast({
          title: "Could not add to cart",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
        return { success: false, reason: "error" };
      }

      setState((prev) => ({
        ...prev,
        items: mergeItems(prev.items, result),
        userId,
        loading: false,
      }));

      toast({
        title: "Added to cart",
        description: result.title,
      });

      return { success: true, item: result };
    },
    [ensureUserAndClient, toast],
  );

  const addProductToCart = useCallback(
    async <K extends ProductType>(
      productType: K,
      product: ProductTypeMap[K],
      options?: CartBuilderOptions,
    ): Promise<CartAddResult> => {
      const payload: CartInsertPayload = buildCartInsertPayload(
        productType,
        product,
        options,
      );

      return addPayloadToCart(payload);
    },
    [addPayloadToCart],
  );

  const updateQuantity = useCallback(
    async (input: Omit<UpdateQuantityInput, "userId">) => {
      if (!user) {
        return;
      }

      const result = await updateCartItemQuantity({
        ...input,
        userId: user.id,
      });

      if (!result) {
        await refresh();
        return;
      }

      setState((prev) => ({
        ...prev,
        items: mergeItems(prev.items, result),
      }));
    },
    [refresh, user],
  );

  const removeItem = useCallback(
    async (input: Omit<RemoveCartItemInput, "userId">) => {
      if (!user) {
        return;
      }

      const success = await removeCartItem({ ...input, userId: user.id });
      if (!success) {
        toast({
          title: "Unable to remove item",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => {
          if (input.cartItemId) {
            return item.id !== input.cartItemId;
          }
          if (input.productType && input.productId) {
            return !(
              item.productType === input.productType &&
              item.productId === input.productId
            );
          }
          return true;
        }),
      }));
    },
    [toast, user],
  );

  const resetCart = useCallback(async () => {
    if (!user) {
      return;
    }

    const success = await clearCart(user.id);
    if (!success) {
      toast({
        title: "Unable to clear cart",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    setState((prev) => ({ ...prev, items: [] }));
  }, [toast, user]);

  const subtotalCents = useMemo(() => {
    return state.items.reduce((total, item) => {
      return total + item.priceCents * item.quantity;
    }, 0);
  }, [state.items]);

  const isInCart = useCallback(
    (productType: ProductType, productId: string) =>
      state.items.find(
        (item) =>
          item.productType === productType && item.productId === productId,
      ) ?? null,
    [state.items],
  );

  return {
    items: state.items,
    loading: state.loading,
    userId: user?.id ?? null,
    subtotalCents,
    addPayloadToCart,
    addProductToCart,
    updateQuantity,
    removeItem,
    clearCart: resetCart,
    refresh,
    isInCart,
  };
};
