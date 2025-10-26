import { Check, Globe, MapPin, MessageCircle, ShoppingCart, Star } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import type { InvestmentConsultant } from "@/data/marketplaceInvestmentConsultants";
import { useFavorite } from "@/hooks/useFavorite";
import { extractOriginalProductId } from "@/lib/utils";

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

const FAVORITE_STORAGE_KEY = "consultant-detail-favorites";

const InvestmentConsultantDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentNode[]>(() => INITIAL_COMMENTS);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

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

    if (comment.hidden) {
      return (
        <div
          key={comment.id}
          className="relative flex items-center justify-between rounded-2xl border border-[#181B22] bg-[#0C1014]/50 px-4 py-3"
          style={{ marginLeft: indent }}
        >
          {depth > 0 && (
            <div
              className="absolute top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]"
              style={{ left: -indentStep }}
            />
          )}
          <span className="text-sm font-bold text-[#B0B0B0]">
            {hasReplies ? "Thread hidden" : "Comment hidden"}
          </span>
          <button
            type="button"
            onClick={() => handleToggleHidden(comment.id)}
            className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF]"
          >
            {hasReplies ? "Show thread" : "Show comment"}
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
        {depth > 0 && (
          <div
            className="absolute top-0 h-8 w-5 rounded-bl-lg border-b border-l border-[#181B22]"
            style={{ left: -indentStep }}
          />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src={COMMENT_AVATAR}
              alt={`${comment.author} avatar`}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-bold text-white">{comment.author}</span>
              <span className="text-xs font-bold" style={{ color: timeColor }}>
                {comment.time}
              </span>
            </div>
          </div>
          <p className="text-[15px] font-normal text-white">{comment.text}</p>
        </div>

        <button
          type="button"
          onClick={() => handleToggleLike(comment.id)}
          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${likeButtonClasses}`}
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

        <div className="flex flex-wrap items-center gap-2">
          {comment.canHide && (
            <button
              type="button"
              className="rounded-full px-4 py-2 text-[15px] font-bold text-[#A06AFF]"
              onClick={() => handleToggleHidden(comment.id)}
            >
              Hide
            </button>
          )}
          <button type="button" className="rounded-full px-4 py-2 text-[15px] font-bold text-white">
            Reply
          </button>
          <button type="button" className="rounded-full p-1 text-[#B0B0B0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" />
              <circle cx="5" cy="12" r="1" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" />
              <circle cx="19" cy="12" r="1" fill="#B0B0B0" stroke="#B0B0B0" strokeWidth="2" />
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

  const locationState = location.state as { consultant?: InvestmentConsultant; isFavorite?: boolean } | null;


  const consultant = useMemo(() => {
    const fallback = {
      id: "default-consultant",
      name: "Sarah Lee",
      credentials: "CPFA, RFC",
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/6b81315108c0d5a4dad70aa8657893239c18b8db?width=624",
      company: "Diversified Investment Strategies, LLC.",
      location: "Chandler, AZ",
      nationwide: true,
      rating: 5.0,
      clients: "15,054",
      verified: true,
    };

    const provided = locationState?.consultant;
    if (!provided) {
      return fallback;
    }

    return {
      ...fallback,
      ...provided,
    };
  }, [locationState]);

  const { isFavorite: isConsultantFavorite, toggle: toggleConsultantFavorite } = useFavorite("investment-consultant", consultant.id);

  const handleToggleFavoriteConsultant = useCallback(() => {
    toggleConsultantFavorite();
  }, [toggleConsultantFavorite]);

  const handleNavigateToCategory = useCallback(() => {
    navigate("/marketplace/investment-consultants", {
      state: { scrollToTop: true },
    });
  }, [navigate]);

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-[1075px] px-4">
        <div className="flex items-center gap-2 text-[15px]">
          <button
            type="button"
            onClick={handleNavigateToCategory}
            className="text-left font-normal text-[#B0B0B0] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
          >
            Investment consultants
          </button>
          <span className="font-bold text-[#808283]">/</span>
          <span className="font-bold text-white">{consultant.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mx-auto w-full max-w-[1075px] px-4">
        <div className="relative overflow-hidden rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
          <div className="absolute inset-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/2ade7292b85c05a2ad870071c1db3347a9cc71d0?width=1492"
              alt=""
              className="h-full w-full object-cover opacity-60 mix-blend-lighten"
            />
          </div>

          <div className="relative flex flex-col gap-6 p-4 lg:flex-row lg:items-center">
            <img
              src={consultant.avatar}
              alt={consultant.name}
              className="h-[312px] w-[312px] flex-shrink-0 rounded-2xl object-cover shadow-[0_6.711px_11.409px_-1.342px_rgba(0,0,0,0.28)] lg:self-center"
            />

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  {consultant.company}
                </div>
                <h1 className="text-[31px] font-bold text-white">{consultant.name}, {consultant.credentials}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-[15px] font-bold">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{consultant.location}</span>
                  </div>
                  <div className="h-6 w-px bg-[#181B22]" />
                  <div className="flex items-center gap-2 text-white">
                    <Globe className="h-4 w-4" />
                    <span>Serving Clients Nationwide</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[15px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-[#FFA800] text-[#FFA800]" />
                      ))}
                    </div>
                    <span className="font-bold text-[#2EBD85]">5.0</span>
                  </div>
                  <div className="h-6 w-px bg-[#181B22]" />
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" stroke="#B0B0B0" strokeWidth="1.5">
                      <path d="M12.4055 13.333H12.7323C13.4989 13.333 14.1086 12.9837 14.6561 12.4954C16.0468 11.2547 12.7775 9.99967 11.6615 9.99967M10.3281 3.37885C10.4795 3.34883 10.6367 3.33301 10.798 3.33301C12.0113 3.33301 12.9948 4.22844 12.9948 5.33301C12.9948 6.43757 12.0113 7.33301 10.798 7.33301C10.6367 7.33301 10.4795 7.31721 10.3281 7.28714"/>
                      <path d="M2.98949 10.7408C2.20351 11.162 0.142712 12.0221 1.39787 13.0983C2.01101 13.624 2.69389 14 3.55243 14H8.45149C9.31002 14 9.99289 13.624 10.606 13.0983C11.8612 12.0221 9.80042 11.162 9.01442 10.7408C7.17129 9.75307 4.83261 9.75307 2.98949 10.7408Z"/>
                      <path d="M8.66732 4.99967C8.66732 6.47243 7.47338 7.66634 6.00065 7.66634C4.52789 7.66634 3.33398 6.47243 3.33398 4.99967C3.33398 3.52691 4.52789 2.33301 6.00065 2.33301C7.47338 2.33301 8.66732 3.52691 8.66732 4.99967Z"/>
                    </svg>
                    <span className="font-bold text-white">{consultant.clients}</span>
                  </div>
                  <div className="h-6 w-px bg-[#181B22]" />
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-white">
                    <span>Verified</span>
                    <svg width="16" height="16" fill="none">
                      <path d="M7.67653 1.39519C7.88466 1.31228 8.11599 1.31228 8.32413 1.39519C8.99506 1.66238 9.12613 2.6913 9.91779 2.74858C10.4753 2.78891 11.0223 2.32419 11.5817 2.4635C11.8073 2.51969 12.0022 2.66353 12.1243 2.86405C12.4985 3.4785 12.0156 4.38162 12.6259 4.89146C13.0499 5.24552 13.7504 5.1997 14.119 5.63374C14.2742 5.81657 14.3505 6.05503 14.3305 6.29547C14.2715 7.01074 13.3596 7.45807 13.56 8.22894C13.6987 8.76254 14.2839 9.13767 14.3305 9.70387C14.3505 9.94434 14.2742 10.1828 14.119 10.3656C13.6558 10.9109 12.6542 10.7313 12.3654 11.4705C12.1626 11.9893 12.423 12.6448 12.1243 13.1353C12.0022 13.3358 11.8073 13.4797 11.5817 13.5359C10.8871 13.7088 10.1821 12.9627 9.51373 13.3835C9.03653 13.6839 8.86553 14.3887 8.32413 14.6041C8.11599 14.6871 7.88466 14.6871 7.67653 14.6041C7.13513 14.3887 6.96413 13.6839 6.48692 13.3835C5.8268 12.9679 5.10175 13.7059 4.41893 13.5359C4.19331 13.4797 3.99846 13.3358 3.87636 13.1353C3.50223 12.5209 3.98502 11.6177 3.37479 11.1079C2.95087 10.7538 2.25029 10.7997 1.88169 10.3656C1.72647 10.1828 1.65022 9.94434 1.67009 9.70387C1.71689 9.13767 2.30193 8.76254 2.44066 8.22894C2.63905 7.46614 1.72835 7.00027 1.67009 6.29547C1.65022 6.05503 1.72647 5.81657 1.88169 5.63374C2.34483 5.08823 3.34632 5.26803 3.63525 4.52889C3.83807 4.01007 3.57771 3.35452 3.87636 2.86405C3.99846 2.66353 4.19331 2.51969 4.41893 2.4635C4.97836 2.32419 5.52537 2.78892 6.08285 2.74858C6.87453 2.69131 7.00559 1.66238 7.67653 1.39519Z" fill="#A06AFF"/>
                      <path d="M6 8.88919C6 8.88919 6.58333 8.88919 7.16667 10.0003C7.16667 10.0003 9.0196 7.22253 10.6667 6.66699" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <p className="text-[15px] font-bold text-white">
                  Dedicated to providing experienced guidance on all aspects of wealth management
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Investment management", "Owning a business", "Retirement planning", "Financial life planning"].map((badge) => (
                    <div key={badge} className="flex items-center gap-1 rounded bg-[rgba(106,165,255,0.16)] px-1">
                      <span className="text-xs font-bold uppercase text-[#6AA5FF]">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  aria-pressed={isChatActive}
                  onClick={() => setIsChatActive((prev) => !prev)}
                  className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 backdrop-blur-[50px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014] ${
                    isChatActive
                      ? "border-transparent bg-gradient-to-r from-[#A06AFF] to-[#482090]"
                      : "border border-[#181B22] bg-[#0C1014]/50 hover:border-[#1F2230]"
                  }`}
                >
                  <MessageCircle className="h-4 w-4 text-white" />
                  <span className="text-[15px] font-bold text-white">Chat</span>
                </button>
                <p className="text-center text-[15px] font-normal text-[#B0B0B0]">
                  free 20-minute introductory consultation
                </p>
              </div>
            </div>

            <FavoriteStarButton
              pressed={isConsultantFavorite}
              onToggle={handleToggleFavoriteConsultant}
              className="absolute right-5 top-5"
            />
          </div>
        </div>
      </div>

      {/* Professional Designations */}
      <div className="mx-auto w-full max-w-[1075px] px-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
          <h2 className="text-[19px] font-bold text-[#A06AFF]">Professional designations</h2>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1">
              <span className="text-xs font-bold uppercase text-white">Certified plan fiduciary advisor (CPFA)</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1">
              <span className="text-xs font-bold uppercase text-white">Registered Financial Consultant (RFC)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-[1075px] px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:flex-[2]">
            {/* About Me */}
            <div className="rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h2 className="mb-4 text-[19px] font-bold text-[#A06AFF]">About Me:</h2>
              <p className="text-[15px] font-normal text-white">
                This algorithm is designed to optimize your trading decisions by analyzing market data in real time. It uses a combination of historical patterns and predictive models to identify high-probability entry and exit points. With a focus on risk management, the algorithm adjusts its strategy based on changing market conditions. Whether you're trading manually or using automated systems, this tool provides clear, actionable signals.
              </p>

              <h2 className="mb-4 mt-6 text-[19px] font-bold text-[#A06AFF]">Results and Cases:</h2>
              <div className="flex flex-col gap-2">
                {[
                  "Designed a strategy for a retiree, growing their retirement savings by 15% over three years through optimized investments.",
                  "Developed a financial plan for an Arizona family, reducing their tax burden by 20% and incresing their portfolio by 10% in one year",
                  "Supported a tech enterpreneur, achieving an average annual portfolio of 12%.",
                ].map((result, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[#A06AFF]" />
                    <span className="text-[15px] font-normal text-white">{result}</span>
                  </div>
                ))}
              </div>

              <h2 className="mb-4 mt-6 text-[19px] font-bold text-[#A06AFF]">Services:</h2>
              <div className="flex flex-col gap-2">
                {["Financial Planning", "Investment Management", "Consulting (debt, insurance, tax)"].map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                    <span className="text-[15px] font-normal text-white">{service}</span>
                  </div>
                ))}
              </div>

              <h2 className="mb-4 mt-6 text-[19px] font-bold text-[#A06AFF]">Education and Certifications:</h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                  <span className="text-[15px] font-normal text-white">Bachelor's on France, University of Arizona, 2011</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                  <span className="text-[15px] font-normal text-white">CFP<span className="font-bold">® Certification, 2011</span></span>
                </div>
              </div>

              <h2 className="mb-4 mt-6 text-[19px] font-bold text-[#A06AFF]">Personal:</h2>
              <div className="flex flex-col gap-2">
                {[
                  "Hobbies - hiking, running, golf, volunteering.",
                  "Family - married, active in local communities.",
                  "Values - honesty, transparency, client-focused approach.",
                ].map((personal, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                    <span className="text-[15px] font-normal text-white">{personal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price List */}
            <div className="rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h2 className="mb-4 text-[19px] font-bold text-[#A06AFF]">Price List</h2>
              <div className="flex flex-col gap-6">
                {[
                  { name: "Personal Consultation", price: "$100/hour" },
                  { name: "Portfolio Review", price: "$150" },
                  { name: "Investment Strategy Planning", price: "$200" },
                  { name: "Monthly Advisory Support", price: "$250/month" },
                  { name: "Financial Planning", price: "$180" },
                  { name: "Custom Investment Plan", price: "$220" },
                ].map((service) => (
                  <div key={service.name} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#A06AFF]" />
                        <span className="text-[15px] font-normal text-white">{service.name}</span>
                      </div>
                      <span className="text-[15px] font-bold text-white">{service.price}</span>
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C1014]/50 px-4 py-2 backdrop-blur-[50px]">
                      <ShoppingCart className="h-4 w-4 text-white" />
                      <span className="text-[15px] font-bold text-white">Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">20 comments</h2>
                <div className="flex items-center gap-1 rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px]">
                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full">
                    <svg width="16" height="16" fill="none" stroke="#B0B0B0" strokeWidth="1.5">
                      <path d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 5.33301V7.99967L9.33333 9.33301" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090]">
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M9.23732 14.6663C17.3855 12.6663 12.8225 4.66634 7.28172 1.33301C6.63012 3.66634 5.65217 4.33301 3.69657 6.66634C1.10739 9.75561 2.39292 13.333 5.97805 14.6663C5.43485 13.9997 4.03297 12.6002 4.99992 10.6663C5.33325 9.99967 5.99992 9.33301 5.66659 7.99967C6.31844 8.33301 7.66659 8.66634 7.99992 10.333C8.54312 9.66634 9.10685 8.26634 8.58545 6.66634C12.6666 9.66634 10.9999 12.6663 9.23732 14.6663Z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-6 flex flex-col items-end gap-4">
                <textarea
                  className="h-[88px] w-full resize-none rounded-2xl border border-[#181B22] bg-[#0C1014]/30 px-4 py-3 text-[15px] text-white placeholder-[#B0B0B0]"
                  placeholder="Comment..."
                />
                <button className="rounded-full bg-gradient-to-l from-[#482090] to-[#A06AFF] px-6 py-2 text-[15px] font-bold text-white">
                  Send
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {comments.map((comment) => renderComment(comment))}
                <div className="flex justify-center">
                  <button className="rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2 text-[15px] font-bold text-white">
                    16 more comments
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex w-full flex-col gap-6 lg:max-w-[339px]">
            {/* Video */}
            <div className="rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
              <h3 className="mb-4 text-[19px] font-bold text-[#A06AFF]">Video:</h3>
              <div className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-800 bg-[url('https://api.builder.io/api/v1/image/assets/TEMP/91427fc183512ea04c4513555f63eb808b68d001?width=614')] bg-cover">
                <button className="rounded-full bg-[#A06AFF] p-5 shadow-[0_12px_24px_0_rgba(0,0,0,0.48)]">
                  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 12.0004V8.44038C4 4.02038 7.13 2.21039 10.96 4.42039L14.05 6.20039L17.14 7.98039C20.97 10.1904 20.97 13.8104 17.14 16.0204L14.05 17.8004L10.96 19.5804C7.13 21.7904 4 19.9804 4 15.5604V12.0004Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <h3 className="mb-2 text-[19px] font-bold text-[#A06AFF]">Location:</h3>
              <p className="text-[15px] font-normal text-white">
                <span className="text-[#B0B0B0]">Main Office: </span>Tucson, AZ<br/>
                <span className="text-[#B0B0B0]">Additional Locations: </span>Oro Valley, Marana, Vail
              </p>
            </div>

            {/* Profile Card */}
            <div className="rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <img
                    src={consultant.avatar}
                    alt={consultant.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-white">{consultant.name}</span>
                      <span className="rounded bg-[#A06AFF] px-1 text-xs font-extrabold text-white">PRO</span>
                    </div>
                    <button className="rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 py-1 text-xs font-bold text-white">
                      Follow
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#181B22] px-4 py-4">
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  Join our 10k+ community: <a href="https://example.com" className="text-[#A06AFF] underline">example.com</a>
                </p>
              </div>

              <div className="px-4">
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  Professional trader with 8+ years of experience in momentum strategies and technical analysis.
                </p>
              </div>

              <div className="flex items-center gap-3 px-4 pt-4">
                <span className="text-[15px] font-normal text-[#B0B0B0]">Also on:</span>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" fill="white">
                    <path d="M12.2179 1.26953H14.4668L9.55347 6.88519L15.3337 14.5268H10.8078L7.26302 9.89222L3.20696 14.5268H0.956613L6.21195 8.52026L0.666992 1.26953H5.30773L8.51192 5.50575L12.2179 1.26953ZM11.4285 13.1807H12.6747L4.63059 2.54495H3.2933L11.4285 13.1807Z"/>
                  </svg>
                  <svg width="16" height="16" fill="white">
                    <path d="M15.8406 4.8002C15.8406 4.8002 15.6844 3.69707 15.2031 3.2127C14.5938 2.5752 13.9125 2.57207 13.6 2.53457C11.3625 2.37207 8.00313 2.37207 8.00313 2.37207H7.99687C7.99687 2.37207 4.6375 2.37207 2.4 2.53457C2.0875 2.57207 1.40625 2.5752 0.796875 3.2127C0.315625 3.69707 0.1625 4.8002 0.1625 4.8002C0.1625 4.8002 0 6.09707 0 7.39082V8.60332C0 9.89707 0.159375 11.1939 0.159375 11.1939C0.159375 11.1939 0.315625 12.2971 0.79375 12.7814C1.40313 13.4189 2.20313 13.3971 2.55938 13.4658C3.84063 13.5877 8 13.6252 8 13.6252C8 13.6252 11.3625 13.6189 13.6 13.4596C13.9125 13.4221 14.5938 13.4189 15.2031 12.7814C15.6844 12.2971 15.8406 11.1939 15.8406 11.1939C15.8406 11.1939 16 9.90019 16 8.60332V7.39082C16 6.09707 15.8406 4.8002 15.8406 4.8002ZM6.34688 10.0752V5.57832L10.6687 7.83457L6.34688 10.0752Z"/>
                  </svg>
                  <svg width="16" height="16" fill="white">
                    <path d="M8 1.44062C10.1375 1.44062 10.3906 1.45 11.2313 1.4875C12.0125 1.52187 12.4344 1.65313 12.7156 1.7625C13.0875 1.90625 13.3563 2.08125 13.6344 2.35938C13.9156 2.64062 14.0875 2.90625 14.2313 3.27813C14.3406 3.55938 14.4719 3.98438 14.5063 4.7625C14.5438 5.60625 14.5531 5.85938 14.5531 7.99375C14.5531 10.1313 14.5438 10.3844 14.5063 11.225C14.4719 12.0063 14.3406 12.4281 14.2313 12.7094C14.0875 13.0813 13.9125 13.35 13.6344 13.6281C13.3531 13.9094 13.0875 14.0813 12.7156 14.225C12.4344 14.3344 12.0094 14.4656 11.2313 14.5C10.3875 14.5375 10.1344 14.5469 8 14.5469C5.8625 14.5469 5.60938 14.5375 4.76875 14.5C3.9875 14.4656 3.56563 14.3344 3.28438 14.225C2.9125 14.0813 2.64375 13.9063 2.36563 13.6281C2.08438 13.3469 1.9125 13.0813 1.76875 12.7094C1.65938 12.4281 1.52813 12.0031 1.49375 11.225C1.45625 10.3813 1.44688 10.1281 1.44688 7.99375C1.44688 5.85625 1.45625 5.60313 1.49375 4.7625C1.52813 3.98125 1.65938 3.55938 1.76875 3.27813C1.9125 2.90625 2.0875 2.6375 2.36563 2.35938C2.64688 2.07812 2.9125 1.90625 3.28438 1.7625C3.56563 1.65313 3.99063 1.52187 4.76875 1.4875C5.60938 1.45 5.8625 1.44062 8 1.44062ZM8 0C5.82813 0 5.55625 0.009375 4.70313 0.046875C3.85313 0.084375 3.26875 0.221875 2.7625 0.41875C2.23438 0.625 1.7875 0.896875 1.34375 1.34375C0.896875 1.7875 0.625 2.23438 0.41875 2.75938C0.221875 3.26875 0.084375 3.85 0.046875 4.7C0.009375 5.55625 0 5.82812 0 8C0 10.1719 0.009375 10.4438 0.046875 11.2969C0.084375 12.1469 0.221875 12.7313 0.41875 13.2375C0.625 13.7656 0.896875 14.2125 1.34375 14.6562C1.7875 15.1 2.23438 15.375 2.75938 15.5781C3.26875 15.775 3.85 15.9125 4.7 15.95C5.55313 15.9875 5.825 15.9969 7.99688 15.9969C10.1688 15.9969 10.4406 15.9875 11.2938 15.95C12.1438 15.9125 12.7281 15.775 13.2344 15.5781C13.7594 15.375 14.2063 15.1 14.65 14.6562C15.0938 14.2125 15.3688 13.7656 15.5719 13.2406C15.7688 12.7313 15.9063 12.15 15.9438 11.3C15.9813 10.4469 15.9906 10.175 15.9906 8.00313C15.9906 5.83125 15.9813 5.55938 15.9438 4.70625C15.9063 3.85625 15.7688 3.27188 15.5719 2.76562C15.375 2.23438 15.1031 1.7875 14.6563 1.34375C14.2125 0.9 13.7656 0.625 13.2406 0.421875C12.7313 0.225 12.15 0.0875 11.3 0.05C10.4438 0.009375 10.1719 0 8 0Z"/>
                    <path d="M8 3.89062C5.73125 3.89062 3.89062 5.73125 3.89062 8C3.89062 10.2688 5.73125 12.1094 8 12.1094C10.2688 12.1094 12.1094 10.2688 12.1094 8C12.1094 5.73125 10.2688 3.89062 8 3.89062ZM8 10.6656C6.52813 10.6656 5.33437 9.47188 5.33437 8C5.33437 6.52813 6.52813 5.33437 8 5.33437C9.47188 5.33437 10.6656 6.52813 10.6656 8C10.6656 9.47188 9.47188 10.6656 8 10.6656Z"/>
                    <path d="M13.2312 3.72793C13.2312 4.25918 12.8 4.68731 12.2719 4.68731C11.7406 4.68731 11.3125 4.25606 11.3125 3.72793C11.3125 3.19668 11.7438 2.76855 12.2719 2.76855C12.8 2.76855 13.2312 3.19981 13.2312 3.72793Z"/>
                  </svg>
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M7.99967 14.6663C4.31777 14.6663 1.33301 11.6815 1.33301 7.99967C1.33301 6.13798 2.09611 4.45452 3.32659 3.24502M7.99967 14.6663C7.35767 14.1906 7.46014 13.6367 7.78221 13.0828C8.27741 12.2313 8.27741 12.2313 8.27741 11.0959C8.27741 9.96061 8.95207 9.42827 11.333 9.90441C12.4028 10.1184 13.1824 8.64027 14.5712 9.12834M7.99967 14.6663C11.2969 14.6663 14.035 12.2727 14.5712 9.12834M3.32659 3.24502C3.89278 3.30477 4.20979 3.6081 4.73631 4.16445C5.73594 5.22069 6.73554 5.30882 7.40201 4.95674C8.40161 4.42863 7.56161 3.57321 8.73481 3.10833C9.45407 2.82335 9.59114 2.077 9.25074 1.4502M3.32659 3.24502C4.52964 2.06248 6.17947 1.33301 7.99967 1.33301C8.42727 1.33301 8.84547 1.37327 9.25074 1.4502M14.5712 9.12834C14.6337 8.76147 14.6663 8.38441 14.6663 7.99967C14.6663 4.74539 12.3346 2.03571 9.25074 1.4502" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 p-4">
                {["Distribution", "Luxaigo", "signals", "statisticalprobability", "statistics", "Stop", "trailingstop", "trendanalysis"].map((tag) => (
                  <div key={tag} className="flex items-center gap-1 rounded bg-[#2E2744] px-1">
                    <span className="text-xs font-bold uppercase text-white">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h3 className="mb-4 text-[19px] font-bold text-[#A06AFF]">Reviews</h3>
                <div className="flex items-center gap-4">
                  <div className="text-[31px] font-bold text-[#A06AFF]">4.5</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-[#A06AFF] text-[#A06AFF]" />
                      ))}
                      <Star className="h-4 w-4 fill-[#2E2744] text-[#2E2744]" />
                    </div>
                    <span className="text-xs font-bold text-[#B0B0B0]">Based on 28 reviews</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                {[
                  {
                    author: "John Smith",
                    time: "2 days ago",
                    rating: 5,
                    title: "Game changer for my trading strategy!",
                    text: "This tool has completely transformed how I manage risk in my trading. The automatic calculations save me so much time, and I've seen a significant improvement in my overall performance. Highly recommended for any serious trader.",
                  },
                  {
                    author: "John Smith",
                    time: "1 week ago",
                    rating: 4,
                    title: "Great tool, but could use more features",
                    text: "RiskMaster has been very helpful for my day trading. The risk calculations are spot on and have helped me avoid some potentially big losses. I'd love to see more advanced features in future updates, like custom risk models and better integration with other platforms.",
                  },
                  {
                    author: "John Smith",
                    time: "3 weeks ago",
                    rating: 4.5,
                    title: "Worth every penny",
                    text: "I was hesitant about the price at first, but after using Riskmaster for a month, I can confidently say it's worth every penny. The portfolio analysis feature alone has saved me from making several costly mistakes. The UI is clean and intuitive, making it easy to incorporate into my daily routine.",
                  },
                ].map((review, idx) => (
                  <div key={idx} className="border-b border-[#181B22] last:border-0">
                    <div className="flex items-start justify-between p-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={COMMENT_AVATAR}
                          alt={review.author}
                          className="h-11 w-11 rounded-full"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-white">{review.author}</span>
                          <span className="text-xs font-bold text-[#B0B0B0]">{review.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(review.rating) ? "fill-[#A06AFF] text-[#A06AFF]" : "fill-[#2E2744] text-[#2E2744]"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <h4 className="mb-2 text-[15px] font-bold text-white">{review.title}</h4>
                      <p className="text-[15px] font-normal text-[#B0B0B0]">{review.text}</p>
                    </div>
                  </div>
                ))}

                <div className="p-4">
                  <button className="w-full rounded-full border border-[#181B22] bg-[#0C1014]/50 py-2 text-[15px] font-bold text-white backdrop-blur-[50px]">
                    Show More Reviews
                  </button>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h3 className="text-[19px] font-bold text-[#A06AFF]">Disclaimer</h3>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-normal text-[#B0B0B0]">
                  The information and publications are not meant to be, and do not constitute, financial, investment, trading, or other types of advice or recommendations supplied or endorsed by TyrianTrade. Read more in the{" "}
                  <a href="#" className="text-[#A06AFF] underline">Terms of Use</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentConsultantDetailLanding;
