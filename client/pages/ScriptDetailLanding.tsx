import { BookOpen, ShoppingCart } from "lucide-react";
import { FC, useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ScriptProduct } from "@/data/marketplaceScriptsSoftware";
import { baseScriptProducts } from "@/data/marketplaceScriptsSoftware";
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
    author: "John Smith",
    time: "6 hours ago",
    text: "Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.",
    likes: 25,
    canHide: true,
    replies: [
      {
        id: "comment-1-1",
        author: "John Smith",
        time: "6 hours ago",
        text: "Thank you, John Smith!",
        likes: 25,
        canHide: true,
        replies: [
          {
            id: "comment-1-1-1",
            author: "John Smith",
            time: "6 hours ago",
            text: "At your service, John Smith!",
            likes: 25,
            likeColor: "#B0B0B0",
          },
        ],
      },
    ],
  },
  {
    id: "comment-2",
    author: "John Smith",
    time: "6 hours ago",
    text: "Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.",
    likes: 25,
    likeColor: "#808283",
    timeColor: "#808283",
  },
  {
    id: "comment-3",
    author: "John Smith",
    time: "6 hours ago",
    text: "Following your lead, I'm reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it's at. Thanks. At first glance, it's a tedious task, but with a strong upward move, it could pay off really well.",
    likes: 25,
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

const SCRIPT_ACTIONS = [
  { key: "demo", label: "Demo", icon: BookOpen },
  { key: "buy", label: "Buy", icon: ShoppingCart },
];

const ScriptDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentNode[]>(
    () => INITIAL_COMMENTS,
  );
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  const product = useMemo<ScriptProduct>(() => {
    const locationState = location.state as { product?: ScriptProduct } | null;
    return locationState?.product ?? baseScriptProducts[0];
  }, [location.state]);
  const originalProductId = useMemo(
    () => extractOriginalProductId(product.id),
    [product.id],
  );
  const { addProductToCart } = useCart();

  const handleAddScriptToCart = useCallback(() => {
    void addProductToCart("script", product, {
      imageUrl: product.heroImage,
      subtitle: product.typeLabel,
      metadata: {
        revenue: product.revenueLabel,
        compatibility: product.compatibility.join(", "),
      },
    });
  }, [addProductToCart, product]);

  const handleNavigateBack = useCallback(() => {
    navigate("/marketplace/scripts");
  }, [navigate]);

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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const filled = i < Math.floor(rating);
      const halfFilled = !filled && i < rating;

      stars.push(
        <svg
          key={i}
          className="h-4 w-4 aspect-square"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.15238 2.29579L10.3256 4.66159C10.4856 4.99092 10.9122 5.30681 11.2722 5.36729L13.3986 5.72351C14.7585 5.95203 15.0785 6.94674 14.0985 7.92801L12.4454 9.59481C12.1654 9.87707 12.0121 10.4215 12.0987 10.8113L12.5721 12.8747C12.9453 14.5079 12.0854 15.1397 10.6523 14.2861L8.65912 13.0965C8.29918 12.8814 7.70592 12.8814 7.33925 13.0965L5.34616 14.2861C3.91965 15.1397 3.05308 14.5011 3.42638 12.8747L3.89966 10.8113C3.98631 10.4215 3.833 9.87707 3.55302 9.59481L1.89988 7.92801C0.926651 6.94674 1.23995 5.95203 2.5998 5.72351L4.72623 5.36729C5.07952 5.30681 5.50614 4.99092 5.66612 4.66159L6.83932 2.29579C7.47925 1.01208 8.51912 1.01208 9.15238 2.29579Z"
            fill={filled ? "#A06AFF" : halfFilled ? "#2E2744" : "#23252D"}
          />
          {halfFilled && (
            <path
              d="M9.15238 2.29579L10.3256 4.66159C10.4856 4.99092 10.9122 5.30681 11.2722 5.36729L13.3986 5.72351C14.7585 5.95203 15.0785 6.94674 14.0985 7.92801L12.4454 9.59481C12.1654 9.87707 12.0121 10.4215 12.0987 10.8113L12.5721 12.8747C12.9453 14.5079 12.0854 15.1397 10.6523 14.2861L8.65912 13.0965C8.29918 12.8814 7.70592 12.8814 7.33925 13.0965L5.34616 14.2861C3.91965 15.1397 3.05308 14.5011 3.42638 12.8747L3.89966 10.8113C3.98631 10.4215 3.833 9.87707 3.55302 9.59481L1.89988 7.92801C0.926651 6.94674 1.23995 5.95203 2.5998 5.72351L4.72623 5.36729C5.07952 5.30681 5.50614 4.99092 5.66612 4.66159L6.83932 2.29579C7.47925 1.01208 8.51912 1.01208 9.15238 2.29579Z"
              fill="url(#paint0_linear)"
            />
          )}
          {halfFilled && (
            <defs>
              <linearGradient
                id="paint0_linear"
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
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={handleNavigateBack}
          className="rounded-full text-[15px] font-normal text-[#B0B0B0] hover:text-white"
        >
          Scripts and Software
        </button>
        <span className="text-[15px] font-bold text-[#808283]">/</span>
        <span className="text-[15px] font-bold text-white">Script_name</span>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_339px]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Details */}
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  type
                </span>
                <span className="text-[15px] font-bold text-white">Script</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  industry
                </span>
                <span className="text-[15px] font-bold text-white">
                  Automation
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  platform
                </span>
                <span className="text-[15px] font-bold text-white">
                  Windows/Mac
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                  category
                </span>
                <span className="text-[15px] font-bold text-white">Other</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">
                Description
              </h2>
            </div>
            <div className="p-4">
              <p className="mb-4 text-[15px] font-normal text-white">
                RiskMaster - powerful tool for traders, automatically calculates
                trade risks. Optimize trading and minimize losses!
              </p>
              <div className="relative">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/5d24f283cbc71837279744db6b5226a102476ce9?width=1360"
                  alt="Product screenshot"
                  className="w-full rounded-lg"
                />
                {/* Carousel navigation */}
                <button
                  type="button"
                  aria-label="Previous screenshot"
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
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
                      fill="url(#script_description_prev)"
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
                        id="script_description_prev"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
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
                      fill="url(#script_description_next)"
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
                        id="script_description_next"
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
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]"></div>
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]"></div>
                  <div className="h-1 w-1 rounded-full bg-[#B0B0B0]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-4 max-[360px]:p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white max-[360px]:text-xl">
                20 comments
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
                    <g clipPath="url(#clip0_clock_script)">
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
                      <clipPath id="clip0_clock_script">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Show trending comments"
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
                placeholder="Comment..."
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
                    16 more comments
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Product card */}
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/d706605b0956cb26f33fb8b670c187f4bd573a4b?width=678"
              alt="Product"
              className="h-[332px] w-full rounded-t-3xl border border-[#181B22] object-cover"
            />
            <div className="p-4">
              <div className="mb-2 text-2xl font-bold text-white">$49.99</div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  automation
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  risk_management
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  trading
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  script
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  optimization
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">{renderStars(4.5)}</div>
                  <span className="text-[15px] font-normal text-[#B0B0B0]">
                    4.5 (28 reviews)
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {SCRIPT_ACTIONS.map(({ key, label, icon: Icon }) => {
                  const isPrimary = key === "buy";
                  const baseClasses = isPrimary
                    ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white transition-transform hover:scale-[1.02]"
                    : "border border-[#181B22] bg-[#0C1014]/50 text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]";
                  const iconClass = isPrimary ? "h-5 w-5" : "h-4 w-4";

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={isPrimary ? handleAddScriptToCart : undefined}
                      className={`flex h-[46px] items-center justify-center gap-2 rounded-full text-[15px] font-bold ${baseClasses}`}
                    >
                      <Icon className={iconClass} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="p-4">
              <div className="mb-4 flex items-center gap-2">
                <img
                  src={AVATAR_PLACEHOLDER}
                  alt="John Smith"
                  className="h-20 w-20 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-white">
                    John Smith
                  </div>
                  <button className="mt-2 flex h-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-3 text-xs font-bold text-white">
                    Follow
                  </button>
                </div>
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Join our 10k+ community:{" "}
                <a
                  href="https://example.com"
                  className="text-[#A06AFF] underline"
                >
                  example.com
                </a>
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Professional trader with 8+ years of experience in momentum
                strategies and technical analysis.
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[15px] font-normal text-[#B0B0B0]">
                  Also on:
                </span>
                <div className="flex gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12.2169 1.26953H14.4659L9.55249 6.88519L15.3327 14.5268H10.8068L7.26204 9.89222L3.20598 14.5268H0.955637L6.21097 8.52026L0.666016 1.26953H5.30675L8.51095 5.50575L12.2169 1.26953ZM11.4276 13.1807H12.6737L4.62961 2.54495H3.29232L11.4276 13.1807Z"
                      fill="white"
                    />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M15.8406 4.8002C15.8406 4.8002 15.6844 3.69707 15.2031 3.2127C14.5938 2.5752 13.9125 2.57207 13.6 2.53457C11.3625 2.37207 8.00313 2.37207 8.00313 2.37207H7.99687C7.99687 2.37207 4.6375 2.37207 2.4 2.53457C2.0875 2.57207 1.40625 2.5752 0.796875 3.2127C0.315625 3.69707 0.1625 4.8002 0.1625 4.8002C0.1625 4.8002 0 6.09707 0 7.39082V8.60332C0 9.89707 0.159375 11.1939 0.159375 11.1939C0.159375 11.1939 0.315625 12.2971 0.79375 12.7814C1.40313 13.4189 2.20313 13.3971 2.55938 13.4658C3.84063 13.5877 8 13.6252 8 13.6252C8 13.6252 11.3625 13.6189 13.6 13.4596C13.9125 13.4221 14.5938 13.4189 15.2031 12.7814C15.6844 12.2971 15.8406 11.1939 15.8406 11.1939C15.8406 11.1939 16 9.90019 16 8.60332V7.39082C16 6.09707 15.8406 4.8002 15.8406 4.8002ZM6.34688 10.0752V5.57832L10.6687 7.83457L6.34688 10.0752Z"
                      fill="white"
                    />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1.44062C10.1375 1.44062 10.3906 1.45 11.2313 1.4875C12.0125 1.52187 12.4344 1.65313 12.7156 1.7625C13.0875 1.90625 13.3563 2.08125 13.6344 2.35938C13.9156 2.64063 14.0875 2.90625 14.2313 3.27813C14.3406 3.55938 14.4719 3.98437 14.5063 4.7625C14.5438 5.60625 14.5531 5.85938 14.5531 7.99375C14.5531 10.1313 14.5438 10.3844 14.5063 11.225C14.4719 12.0063 14.3406 12.4281 14.2313 12.7094C14.0875 13.0813 13.9125 13.35 13.6344 13.6281C13.3531 13.9094 13.0875 14.0813 12.7156 14.225C12.4344 14.3344 12.0094 14.4656 11.2313 14.5C10.3875 14.5375 10.1344 14.5469 8 14.5469C5.8625 14.5469 5.60938 14.5375 4.76875 14.5C3.9875 14.4656 3.56563 14.3344 3.28438 14.225C2.9125 14.0813 2.64375 13.9063 2.36563 13.6281C2.08438 13.3469 1.9125 13.0813 1.76875 12.7094C1.65938 12.4281 1.52813 12.0031 1.49375 11.225C1.45625 10.3813 1.44688 10.1281 1.44688 7.99375C1.44688 5.85625 1.45625 5.60312 1.49375 4.7625C1.52813 3.98125 1.65938 3.55938 1.76875 3.27813C1.9125 2.90625 2.0875 2.6375 2.36563 2.35938C2.64688 2.07813 2.9125 1.90625 3.28438 1.7625C3.56563 1.65313 3.99063 1.52187 4.76875 1.4875C5.60938 1.45 5.8625 1.44062 8 1.44062ZM8 0C5.82813 0 5.55625 0.009375 4.70313 0.046875C3.85313 0.084375 3.26875 0.221875 2.7625 0.41875C2.23438 0.625 1.7875 0.896875 1.34375 1.34375C0.896875 1.7875 0.625 2.23438 0.41875 2.75938C0.221875 3.26875 0.084375 3.85 0.046875 4.7C0.009375 5.55625 0 5.82813 0 8C0 10.1719 0.009375 10.4438 0.046875 11.2969C0.084375 12.1469 0.221875 12.7313 0.41875 13.2375C0.625 13.7656 0.896875 14.2125 1.34375 14.6563C1.7875 15.1 2.23438 15.375 2.75938 15.5781C3.26875 15.775 3.85 15.9125 4.7 15.95C5.55313 15.9875 5.825 15.9969 7.99688 15.9969C10.1688 15.9969 10.4406 15.9875 11.2938 15.95C12.1438 15.9125 12.7281 15.775 13.2344 15.5781C13.7594 15.375 14.2063 15.1 14.65 14.6563C15.0938 14.2125 15.3688 13.7656 15.5719 13.2406C15.7688 12.7313 15.9063 12.15 15.9438 11.3C15.9813 10.4469 15.9906 10.175 15.9906 8.00313C15.9906 5.83125 15.9813 5.55938 15.9438 4.70625C15.9063 3.85625 15.7688 3.27188 15.5719 2.76563C15.375 2.23438 15.1031 1.7875 14.6563 1.34375C14.2125 0.9 13.7656 0.625 13.2406 0.421875C12.7313 0.225 12.15 0.0875 11.3 0.05C10.4438 0.009375 10.1719 0 8 0Z"
                      fill="white"
                    />
                    <path
                      d="M8 3.89062C5.73125 3.89062 3.89062 5.73125 3.89062 8C3.89062 10.2688 5.73125 12.1094 8 12.1094C10.2688 12.1094 12.1094 10.2688 12.1094 8C12.1094 5.73125 10.2688 3.89062 8 3.89062ZM8 10.6656C6.52813 10.6656 5.33437 9.47188 5.33437 8C5.33437 6.52813 6.52813 5.33437 8 5.33437C9.47188 5.33437 10.6656 6.52813 10.6656 8C10.6656 9.47188 9.47188 10.6656 8 10.6656Z"
                      fill="white"
                    />
                    <path
                      d="M13.2312 3.72793C13.2312 4.25918 12.8 4.68731 12.2719 4.68731C11.7406 4.68731 11.3125 4.25606 11.3125 3.72793C11.3125 3.19668 11.7438 2.76855 12.2719 2.76855C12.8 2.76855 13.2312 3.19981 13.2312 3.72793Z"
                      fill="white"
                    />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8.00065 14.6663C4.31875 14.6663 1.33398 11.6815 1.33398 7.99967C1.33398 6.13798 2.09708 4.45452 3.32756 3.24502M8.00065 14.6663C7.35865 14.1906 7.46112 13.6367 7.78318 13.0828C8.27838 12.2313 8.27838 12.2313 8.27838 11.0959C8.27838 9.96061 8.95305 9.42827 11.334 9.90441C12.4038 10.1184 13.1834 8.64027 14.5722 9.12834M8.00065 14.6663C11.2979 14.6663 14.036 12.2727 14.5722 9.12834M3.32756 3.24502C3.89376 3.30477 4.21076 3.6081 4.73729 4.16445C5.73692 5.22069 6.73652 5.30882 7.40298 4.95674C8.40258 4.42863 7.56258 3.57321 8.73578 3.10833C9.45505 2.82335 9.59212 2.077 9.25172 1.4502M3.32756 3.24502C4.53062 2.06248 6.18044 1.33301 8.00065 1.33301C8.42825 1.33301 8.84645 1.37327 9.25172 1.4502M14.5722 9.12834C14.6347 8.76147 14.6673 8.38441 14.6673 7.99967C14.6673 4.74539 12.3356 2.03571 9.25172 1.4502"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  Distribution
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  Luxaigo
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  signals
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  statisticalprobability
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  statistics
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  Stop
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  trailingstop
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  trendanalysis
                </span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="mb-4 text-[19px] font-bold text-[#A06AFF]">
                Reviews
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-[31px] font-bold text-[#A06AFF]">4.5</div>
                <div>
                  <div className="flex gap-0.5">{renderStars(4.5)}</div>
                  <div className="text-xs font-bold text-[#B0B0B0]">
                    Based on 28 reviews
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-[#181B22]">
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={AVATAR_PLACEHOLDER}
                      alt="John Smith"
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="text-[15px] font-bold text-white">
                        John Smith
                      </div>
                      <div className="text-xs font-bold text-[#B0B0B0]">
                        2 days ago
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{renderStars(5)}</div>
                </div>
                <div className="text-[15px] font-bold text-white">
                  Game changer for my trading strategy!
                </div>
                <div className="text-[15px] font-normal text-[#B0B0B0]">
                  This tool has completely transformed how I manage risk in my
                  trading. The automatic calculations save me so much time, and
                  I've seen a significant improvement in my overall performance.
                  Highly recommended for any serious trader.
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={AVATAR_PLACEHOLDER}
                      alt="John Smith"
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="text-[15px] font-bold text-white">
                        John Smith
                      </div>
                      <div className="text-xs font-bold text-[#B0B0B0]">
                        1 week ago
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{renderStars(4)}</div>
                </div>
                <div className="text-[15px] font-bold text-white">
                  Great tool, but could use more features
                </div>
                <div className="text-[15px] font-normal text-[#B0B0B0]">
                  RiskMaster has been very helpful for my day trading. The risk
                  calculations are spot on and have helped me avoid some
                  potentially big losses. I'd love to see more advanced features
                  in future updates, like custom risk models and better
                  integration with other platforms.
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={AVATAR_PLACEHOLDER}
                      alt="John Smith"
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="text-[15px] font-bold text-white">
                        John Smith
                      </div>
                      <div className="text-xs font-bold text-[#B0B0B0]">
                        3 weeks ago
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{renderStars(4.5)}</div>
                </div>
                <div className="text-[15px] font-bold text-white">
                  Worth every penny
                </div>
                <div className="text-[15px] font-normal text-[#B0B0B0]">
                  I was hesitant about the price at first, but after using
                  Riskmaster for a month, I can confidently say it's worth every
                  penny. The portfolio analysis feature alone has saved me from
                  making several costly mistakes. The UI is clean and intuitive,
                  making it easy to incorporate into my daily routine.
                </div>
              </div>
            </div>
            <div className="p-4">
              <button className="flex h-[46px] w-full items-center justify-center rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                Show More Reviews
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">
                Disclaimer
              </h2>
            </div>
            <div className="p-4">
              <p className="text-[15px] font-normal text-[#B0B0B0]">
                The information and publications are not meant to be, and do not
                constitute, financial, investment, trading, or other types of
                advice or recommendations supplied or endorsed by TyrianTrade.
                Read more in the{" "}
                <a href="#" className="text-[#A06AFF] underline">
                  Terms of Use
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptDetailLanding;
