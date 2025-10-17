import { Check, MessageCircle, Star, Users } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";

interface TradingRobot {
  id: string;
  name: string;
  icon: string;
  users: string;
  accuracyLevel: string;
  accuracyLabel: string;
  profitSharing: string;
  leverage: string;
  leverageCategory: string;
  exchanges: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  pair?: string;
  maxDrawdown?: string;
  marketType?: string;
  type?: string;
  strategy?: string;
  settings?: string;
  roiApy30d?: string;
  aum?: string;
  platform?: string;
  roiApy1y?: string;
  subscribers?: string;
  sector?: string;
  runningTime?: string;
}

interface TradingRobotDetailsState {
  robot?: TradingRobot;
  scrollToTop?: boolean;
  isFavorite?: boolean;
}

type ExtendedRobot = TradingRobot & {
  price?: string;
  productImage?: string;
  author?: {
    name: string;
    avatar: string;
    bio?: string;
    communityLink?: string;
    socials?: string[];
    role?: string;
  };
  tags?: string[];
  reviews?: Array<{
    id: string;
    author: string;
    avatar: string;
    postedAt: string;
    rating: number;
    title: string;
    message: string;
    likes?: number;
  }>;
  averageRating?: number;
  totalReviews?: number;
  description?: string;
  originalDescription?: string;
};

const DEFAULT_CHART_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F2d6d24710ba34771b2ab72e3d53cd2ec?format=webp&width=800";
const FAVORITE_STORAGE_KEY = "robot-detail-favorites";

const PRODUCT_ACTIONS = [
  { key: "subscribe", label: "Subscribe", icon: Check },
  { key: "chat", label: "Chat", icon: MessageCircle },
] as const;

type ProductActionKey = (typeof PRODUCT_ACTIONS)[number]["key"];

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

type PerformanceLevel = {
  label: string;
  accent?: boolean;
};

const PERFORMANCE_LEVELS: readonly PerformanceLevel[] = [
  { label: "$500K" },
  { label: "$100K" },
  { label: "$10K" },
  { label: "$100" },
  { label: "$1" },
  { label: "$0.01", accent: true },
];

const PERFORMANCE_MONTHS = [
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
  "JAN",
  "FEB",
  "MAR",
] as const;

const ACCURACY_LEVELS = [250, 200, 150, 100, 50, 0] as const;

const ACCURACY_DATA = [
  { month: "APR", successful: 37, unsuccessful: 14 },
  { month: "MAY", successful: 17, unsuccessful: 25 },
  { month: "JUN", successful: 37, unsuccessful: 29 },
  { month: "JUL", successful: 57, unsuccessful: 8 },
  { month: "AUG", successful: 37, unsuccessful: 6 },
  { month: "SEP", successful: 27, unsuccessful: 22 },
  { month: "OCT", successful: 27, unsuccessful: 16 },
  { month: "NOV", successful: 57, unsuccessful: 27 },
  { month: "DEC", successful: 181, unsuccessful: 6 },
  { month: "JAN", successful: 27, unsuccessful: 6 },
  { month: "FEB", successful: 181, unsuccessful: 47 },
  { month: "MAR", successful: 57, unsuccessful: 15 },
] as const;

const SUBSCRIBER_RATINGS = [
  {
    id: "1",
    rank: 1,
    name: "Atlas Quinn",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/3c86ef8ce9d9f7f00e7e31590e37379c0ce5a723?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
  {
    id: "2",
    rank: 2,
    name: "Mira Sterling",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/df1d49f2a52e02e453bedc3be604d2f6d505dd9d?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
  {
    id: "3",
    rank: 3,
    name: "Drake Lawson",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/4d7134864adca418ec77aca2390bd76e870bfda9?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
  {
    id: "4",
    rank: 4,
    name: "Eva Ryker",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/184a2af0b23d017baa9a302e8dc1c6dfaa6a52dd?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
  {
    id: "5",
    rank: 5,
    name: "Silas Trent",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/df1d54dd467a939d083ce359882e9d457963b2fb?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
  {
    id: "6",
    rank: 6,
    name: "Noa Vance",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/9a5ce8adf3ba54842c9026bacddc4e382df3a8dd?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
  {
    id: "7",
    rank: 7,
    name: "Jaxon Wolfe",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/6889c9671fa904091f0b71cae03fb98e81cd4da6?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
  {
    id: "8",
    rank: 8,
    name: "Elara Knox",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/0003cb6c803e279a28542c907af7178d810da9b1?width=88",
    subscribedDays: 9,
    roi: "+120.83%",
    amount: "466.00",
  },
];

const TradingRobotDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentNode[]>(() => INITIAL_COMMENTS);
  const [activeAction, setActiveAction] = useState<ProductActionKey>("subscribe");
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showOriginalDescription, setShowOriginalDescription] = useState(false);

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

  const handleToggleLike = useCallback((id: string) => {
    setComments((prev) => toggleLikeInTree(prev, id));
  }, []);

  const handleToggleHidden = useCallback((id: string) => {
    setComments((prev) => toggleHiddenInTree(prev, id));
  }, []);

  const renderComment = (comment: CommentNode, depth = 0): JSX.Element => {
    const indentStep = isCompactLayout ? 16 : 32;
    const indent = depth * indentStep;
    const timeColor = comment.timeColor ?? "#B0B0B0";
    const hasReplies = Array.isArray(comment.replies) && comment.replies.length > 0;
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
          <span className="text-sm font-bold text-[#B0B0B0] max-[360px]:text-xs">{hiddenLabel}</span>
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
              <span className="text-[15px] font-bold text-white">{comment.author}</span>
              <span className="text-xs font-bold" style={{ color: timeColor }}>
                {comment.time}
              </span>
            </div>
          </div>
          <p className="text-[15px] font-medium text-white max-[360px]:text-sm">{comment.text}</p>
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
          {comment.canHide && (
            <button
              type="button"
              className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF] max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm"
              onClick={() => handleToggleHidden(comment.id)}
            >
              {hideLabel}
            </button>
          )}
          <button type="button" className="rounded-full px-4 py-2 text-[15px] font-bold text-white max-[360px]:px-3 max-[360px]:py-1.5 max-[360px]:text-sm">
            Reply
          </button>
          <button type="button" className="rounded-full p-1 text-[#B0B0B0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  const locationState = (location.state as TradingRobotDetailsState | null) ?? null;

  const [favoriteRobotIds, setFavoriteRobotIds] = useState<Set<string>>(() => {
    const storedIds = new Set<string>();

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(FAVORITE_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((value) => {
              if (typeof value === "string" && value.trim().length > 0) {
                storedIds.add(value);
              }
            });
          }
        } catch {
          // ignore malformed storage values
        }
      }
    }

    if (locationState?.robot?.id && locationState.isFavorite) {
      storedIds.add(locationState.robot.id);
    }

    return storedIds;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      FAVORITE_STORAGE_KEY,
      JSON.stringify(Array.from(favoriteRobotIds)),
    );
  }, [favoriteRobotIds]);

  useEffect(() => {
    const id = locationState?.robot?.id;
    if (!id || !locationState?.isFavorite) {
      return;
    }

    setFavoriteRobotIds((prev) => {
      if (prev.has(id)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [locationState]);

  useEffect(() => {
    if (locationState?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(location.pathname, {
        replace: true,
        state: { ...locationState, scrollToTop: false },
      });
    }
  }, [location.pathname, locationState, navigate]);

  const robot = useMemo<ExtendedRobot>(() => {
    const fallback: ExtendedRobot = {
      id: "default-robot",
      name: "BTC/USDT Grid-Bot HODL",
      icon: "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F1d90fdad8fa945dc9d0b417f6bb84c17?format=webp&width=256",
      users: "315",
      accuracyLevel: "medium",
      accuracyLabel: "Medium Accuracy",
      profitSharing: "20% Profit Sharing",
      leverage: "x10",
      leverageCategory: "MEDIUM",
      exchanges: [],
      pair: "BTC/USDT",
      maxDrawdown: "-8.2%",
      marketType: "Futures (x10 LEVERAGE)",
      type: "Stocks, Futures",
      strategy: "Tech Analysis (MA, RSI)",
      settings: "Custom Indicators",
      roiApy30d: "+120.83%",
      aum: "216,632.59",
      platform: "Windows/Mac",
      roiApy1y: "+520.00%",
      subscribers: "4,071",
      sector: "Crypto, Forex, Stocks",
      runningTime: "114d 7h 13m",
      price: "$10 / month",
      productImage: DEFAULT_CHART_IMAGE,
      author: {
        name: "Sarah Lee",
        avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=160",
        bio: "Professional trader with 8+ years of experience in momentum strategies and technical analysis.",
        communityLink: "https://example.com",
        socials: ["twitter", "youtube", "instagram", "web"],
      },
      tags: ["Distribution", "Luxaigo", "signals", "statisticalprobability", "statistics", "Stop", "trailingstop", "trendanalysis"],
      averageRating: 4.5,
      totalReviews: 28,
      description: "Automates swaps between Ethereum (ETH) and Bitcoin (BTC) based on price divergence. When ETH outperforms BTC the bot sells a slice of ETH for BTC; when BTC regains strength the cycle reverse. No manual action required.",
      originalDescription:
        "Automates swaps between Ethereum (ETH) and Bitcoin (BTC) based on price divergence. When ETH outperforms BTC the bot sells a slice of ETH for BTC; when BTC regains strength the cycle reverse. No manual action required.",
      reviews: [
        {
          id: "1",
          author: "John Smith",
          avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
          postedAt: "2 days ago",
          rating: 5,
          title: "Game changer for my trading strategy!",
          message: "This tool has completely transformed how I manage risk in my trading. The automatic calculations save me so much time, and I've seen a significant improvement in my overall performance. Highly recommended for any serious trader.",
        },
        {
          id: "2",
          author: "John Smith",
          avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
          postedAt: "1 week ago",
          rating: 4,
          title: "Great tool, but could use more features",
          message: "RiskMaster has been very helpful for my day trading. The risk calculations are spot on and have helped me avoid some potentially big losses. I'd love to see more advanced features in future updates, like custom risk models and better integration with other platforms.",
        },
        {
          id: "3",
          author: "John Smith",
          avatar: "https://api.builder.io/api/v1/image/assets/TEMP/f9b1a559e2dfecc34192f3c44dcb709b0e800d3a?width=88",
          postedAt: "3 weeks ago",
          rating: 4.5,
          title: "Worth every penny",
          message: "I was hesitant about the price at first, but after using Riskmaster for a month, I can confidently say it's worth every penny. The portfolio analysis feature alone has saved me from making several costly mistakes. The UI is clean and intuitive, making it easy to incorporate into my daily routine.",
        },
      ],
    };

    const provided = locationState?.robot as ExtendedRobot | undefined;
    return provided ?? fallback;
  }, [locationState]);

  const isRobotFavorite = favoriteRobotIds.has(robot.id);

  const handleToggleFavoriteRobot = useCallback(() => {
    setFavoriteRobotIds((prev) => {
      const next = new Set(prev);
      if (next.has(robot.id)) {
        next.delete(robot.id);
      } else {
        next.add(robot.id);
      }
      return next;
    });
  }, [robot.id]);

  const reviews = useMemo(() => {
    const sourceReviews = Array.isArray(robot.reviews) && robot.reviews.length > 0
      ? robot.reviews
      : [];

    return sourceReviews.filter(
      (review) =>
        typeof review?.author === "string" &&
        review.author.trim().length > 0 &&
        typeof review?.message === "string" &&
        review.message.trim().length > 0,
    );
  }, [robot.reviews]);

  const handleNavigateToCategory = useCallback(() => {
    navigate("/marketplace/trading-robots", {
      state: {
        scrollToTop: true,
      },
    });
  }, [navigate]);

  const tags = Array.isArray(robot.tags) ? robot.tags : [];
  const author = robot.author;
  const averageRating =
    typeof robot.averageRating === "number" && robot.averageRating > 0
      ? robot.averageRating
      : 0;
  const totalReviews =
    typeof robot.totalReviews === "number" && robot.totalReviews > 0
      ? robot.totalReviews
      : 0;
  const baseChartImage =
    robot.productImage ?? DEFAULT_CHART_IMAGE;
  const displayChartImage = baseChartImage || DEFAULT_CHART_IMAGE;
  const authorAvatar = author?.avatar ?? "";
  const heroImage = authorAvatar || baseChartImage || DEFAULT_CHART_IMAGE;

  const translatedDescription = robot.description ?? "";
  const hasOriginalDescription = Boolean(robot.originalDescription && robot.originalDescription.trim().length > 0);
  const descriptionToDisplay =
    showOriginalDescription && hasOriginalDescription
      ? robot.originalDescription ?? ""
      : translatedDescription;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      const halfFilled = !filled && index < rating;

      return (
        <Star
          key={index}
          className={`h-4 w-4 ${
            filled
              ? "fill-[#A06AFF] text-[#A06AFF]"
              : halfFilled
                ? "fill-[url(#half-star)] text-[#A06AFF]"
                : "fill-[#2E2744] text-[#2E2744]"
          }`}
        />
      );
    });
  };

  return (
    <div className="flex flex-col gap-6 max-[360px]:gap-4">
      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex items-center gap-2 text-[15px] max-[360px]:gap-1.5 max-[360px]:text-sm">
          <button
            type="button"
            onClick={handleNavigateToCategory}
            className="font-normal text-[#B0B0B0] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
          >
            Trading robots and Algorithms
          </button>
          <span className="font-bold text-[#B0B0B0]">/</span>
          <span className="font-bold text-white">{robot.name}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:flex-col max-[360px]:items-start max-[360px]:gap-2 max-[360px]:rounded-xl max-[360px]:p-3">
          <h1 className="text-2xl font-bold text-white sm:text-[31px] max-[360px]:text-xl">
            {robot.name}
          </h1>
          <FavoriteStarButton
            pressed={isRobotFavorite}
            onToggle={handleToggleFavoriteRobot}
            className="focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4 max-[360px]:px-2">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6 max-[360px]:gap-4">
          <div className="flex flex-col gap-6 lg:flex-[2] lg:min-w-0 max-[360px]:gap-4">
            {/* Grid-Bot HODL Description */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4 max-[360px]:p-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Grid-Bot HODL</h2>
              </div>
              <div className="p-4 max-[360px]:p-3">
                <div
                  className={`relative text-[15px] font-medium leading-relaxed text-white/90 max-[360px]:text-sm ${
                    isDescriptionExpanded ? "" : "max-h-[176px] overflow-hidden pr-1"
                  }`}
                >
                  <p className="whitespace-pre-line">{descriptionToDisplay}</p>
                  {!isDescriptionExpanded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#0C1014]" />
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-6 text-[15px] font-medium max-[360px]:gap-4">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="text-[#A06AFF] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                  >
                    {isDescriptionExpanded ? "Collapse" : "Expand"}
                  </button>
                  {hasOriginalDescription && (
                    <button
                      type="button"
                      onClick={() => setShowOriginalDescription((prev) => !prev)}
                      className="text-[#A06AFF] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                    >
                      {showOriginalDescription ? "Show Translation" : "Show Original"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4 max-[360px]:p-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Details</h2>
              </div>
              <div className="flex flex-col gap-4 border-b border-[#181B22] p-4 sm:flex-row sm:items-center sm:justify-between max-[360px]:p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={author?.avatar ?? ""}
                    alt={author?.name ?? "Author"}
                    className="h-11 w-11 rounded-full object-cover max-[360px]:h-10 max-[360px]:w-10"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                      {author?.name ?? ""}
                    </span>
                    <span className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                      Individual Analyst
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-left sm:text-right">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Running time</span>
                  <span className="text-[15px] font-medium text-[#A06AFF] max-[360px]:text-sm">
                    {robot.runningTime ?? "—"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 max-[360px]:gap-3 max-[360px]:p-3">
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">ROI APY for 30 days</span>
                  <span className="text-[15px] font-bold text-[#2EBD85] max-[360px]:text-sm">
                    {robot.roiApy30d ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">AUM (USDT)</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {robot.aum ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Platform</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {robot.platform ?? "—"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 border-t border-[#181B22] p-4 sm:grid-cols-3 max-[360px]:gap-3 max-[360px]:p-3">
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">ROI APY for 1 year</span>
                  <span className="text-[15px] font-bold text-[#2EBD85] max-[360px]:text-sm">
                    {robot.roiApy1y ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Subscribers</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {robot.subscribers ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Sector</span>
                  <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                    {robot.sector ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="relative flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-3 max-[360px]:p-3">
              <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Performance</h2>
              <div className="h-px w-full bg-[#181B22]" />
              <div className="relative">
                <div className="relative h-[220px] max-[360px]:h-[140px]">
                  <div className="absolute left-0.5 top-0 h-full w-[calc(100%-42px)] max-[360px]:w-[calc(100%-24px)]">
                    <svg
                      className="h-full w-full"
                      viewBox="0 0 652 221"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <g filter="url(#filter0_d_perf)">
                        <path
                          d="M9 208.911L16.454 212L21.0091 205.822L25.1502 208.028L26.3926 204.498L29.7054 205.822L33.8465 202.291L37.5735 204.498L49.5826 185.08L51.2391 186.404L56.6225 176.696L58.2789 180.226L60.3494 178.02L62.42 180.226L64.0764 176.696L66.9752 179.343L69.8739 176.696L72.3586 178.02C73.6009 174.048 76.0856 166.016 76.0856 165.663C76.0856 165.31 76.0856 157.278 76.0856 153.307L79.3984 157.278L81.8831 153.307C81.8831 154.189 81.8831 155.601 81.8831 154.189C81.8831 152.777 84.6438 143.009 86.0242 138.302L89.337 151.1L93.8922 140.067L97.2051 139.185L98.4474 131.683L100.932 133.007L102.174 128.593L105.487 136.537L107.144 145.804L108.8 137.42L110.457 142.274L112.113 154.189L114.184 139.185L117.911 149.776L122.88 131.683L127.021 135.213L128.677 130.8L130.748 134.33L134.061 129.917L138.616 144.922L141.101 137.42L144.828 140.067L147.726 129.917L148.555 135.213L151.453 130.8L155.594 147.57L157.665 143.157L158.493 147.57L162.22 144.922L163.462 152.865L165.119 146.687L168.846 143.157L170.502 145.804L171.745 140.067L175.057 147.57L177.542 146.687L181.269 152.865L183.754 146.687L187.067 161.691L190.379 160.367V151.1L192.864 148.452L199.076 157.72L201.975 149.776L203.217 157.72L205.702 156.837L208.186 152.865L209.843 156.837L211.499 144.922L212.741 147.57L214.812 142.274"
                          stroke="#A06AFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </g>
                      <defs>
                        <filter id="filter0_d_perf" x="0.249756" y="0.698242" width="651.5" height="220.22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset />
                          <feGaussianBlur stdDeviation="4" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0.627451 0 0 0 0 0.415686 0 0 0 0 1 0 0 0 0.24 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_perf" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_perf" result="shape" />
                        </filter>
                      </defs>
                    </svg>
                  </div>

                  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
                    {PERFORMANCE_LEVELS.map((level) => (
                      <div key={level.label} className="flex items-center gap-0.5">
                        <div
                          className={`h-px flex-1 ${level.accent ? "bg-[#523A83]" : "bg-[#2E2744]"}`}
                        />
                        <span className="w-10 text-right text-xs font-bold uppercase text-[#B0B0B0] max-[360px]:w-8">
                          {level.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute right-4 top-0 z-20 inline-flex items-center justify-center rounded bg-[#A06AFF] px-1 py-0.5">
                    <span className="text-center text-xs font-bold uppercase text-white">$507K</span>
                  </div>
                </div>

                <div className="relative left-0.5 top-0.5 flex w-[calc(100%-42px)] max-[360px]:w-[calc(100%-24px)] items-start justify-between gap-2">
                  {PERFORMANCE_MONTHS.map((month) => (
                    <div key={month} className="flex flex-col items-center gap-1">
                      <div className="h-2 w-px bg-[#523A83]" />
                      <span className="text-center text-xs font-bold uppercase text-[#B0B0B0]">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accuracy Chart */}
            <div className="relative flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-3 max-[360px]:p-3">
              <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Accuracy</h2>
              <div className="h-px w-full bg-[#181B22]" />
              <div className="relative">
                <div className="relative h-[216px] max-[360px]:h-[140px]">
                  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
                    {ACCURACY_LEVELS.map((level, index) => (
                      <div key={level} className="flex items-center gap-0.5">
                        <div
                          className={`h-px flex-1 ${index === ACCURACY_LEVELS.length - 1 ? "bg-[#523A83]" : "bg-[#2E2744]"}`}
                        />
                        <span className="w-10 text-right text-xs font-bold uppercase text-[#B0B0B0] max-[360px]:w-8">
                          {level}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-[42px] z-20 flex items-end justify-between gap-[2px] max-[360px]:right-[28px]">
                    {ACCURACY_DATA.map((data) => {
                      const maxHeight = 181;
                      const successfulHeight = (data.successful / 250) * maxHeight;
                      const unsuccessfulHeight = (data.unsuccessful / 250) * maxHeight;

                      return (
                        <div key={data.month} className="flex flex-1 items-end gap-px">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-[#181A20] to-[#A06AFF]"
                            style={{
                              height: `${successfulHeight}px`,
                              minHeight: successfulHeight > 0 ? "8px" : "0px",
                            }}
                          />
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-[#181A20] to-[#FFA800]"
                            style={{
                              height: `${unsuccessfulHeight}px`,
                              minHeight: unsuccessfulHeight > 0 ? "8px" : "0px",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative left-0.5 top-0.5 flex w-[calc(100%-42px)] max-[360px]:w-[calc(100%-24px)] items-start justify-between gap-2">
                  {ACCURACY_MONTHS.map((month) => (
                    <div key={month} className="flex flex-col items-center gap-1">
                      <div className="h-2 w-px bg-[#523A83]" />
                      <span className="text-center text-xs font-bold uppercase text-[#B0B0B0]">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 max-[360px]:gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#A06AFF]" />
                  <span className="text-xs font-bold uppercase text-[#808283]">Successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FFA800]" />
                  <span className="text-xs font-bold uppercase text-[#808283]">Unsuccessful</span>
                </div>
              </div>
            </div>

            {/* Bot Subscribers Rating */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="flex items-center gap-2 border-b border-[#181B22] p-4 max-[360px]:p-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">
                  Bot Subscribers Rating
                </h2>
                <button type="button" className="text-[#B0B0B0]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_rating)">
                      <path
                        d="M8.7135 2.20042C9.42358 1.48918 10.5761 1.48918 11.2862 2.20042L12.1273 3.04292C12.4686 3.38482 12.932 3.57676 13.4151 3.57636L14.6056 3.57538C15.6107 3.57457 16.4256 4.38951 16.4248 5.39454L16.4238 6.58504C16.4234 7.06815 16.6153 7.53153 16.9573 7.87287L17.7998 8.71399C18.511 9.42407 18.511 10.5766 17.7998 11.2867L16.9573 12.1278C16.6153 12.4691 16.4234 12.9325 16.4238 13.4156L16.4248 14.6061C16.4256 15.6112 15.6107 16.4261 14.6056 16.4252L13.4151 16.4243C12.932 16.4239 12.4686 16.6158 12.1273 16.9577L11.2862 17.8002C10.5761 18.5115 9.42358 18.5115 8.7135 17.8002L7.87238 16.9577C7.53104 16.6158 7.06766 16.4239 6.58455 16.4243L5.39405 16.4252C4.38902 16.4261 3.57408 15.6112 3.57489 14.6061L3.57587 13.4156C3.57627 12.9325 3.38433 12.4691 3.04244 12.1278L2.19994 11.2867C1.48869 10.5766 1.48869 9.42407 2.19994 8.71399L3.04244 7.87287C3.38433 7.53153 3.57627 7.06815 3.57587 6.58504L3.57489 5.39454C3.57408 4.38951 4.38902 3.57457 5.39405 3.57538L6.58455 3.57636C7.06766 3.57676 7.53104 3.38482 7.87238 3.04292L8.7135 2.20042Z"
                        stroke="#B0B0B0"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8.3335 7.49967C8.3335 6.5792 9.07966 5.83301 10.0002 5.83301C10.9207 5.83301 11.6668 6.5792 11.6668 7.49967C11.6668 7.83147 11.5699 8.14062 11.4027 8.40034C10.9047 9.17442 10.0002 9.91251 10.0002 10.833V11.2497"
                        stroke="#B0B0B0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.99316 14.167H10.0007"
                        stroke="#B0B0B0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_rating">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>

              <div className="border-b border-[#181B22] p-4 max-[360px]:p-3">
                <p className="text-xs font-bold text-[#B0B0B0]">
                  Trader 180***2022 deposited 24.00 USDT
                  <span className="float-right">38 minutes ago</span>
                </p>
              </div>

              <div className="flex flex-col gap-0">
                {SUBSCRIBER_RATINGS.map((subscriber, index) => (
                  <div
                    key={subscriber.id}
                    className={`flex items-center gap-6 p-4 max-[360px]:gap-3 max-[360px]:p-3 ${
                      index !== SUBSCRIBER_RATINGS.length - 1 ? "border-b border-[#181B22]" : ""
                    }`}
                  >
                    <span className="text-[15px] font-bold text-[#B0B0B0] max-[360px]:text-sm">
                      {subscriber.rank}
                    </span>
                    <div className="flex flex-1 items-center justify-between gap-4 max-[360px]:flex-col max-[360px]:items-start max-[360px]:gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={subscriber.avatar}
                          alt={subscriber.name}
                          className="h-11 w-11 rounded-full object-cover max-[360px]:h-10 max-[360px]:w-10"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                            {subscriber.name}
                          </span>
                          <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                            Subscribed for {subscriber.subscribedDays} days
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 max-[360px]:w-full max-[360px]:items-start">
                        <div className="rounded bg-[#1C3430] px-2 py-0.5">
                          <span className="text-xs font-bold uppercase text-[#2EBD85]">
                            {subscriber.roi}
                          </span>
                        </div>
                        <span className="text-xs font-bold uppercase text-[#B0B0B0]">
                          {subscriber.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-1 p-6 max-[360px]:p-4">
                <button
                  type="button"
                  className="flex h-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:h-6"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.6585 15L15.8335 13.825L12.0168 10L15.8335 6.175L14.6585 5L9.6585 10L14.6585 15Z"
                      fill="#B0B0B0"
                    />
                    <path
                      d="M9.1668 15L10.3418 13.825L6.52513 10L10.3418 6.175L9.1668 5L4.1668 10L9.1668 15Z"
                      fill="#B0B0B0"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex h-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:h-6"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.575 15L13.75 13.825L9.93333 10L13.75 6.175L12.575 5L7.575 10L12.575 15Z"
                      fill="#B0B0B0"
                    />
                  </svg>
                </button>
                <div className="flex h-[26px] items-center justify-center rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-3 max-[360px]:h-6">
                  <span className="text-center text-[15px] font-bold text-white max-[360px]:text-sm">
                    1
                  </span>
                </div>
                <button
                  type="button"
                  className="flex h-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:h-6"
                >
                  <span className="text-center text-[15px] font-bold text-[#B0B0B0] max-[360px]:text-sm">
                    2
                  </span>
                </button>
                <button
                  type="button"
                  className="flex h-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:h-6"
                >
                  <span className="text-center text-[15px] font-bold text-[#B0B0B0] max-[360px]:text-sm">
                    3
                  </span>
                </button>
                <button
                  type="button"
                  className="flex h-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:h-6"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.675 5L7.5 6.175L11.3167 10L7.5 13.825L8.675 15L13.675 10L8.675 5Z"
                      fill="#B0B0B0"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex h-[26px] items-center justify-center rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-3 backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:h-6"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.3415 5L4.1665 6.175L7.98317 10L4.1665 13.825L5.3415 15L10.3415 10L5.3415 5Z"
                      fill="#B0B0B0"
                    />
                    <path
                      d="M10.8332 5L9.6582 6.175L13.4749 10L9.6582 13.825L10.8332 15L15.8332 10L10.8332 5Z"
                      fill="#B0B0B0"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-4 max-[360px]:p-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white max-[360px]:text-xl">20 comments</h2>
                <div className="flex items-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px] max-[360px]:p-0.5">
                  <button
                    type="button"
                    aria-label="Sort comments"
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_clock)">
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
                        <clipPath id="clip0_clock">
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          {/* Right Sidebar */}
          <div className="flex w-full flex-col gap-6 lg:max-w-[339px] lg:flex-1 lg:min-w-0 max-[360px]:gap-4">
            {/* Product Card */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <img
                src={heroImage}
                alt={robot.name}
                className="h-[332px] w-full border-b border-[#181B22] object-cover max-[360px]:h-[200px]"
              />

              <div className="flex items-start gap-3 p-4 max-[360px]:gap-2 max-[360px]:p-3">
                <div className="flex flex-col gap-2 max-[360px]:gap-1.5">
                  <h3 className="text-[19px] font-bold text-white max-[360px]:text-base">
                    Product Name
                  </h3>
                  <div className="flex flex-wrap items-center gap-1">
                    <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                      <Users className="h-4 w-4 text-[#B0B0B0] max-[360px]:h-3.5 max-[360px]:w-3.5" />
                      <span className="text-xs font-bold text-white">{robot.users}</span>
                    </div>
                    <div className="rounded bg-[rgba(255,168,0,0.16)] px-1 py-0.5">
                      <span className="text-xs font-extrabold uppercase text-[#FFA800]">
                        {robot.accuracyLabel}
                      </span>
                    </div>
                    <div className="rounded bg-[rgba(46,189,133,0.16)] px-1 py-0.5">
                      <span className="text-xs font-extrabold uppercase text-[#2EBD85]">
                        {robot.profitSharing}
                      </span>
                    </div>
                  </div>
                </div>
                <FavoriteStarButton
                  pressed={isRobotFavorite}
                  onToggle={handleToggleFavoriteRobot}
                  className="focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
                />
              </div>

              <div className="h-px bg-[#181B22]" />

              {robot.exchanges && robot.exchanges.length > 0 && (
                <div className="flex items-center gap-2 p-4 max-[360px]:gap-1.5 max-[360px]:p-3">
                  {robot.exchanges.slice(0, 3).map((exchange, idx) => (
                    <img
                      key={exchange.id}
                      src={exchange.icon}
                      alt={exchange.name}
                      className="h-8 w-8 rounded-full object-cover max-[360px]:h-7 max-[360px]:w-7"
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2 p-4 max-[360px]:gap-1.5 max-[360px]:p-3">
                {robot.pair && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">PAIR:</span>
                    <div className="rounded bg-[#2E2744] px-1 py-0.5">
                      <span className="text-white">{robot.pair}</span>
                    </div>
                  </div>
                )}

                {robot.maxDrawdown && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">MAX DRAWDOWN:</span>
                    <div className="rounded bg-[#1C3430] px-1 py-0.5">
                      <span className="text-[#2EBD85]">{robot.maxDrawdown}</span>
                    </div>
                  </div>
                )}

                {robot.marketType && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">MARKET TYPE:</span>
                    <div className="rounded bg-[#2E2744] px-1 py-0.5">
                      <span className="text-white">{robot.marketType}</span>
                    </div>
                  </div>
                )}

                {robot.type && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">TYPE:</span>
                    {robot.type.split(", ").map((type, idx) => (
                      <div key={idx} className="rounded bg-[#2E2744] px-1 py-0.5">
                        <span className="text-white">{type}</span>
                      </div>
                    ))}
                  </div>
                )}

                {robot.strategy && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">STRATEGY:</span>
                    <div className="rounded bg-[#2E2744] px-1 py-0.5">
                      <span className="text-white">{robot.strategy}</span>
                    </div>
                  </div>
                )}

                {robot.settings && (
                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase">
                    <span className="text-[#B0B0B0]">SETTINGS:</span>
                    <div className="rounded bg-[rgba(106,165,255,0.16)] px-1 py-0.5">
                      <span className="text-[#6AA5FF]">{robot.settings}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-[#181B22]" />

              <svg
                className="h-auto w-full"
                viewBox="0 0 307 53"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M3.04104 34.8772L0.75 36.7462V53.7639H307.75V3.20197L300.304 5.85797L295.149 10.383L289.422 10.0879L286.558 11.0716L279.685 1.92316L277.394 3.20197L273.384 2.61175L264.793 3.69382L260.211 8.41559L256.774 7.23515C255.438 8.31722 252.765 10.4617 252.765 10.383C252.765 10.3043 250.474 8.84186 249.328 8.12048L245.892 10.4814L241.31 8.02211L235.582 7.33352L232.718 0.939453L224.127 4.0873H221.263L218.972 4.77589L217.254 3.59545L212.099 9.30092L210.381 7.727L204.653 7.33352L201.216 9.00581L200.071 5.46448L197.207 7.33352L193.198 4.77589L189.761 6.15308L188.043 5.46448L186.325 5.85797L182.888 2.41501L180.024 9.79278L175.442 6.64493L170.86 5.85797L166.278 10.9732L158.832 13.9243L153.104 13.3341L152.532 15.7934L149.668 13.826L145.086 16.482L141.649 22.4825L137.64 22.7776L133.631 23.1711L131.34 27.0076L128.476 27.4994L121.603 27.0076L113.011 24.8434L110.147 27.7945L102.701 28.8766L99.8377 28.4831L98.6921 29.4668L91.2462 27.7945L90.1007 28.5815L82.082 28.0896L75.2089 30.1554L74.6362 31.631L71.1996 31.2375L67.1902 32.713L64.3265 31.631H57.4534L56.3078 32.1228H54.0168L50.0075 33.3033L43.1343 32.3196L39.6977 30.2538L35.6884 30.3522L31.6791 32.713L28.8153 31.9261L27.097 33.0082L24.2332 32.3196L14.4963 33.0082L9.91414 35.5658L3.04104 34.8772Z"
                  fill="url(#paint0_linear_chart)"
                />
                <path
                  d="M0.75 36.1557L3.04107 34.3175L9.91418 34.9948L14.4963 32.4793L24.2332 31.8021L27.097 32.4793L28.8153 31.4151L31.6791 32.1891L35.6884 29.8671L39.6978 29.7704L43.1343 31.8021L50.0075 32.7695L54.0168 31.6086H56.3078L57.4534 31.1248H64.3265L67.1903 32.1891L71.1996 30.7378L74.6362 31.1248L75.209 29.6736L82.0821 27.6419L90.1008 28.1256L91.2462 27.3517L98.6921 28.9964L99.8377 28.0289L102.702 28.4159L110.147 27.3517L113.011 24.4492L121.603 26.5777L128.476 27.0614L131.34 26.5777L133.631 22.8045L137.64 22.4175L141.649 22.1273L145.086 16.2256L149.668 13.6134L152.532 15.5484L153.104 13.1297L158.832 13.7102L166.278 10.8077L170.86 5.77685L175.442 6.55084L180.024 9.64677L182.888 2.39067L186.325 5.77685L188.043 5.38986L189.761 6.0671L193.198 4.71262L197.207 7.22807L200.071 5.38986L201.216 8.87279L204.653 7.22807L210.381 7.61506L212.099 9.16303L217.254 3.55165L218.972 4.71262L221.263 4.03539H224.127L232.718 0.939453L235.582 7.22807L241.31 7.90531L245.892 10.324L249.328 8.00206C250.474 8.71154 252.765 10.1499 252.765 10.2273C252.765 10.3047 255.438 8.19555 256.774 7.13132L260.211 8.2923L264.793 3.6484L273.384 2.58417L277.394 3.16466L279.685 1.90693L286.558 10.9045L289.422 9.93702L295.149 10.2273L300.304 5.77685L307.75 3.16466"
                  stroke="#A06AFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_chart"
                    x1="-130.699"
                    y1="0.939453"
                    x2="-130.699"
                    y2="53.7639"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#A06AFF" stopOpacity="0.32" />
                    <stop offset="1" stopColor="#181A20" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex flex-col justify-center gap-2 px-4 py-4 max-[360px]:px-3 max-[360px]:py-3">
                <p className="text-2xl font-bold text-white max-[360px]:text-xl">
                  {robot.price ?? "$10 / month"}
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 max-[360px]:gap-3 max-[360px]:p-3">
                {PRODUCT_ACTIONS.map(({ key, label, icon: Icon }) => {
                  const isActive = activeAction === key;
                  const baseClasses = isActive
                    ? "bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white"
                    : "border border-[#181B22] bg-[#0C1014]/60 text-white backdrop-blur-[50px] hover:border-[#1F2230]";

                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveAction(key)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2 text-[15px] font-bold transition-colors ${baseClasses} max-[360px]:gap-1.5 max-[360px]:px-4 max-[360px]:py-2 max-[360px]:text-sm`}
                    >
                      <Icon className="h-4 w-4 max-[360px]:h-3.5 max-[360px]:w-3.5" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Author Card */}
            {author && (
              <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px] max-[360px]:gap-3">
                <div className="flex items-center gap-2 p-4 max-[360px]:gap-2 max-[360px]:p-3">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-20 w-20 flex-shrink-0 rounded-full object-cover max-[360px]:h-16 max-[360px]:w-16"
                  />
                  <div className="flex flex-1 flex-col gap-2 max-[360px]:gap-1.5">
                    <h3 className="text-[15px] font-bold text-white max-[360px]:text-sm">{author.name}</h3>
                    <button
                      type="button"
                      className="flex h-[26px] w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] text-xs font-bold text-white transition-opacity hover:opacity-90 max-[360px]:w-16 max-[360px]:text-[11px]"
                    >
                      Follow
                    </button>
                  </div>
                </div>

                {author.communityLink && (
                  <div className="px-4 pb-4 max-[360px]:px-3 max-[360px]:pb-3">
                    <p className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                      Join our 10k+ community:{" "}
                      <a
                        href={author.communityLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#A06AFF] underline"
                      >
                        example.com
                      </a>
                    </p>
                  </div>
                )}

                {author.bio && (
                  <div className="px-4 max-[360px]:px-3">
                    <p className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                      {author.bio}
                    </p>
                  </div>
                )}

                {author.socials && author.socials.length > 0 && (
                  <div className="flex items-center gap-3 px-4 pt-4 max-[360px]:gap-2 max-[360px]:px-3 max-[360px]:pt-3">
                    <span className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                      Also on:
                    </span>
                    <div className="flex items-center gap-3">
                      {author.socials.includes("twitter") && (
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M12.2174 1.26953H14.4663L9.55298 6.88519L15.3332 14.5268H10.8073L7.26253 9.89222L3.20647 14.5268H0.956125L6.21146 8.52026L0.666504 1.26953H5.30724L8.51143 5.50575L12.2174 1.26953ZM11.428 13.1807H12.6742L4.6301 2.54495H3.29281L11.428 13.1807Z" />
                        </svg>
                      )}
                      {author.socials.includes("youtube") && (
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M15.8406 4.8002C15.8406 4.8002 15.6844 3.69707 15.2031 3.2127C14.5938 2.5752 13.9125 2.57207 13.6 2.53457C11.3625 2.37207 8.00313 2.37207 8.00313 2.37207H7.99687C7.99687 2.37207 4.6375 2.37207 2.4 2.53457C2.0875 2.57207 1.40625 2.5752 0.796875 3.2127C0.315625 3.69707 0.1625 4.8002 0.1625 4.8002C0.1625 4.8002 0 6.09707 0 7.39082V8.60332C0 9.89707 0.159375 11.1939 0.159375 11.1939C0.159375 11.1939 0.315625 12.2971 0.79375 12.7814C1.40313 13.4189 2.20313 13.3971 2.55938 13.4658C3.84063 13.5877 8 13.6252 8 13.6252C8 13.6252 11.3625 13.6189 13.6 13.4596C13.9125 13.4221 14.5938 13.4189 15.2031 12.7814C15.6844 12.2971 15.8406 11.1939 15.8406 11.1939C15.8406 11.1939 16 9.90019 16 8.60332V7.39082C16 6.09707 15.8406 4.8002 15.8406 4.8002ZM6.34688 10.0752V5.57832L10.6687 7.83457L6.34688 10.0752Z" />
                        </svg>
                      )}
                      {author.socials.includes("instagram") && (
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 1.44062C10.1375 1.44062 10.3906 1.45 11.2313 1.4875C12.0125 1.52187 12.4344 1.65313 12.7156 1.7625C13.0875 1.90625 13.3563 2.08125 13.6344 2.35938C13.9156 2.64063 14.0875 2.90625 14.2313 3.27813C14.3406 3.55938 14.4719 3.98437 14.5063 4.7625C14.5438 5.60625 14.5531 5.85938 14.5531 7.99375C14.5531 10.1313 14.5438 10.3844 14.5063 11.225C14.4719 12.0063 14.3406 12.4281 14.2313 12.7094C14.0875 13.0813 13.9125 13.35 13.6344 13.6281C13.3531 13.9094 13.0875 14.0813 12.7156 14.225C12.4344 14.3344 12.0094 14.4656 11.2313 14.5C10.3875 14.5375 10.1344 14.5469 8 14.5469C5.8625 14.5469 5.60938 14.5375 4.76875 14.5C3.9875 14.4656 3.56563 14.3344 3.28438 14.225C2.9125 14.0813 2.64375 13.9063 2.36563 13.6281C2.08438 13.3469 1.9125 13.0813 1.76875 12.7094C1.65938 12.4281 1.52813 12.0031 1.49375 11.225C1.45625 10.3813 1.44688 10.1281 1.44688 7.99375C1.44688 5.85625 1.45625 5.60312 1.49375 4.7625C1.52813 3.98125 1.65938 3.55938 1.76875 3.27813C1.9125 2.90625 2.0875 2.6375 2.36563 2.35938C2.64688 2.07813 2.9125 1.90625 3.28438 1.7625C3.56563 1.65313 3.99063 1.52187 4.76875 1.4875C5.60938 1.45 5.8625 1.44062 8 1.44062ZM8 0C5.82813 0 5.55625 0.009375 4.70313 0.046875C3.85313 0.084375 3.26875 0.221875 2.7625 0.41875C2.23438 0.625 1.7875 0.896875 1.34375 1.34375C0.896875 1.7875 0.625 2.23438 0.41875 2.75938C0.221875 3.26875 0.084375 3.85 0.046875 4.7C0.009375 5.55625 0 5.82813 0 8C0 10.1719 0.009375 10.4438 0.046875 11.2969C0.084375 12.1469 0.221875 12.7313 0.41875 13.2375C0.625 13.7656 0.896875 14.2125 1.34375 14.6563C1.7875 15.1 2.23438 15.375 2.75938 15.5781C3.26875 15.775 3.85 15.9125 4.7 15.95C5.55313 15.9875 5.825 15.9969 7.99688 15.9969C10.1688 15.9969 10.4406 15.9875 11.2938 15.95C12.1438 15.9125 12.7281 15.775 13.2344 15.5781C13.7594 15.375 14.2063 15.1 14.65 14.6563C15.0938 14.2125 15.3688 13.7656 15.5719 13.2406C15.7688 12.7313 15.9063 12.15 15.9438 11.3C15.9813 10.4469 15.9906 10.175 15.9906 8.00313C15.9906 5.83125 15.9813 5.55938 15.9438 4.70625C15.9063 3.85625 15.7688 3.27188 15.5719 2.76563C15.375 2.23438 15.1031 1.7875 14.6563 1.34375C14.2125 0.9 13.7656 0.625 13.2406 0.421875C12.7313 0.225 12.15 0.0875 11.3 0.05C10.4438 0.009375 10.1719 0 8 0Z" />
                          <path d="M8 3.89062C5.73125 3.89062 3.89062 5.73125 3.89062 8C3.89062 10.2688 5.73125 12.1094 8 12.1094C10.2688 12.1094 12.1094 10.2688 12.1094 8C12.1094 5.73125 10.2688 3.89062 8 3.89062ZM8 10.6656C6.52813 10.6656 5.33437 9.47188 5.33437 8C5.33437 6.52813 6.52813 5.33437 8 5.33437C9.47188 5.33437 10.6656 6.52813 10.6656 8C10.6656 9.47188 9.47188 10.6656 8 10.6656Z" />
                          <path d="M13.2312 3.72793C13.2312 4.25918 12.8 4.68731 12.2719 4.68731C11.7406 4.68731 11.3125 4.25606 11.3125 3.72793C11.3125 3.19668 11.7438 2.76855 12.2719 2.76855C12.8 2.76855 13.2312 3.19981 13.2312 3.72793Z" />
                        </svg>
                      )}
                      {author.socials.includes("web") && (
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M8.00016 14.6663C4.31826 14.6663 1.3335 11.6815 1.3335 7.99967C1.3335 6.13798 2.0966 4.45452 3.32708 3.24502M8.00016 14.6663C7.35816 14.1906 7.46063 13.6367 7.7827 13.0828C8.2779 12.2313 8.2779 12.2313 8.2779 11.0959C8.2779 9.96061 8.95256 9.42827 11.3335 9.90441C12.4033 10.1184 13.1829 8.64027 14.5717 9.12834M8.00016 14.6663C11.2974 14.6663 14.0355 12.2727 14.5717 9.12834M3.32708 3.24502C3.89327 3.30477 4.21028 3.6081 4.7368 4.16445C5.73643 5.22069 6.73603 5.30882 7.4025 4.95674C8.4021 4.42863 7.5621 3.57321 8.7353 3.10833C9.45456 2.82335 9.59163 2.077 9.25123 1.4502M3.32708 3.24502C4.53013 2.06248 6.17996 1.33301 8.00016 1.33301C8.42776 1.33301 8.84596 1.37327 9.25123 1.4502M14.5717 9.12834C14.6342 8.76147 14.6668 8.38441 14.6668 7.99967C14.6668 4.74539 12.3351 2.03571 9.25123 1.4502"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-4 max-[360px]:gap-1.5 max-[360px]:p-3">
                    {tags.map((tag, idx) => (
                      <div
                        key={`${robot.id}-tag-${idx}`}
                        className="rounded bg-[#2E2744] px-2 py-0.5"
                      >
                        <span className="text-xs font-bold uppercase text-white">
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="flex flex-col gap-4 border-b border-[#181B22] p-4 max-[360px]:gap-3 max-[360px]:p-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Reviews</h2>

                <div className="flex items-center gap-4 max-[360px]:gap-3">
                  <span className="text-[31px] font-bold leading-none text-[#A06AFF] max-[360px]:text-2xl">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-0.5">
                      {renderStars(averageRating)}
                    </div>
                    <p className="text-xs font-bold text-[#B0B0B0]">
                      Based on {totalReviews} reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, index) => (
                  <div key={review.id} className="flex flex-col">
                    {index > 0 && (
                      <div className="px-4 py-2 max-[360px]:px-3">
                        <div className="h-px bg-[#181B22]" />
                      </div>
                    )}

                    <div className="flex justify-between gap-3 px-4 pb-2 pt-4 max-[360px]:px-3 max-[360px]:pt-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="h-11 w-11 rounded-full object-cover max-[360px]:h-10 max-[360px]:w-10"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-white max-[360px]:text-sm">
                            {review.author}
                          </span>
                          <span className="text-xs font-bold text-[#B0B0B0]">
                            {review.postedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 px-4 pb-4 max-[360px]:gap-1.5 max-[360px]:px-3 max-[360px]:pb-3">
                      <h4 className="text-[15px] font-bold text-white max-[360px]:text-sm">
                        {review.title}
                      </h4>
                      <p className="text-[15px] font-normal text-[#B0B0B0] max-[360px]:text-sm">
                        {review.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length > 0 && (
                <div className="p-4 max-[360px]:p-3">
                  <button
                    type="button"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="flex h-[26px] w-full items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-4 text-center text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230] max-[360px]:text-sm"
                  >
                    {showAllReviews ? "Show Less Reviews" : "Show More Reviews"}
                  </button>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4 max-[360px]:p-3">
                <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">Disclaimer</h2>
              </div>
              <div className="p-4 max-[360px]:p-3">
                <p className="text-[15px] font-medium text-[#B0B0B0] max-[360px]:text-sm">
                  The information and publications are not meant to be, and do not
                  constitute, financial, investment, trading, or other types of advice
                  or recommendations supplied or endorsed by TyrianTrade. Read more in
                  the{" "}
                  <a
                    href="/terms"
                    className="text-[#A06AFF] underline"
                  >
                    Terms of Use
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#A06AFF" />
            <stop offset="50%" stopColor="#2E2744" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default TradingRobotDetailLanding;
