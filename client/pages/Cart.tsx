import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
} from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/lib/supabaseCart";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

type SelectionMap = Record<string, boolean>;

const Cart: FC = () => {
  const navigate = useNavigate();
  const { items, loading, userId, removeItem } = useCart();
  const [selection, setSelection] = useState<SelectionMap>({});

  useEffect(() => {
    setSelection((prev) => {
      const next: SelectionMap = {};
      for (const item of items) {
        next[item.id] = prev[item.id] ?? true;
      }
      return next;
    });
  }, [items]);

  const formatCurrency = useCallback((amountCents: number, currencyCode?: string) => {
    const normalizedCurrency = (currencyCode ?? "USD").toUpperCase();
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: normalizedCurrency,
      }).format(amountCents / 100);
    } catch {
      return `$${(amountCents / 100).toFixed(2)}`;
    }
  }, []);

  const buildDescription = useCallback((item: CartItemType): string => {
    if (item.subtitle && item.subtitle.trim().length > 0) {
      return item.subtitle;
    }

    if (item.metadata) {
      const stringValues = Object.values(item.metadata).filter(
        (value): value is string => typeof value === "string" && value.trim().length > 0,
      );

      if (stringValues.length > 0) {
        return stringValues.slice(0, 2).join(" • ");
      }
    }

    return "No additional details";
  }, []);

  const toggleItemSelection = useCallback((id: string) => {
    setSelection((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleRemove = useCallback(
    async (id: string) => {
      await removeItem({ cartItemId: id });
      setSelection((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [removeItem],
  );

  const selectedSubtotalCents = useMemo(() => {
    return items.reduce((total, item) => {
      if (!selection[item.id]) {
        return total;
      }
      return total + item.priceCents * item.quantity;
    }, 0);
  }, [items, selection]);

  const hasSelectedItems = useMemo(() => {
    return items.some((item) => selection[item.id]);
  }, [items, selection]);

  const summaryCurrency = useMemo(() => {
    const firstCurrency = items.find((item) => selection[item.id])?.priceCurrency;
    return firstCurrency ?? items[0]?.priceCurrency ?? "USD";
  }, [items, selection]);

  return (
    <div className="mx-auto flex w/full max-w-[880px] flex-col gap-6 px-3 pb-20 sm:px-4 xl:min-w-[880px]">
      <div className="flex flex-col gap-4 rounded-[24px] border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px] sm:p-6 lg:flex-row lg:gap-0">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">Your cart</h1>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex items-center justify-center rounded-[20px] border border-[#181B22] bg-[#0C1014] p-6 text-sm text-[#B0B0B0]">
                Loading your cart...
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#181B22] bg-[#0C1014] p-6 text-center text-[#B0B0B0]">
                <span className="text-[15px]">
                  {userId ? "Your cart is empty." : "Sign in to view your saved items."}
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/marketplace/my-products")}
                  className="mt-4 rounded-full border border-[#181B22] px-6 py-2 text-sm font-semibold text-white transition-colors hover:border-[#1F2230]"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => {
                const description = buildDescription(item);
                const itemTotalCents = item.priceCents * item.quantity;
                const imageSource = item.imageUrl ?? PLACEHOLDER_IMAGE;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:gap-4",
                      index > 0 && "border-t border-[#181B22]",
                    )}
                  >
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className="relative h-[18px] w-[18px] flex-shrink-0"
                      aria-label={`Select ${item.title}`}
                    >
                      <div
                        className={cn(
                          "h-[18px] w/[18px] rounded-[3px] transition-all",
                          selection[item.id]
                            ? "bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                            : "border border-[#181B22] bg-[#0C1014]",
                        )}
                      />
                      {selection[item.id] && (
                        <svg
                          className="absolute left-1 top-1.5 h-[6px] w-[10px]"
                          viewBox="0 0 12 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 2.5L5 6.5L10.5 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>

                    <img
                      src={imageSource}
                      alt={item.title}
                      className="h-[88px] w-full flex-shrink-0 rounded-2xl object-cover sm:h-11 sm:w-[84px] sm:rounded-lg"
                    />

                    <div className="flex min-w-0 w/full flex-1 flex-col justify-between gap-0.5 sm:w-auto">
                      <h3 className="truncate text-[15px] font-bold text-white">{item.title}</h3>
                      <p className="truncate text-[15px] font-normal text-[#B0B0B0]">{description}</p>
                    </div>

                    <div className="w-full text-left text-[15px] font-normal text-white sm:w-32 sm:flex-shrink-0 sm:text-right">
                      {formatCurrency(itemTotalCents, item.priceCurrency)}
                      {item.quantity > 1 && (
                        <span className="block text-xs text-[#B0B0B0]">
                          {item.quantity} × {formatCurrency(item.priceCents, item.priceCurrency)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        void handleRemove(item.id);
                      }}
                      className="self-start text-[#B0B0B0] transition-colors hover:text-white sm:self-auto"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="my-4 h-px w-full bg-[#181B22] lg:mx-4 lg:my-0 lg:h-auto lg:w-px" />

        <div className="flex w-full flex-col justify-between lg:w-[330px]">
          <div className="flex flex-col">
            <div className="p-4 sm:p-0 sm:pb-4">
              <h2 className="text-[19px] font-bold text-white">Order Summary</h2>
            </div>

            <div className="flex items-center justify-between border-b border-[#181B22] px-4 pb-4 sm:px-0">
              <span className="text-[15px] font-normal text-[#B0B0B0]">Subtotal</span>
              <span className="text-[15px] font-normal text-white">
                {formatCurrency(selectedSubtotalCents, summaryCurrency)}
              </span>
            </div>

            <div className="flex items-center justify-between px-4 py-4 sm:px-0">
              <span className="text-[15px] font-bold text-white">Total</span>
              <span className="text-[15px] font-normal text-[#A06AFF]">
                {formatCurrency(selectedSubtotalCents, summaryCurrency)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              disabled={!hasSelectedItems}
              className={cn(
                "flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-[15px] font-bold text-white backdrop-blur-[50px] transition-opacity hover:opacity-90 sm:w-auto",
                !hasSelectedItems && "cursor-not-allowed opacity-50 hover:opacity-50",
              )}
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={() => navigate("/marketplace/my-products")}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] sm:w-auto"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
