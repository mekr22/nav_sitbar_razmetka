import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  ShoppingCart,
  Star,
  Eye,
} from "lucide-react";

import type { Course } from "@/data/marketplaceCourses";
import { baseCourses } from "@/data/marketplaceCourses";

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
    author: "Alex Turner",
    time: "3 hours ago",
    text: "Just wrapped up the workshop and already applying the frameworks to my morning playbook. The worksheets are gold.",
    likes: 18,
    canHide: true,
    replies: [
      {
        id: "comment-1-1",
        author: "Sarah Lee",
        time: "2 hours ago",
        text: "Love hearing that, Alex. The Q&A archive is also packed with examples—definitely worth a look!",
        likes: 9,
        canHide: true,
      },
    ],
  },
  {
    id: "comment-2",
    author: "Priya Desai",
    time: "1 day ago",
    text: "Great balance between theory and real order flow. The focus section on risk sizing alone justifies the enrolment.",
    likes: 27,
    likeColor: "#808283",
    timeColor: "#808283",
  },
  {
    id: "comment-3",
    author: "Julian Kraft",
    time: "2 days ago",
    text: "I'm midway through the case studies. The downloadable cheat sheets make it easy to brief my team before the session.",
    likes: 14,
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

const priceByFormat: Record<Course["format"], string> = {
  video: "$199.00",
  live: "$349.00",
  ebook: "$129.00",
};

const toTitleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const releaseWindowLabel: Record<Course["releaseWindow"], string> = {
  "24h": "Released in the last 24 hours",
  "7d": "Released in the last 7 days",
  "30d": "Released in the last 30 days",
};

const CourseDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as
    | {
        course?: Course;
        category?: string;
        isFavorite?: boolean;
      }
    | null;

  const [isFavorite, setIsFavorite] = useState(Boolean(locationState?.isFavorite));
  const [comments, setComments] = useState<CommentNode[]>(() => INITIAL_COMMENTS);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    whatYouLearn: false,
  });

  const course = useMemo<Course>(() => {
    if (locationState?.course) {
      return locationState.course;
    }
    return baseCourses[0];
  }, [locationState]);

  useEffect(() => {
    setIsFavorite(Boolean(locationState?.isFavorite));
  }, [locationState?.isFavorite]);

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

  const categoryLabel = locationState?.category ?? "Courses and Training materials";

  const handleNavigateBack = useCallback(() => {
    navigate("/marketplace/courses", {
      state: {
        scrollToTop: true,
        category: "Courses and Training materials",
      },
    });
  }, [navigate]);

  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
  }, []);

  const handleToggleLike = useCallback((id: string) => {
    setComments((prev) => toggleLikeInTree(prev, id));
  }, []);

  const handleToggleHidden = useCallback((id: string) => {
    setComments((prev) => toggleHiddenInTree(prev, id));
  }, []);

  const ratingValue = useMemo(() => {
    const parsed = Number.parseFloat(course.rating);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.min(Math.max(parsed, 0), 5);
  }, [course.rating]);

  const totalReviews = useMemo(() => Math.max(Math.round(ratingValue * 22), 24), [ratingValue]);

  const formatLabel = useMemo(() => toTitleCase(course.format), [course.format]);
  const focusLabel = useMemo(() => toTitleCase(course.focusArea), [course.focusArea]);
  const languageLabel = useMemo(() => toTitleCase(course.language), [course.language]);
  const materialLabel = course.materialType === "training" ? "Training" : "Course";
  const releaseLabel = releaseWindowLabel[course.releaseWindow];
  const priceLabel = priceByFormat[course.format];

  const detailItems = useMemo(
    () => [
      { label: "Type", value: materialLabel },
      { label: "Focus", value: focusLabel },
      { label: "Format", value: formatLabel },
      { label: "Duration", value: course.duration },
      { label: "Lectures", value: course.lectures },
      { label: "Language", value: languageLabel },
    ],
    [course.duration, course.lectures, formatLabel, focusLabel, languageLabel, materialLabel],
  );

  const lessonHighlights = useMemo(
    () => [
      `${course.lectures} guided by ${course.host} with practical assignments`,
      `Structured for ${course.level.toLowerCase()} learners in a ${formatLabel.toLowerCase()} format`,
      `${releaseLabel} — fully annotated resources included`,
    ],
    [course.host, course.level, course.lectures, formatLabel, releaseLabel],
  );

  const infoTags = useMemo(
    () => [focusLabel, formatLabel, course.level, languageLabel],
    [course.level, focusLabel, formatLabel, languageLabel],
  );

  const reviews = useMemo(
    () => [
      {
        id: "review-1",
        author: "Michael Chan",
        time: "4 days ago",
        summary: "Exactly what I needed to tighten my execution",
        body:
          "Clear frameworks and actionable worksheets. The live case breakdowns clarified how to size trades regardless of market regime.",
        rating: 5,
      },
      {
        id: "review-2",
        author: "Lina Ortega",
        time: "1 week ago",
        summary: "Fantastic depth on risk and mindset",
        body:
          "The module on risk journaling is worth the price alone. I've already updated my team's playbook with the templates provided.",
        rating: 4,
      },
      {
        id: "review-3",
        author: "Nina Patel",
        time: "3 weeks ago",
        summary: "Delivered on every promise",
        body:
          "Loved the blend of macro context and tactical entries. Having both recordings and checklists makes it easy to revisit before sessions.",
        rating: 4.5,
      },
    ],
    [],
  );

  const whatYouLearnItems = useMemo(
    () => [
      [
        "What is blockchain and how it works",
        "Basics of P2P trading",
        "Risk management",
        "Trading Automation",
      ],
      [
        "Working with wallets and exchanges",
        "Arbitrage strategies",
        "Tax aspects of cryptocurrencies",
        "Business scaling",
      ],
    ],
    [],
  );

  const renderStars = (rating: number) => {
    const stars = [] as JSX.Element[];
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
              fill="url(#course-star-paint)"
            />
          )}
          {halfFilled && (
            <defs>
              <linearGradient
                id="course-star-paint"
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

  const renderComment = (comment: CommentNode, depth = 0): JSX.Element => {
    const indentStep = isCompactLayout ? 16 : 24;
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

  return (
    <div className="mx-auto w-full max-w-[1075px] px-3 sm:px-4">
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={handleNavigateBack}
          className="rounded-full text-[15px] font-normal text-[#B0B0B0] hover:text-white"
        >
          {categoryLabel}
        </button>
        <span className="text-[15px] font-bold text-[#808283]">/</span>
        <span className="text-[15px] font-bold text-white">{course.title}</span>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px]">
        <h1 className="flex-1 text-[31px] font-bold leading-normal text-white">{course.title}</h1>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-[#A06AFF]/10"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove course from favourites" : "Add course to favourites"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.7296 3.44515L15.4894 6.99385C15.7294 7.48784 16.3693 7.96167 16.9093 8.0524L20.0989 8.58672C22.1387 8.9295 22.6187 10.4216 21.1488 11.8935L18.6691 14.3937C18.2491 14.8171 18.0192 15.6337 18.1491 16.2185L18.8591 19.3135C19.419 21.7633 18.1291 22.711 15.9794 21.4306L12.9897 19.6462C12.4498 19.3236 11.5599 19.3236 11.0099 19.6462L8.02022 21.4306C5.88045 22.711 4.5806 21.7532 5.14054 19.3135L5.85046 16.2185C5.98044 15.6337 5.75047 14.8171 5.33051 14.3937L2.85079 11.8935C1.39095 10.4216 1.8609 8.9295 3.90067 8.58672L7.09032 8.0524C7.62026 7.96167 8.26019 7.48784 8.50016 6.99385L10.26 3.44515C11.2199 1.51958 12.7797 1.51958 13.7296 3.44515Z"
              stroke={isFavorite ? "#A06AFF" : "#B0B0B0"}
              fill={isFavorite ? "#A06AFF" : "none"}
              strokeWidth="1.00667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_339px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px]">
            <div className="relative w-full">
              <img
                src={course.image}
                alt={`${course.title} preview`}
                className="w-full rounded-lg"
              />
              <button
                type="button"
                aria-label="Previous screenshot"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1014]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11.9908" cy="11.9908" r="11.9908" fill="url(#course_prev)" />
                  <path
                    d="M13.627 8.17578L9.81171 11.991L13.627 15.8063"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="course_prev"
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11.9908" cy="11.9908" r="11.9908" fill="url(#course_next)" />
                  <path
                    d="M10.373 8.17578L14.188 11.991L10.373 15.8063"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="course_next"
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

          <div className="flex flex-col gap-4 rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] p-4 backdrop-blur-[50px]">
            <h2 className="text-[19px] font-bold text-[#A06AFF]">What you'll learn</h2>
            <div className="flex gap-2.5">
              <div className="flex flex-1 flex-col gap-2">
                {whatYouLearnItems[0].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                        stroke="#A06AFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="flex-1 text-[15px] font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {whatYouLearnItems[1].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                        stroke="#A06AFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="flex-1 text-[15px] font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setExpandedSections((prev) => ({ ...prev, whatYouLearn: !prev.whatYouLearn }))
              }
              className="flex items-center justify-center gap-1 rounded-full border border-[#A06AFF] px-3 py-2 transition-colors hover:bg-[#A06AFF]/10"
            >
              <span className="text-[15px] font-medium text-[#A06AFF]">Expand</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${expandedSections.whatYouLearn ? "rotate-180" : ""}`}
              >
                <path
                  d="M8.4693 10.7402L11.9993 14.2602L15.5293 10.7402"
                  stroke="#A06AFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="rounded-2xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Description</h2>
            </div>
            <div className="p-4">
              <p className="mb-4 text-[15px] font-normal text-white">{course.subtitle}</p>
              <ul className="list-disc space-y-2 pl-5 text-[15px] font-medium text-white">
                {lessonHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative flex flex-col gap-6 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px] max-[360px]:gap-4 max-[360px]:p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white max-[360px]:text-xl">Community discussions</h2>
              <div className="flex items-center gap-1 rounded-full border border-[#181B22] bg-[#0C1014]/50 p-1 backdrop-blur-[50px] max-[360px]:p-0.5">
                <button
                  type="button"
                  aria-label="Sort comments"
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full transition-transform hover:scale-[1.02] max-[360px]:h-6 max-[360px]:w-6"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_clock_course)">
                      <path d="M3.36524 5.73739L1.69181 5.63552C2.89133 2.46952 6.33525 0.666286 9.69299 1.56284C13.2693 2.51775 15.3935 6.17372 14.4376 9.72868C13.4817 13.2837 9.80765 15.3914 6.23139 14.4365C3.57605 13.7275 1.7212 11.5294 1.33325 8.98928" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 5.33301V7.99967L9.33333 9.33301" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_clock_course">
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.23732 14.6663C17.3855 12.6663 12.8225 4.66634 7.28172 1.33301C6.63012 3.66634 5.65217 4.33301 3.69657 6.66634C1.10739 9.75561 2.39292 13.333 5.97805 14.6663C5.43485 13.9997 4.03297 12.6002 4.99992 10.6663C5.33325 9.99967 5.99992 9.33301 5.66659 7.99967C6.31844 8.33301 7.66659 8.66634 7.99992 10.333C8.54312 9.66634 9.10685 8.26634 8.58545 6.66634C12.6666 9.66634 10.9999 12.6663 9.23732 14.6663Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 max-[360px]:gap-3">
              <textarea
                className="h-[88px] w-full resize-none rounded-2xl border border-[#181B22] bg-[#0C1014]/30 px-4 py-3 text-[15px] font-medium text-white placeholder-[#B0B0B0] focus:border-[#A06AFF] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]/40 max-[360px]:h-[72px] max-[360px]:px-3 max-[360px]:py-2 max-[360px]:text-sm"
                placeholder="Share your experience with this course"
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
                  <span className="text-center text-[15px] font-bold text-white max-[360px]:text-sm">Load more comments</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="h-[332px] w-full rounded-t-3xl border border-[#181B22] object-cover"
              />
              <button
                type="button"
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-l from-[#482090] to-[#A06AFF] shadow-[0_12px_24px_0_rgba(0,0,0,0.48)]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 12.0004V8.44038C4 4.02038 7.13 2.21039 10.96 4.42039L14.05 6.20039L17.14 7.98039C20.97 10.1904 20.97 13.8104 17.14 16.0204L14.05 17.8004L10.96 19.5804C7.13 21.7904 4 19.9804 4 15.5604V12.0004Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-white">$39.99</div>
                <div className="flex items-center gap-2">
                  <div className="text-[15px] font-medium text-[#B0B0B0] line-through">$39.99</div>
                  <div className="inline-flex h-7 items-center rounded bg-[#1C3430] px-2">
                    <span className="text-xs font-bold uppercase leading-none text-[#2EBD85]">34% OFF</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <div className="inline-flex h-7 items-center justify-center gap-1 rounded bg-[#2E2744] px-2">
                  <span className="text-xs font-bold uppercase leading-none text-white">4.5H</span>
                </div>
                <div className="inline-flex h-7 items-center justify-center gap-1 rounded bg-[#2E2744] px-2">
                  <span className="text-xs font-bold uppercase leading-none text-white">17 LECTURES</span>
                </div>
                <div className="inline-flex h-7 items-center justify-center gap-1 rounded bg-[rgba(106,165,255,0.16)] px-2">
                  <span className="text-xs font-bold uppercase leading-none text-[#6AA5FF]">ALL LEVELS</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1111_20909)">
                    <path
                      d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z"
                      stroke="#A06AFF"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 5.33301V7.99967L9.33333 9.33301"
                      stroke="#A06AFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1111_20909">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-[15px] text-[#A06AFF]">
                  Limited time offer: <span className="font-bold">2 days left</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] text-[#B0B0B0]">P2P Crypto Arbitrage from Scratch!</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-4 pb-2">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Expert level content</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">For experienced users</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Full lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Certificate of completion</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.33398 9.66699C3.33398 9.66699 4.33398 9.66699 5.66732 12.0003C5.66732 12.0003 9.37318 5.88921 12.6673 4.66699"
                    stroke="#A06AFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-1 text-[15px] font-medium text-white">Access on mobile and TV</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">{renderStars(4.1)}</div>
                <span className="text-[15px] text-[#B0B0B0]">4.1 (311 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[15px] text-[#B0B0B0]">46 sales</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 px-4 pb-4">
              <div className="flex h-7 items-center rounded bg-[#2E2744] px-2">
                <span className="text-xs font-bold uppercase leading-none text-white">COURSES</span>
              </div>
              <div className="flex h-7 items-center rounded bg-[#2E2744] px-2">
                <span className="text-xs font-bold uppercase leading-none text-white">TRADING_MATERIALS</span>
              </div>
              <div className="flex h-7 items-center rounded bg-[#2E2744] px-2">
                <span className="text-xs font-bold uppercase leading-none text-white">CRYPTOCURRENCY</span>
              </div>
              <div className="flex h-7 items-center rounded bg-[#2E2744] px-2">
                <span className="text-xs font-bold uppercase leading-none text-white">P2P_TRADING</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <button className="flex h-[46px] items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[#482090] to-[#A06AFF] text-[15px] font-bold text-white">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1111_20966)">
                    <path d="M5.19922 10.6667L11.0126 10.1822C12.8316 10.0307 13.24 9.63333 13.4416 7.81927L13.8659 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 4H14.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M3.99935 14.6667C4.73573 14.6667 5.33268 14.0697 5.33268 13.3333C5.33268 12.597 4.73573 12 3.99935 12C3.26297 12 2.66602 12.597 2.66602 13.3333C2.66602 14.0697 3.26297 14.6667 3.99935 14.6667Z" stroke="white" strokeWidth="1.5" />
                    <path d="M11.3333 14.6667C12.0697 14.6667 12.6667 14.0697 12.6667 13.3333C12.6667 12.597 12.0697 12 11.3333 12C10.597 12 10 12.597 10 13.3333C10 14.0697 10.597 14.6667 11.3333 14.6667Z" stroke="white" strokeWidth="1.5" />
                    <path d="M5.33398 13.333H10.0007" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M1.33398 1.33301H1.97798C2.60777 1.33301 3.15674 1.7494 3.30949 2.34296L5.293 10.0507C5.39323 10.4402 5.30745 10.8528 5.05948 11.1741L4.42207 11.9997" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1111_20966">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Buy
              </button>
              <button className="flex h-[46px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1111_20975)">
                    <path d="M13.334 5.99967C12.8039 3.34271 10.3425 1.33301 7.38685 1.33301C4.04431 1.33301 1.33398 3.90315 1.33398 7.07301C1.33398 8.59607 1.95944 9.97994 2.97968 11.0069C3.20431 11.233 3.35428 11.5419 3.29376 11.8599C3.19386 12.3797 2.96749 12.8647 2.63602 13.2688C3.50814 13.4296 4.41496 13.2848 5.19266 12.8748C5.46758 12.7299 5.60503 12.6575 5.70203 12.6427C5.76993 12.6325 5.85838 12.6421 6.00065 12.6665" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.33398 10.8408C7.33398 12.7779 8.97585 14.3486 11.0007 14.3486C11.2387 14.3489 11.4761 14.3269 11.71 14.283C11.8783 14.2513 11.9625 14.2355 12.0213 14.2445C12.08 14.2535 12.1633 14.2978 12.3299 14.3863C12.8009 14.6369 13.3503 14.7253 13.8786 14.6271C13.6778 14.3801 13.5407 14.0838 13.4801 13.7661C13.4435 13.5718 13.5343 13.383 13.6704 13.2448C14.2885 12.6172 14.6673 11.7715 14.6673 10.8408C14.6673 8.90367 13.0255 7.33301 11.0007 7.33301C8.97585 7.33301 7.33398 8.90367 7.33398 10.8408Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1111_20975">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Chat
              </button>
              <button className="flex h-[46px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[rgba(12,16,20,0.50)] text-[15px] font-bold text-white backdrop-blur-[50px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V13.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3.98769 2.19029C6.21515 2.6144 7.54272 3.50154 8.00065 4.01085C8.45858 3.50154 9.78612 2.6144 12.0136 2.19029C13.1421 1.97543 13.7063 1.86801 14.1868 2.27976C14.6673 2.69151 14.6673 3.36015 14.6673 4.69741V9.50333C14.6673 10.7261 14.6673 11.3374 14.3589 11.7191C14.0505 12.1008 13.3716 12.2301 12.0136 12.4887C10.8031 12.7191 9.85838 13.0863 9.17452 13.4554C8.50172 13.8185 8.16532 14 8.00065 14C7.83598 14 7.49958 13.8185 6.82678 13.4554C6.14294 13.0863 5.1982 12.7191 3.98769 12.4887C2.62975 12.2301 1.95078 12.1008 1.64238 11.7191C1.33398 11.3374 1.33398 10.7261 1.33398 9.50333V4.69741C1.33398 3.36015 1.33398 2.69151 1.8145 2.27976C2.29503 1.86801 2.85925 1.97543 3.98769 2.19029Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Live Preview
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={AVATAR_PLACEHOLDER}
                  alt={course.host}
                  className="h-20 w-20 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-white">{course.host}</div>
                  <div className="text-sm font-semibold text-[#B0B0B0]">
                    {focusLabel} specialist • {formatLabel} format
                  </div>
                  <button className="mt-2 flex h-[26px] items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-3 text-xs font-bold text-white">
                    Follow
                  </button>
                </div>
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Students gain lifetime access to annotated slides, case study replays, and a private forum moderated weekly by {course.host}.
              </div>
              <div className="mb-4 text-[15px] font-normal text-[#B0B0B0]">
                Weekly AMA sessions keep the cohort aligned with {course.host}'s market outlook and provide direct feedback on submitted trade plans.
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[15px] font-normal text-[#B0B0B0]">Also on:</span>
                <div className="flex gap-2 text-white">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.2169 1.26953H14.4659L9.55249 6.88519L15.3327 14.5268H10.8068L7.26204 9.89222L3.20598 14.5268H0.955637L6.21097 8.52026L0.666016 1.26953H5.30675L8.51095 5.50575L12.2169 1.26953ZM11.4276 13.1807H12.6737L4.62961 2.54495H3.29232L11.4276 13.1807Z" fill="currentColor" />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.8406 4.8002C15.8406 4.8002 15.6844 3.69707 15.2031 3.2127C14.5938 2.5752 13.9125 2.57207 13.6 2.53457C11.3625 2.37207 8.00313 2.37207 8.00313 2.37207H7.99687C7.99687 2.37207 4.6375 2.37207 2.4 2.53457C2.0875 2.57207 1.40625 2.5752 0.796875 3.2127C0.315625 3.69707 0.1625 4.8002 0.1625 4.8002C0.1625 4.8002 0 6.09707 0 7.39082V8.60332C0 9.89707 0.159375 11.1939 0.159375 11.1939C0.159375 11.1939 0.315625 12.2971 0.79375 12.7814C1.40313 13.4189 2.20313 13.3971 2.55938 13.4658C3.84063 13.5877 8 13.6252 8 13.6252C8 13.6252 11.3625 13.6189 13.6 13.4596C13.9125 13.4221 14.5938 13.4189 15.2031 12.7814C15.6844 12.2971 15.8406 11.1939 15.8406 11.1939C15.8406 11.1939 16 9.90019 16 8.60332V7.39082C16 6.09707 15.8406 4.8002 15.8406 4.8002ZM6.34688 10.0752V5.57832L10.6687 7.83457L6.34688 10.0752Z" fill="currentColor" />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1.44062C10.1375 1.44062 10.3906 1.45 11.2313 1.4875C12.0125 1.52187 12.4344 1.65313 12.7156 1.7625C13.0875 1.90625 13.3563 2.08125 13.6344 2.35938C13.9156 2.64063 14.0875 2.90625 14.2313 3.27813C14.3406 3.55938 14.4719 3.98437 14.5063 4.7625C14.5438 5.60625 14.5531 5.85938 14.5531 7.99375C14.5531 10.1313 14.5438 10.3844 14.5063 11.225C14.4719 12.0063 14.3406 12.4281 14.2313 12.7094C14.0875 13.0813 13.9125 13.35 13.6344 13.6281C13.3531 13.9094 13.0875 14.0813 12.7156 14.225C12.4344 14.3344 12.0094 14.4656 11.2313 14.5C10.3875 14.5375 10.1344 14.5469 8 14.5469C5.8625 14.5469 5.60938 14.5375 4.76875 14.5C3.9875 14.4656 3.56563 14.3344 3.28438 14.225C2.9125 14.0813 2.64375 13.9063 2.36563 13.6281C2.08438 13.3469 1.9125 13.0813 1.76875 12.7094C1.65938 12.4281 1.52813 12.0031 1.49375 11.225C1.45625 10.3813 1.44688 10.1281 1.44688 7.99375C1.44688 5.85625 1.45625 5.60312 1.49375 4.7625C1.52813 3.98125 1.65938 3.55938 1.76875 3.27813C1.9125 2.90625 2.0875 2.6375 2.36563 2.35938C2.64688 2.07813 2.9125 1.90625 3.28438 1.7625C3.56563 1.65313 3.99063 1.52187 4.76875 1.4875C5.60938 1.45 5.8625 1.44062 8 1.44062ZM8 0C5.82813 0 5.55625 0.009375 4.70313 0.046875C3.85313 0.084375 3.26875 0.221875 2.7625 0.41875C2.23438 0.625 1.7875 0.896875 1.34375 1.34375C0.896875 1.7875 0.625 2.23438 0.41875 2.75938C0.221875 3.26875 0.084375 3.85 0.046875 4.7C0.009375 5.55625 0 5.82813 0 8C0 10.1719 0.009375 10.4438 0.046875 11.2969C0.084375 12.1469 0.221875 12.7313 0.41875 13.2813C0.625 13.8063 0.896875 14.2531 1.34375 14.6969C1.7875 15.1437 2.23438 15.4156 2.7625 15.6219C3.26875 15.8187 3.85 15.9562 4.70313 15.9937C5.55313 16.0312 5.82813 16.0406 8 16.0406C10.1719 16.0406 10.4469 16.0312 11.3 15.9937C12.15 15.9562 12.7344 15.8187 13.2406 15.6219C13.7687 15.4156 14.2156 15.1437 14.6594 14.6969C15.1031 14.2531 15.375 13.8063 15.5813 13.2813C15.7781 12.7719 15.9156 12.1906 15.9531 11.3406C15.9906 10.4875 16 10.2125 16 8.04062C16 5.86875 15.9906 5.59688 15.9531 4.74375C15.9156 3.89375 15.7781 3.30938 15.5813 2.80313C15.375 2.275 15.1031 1.82812 14.6594 1.38437C14.2156 0.94062 13.7687 0.66875 13.2406 0.4625C12.7344 0.265625 12.15 0.128125 11.3 0.090625C10.4469 0.053125 10.1719 0.04375 8 0.04375C5.82813 0.04375 5.55313 0.053125 4.7 0.090625C3.85 0.128125 3.26563 0.265625 2.75938 0.4625C2.23438 0.66875 1.7875 0.94062 1.34375 1.38437C0.896875 1.82812 0.625 2.275 0.41875 2.80313C0.221875 3.30938 0.084375 3.89375 0.046875 4.74375C0.009375 5.59688 0 5.86875 0 8.04062C0 10.2125 0.009375 10.4875 0.046875 11.3C0.084375 12.15 0.221875 12.7344 0.41875 13.2406C0.625 13.7687 0.896875 14.2156 1.34375 14.6594C1.7875 15.1031 2.23438 15.375 2.7625 15.5813C3.26875 15.7781 3.85 15.9156 4.70313 15.9531C5.55313 15.9906 5.82813 16 8 16C10.1719 16 10.4469 15.9906 11.3 15.9531C12.15 15.9156 12.7344 15.7781 13.2406 15.5813C13.7687 15.375 14.2156 15.1031 14.6594 14.6594C15.1031 14.2156 15.375 13.7687 15.5813 13.2406C15.7781 12.7344 15.9156 12.15 15.9531 11.3C15.9906 10.4469 16 10.1719 16 8C16 5.82813 15.9906 5.55313 15.9531 4.7C15.9156 3.85 15.7781 3.26562 15.5813 2.75938C15.375 2.23438 15.1031 1.7875 14.6594 1.34375C14.2156 0.896875 13.7687 0.625 13.2406 0.41875C12.7344 0.221875 12.1531 0.084375 11.3 0.046875C10.4469 0.009375 10.1719 0 8 0Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {infoTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex h-7 items-center rounded bg-[#2E2744] px-2 text-xs font-bold uppercase leading-none text-white"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#181B22] bg-[rgba(12,16,20,0.50)] backdrop-blur-[50px]">
            <div className="border-b border-[#181B22] p-4">
              <h2 className="mb-4 text-[19px] font-bold text-[#A06AFF]">Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="text-[31px] font-bold text-[#A06AFF]">{ratingValue.toFixed(1)}</div>
                <div>
                  <div className="flex gap-0.5">{renderStars(ratingValue)}</div>
                  <div className="text-xs font-bold text-[#B0B0B0]">Based on {totalReviews} reviews</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-[#181B22]">
              {reviews.map((review) => (
                <div key={review.id} className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={AVATAR_PLACEHOLDER} alt={review.author} className="h-11 w-11 rounded-full" />
                      <div>
                        <div className="text-[15px] font-bold text-white">{review.author}</div>
                        <div className="text-xs font-bold text-[#B0B0B0]">{review.time}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                  </div>
                  <div className="text-[15px] font-bold text-white">{review.summary}</div>
                  <div className="text-[15px] font-normal text-[#B0B0B0]">{review.body}</div>
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
              <h2 className="text-[19px] font-bold text-[#A06AFF]">Disclaimer</h2>
            </div>
            <div className="p-4">
              <p className="text-[15px] font-normal text-[#B0B0B0]">
                Educational content is provided for instructional purposes only and does not constitute financial or investment advice. Review the
                <a href="#" className="text-[#A06AFF] underline"> Terms of Use</a> for additional details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailLanding;
