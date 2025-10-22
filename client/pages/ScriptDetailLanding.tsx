import {
  ArrowLeft,
  BookOpen,
  Check,
  Download,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Share2,
  Star,
  Users,
  Eye,
  Globe,
} from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import type { MarketplaceCategory } from "@/data/marketplaceCategories";
import type { ScriptProduct } from "@/data/marketplaceScriptsSoftware";
import { baseScriptProducts } from "@/data/marketplaceScriptsSoftware";

interface ScriptDetailLocationState {
  product?: ScriptProduct;
  category?: MarketplaceCategory;
  scrollToTop?: boolean;
  isFavorite?: boolean;
}

type Review = {
  id: string;
  author: string;
  avatar: string;
  postedAt: string;
  rating: number;
  title: string;
  message: string;
  likes?: number;
};

type ExtendedScriptProduct = ScriptProduct & {
  price: string;
  productImage: string;
  gallery: string[];
  supportChannels: string[];
  documentationLinks: string[];
  deploymentOptions: string[];
  authorBio: string;
  tags: string[];
  averageRating: number;
  totalReviews: number;
  releaseNotes: string[];
  supportResponseTime: string;
  reviews: Review[];
};

const FAVORITE_STORAGE_KEY = "scripts-detail-favorites";

const DEFAULT_GALLERY = [
  "https://api.builder.io/api/v1/image/assets/TEMP/7825b04c53855449a418b331c5ca1f44ac396b69?width=800",
  "https://api.builder.io/api/v1/image/assets/TEMP/9dbaf1fa8ee6fb3c7d1fc3279b8a8fbeb9b0dd02c54af43c9aac5a2ddcaad419?width=800",
  "https://api.builder.io/api/v1/image/assets/TEMP/6b8dbd1c8b78427745934976a8c72c2863d7b8ce7b8077682fa0c3d1ee0d28da?width=800",
];

const resolveFallbackProduct = (
  provided?: ScriptProduct,
): ExtendedScriptProduct => {
  const base = provided ?? baseScriptProducts[0];

  const gallery = [base.heroImage, ...DEFAULT_GALLERY].filter(
    (url, index, array) => array.indexOf(url) === index,
  );

  const numericRating = parseFloat(base.ratingScore) || 4.7;

  return {
    ...base,
    price: "$499 one-time";
    productImage: base.heroImage;
    gallery,
    supportChannels: ["Email", "Discord", "Slack"],
    documentationLinks: [
      "https://example.com/docs",
      "https://example.com/api",
      "https://example.com/quickstart",
    ],
    deploymentOptions: ["On-Premise", "Cloud", "Docker"],
    authorBio:
      "Trading automation specialist focused on packaging institutional-grade tooling for independent desks.",
    tags: ["Automation", "Risk Management", "Multi-platform"],
    averageRating: Number.isFinite(numericRating) ? numericRating : 4.7,
    totalReviews: 128,
    releaseNotes: [
      "Version 2.4 adds broker-agnostic execution adapters and enhanced monitoring dashboards.",
      "Performance optimised with batch backtesting improvements (up to 35% faster).",
      "Extended compatibility with TradingView webhooks and REST automation triggers.",
    ],
    supportResponseTime: "Responds within 2 business hours",
    reviews: [
      {
        id: "review-1",
        author: "Isabella Reed",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=160",
        postedAt: "3 days ago",
        rating: 5,
        title: "Streamlined our risk management",
        message:
          "RiskMaster replaced three separate spreadsheets. Position sizing and stop placement are calculated instantly, and the audit trail keeps compliance happy.",
        likes: 32,
      },
      {
        id: "review-2",
        author: "Marcus Taylor",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F4a0f255d9e9940ecaf46e40918c30f1f?format=webp&width=160",
        postedAt: "1 week ago",
        rating: 4,
        title: "Great automation toolkit",
        message:
          "Deployment through Docker was painless and the included scripts cover most scenarios. Hoping for additional REST endpoints in the next update.",
        likes: 21,
      },
      {
        id: "review-3",
        author: "Lin Chen",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F19246b010e374d04bbcb2900c9c4d3cb?format=webp&width=160",
        postedAt: "2 weeks ago",
        rating: 5,
        title: "Excellent documentation",
        message:
          "The API guides are clear and the sample notebooks shortened integration time dramatically. The support team is quick to respond on Slack.",
        likes: 18,
      },
    ],
  };
};

const COMMENT_AVATAR =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=128";

interface CommentNode {
  id: string;
  author: string;
  time: string;
  text: string;
  likes: number;
  liked?: boolean;
  hidden?: boolean;
  replies?: CommentNode[];
}

const INITIAL_COMMENTS: CommentNode[] = [
  {
    id: "comment-1",
    author: "Isabella Reed",
    time: "4 hours ago",
    text: "Integrated the script with our portfolio risk dashboard. Alerting and hedging recommendations are on point.",
    likes: 18,
    replies: [
      {
        id: "comment-1-1",
        author: "Sarah Lee",
        time: "3 hours ago",
        text: "Appreciate the feedback! We are rolling out an Azure deployment guide next week.",
        likes: 9,
      },
    ],
  },
  {
    id: "comment-2",
    author: "David Romero",
    time: "1 day ago",
    text: "The automation scheduler works flawlessly with our FIX execution stack. Would love an option for webhook retries.",
    likes: 12,
  },
  {
    id: "comment-3",
    author: "Priya Desai",
    time: "2 days ago",
    text: "Onboarding team answered every question quickly. Documentation is dense but comprehensive.",
    likes: 15,
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

const ScriptDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentNode[]>(() => INITIAL_COMMENTS);
  const [activeTab, setActiveTab] = useState<"overview" | "documentation">("overview");

  const locationState = (location.state as ScriptDetailLocationState | null) ?? null;

  useEffect(() => {
    if (locationState?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, {
        replace: true,
        state: { ...locationState, scrollToTop: false },
      });
    }
  }, [location.pathname, locationState, navigate]);

  const favoritesStorageKey = FAVORITE_STORAGE_KEY;
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    const stored = new Set<string>();

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(favoritesStorageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((value) => {
              if (typeof value === "string" && value.trim().length > 0) {
                stored.add(value);
              }
            });
          }
        } catch {
          // ignore malformed values
        }
      }
    }

    if (locationState?.product?.id && locationState.isFavorite) {
      stored.add(locationState.product.id);
    }

    return stored;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      favoritesStorageKey,
      JSON.stringify(Array.from(favoriteIds)),
    );
  }, [favoriteIds, favoritesStorageKey]);

  const product = useMemo<ExtendedScriptProduct>(() => {
    const provided = locationState?.product;
    return resolveFallbackProduct(provided);
  }, [locationState?.product]);

  const isFavorite = favoriteIds.has(product.id);

  const handleToggleFavorite = useCallback(() => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  }, [product.id]);

  const categoryLabel = locationState?.category ?? "Scripts and Software";

  const handleNavigateToCategory = useCallback(() => {
    navigate("/marketplace/scripts", {
      state: {
        scrollToTop: true,
        category: categoryLabel,
      },
    });
  }, [categoryLabel, navigate]);

  const handleToggleLike = useCallback((id: string) => {
    setComments((prev) => toggleLikeInTree(prev, id));
  }, []);

  const handleToggleHidden = useCallback((id: string) => {
    setComments((prev) => toggleHiddenInTree(prev, id));
  }, []);

  const renderComment = (comment: CommentNode, depth = 0): JSX.Element => {
    const indent = depth * 20;

    if (comment.hidden) {
      return (
        <div
          key={comment.id}
          className="relative flex items-center justify-between rounded-2xl border border-[#181B22] bg-[#0C1014]/50 px-4 py-3"
          style={{ marginLeft: indent }}
        >
          <span className="text-sm font-bold text-[#B0B0B0]">
            Comment hidden
          </span>
          <button
            type="button"
            onClick={() => handleToggleHidden(comment.id)}
            className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF]"
          >
            Show
          </button>
        </div>
      );
    }

    return (
      <div
        key={comment.id}
        className="relative flex flex-col gap-4"
        style={{ marginLeft: indent }}
      >
        <div className="flex items-center gap-3">
          <img
            src={COMMENT_AVATAR}
            alt={`${comment.author} avatar`}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="flex flex-1 flex-col">
            <span className="text-[15px] font-bold text-white">{comment.author}</span>
            <span className="text-xs font-bold text-[#B0B0B0]">{comment.time}</span>
          </div>
        </div>

        <p className="text-[15px] font-medium text-white">{comment.text}</p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleLike(comment.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
              comment.liked
                ? "border-[#A06AFF] text-[#A06AFF]"
                : "border-[#181B22] text-[#B0B0B0] hover:border-[#A06AFF]/40"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill={comment.liked ? "currentColor" : "none"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.2189 3.32846C13.9842 1.95769 12.0337 2.51009 10.8621 3.39001C10.3816 3.7508 10.1414 3.93119 10.0001 3.93119C9.85875 3.93119 9.61858 3.7508 9.13808 3.39001C7.96643 2.51009 6.01599 1.95769 3.78128 3.32846C0.848472 5.12745 0.184848 11.0624 6.94969 16.0695C8.23818 17.0232 8.88241 17.5 10.0001 17.5C11.1177 17.5 11.762 17.0232 13.0505 16.0695C19.8153 11.0624 19.1517 5.12745 16.2189 3.32846Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {comment.likes}
          </button>
          <button
            type="button"
            onClick={() => handleToggleHidden(comment.id)}
            className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF]"
          >
            Hide
          </button>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-[15px] font-bold text-white"
          >
            Reply
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

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      const halfFilled = !filled && index < rating;

      return (
        <Star
          key={index}
          className={`h-4 w-4 ${
            filled
              ? "fill-[#A06AFF] text-[#A06AFF]"
              : halfFilled
                ? "fill-[#A06AFF]/60 text-[#A06AFF]"
                : "fill-[#2E2744] text-[#2E2744]"
          }`}
        />
      );
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto flex w-full max-w-[1075px] items-center justify-between px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={handleNavigateToCategory}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#B0B0B0] transition-colors hover:text-white sm:text-[15px]"
        >
          <ArrowLeft className="h-4 w-4" />
          {categoryLabel}
        </button>
        <span className="text-sm font-bold text-[#B0B0B0] sm:text-[15px]">
          {product.id}
        </span>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] lg:flex-row lg:items-start lg:gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(160,106,255,0.16)] px-3 py-1 text-xs font-extrabold uppercase text-[#A06AFF]">
                  {product.typeLabel}
                </div>
                <h1 className="text-2xl font-bold text-white sm:text-[31px]">
                  {product.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                  <span className="inline-flex items-center gap-1 text-white">
                    <ShoppingCart className="h-4 w-4 text-[#FFA800]" />
                    {product.purchases} purchases
                  </span>
                  <span className="inline-flex items-center gap-1 text-white">
                    <Eye className="h-4 w-4 text-[#FFA800]" />
                    {product.views} views
                  </span>
                  <span className="inline-flex items-center gap-1 text-white">
                    <Users className="h-4 w-4 text-[#B0B0B0]" />
                    {product.creator.followers} followers
                  </span>
                </div>
              </div>

              <FavoriteStarButton
                pressed={isFavorite}
                onToggle={handleToggleFavorite}
                className="focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
              />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#181B22]">
              <img
                src={product.productImage}
                alt={product.heroAlt}
                className="h-full w-full max-h-[400px] rounded-2xl object-cover"
              />
            </div>

            <div className="grid gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Price
                </span>
                <span className="text-lg font-bold text-white">{product.price}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Revenue
                </span>
                <span className="text-lg font-bold text-white">
                  {product.revenueLabel}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Rating
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.averageRating)}
                  </div>
                  <span className="text-lg font-bold text-white">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Support
                </span>
                <span className="text-lg font-bold text-white">
                  {product.supportResponseTime}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="flex h-[42px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Buy now
                </button>
                <button
                  type="button"
                  className="flex h-[42px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-6 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <BookOpen className="h-4 w-4" />
                  Request demo
                </button>
                <button
                  type="button"
                  className="flex h-[42px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-6 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact author
                </button>
                <button
                  type="button"
                  className="flex h-[42px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 px-6 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
                <span>Tags:</span>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[#2E2744] px-2 py-0.5 text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
                <h2 className="mb-2 text-[19px] font-bold text-white">Overview</h2>
                <p className="text-[15px] font-medium text-white">
                  {product.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
                  <h3 className="mb-3 text-[15px] font-bold uppercase text-[#B0B0B0]">
                    Compatibility
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibility.map((item) => (
                      <span
                        key={item}
                        className="rounded bg-[#2E2744] px-2 py-1 text-xs font-bold uppercase text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
                  <h3 className="mb-3 text-[15px] font-bold uppercase text-[#B0B0B0]">
                    Requirements
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.requirements.map((item) => (
                      <span
                        key={item}
                        className="rounded bg-[#2E2744] px-2 py-1 text-xs font-bold uppercase text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
                  <h3 className="mb-3 text-[15px] font-bold uppercase text-[#B0B0B0]">
                    Support channels
                  </h3>
                  <ul className="flex flex-col gap-2 text-sm font-bold text-white">
                    {product.supportChannels.map((channel) => (
                      <li key={channel} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#2EBD85]" />
                        {channel}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
                  <h3 className="mb-3 text-[15px] font-bold uppercase text-[#B0B0B0]">
                    Documentation
                  </h3>
                  <ul className="flex flex-col gap-2 text-sm font-bold text-white">
                    {product.documentationLinks.map((link) => (
                      <li key={link} className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-[#A06AFF]" />
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-[#A06AFF] underline-offset-4 hover:opacity-80"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
                  <h3 className="mb-3 text-[15px] font-bold uppercase text-[#B0B0B0]">
                    Deployment
                  </h3>
                  <ul className="flex flex-col gap-2 text-sm font-bold text-white">
                    {product.deploymentOptions.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#6AA5FF]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
                <h3 className="mb-3 text-[15px] font-bold uppercase text-[#B0B0B0]">
                  Latest release notes
                </h3>
                <ul className="flex list-disc flex-col gap-2 pl-4 text-sm font-bold text-white">
                  {product.releaseNotes.map((note, index) => (
                    <li key={`${note}-${index}`}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-[320px] flex-col gap-4">
            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
              <h2 className="mb-3 text-[19px] font-bold text-white">Creator</h2>
              <div className="flex items-center gap-3">
                <img
                  src={product.creator.avatar}
                  alt={product.creator.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-bold text-white">
                    {product.creator.name}
                  </span>
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Responds fast
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-white">
                {product.authorBio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.creator.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[#2A1C0E] px-2 py-0.5 text-xs font-extrabold uppercase text-[#FFA800]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="mt-4 flex h-[38px] w-full items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/60 text-sm font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
              >
                <Globe className="h-4 w-4" />
                View portfolio
              </button>
            </div>

            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
              <h2 className="mb-3 text-[19px] font-bold text-white">Gallery</h2>
              <div className="grid grid-cols-2 gap-3">
                {product.gallery.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${product.title} screenshot ${index + 1}`}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4">
              <h2 className="mb-3 text-[19px] font-bold text-white">
                Customer satisfaction
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-[#B0B0B0]">
                  ({product.totalReviews} reviews)
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {renderStars(product.averageRating)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`rounded-full px-4 py-2 text-[15px] font-bold transition-colors ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C1014]/50 text-white"
            }`}
          >
            Reviews
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("documentation")}
            className={`rounded-full px-4 py-2 text-[15px] font-bold transition-colors ${
              activeTab === "documentation"
                ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                : "border border-[#181B22] bg-[#0C1014]/50 text-white"
            }`}
          >
            Documentation
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="mt-6 flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
            <div className="flex flex-col gap-6">
              {comments.map((comment) => renderComment(comment))}
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] md:grid-cols-2">
            {product.documentationLinks.map((link) => (
              <div
                key={`doc-${link}`}
                className="flex flex-col gap-2 rounded-2xl border border-[#181B22] bg-[#0C1014]/60 p-4"
              >
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Documentation resource
                </span>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[15px] font-bold text-white underline decoration-[#A06AFF] underline-offset-4 hover:opacity-80"
                >
                  {link}
                </a>
                <p className="text-sm font-medium text-white">
                  Step-by-step guide covering configuration, integration notes, and best practices for this resource.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptDetailLanding;