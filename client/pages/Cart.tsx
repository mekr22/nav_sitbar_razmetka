import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CartItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  selected: boolean;
};

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    title: "Premium Trading Course",
    description: "Learn advanced trading strategies from professional ...",
    price: 199.99,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/07fc8b5bbf140bd1f7872dec9f35fd0ffa94a6ed?width=168",
    selected: true,
  },
  {
    id: "2",
    title: "Premium Trading Course",
    description: "Learn advanced trading strategies from professional ...",
    price: 99.99,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/07fc8b5bbf140bd1f7872dec9f35fd0ffa94a6ed?width=168",
    selected: true,
  },
  {
    id: "3",
    title: "Premium Trading Course",
    description: "Learn advanced trading strategies from professional ...",
    price: 29.99,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/07fc8b5bbf140bd1f7872dec9f35fd0ffa94a6ed?width=168",
    selected: true,
  },
  {
    id: "4",
    title: "Premium Trading Course",
    description: "Learn advanced trading strategies from professional ...",
    price: 4.99,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/07fc8b5bbf140bd1f7872dec9f35fd0ffa94a6ed?width=168",
    selected: true,
  },
  {
    id: "5",
    title: "1-month subscription",
    description: "Learn advanced trading strategies from professional ...",
    price: 1.99,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/07fc8b5bbf140bd1f7872dec9f35fd0ffa94a6ed?width=168",
    selected: true,
  },
];

const Cart: FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  const toggleItemSelection = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-3 pb-20 sm:px-4 xl:min-w-[880px]">
      {/* Main Content */}
      <div className="flex flex-col gap-4 rounded-[24px] border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px] sm:p-6 lg:flex-row lg:gap-0">
        {/* Cart Items Section */}
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">Your cart</h1>

          <div className="flex flex-col gap-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:gap-4",
                  index > 0 && "border-t border-[#181B22]",
                )}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleItemSelection(item.id)}
                  className="relative h-[18px] w-[18px] flex-shrink-0"
                  aria-label={`Select ${item.title}`}
                >
                  <div
                    className={cn(
                      "h-[18px] w-[18px] rounded-[3px] transition-all",
                      item.selected
                        ? "bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                        : "border border-[#181B22] bg-[#0C1014]",
                    )}
                  />
                  {item.selected && (
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

                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[88px] w-full flex-shrink-0 rounded-2xl object-cover sm:h-11 sm:w-[84px] sm:rounded-lg"
                />

                {/* Product Info */}
                <div className="flex min-w-0 w-full flex-1 flex-col justify-between gap-0.5 sm:w-auto">
                  <h3 className="truncate text-[15px] font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="truncate text-[15px] font-normal text-[#B0B0B0]">
                    {item.description}
                  </p>
                </div>

                {/* Price */}
                <div className="w-full text-left text-[15px] font-normal text-white sm:w-20 sm:flex-shrink-0 sm:text-right">
                  ${item.price.toFixed(2)}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start text-[#B0B0B0] transition-colors hover:text-white sm:self-auto"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-[#181B22] lg:mx-4 lg:my-0 lg:h-auto lg:w-px" />

        {/* Order Summary */}
        <div className="flex w-full flex-col justify-between lg:w-[330px]">
          <div className="flex flex-col">
            <div className="p-4 sm:p-0 sm:pb-4">
              <h2 className="text-[19px] font-bold text-white">
                Order Summary
              </h2>
            </div>

            <div className="flex items-center justify-between border-b border-[#181B22] px-4 pb-4 sm:px-0">
              <span className="text-[15px] font-normal text-[#B0B0B0]">
                Subtotal
              </span>
              <span className="text-[15px] font-normal text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between px-4 py-4 sm:px-0">
              <span className="text-[15px] font-bold text-white">Total</span>
              <span className="text-[15px] font-normal text-[#A06AFF]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-[15px] font-bold text-white backdrop-blur-[50px] transition-opacity hover:opacity-90 sm:w-auto"
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
