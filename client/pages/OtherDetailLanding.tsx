import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, ShoppingCart } from "lucide-react";

import type { OtherProduct } from "@/data/marketplaceOthers";
import { baseOtherProducts } from "@/data/marketplaceOthers";
import { useCart } from "@/hooks/useCart";
import { extractOriginalProductId } from "@/lib/utils";

const AVATAR_PLACEHOLDER =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=160";

const COMMENT_AVATAR =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=800";

type CommentNode = {
  id: string;
  author: string;
  time: string;
  text: string;
  likes: number;
  likeColor?: string;
  timeColor?: string;
  canHide?: boolean;
  replies?: CommentNode[];
  liked?: boolean;
  hidden?: boolean;
};

const INITIAL_COMMENTS: CommentNode[] = [
  {
    id: "comment-1",
    author: "Marina Ortiz",
    time: "2 hours ago",
    text: "AtlasSync has replaced three separate tools for our ops team. The staged approvals and shared dashboards make handoffs painless now.",
    likes: 18,
    canHide: true,
    replies: [
      {
        id: "comment-1-1",
        author: "Carlos Fong",
        time: "1 hour ago",
        text: "Seconded. We launched DataVigil this quarter and the real-time vendor benchmarks already caught two SLA drifts.",
        likes: 7,
        canHide: true,
      },
    ],
  },
  {
    id: "comment-2",
    author: "Jenny Park",
    time: "1 day ago",
    text: "QuantDocs keeps our attestations synced with compliance. The templates and workflow exports are spot on for our audit cadence.",
    likes: 24,
    likeColor: "#808283",
    timeColor: "#808283",
  },
  {
    id: "comment-3",
    author: "Leo Zhang",
    time: "3 days ago",
    text: "CapitalSuite's document rooms save us hours during investor reporting. Would love a direct integration with our CRM next.",
    likes: 12,
    likeColor: "#808283",
    timeColor: "#808283",
  },
];

const toggleLikeInTree = (nodes: CommentNode[], id: string): CommentNode[] =>
  nodes.map((node) => {
    if (node.id === id) {
      const liked = !node.liked;
      return {
        ...node,
        liked,
        likes: liked ? node.likes + 1 : Math.max(node.likes - 1, 0),
      };
    }

    return {
      ...node,
      replies: node.replies ? toggleLikeInTree(node.replies, id) : undefined,
    };
  });

const toggleHiddenInTree = (nodes: CommentNode[], id: string): CommentNode[] =>
  nodes.map((node) => {
    if (node.id === id) {
      return {
        ...node,
        hidden: !node.hidden,
      };
    }

    return {
      ...node,
      replies: node.replies ? toggleHiddenInTree(node.replies, id) : undefined,
    };
  });

const priceByType: Record<string, string> = {
  script: "$59.00",
  workspace: "$129.00",
  platform: "$189.00",
  portal: "$249.00",
  automation: "$179.00",
  analytics: "$219.00",
  operations: "$139.00",
  monitoring: "$199.00",
};

const CTA_ACTIONS = [
  { key: "demo", label: "Demo", icon: BookOpen, variant: "secondary" as const },
  { key: "buy", label: "Buy", icon: ShoppingCart, variant: "primary" as const },
] as const;

const OtherDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    product?: OtherProduct;
  } | null;

  const [comments, setComments] = useState<CommentNode[]>(
    () => INITIAL_COMMENTS,
  );
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  const product = useMemo<OtherProduct>(() => {
    if (locationState?.product) {
      return locationState.product;
    }
    return baseOtherProducts[0];
  }, [locationState]);
  const originalProductId = useMemo(() => extractOriginalProductId(product.id), [product.id]);
  const { addProductToCart } = useCart();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateLayout = () => {
      setIsCompactLayout(window.innerWidth <= 360);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  const handleNavigateBack = useCallback(() => {
    navigate("/marketplace/others", {
      state: {
        scrollToTop: true,
        category: "Others",
      },
    });
  }, [navigate]);

  const detailItems = useMemo(
    () => [
      { label: "Type", value: product.typeLabel },
      { label: "Industry", value: product.industryLabel },
      { label: "Platform", value: product.label },
      { label: "Location", value: product.location },
    ],
    [product.industryLabel, product.label, product.location, product.typeLabel],
  );

  const compatibilityItems = product.compatibility;
  const requirementItems = product.requirements;

  const highlightItems = useMemo(() => {
    const compatibilitySummary = compatibilityItems.join(", ");
    const requirementSummary = requirementItems.join(", ");
    return [
      `${product.title} gives ${product.ratingTag.toLowerCase()} teams a ${product.typeLabel.toLowerCase()} that streamlines ${product.industryLabel.toLowerCase()} workflows.`,
      `Built for operators in ${product.location}, it integrates with ${compatibilitySummary}.`,
      `Prerequisites such as ${requirementSummary} ensure fast onboarding and dependable automation.`,
    ];
  }, [
    compatibilityItems,
    product.industryLabel,
    product.location,
    product.ratingTag,
    product.title,
    product.typeLabel,
    requirementItems,
  ]);

  const metaTags = useMemo(
    () => [product.typeLabel, product.industryLabel, product.label],
    [product.industryLabel, product.label, product.typeLabel],
  );

  const ratingValue = useMemo(() => {
    const parsed = Number.parseFloat(product.rating);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.min(Math.max(parsed, 0), 5);
  }, [product.rating]);

  const totalReviews = useMemo(
    () => Math.max(Math.round(ratingValue * 24), 18),
    [ratingValue],
  );

  const normalizedType = product.typeLabel.trim().toLowerCase();
  const priceLabel = priceByType[normalizedType] ?? "$199.00";

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    for (let i = 0; i < 5; i += 1) {
      const filled = i < Math.floor(rating);
      const halfFilled = !filled && i < rating;

      stars.push(
        <svg
          key={i}
          className="h-4 w-4"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.15238 2.29579L10.3256 4.66159C10.4856 4.99092 10.9122 5.30681 11.2722 5.36729L13.3986 5.72351C14.7585 5.95203 15.0785 6.94674 14.0985 7.92801L12.4454 9.59481C12.1654 9.87707 12.0121 10.4215 12.0987 10.8113L12.5721 12.8747C12.9453 14.5079 12.0854 15.1397 10.6523 14.2861L8.65912 13.0965C8.29918 12.8814 7.70592 12.8814 7.33925 13.0965L5.34616 14.2861C3.91965 15.1397 3.05308 14.5011 3.42638 12.8747L3.89966 10.8113C3.98631 10.4215 3.833 9.87707 3.55302 9.59481L1.89988 7.92801C0.926651 6.94674 1.23995 5.95203 2.5998 5.72351L4.72623 5.36729C5.07952 5.30681 5.50614 4.99092 5.66612 4.66159L6.83932 2.29579C7.47925 1.01208 8.51912 1.01208 9.15238 2.29579Z"
            fill={filled ? "#A06AFF" : halfFilled ? "#23252D" : "#23252D"}
          />
          {halfFilled && (
            <path
              d="M9.15238 2.29579L10.3256 4.66159C10.4856 4.99092 10.9122 5.30681 11.2722 5.36729L13.3986 5.72351C14.7585 5.95203 15.0785 6.94674 14.0985 7.92801L12.4454 9.59481C12.1654 9.87707 12.0121 10.4215 12.0987 10.8113L12.5721 12.8747C12.9453 14.5079 12.0854 15.1397 10.6523 14.2861L8.65912 13.0965C8.29918 12.8814 7.70592 12.8814 7.33925 13.0965L5.34616 14.2861C3.91965 15.1397 3.05308 14.5011 3.42638 12.8747L3.89966 10.8113C3.98631 10.4215 3.833 9.87707 3.55302 9.59481L1.89988 7.92801C0.926651 6.94674 1.23995 5.95203 2.5998 5.72351L4.72623 5.36729C5.07952 5.30681 5.50614 4.99092 5.66612 4.66159L6.83932 2.29579C7.47925 1.01208 8.51912 1.01208 9.15238 2.29579Z"
              fill="url(#other-star-paint)"
            />
          )}
          {halfFilled && (
            <defs>
              <linearGradient
                id="other-star-paint"
                x1="14.6673"
                y1="7.99968"
                x2="1.33398"
                y2="7.99968"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.5" stopColor="#A06AFF" stopOpacity="0" />
                <stop offset="0.502929" stopColor="#A06AFF" />
              </linearGradient>
            </defs>
          )}
        </svg>,
      );
    }
    return stars;
  };

  const handleToggleLike = useCallback((id: string) => {
    setComments((prev) => toggleLikeInTree(prev, id));
  }, []);

  const handleToggleHidden = useCallback((id: string) => {
    setComments((prev) => toggleHiddenInTree(prev, id));
  }, []);

  const renderComment = (comment: CommentNode, depth = 0): JSX.Element => {
    const indentStep = isCompactLayout ? 16 : 24;
    const indent = depth * indentStep;
    const timeColor = comment.timeColor ?? "#B0B0B0";
    const hasReplies =
      Array.isArray(comment.replies) && comment.replies.length > 0;
    const baseLikeColor = comment.likeColor ?? "#B0B0B0";
    const displayLikeColor = comment.liked ? "#A06AFF" : baseLikeColor;
    const likeButtonClasses = comment.liked
      ? "border-[#A06AFF] bg-[#2C1F4A]/40"
      : "border-[#181B22] hover:border-[#A06AFF]/30";
    const likeAriaLabel = comment.liked ? "Unlike comment" : "Like comment";
    const hideLabel = "Hide";
    const showLabel = hasReplies ? "Show thread" : "Show comment";
    const hiddenLabel = hasReplies ? "Thread hidden" : "Comment hidden";

    if (comment.hidden) {
      return (
        <div
          key={comment.id}
          className="relative flex items-center justify-between rounded-2xl border border-[#181B22] bg-[#0C1014]/50 px-4 py-3 max-[360px]:flex-col max-[360px]:items-start max-[360px]:gap-2 max-[360px]:px-3 max-[360px]:py-2.5"
          style={{ marginLeft: indent }}
        >
          {depth > 0 && (
            <div
              className="absolute top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]"
              style={{ left: -indentStep }}
            />
          )}
          <span className="text-sm font-bold text-[#B0B0B0] max-[360px]:text-xs">
            {hiddenLabel}
          </span>
          <button
            type="button"
            onClick={() => handleToggleHidden(comment.id)}
            className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF] max-[360px]:self-end max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm"
          >
            {showLabel}
          </button>
        </div>
      );
    }

    return (
      <div
        key={comment.id}
        className="relative flex flex-col gap-4 max-[360px]:gap-3"
        style={{ marginLeft: indent }}
      >
        {depth > 0 && (
          <div
            className="absolute top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]"
            style={{ left: -indentStep }}
          />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 max-[360px]:items-start max-[360px]:gap-1.5">
            <img
              src={COMMENT_AVATAR}
              alt={`${comment.author} avatar`}
              className="h-11 w-11 rounded-full object-cover max-[360px]:h-10 max-[360px]:w-10"
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-bold text-white">
                {comment.author}
              </span>
              <span className="text-xs font-bold" style={{ color: timeColor }}>
                {comment.time}
              </span>
            </div>
          </div>
          <p className="text-[15px] font-medium text-white max-[360px]:text-sm">
            {comment.text}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleToggleLike(comment.id)}
          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${likeButtonClasses} max-[360px]:gap-1 max-[360px]:px-2`}
          aria-pressed={comment.liked}
          aria-label={likeAriaLabel}
          style={{ color: displayLikeColor }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill={comment.liked ? displayLikeColor : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z"
              stroke={displayLikeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xs font-bold">{comment.likes}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 max-[360px]:gap-1.5">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF] max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm"
            onClick={() => handleToggleHidden(comment.id)}
          >
            {hideLabel}
          </button>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-[15px] font-bold text-white max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm"
          >
            Reply
          </button>
          <button type="button" className="rounded-full p-1 text-[#B0B0B0]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11Z"
                fill="#B0B0B0"
                stroke="#B0B0B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11Z"
                fill="#B0B0B0"
                stroke="#B0B0B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                fill="#B0B0B0"
                stroke="#B0B0B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="flex flex-col gap-4">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={handleNavigateBack}
          className="rounded-full text-[15px] font-normal text-[#B0B0B0] hover:text-white"
        >
          Others
        </button>
        <span className="text-[15px] font-bold text-[#808283]">/</span>
        <span className="text-[15px] font-bold text-white">
          {product.title}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_339px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              {detailItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                    {item.label}
                  </span>
                  <span className="text-[15px] font-bold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Overview</h2>
            </div>
            <div className="p-4">
              <p className="mb-4 text-[15px] font-normal text-white">
                {product.description}
              </p>
              <ul className="list-disc space-y-2 pl-5 text-[15px] font-medium text-white">
                {highlightItems.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="relative mt-6">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="w-full rounded-lg"
                />
                <button
                  type="button"
                  aria-label="Previous screenshot"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11.9908"
                      cy="11.9908"
                      r="11.9908"
                      fill="url(#other_prev)"
                    />
                    <path
                      d="M13.627 8.17578L9.81171 11.991L13.627 15.8063"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="other_prev"
                        x1="23.9815"
                        y1="11.9907"
                        x2="0"
                        y2="11.9907"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#A06AFF" />
                        <stop offset="1" stopColor="#482090" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11.9908"
                      cy="11.9908"
                      r="11.9908"
                      fill="url(#other_next)"
                    />
                    <path
                      d="M10.373 8.17578L14.188 11.991L10.373 15.8063"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="other_next"
                        x1="23.9815"
                        y1="11.9907"
                        x2="0"
                        y2="11.9907"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#A06AFF" />
                        <stop offset="1" stopColor="#482090" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-4 max-[360px]:p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white max-[360px]:text-xl">
                Community discussions
              </h2>
              <div className="flex items-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px] max-[360px]:p-0.5">
                <button
                  type="button"
                  aria-label="Sort comments"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_other_clock)">
                      <path
                        d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928"
                        stroke="#B0B0B0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 5.33301V7.99967L9.33333 9.33301"
                        stroke="#B0B0B0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_other_clock">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Show highlighted comments"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.23732 14.6663C17.3855 12.6663 12.8225 4.66634 7.28172 1.33301C6.63012 3.66634 5.65217 4.33301 3.69657 6.66634C1.10739 9.75561 2.39292 13.333 5.97805 14.6663C5.43485 13.9997 4.03297 12.6002 4.99992 10.6663C5.33325 9.99967 5.99992 9.33301 5.66659 7.99967C6.31844 8.33301 7.66659 8.66634 7.99992 10.333C8.54312 9.66634 9.10685 8.26634 8.58545 6.66634C12.6666 9.66634 10.9999 12.6663 9.23732 14.6663Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 max-[360px]:gap-3">
              <textarea
                className="h-[88px] w-full resize-none rounded-2xl border border-[#181B22] bg-[#0C1014]/30 px-4 py-3 text-[15px] font-medium text-white placeholder-[#B0B0B0] focus:border-[#A06AFF] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]/40 max-[360px]:h-[72px] max-[360px]:px-3 max-[360px]:py-2 max-[360px]:text-sm"
                placeholder="Share your experience with this solution"
                aria-label="Add a comment"
              />
              <button
                type="button"
                className="flex h-[26px] w-[180px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-l from-[#482090] to-[#A06AFF] px-6 py-2.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.02] max-[360px]:w-auto max-[360px]:px-4 max-[360px]:py-2 max-[360px]:text-sm"
              >
                Send
              </button>
            </div>

            <div className="flex flex-col gap-4 max-[360px]:gap-3">
              {comments.map((comment) => renderComment(comment))}
              <div className="flex justify-center">
                <button className="flex h-[26px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2.5 max-[360px]:px-4 max-[360px]:py-2">
                  <span className="text-center text-[15px] font-bold text-white max-[360px]:text-sm">
                    Load more comments
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <img
              src={product.image}
              alt={product.imageAlt}
              className="h-[332px] w-full rounded-t-3xl border border-[#181B22] object-cover"
            />
            <div className="p-4">
              <div className="mb-2 text-2xl font-bold text-white">
                {priceLabel}
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {metaTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="mb-4 flex items-center gap-1">
                <div className="flex gap-0.5">{renderStars(ratingValue)}</div>
                <span className="text-[15px] font-normal text-[#B0B0B0]">
                  {ratingValue.toFixed(1)} ({totalReviews} reviews)
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {CTA_ACTIONS.map(({ key, label, icon: Icon, variant }) => {
                  const isPrimary = variant === "primary";
                  const baseClasses = isPrimary
                    ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white transition-transform hover:scale-[1.02]"
                    : "border border-[#181B22] bg-[#0C1014]/50 text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]";
                  const iconClass = isPrimary ? "h-5 w-5" : "h-4 w-4";

                  return (
                    <button
                      key={key}
                      type="button"
                      className={`flex w-full items-center justify-center gap-2 rounded-full px-12 py-2.5 text-[15px] font-bold ${baseClasses} max-[360px]:gap-1.5 max-[360px]:px-4 max-[360px]:py-2 max-[360px]:text-sm`}
                    >
                      <Icon className={`${iconClass} max-[360px]:h-4 max-[360px]:w-4`} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="p-4">
              <div className="mb-4 flex items-center gap-2">
                <img
                  src={AVATAR_PLACEHOLDER}
                  alt="Product specialist"
                  className="h-20 w-20 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-white">
                    Product specialist
                  </div>
                  <button className="mt-2 flex h-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-3 text-xs font-bold text-white">
                    Follow
                  </button>
                </div>
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Teams using {product.title} typically operate across compliance,
                execution, and research. Join the community and trade notes with
                other {product.ratingTag.toLowerCase()} leaders.
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Weekly office hours cover onboarding shortcuts, new
                integrations, and roadmap previews tailored to{" "}
                {product.industryLabel.toLowerCase()} use cases.
              </div>
              <div className="flex flex-wrap gap-2">
                {compatibilityItems.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white"
                  >
                    {item.toUpperCase()}
                  </span>
                ))}
                {requirementItems.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white"
                  >
                    {item.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="mb-4 text-[19px] font-bold text-[#A06AFF]">
                Reviews
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-[31px] font-bold text-[#A06AFF]">
                  {ratingValue.toFixed(1)}
                </div>
                <div>
                  <div className="flex gap-0.5">{renderStars(ratingValue)}</div>
                  <div className="text-xs font-bold text-[#B0B0B0]">
                    Based on {totalReviews} reviews
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-[#181B22]">
              {comments.slice(0, 3).map((comment) => (
                <div key={`summary-${comment.id}`} className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={AVATAR_PLACEHOLDER}
                        alt={comment.author}
                        className="h-11 w-11 rounded-full"
                      />
                      <div>
                        <div className="text-[15px] font-bold text-white">
                          {comment.author}
                        </div>
                        <div className="text-xs font-bold text-[#B0B0B0]">
                          {comment.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {renderStars(ratingValue)}
                    </div>
                  </div>
                  <div className="text-[15px] font-bold text-white">
                    Great enablement for distributed teams
                  </div>
                  <div className="text-[15px] font-normal text-[#B0B0B0]">
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4">
              <button className="flex h-[46px] w-full items-center justify-center rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                Show More Reviews
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">
                Disclaimer
              </h2>
            </div>
            <div className="p-4">
              <p className="text-[15px] font-normal text-[#B0B0B0]">
                Educational content is provided for instructional purposes only
                and does not constitute financial or investment advice. Review
                the
                <a href="#" className="text-[#A06AFF] underline">
                  {" "}
                  Terms of Use
                </a>{" "}
                for additional details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherDetailLanding;
