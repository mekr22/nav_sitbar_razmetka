import { ShoppingCart, MessageCircle, Star, Users, Edit, TrendingUp, DollarSign, Clock, PieChart } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";

interface Analyst {
  id: string;
  name: string;
  avatar: string;
  company?: string;
  role?: string;
  rating?: string;
  followers?: string;
  publications?: string;
  markets?: string;
  assets?: string;
  analysis?: string;
  forecastAccuracy?: string;
  price?: string;
  successRate?: string;
  averageReturn?: string;
  bio?: string;
  communityLink?: string;
  socials?: string[];
  tags?: string[];
  reviews?: Array<{
    id: string;
    author: string;
    avatar: string;
    postedAt: string;
    rating: number;
    title: string;
    message: string;
  }>;
  averageRating?: number;
  totalReviews?: number;
}

const ANALYST_AVATAR = "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=800";
const COMMENT_AVATAR = "https://cdn.builder.io/api/v1/image/assets%2F684cb122a7e14784926e57d7235fa702%2F68315e5814ee44f2b3af7585af3ac179?format=webp&width=800";

const FAVORITE_STORAGE_KEY = "analyst-detail-favorites";

const AnalystDetailLanding: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const locationState = (location.state as { analyst?: Analyst } | null) ?? null;

  const [favoriteAnalystIds, setFavoriteAnalystIds] = useState<Set<string>>(() => {
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
          // ignore
        }
      }
    }
    return storedIds;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(Array.from(favoriteAnalystIds)));
  }, [favoriteAnalystIds]);

  const analyst = useMemo<Analyst>(() => {
    const fallback: Analyst = {
      id: "default-analyst",
      name: "Sarah Lee",
      avatar: ANALYST_AVATAR,
      company: "Berkshire Hathaway",
      role: "Hedge fund manager",
      rating: "5.0",
      followers: "15,054",
      publications: "983",
      markets: "Binance, NASDAQ",
      assets: "BTC, ETH, Tesla, Gold",
      analysis: "Technical & Fundamental Analysis",
      forecastAccuracy: "68%",
      price: "$10 / month",
      successRate: "111 out of 128",
      averageReturn: "111.14%",
      bio: "Professional trader with 8+ years of experience in momentum strategies and technical analysis.",
      communityLink: "https://example.com",
      socials: ["twitter", "youtube", "instagram", "web"],
      tags: ["Distribution", "Luxaigo", "signals", "statisticalprobability", "statistics", "Stop", "trailingstop", "trendanalysis"],
      averageRating: 4.5,
      totalReviews: 28,
      reviews: [
        {
          id: "1",
          author: "John Smith",
          avatar: COMMENT_AVATAR,
          postedAt: "2 days ago",
          rating: 5,
          title: "Game changer for my trading strategy!",
          message: "This tool has completely transformed how I manage risk in my trading. The automatic calculations save me so much time, and I've seen a significant improvement in my overall performance. Highly recommended for any serious trader.",
        },
        {
          id: "2",
          author: "John Smith",
          avatar: COMMENT_AVATAR,
          postedAt: "1 week ago",
          rating: 4,
          title: "Great tool, but could use more features",
          message: "RiskMaster has been very helpful for my day trading. The risk calculations are spot on and have helped me avoid some potentially big losses. I'd love to see more advanced features in future updates, like custom risk models and better integration with other platforms.",
        },
        {
          id: "3",
          author: "John Smith",
          avatar: COMMENT_AVATAR,
          postedAt: "3 weeks ago",
          rating: 4.5,
          title: "Worth every penny",
          message: "I was hesitant about the price at first, but after using Riskmaster for a month, I can confidently say it's worth every penny. The portfolio analysis feature alone has saved me from making several costly mistakes. The UI is clean and intuitive, making it easy to incorporate into my daily routine.",
        },
      ],
    };

    const provided = locationState?.analyst;
    if (!provided) return fallback;

    return {
      ...fallback,
      ...provided,
      tags: Array.isArray(provided.tags) && provided.tags.length > 0 ? provided.tags : fallback.tags,
      reviews: Array.isArray(provided.reviews) && provided.reviews.length > 0 ? provided.reviews : fallback.reviews,
    };
  }, [locationState]);

  const isAnalystFavorite = favoriteAnalystIds.has(analyst.id);

  const handleToggleFavoriteAnalyst = useCallback(() => {
    setFavoriteAnalystIds((prev) => {
      const next = new Set(prev);
      if (next.has(analyst.id)) {
        next.delete(analyst.id);
      } else {
        next.add(analyst.id);
      }
      return next;
    });
  }, [analyst.id]);

  const handleNavigateToCategory = useCallback(() => {
    navigate("/marketplace/analysts", { state: { scrollToTop: true } });
  }, [navigate]);

  const reviews = useMemo(() => {
    const sourceReviews = Array.isArray(analyst.reviews) ? analyst.reviews : [];
    return sourceReviews.filter(
      (review) =>
        typeof review?.author === "string" &&
        review.author.trim().length > 0 &&
        typeof review?.message === "string" &&
        review.message.trim().length > 0
    );
  }, [analyst.reviews]);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

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
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-[1075px] px-4">
        <div className="flex items-center gap-2 text-[15px]">
          <button
            type="button"
            onClick={handleNavigateToCategory}
            className="font-normal text-[#B0B0B0] transition-colors hover:text-white"
          >
            Investment consultants and Analysts and Traders
          </button>
          <span className="font-bold text-[#B0B0B0]">/</span>
          <span className="font-bold text-white">{analyst.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-[1075px] px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
          {/* Left Column - Profile Card */}
          <div className="flex w-full flex-col gap-6 lg:max-w-[339px]">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <img
                src={analyst.avatar}
                alt={analyst.name}
                className="h-24 w-24 rounded-full object-cover mx-auto mt-4"
              />

              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{analyst.name}</h2>
                  <div className="rounded bg-[#A06AFF] px-1">
                    <span className="text-xs font-bold text-white">PRO</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1">
                  <div className="rounded bg-[#3E321D] px-1 py-0.5">
                    <span className="text-xs font-bold uppercase text-[#FFA800]">{analyst.role}</span>
                  </div>
                  <div className="rounded bg-[#1C3430] px-1 py-0.5">
                    <span className="text-xs font-bold text-[#2EBD85]">{analyst.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                    <Users className="h-4 w-4 text-[#B0B0B0]" />
                    <span className="text-xs font-bold text-white">{analyst.followers}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-[#2E2744] px-1 py-0.5">
                    <Edit className="h-4 w-4 text-[#B0B0B0]" />
                    <span className="text-xs font-bold text-white">{analyst.publications}</span>
                  </div>
                </div>

                <p className="text-xs font-bold uppercase text-[#B0B0B0] text-center mt-2">{analyst.company}</p>

                {/* Chart */}
                <svg className="mt-4 w-full" viewBox="0 0 311 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.81635 74.7739L0.50293 78.8428V115.891H310.503V5.81618L302.984 11.5983L297.779 21.4494L291.995 20.807L289.104 22.9485L282.163 3.03217L279.85 5.81618L275.801 4.53125L267.126 6.88695L262.499 17.1664L259.029 14.5965C257.68 16.9522 254.981 21.6208 254.981 21.4494C254.981 21.2781 252.667 18.0944 251.51 16.5239L248.04 21.6636L243.413 16.3097L237.63 14.8107L234.738 0.890625L226.063 7.74357H223.171L220.857 9.24265L219.122 6.67279L213.917 19.0938L212.182 15.6673L206.398 14.8107L202.928 18.4513L201.772 10.7417L198.88 14.8107L194.831 9.24265L191.361 12.2408L189.626 10.7417L187.891 11.5983L184.421 4.10294L181.529 20.1645L176.902 13.3116L172.275 11.5983L167.648 22.7344L160.13 29.159L154.346 27.8741L153.768 33.2279L150.876 28.9449L146.249 34.727L142.779 47.7904L138.731 48.4329L134.682 49.2895L132.369 57.6415L129.477 58.7123L122.536 57.6415L113.861 52.9301L110.969 59.3548L103.451 61.7105L100.559 60.8539L99.4022 62.9954L91.8835 59.3548L90.7268 61.068L82.6297 59.9972L75.6895 64.4945L75.1112 67.7068L71.641 66.8502L67.5924 70.0625L64.7007 67.7068H57.7604L56.6037 68.7776H54.2903L50.2417 71.3474L43.3014 69.2059L39.8312 64.7086L35.7827 64.9228L31.7343 70.0625L28.8424 68.3493L27.1074 70.705L24.2156 69.2059L14.3835 70.705L9.75663 76.273L2.81635 74.7739Z" fill="url(#paint0_linear)" />
                  <path d="M0.50293 77.5573L2.81639 73.5555L9.75666 75.0298L14.3835 69.5536L24.2156 68.0793L27.1074 69.5536L28.8425 67.2368L31.7343 68.9218L35.7828 63.8668L39.8313 63.6562L43.3014 68.0793L50.2418 70.1855L54.2902 67.658H56.6036L57.7604 66.6049H64.7007L67.5925 68.9218L71.641 65.7624L75.1111 66.6049L75.6895 63.4456L82.6298 59.0225L90.7268 60.0756L91.8835 58.3906L99.4021 61.9712L100.559 59.865L103.451 60.7075L110.969 58.3906L113.861 52.0719L122.537 56.7056L129.477 57.7588L132.369 56.7056L134.682 48.4914L138.731 47.6489L142.779 47.017L146.249 34.169L150.876 28.4822L153.768 32.6947L154.346 27.4291L160.13 28.6928L167.648 22.3741L172.275 11.4218L176.902 13.1067L181.529 19.8467L184.421 4.04997L187.891 11.4218L189.626 10.5793L191.361 12.0536L194.831 9.10491L198.88 14.5811L201.772 10.5793L202.928 18.1617L206.398 14.5811L212.182 15.4236L213.917 18.7936L219.122 6.57744L220.857 9.10491L223.171 7.63055H226.063L234.738 0.890625L237.63 14.5811L243.413 16.0555L248.04 21.321L251.51 16.2661C252.667 17.8107 254.981 20.9419 254.981 21.1104C254.981 21.2789 257.68 16.6873 259.029 14.3705L262.499 16.898L267.126 6.78806L275.801 4.47121L279.85 5.73495L282.163 2.99685L289.104 22.5848L291.995 20.4785L297.779 21.1104L302.984 11.4218L310.503 5.73495" stroke="#523A83" strokeWidth="1.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="-132.231" y1="0.890625" x2="-132.231" y2="115.891" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#A06AFF" stopOpacity="0.32" />
                      <stop offset="1" stopColor="#181A20" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="border-t border-[#181B22] px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Markets:</span>
                  <span className="text-xs font-bold uppercase text-white">{analyst.markets}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Assets:</span>
                  <span className="text-xs font-bold uppercase text-white">{analyst.assets}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Analysis:</span>
                  <span className="text-xs font-bold uppercase text-white">{analyst.analysis}</span>
                </div>
              </div>

              <div className="border-t border-[#181B22] px-4 py-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Forecast Accuracy:</span>
                  <span className="text-xs font-bold uppercase text-[#2EBD85]">{analyst.forecastAccuracy}</span>
                </div>
              </div>

              <div className="border-t border-[#181B22] p-4">
                <p className="text-2xl font-bold text-white">{analyst.price}</p>
              </div>

              <div className="flex items-center gap-2 p-4">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 py-2 text-[15px] font-bold text-white">
                  <ShoppingCart className="h-5 w-5" />
                  Buy
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-6 py-2 text-[15px] font-bold text-white backdrop-blur-[50px]">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </button>
              </div>

              <FavoriteStarButton
                pressed={isAnalystFavorite}
                onToggle={handleToggleFavoriteAnalyst}
                className="absolute right-4 top-4"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Metrics Cards */}
            <div className="flex gap-6">
              <div className="flex flex-1 flex-col items-center gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Success Rate</span>
                  <svg className="h-4 w-4 text-[#B0B0B0]" viewBox="0 0 16 16" fill="none">
                    <path d="M6.97061 1.75975C7.53867 1.19076 8.46067 1.19076 9.02874 1.75975L9.70167 2.43375C9.97467 2.70727 10.3454 2.86082 10.7319 2.8605L11.6843 2.85972C12.4883 2.85907 13.1403 3.51102 13.1396 4.31505L13.1389 5.26745C13.1385 5.65393 13.2921 6.02464 13.5656 6.29771L14.2396 6.97061C14.8086 7.53867 14.8086 8.46067 14.2396 9.02874L13.5656 9.70167C13.2921 9.97467 13.1385 10.3454 13.1389 10.7319L13.1396 11.6843C13.1403 12.4883 12.4883 13.1403 11.6843 13.1396L10.7319 13.1389C10.3454 13.1385 9.97467 13.2921 9.70167 13.5656L9.02874 14.2396C8.46067 14.8086 7.53867 14.8086 6.97061 14.2396L6.29771 13.5656C6.02464 13.2921 5.65393 13.1385 5.26745 13.1389L4.31505 13.1396C3.51102 13.1403 2.85907 12.4883 2.85972 11.6843L2.8605 10.7319C2.86082 10.3454 2.70727 9.97467 2.43375 9.70167L1.75975 9.02874C1.19076 8.46067 1.19076 7.53867 1.75975 6.97061L2.43375 6.29771C2.70727 6.02464 2.86082 5.65393 2.8605 5.26745L2.85972 4.31505C2.85907 3.51102 3.51102 2.85907 4.31505 2.85972L5.26745 2.8605C5.65393 2.86082 6.02464 2.70727 6.29771 2.43375L6.97061 1.75975Z" stroke="currentColor" />
                    <path d="M6.66699 6.00033C6.66699 5.26395 7.26393 4.66699 8.00033 4.66699C8.73673 4.66699 9.33366 5.26395 9.33366 6.00033C9.33366 6.26576 9.25613 6.51308 9.12239 6.72086C8.72393 7.34013 8.00033 7.93059 8.00033 8.66699V9.00033" stroke="currentColor" strokeLinecap="round" />
                    <path d="M7.99512 11.333H8.00112" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Pie chart placeholder */}
                <svg className="h-24 w-24" viewBox="0 0 96 96">
                  <path d="M-7.62939e-06 48C-7.62939e-06 21.4903 21.4903 -7.62939e-06 48 -7.62939e-06C74.5097 -7.62939e-06 96 21.4903 96 48C96 74.5097 74.5097 96 48 96C21.4903 96 -7.62939e-06 74.5097 -7.62939e-06 48ZM79.2 48C79.2 30.7687 65.2313 16.8 48 16.8C30.7687 16.8 16.8 30.7687 16.8 48C16.8 65.2313 30.7687 79.2 48 79.2C65.2313 79.2 79.2 65.2313 79.2 48Z" fill="#A06AFF" />
                  <path d="M-7.62939e-06 48C-7.62939e-06 60.2195 4.66032 71.9789 13.0309 80.8811C21.4015 89.7832 32.8522 95.1578 45.0485 95.9092C57.2448 96.6605 69.2686 92.7321 78.6686 84.9247C88.0686 77.1174 94.1371 66.0189 95.637 53.8918L78.9641 51.8297C77.9891 59.7123 74.0446 66.9263 67.9346 72.0011C61.8246 77.0759 54.0092 79.6293 46.0815 79.141C38.1539 78.6526 30.711 75.1591 25.2701 69.3727C19.8292 63.5863 16.8 55.9426 16.8 48H-7.62939e-06Z" fill="#6AA5FF" />
                  <path d="M-7.62939e-06 48C-7.62939e-06 55.3304 1.67893 62.5635 4.90804 69.1444C8.13715 75.7252 12.8306 81.4791 18.6285 85.9646C24.4263 90.4502 31.1745 93.5482 38.3555 95.0211C45.5364 96.494 52.9593 96.3026 60.0548 94.4616L55.8356 78.2001C51.2235 79.3967 46.3987 79.5211 41.731 78.5637C37.0634 77.6063 32.6771 75.5926 28.9085 72.677C25.1399 69.7614 22.0891 66.0214 19.9902 61.7438C17.8913 57.4663 16.8 52.7648 16.8 48H-7.62939e-06Z" fill="#FFA800" />
                </svg>

                <p className="text-center text-xs font-bold text-white">{analyst.successRate} profitable transactions</p>
              </div>

              <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 p-4 backdrop-blur-[50px]">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold uppercase text-[#B0B0B0]">Average Return</span>
                  <svg className="h-4 w-4 text-[#B0B0B0]" viewBox="0 0 16 16" fill="none">
                    <path d="M6.97061 1.75975C7.53867 1.19076 8.46067 1.19076 9.02874 1.75975L9.70167 2.43375C9.97467 2.70727 10.3454 2.86082 10.7319 2.8605L11.6843 2.85972C12.4883 2.85907 13.1403 3.51102 13.1396 4.31505L13.1389 5.26745C13.1385 5.65393 13.2921 6.02464 13.5656 6.29771L14.2396 6.97061C14.8086 7.53867 14.8086 8.46067 14.2396 9.02874L13.5656 9.70167C13.2921 9.97467 13.1385 10.3454 13.1389 10.7319L13.1396 11.6843C13.1403 12.4883 12.4883 13.1403 11.6843 13.1396L10.7319 13.1389C10.3454 13.1385 9.97467 13.2921 9.70167 13.5656L9.02874 14.2396C8.46067 14.8086 7.53867 14.8086 6.97061 14.2396L6.29771 13.5656C6.02464 13.2921 5.65393 13.1385 5.26745 13.1389L4.31505 13.1396C3.51102 13.1403 2.85907 12.4883 2.85972 11.6843L2.8605 10.7319C2.86082 10.3454 2.70727 9.97467 2.43375 9.70167L1.75975 9.02874C1.19076 8.46067 1.19076 7.53867 1.75975 6.97061L2.43375 6.29771C2.70727 6.02464 2.86082 5.65393 2.8605 5.26745L2.85972 4.31505C2.85907 3.51102 3.51102 2.85907 4.31505 2.85972L5.26745 2.8605C5.65393 2.86082 6.02464 2.70727 6.29771 2.43375L6.97061 1.75975Z" stroke="currentColor" />
                    <path d="M6.66699 6.00033C6.66699 5.26395 7.26393 4.66699 8.00033 4.66699C8.73673 4.66699 9.33366 5.26395 9.33366 6.00033C9.33366 6.26576 9.25613 6.51308 9.12239 6.72086C8.72393 7.34013 8.00033 7.93059 8.00033 8.66699V9.00033" stroke="currentColor" strokeLinecap="round" />
                    <path d="M7.99512 11.333H8.00112" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <p className="text-center text-[31px] font-bold text-[#2EBD85]">{analyst.averageReturn}</p>
                <p className="text-center text-xs font-bold text-white">Average return per transaction</p>
              </div>
            </div>

            {/* Portfolio Gain */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h3 className="text-[19px] font-bold text-[#A06AFF]">Portfolio Gain</h3>
              </div>
              <div className="flex flex-col gap-0">
                {[
                  { label: "1-Month Return", value: "+0.14%" },
                  { label: "6-Month Return", value: "+0.14%" },
                  { label: "12-Month Return", value: "+0.14%" },
                  { label: "YTD Return", value: "+0.14%" },
                  { label: "Total Return", value: "+0.14%" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4"
                  >
                    <span className="text-[15px] font-medium text-[#B0B0B0]">{item.label}</span>
                    <div className="rounded bg-[#1C3430] px-1 py-0.5">
                      <span className="text-xs font-bold text-[#2EBD85]">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Trade */}
            <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h3 className="text-[19px] font-bold text-[#A06AFF]">Best Trade</h3>
              </div>
              <div className="flex flex-col gap-0">
                {[
                  { label: "Asset", value: "Broadcom (AVGO)", color: "#6AA5FF" },
                  { label: "Opened at", value: "April 06, 2020", color: "#FFF" },
                  { label: "Closed at", value: "-", color: "#FFF" },
                  { label: "Gain", value: "+718.00%", color: "#2EBD85", isBadge: true },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4"
                  >
                    <span className="text-[15px] font-medium text-[#B0B0B0]">{item.label}</span>
                    {item.isBadge ? (
                      <div className="rounded bg-[#1C3430] px-1 py-0.5">
                        <span className="text-xs font-bold" style={{ color: item.color }}>
                          {item.value}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[15px] font-bold" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="flex items-center gap-2 p-4">
                <img
                  src={analyst.avatar}
                  alt={analyst.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-white">{analyst.name}</span>
                    <div className="rounded bg-gradient-to-r from-[#A06AFF] to-[#482090] px-1">
                      <span className="text-xs font-bold text-white">PRO</span>
                    </div>
                  </div>
                  <button className="flex h-[26px] w-20 items-center justify-center rounded-lg bg-gradient-to-r from-[#A06AFF] to-[#482090] text-xs font-bold text-white">
                    Follow
                  </button>
                </div>
              </div>

              {analyst.communityLink && (
                <div className="px-4 pb-4">
                  <p className="text-[15px] font-medium text-[#B0B0B0]">
                    Join our 10k+ community:{" "}
                    <a href={analyst.communityLink} target="_blank" rel="noreferrer" className="text-[#A06AFF] underline">
                      example.com
                    </a>
                  </p>
                </div>
              )}

              {analyst.bio && (
                <div className="px-4">
                  <p className="text-[15px] font-medium text-[#B0B0B0]">{analyst.bio}</p>
                </div>
              )}

              {analyst.socials && analyst.socials.length > 0 && (
                <div className="flex items-center gap-3 px-4 pt-4">
                  <span className="text-[15px] font-medium text-[#B0B0B0]">Also on:</span>
                  <div className="flex items-center gap-3">
                    {analyst.socials.map((social, idx) => (
                      <div key={idx} className="h-4 w-4 rounded-full bg-white" />
                    ))}
                  </div>
                </div>
              )}

              {analyst.tags && analyst.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-4">
                  {analyst.tags.map((tag, idx) => (
                    <div key={idx} className="rounded bg-[#2E2744] px-2 py-0.5">
                      <span className="text-xs font-bold uppercase text-white">{tag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
                <div className="border-b border-[#181B22] p-4">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-[19px] font-bold text-[#A06AFF]">Reviews</h3>
                    <div className="flex items-center gap-4">
                      <p className="text-[31px] font-bold text-[#A06AFF]">{analyst.averageRating}</p>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-0.5">{renderStars(analyst.averageRating ?? 0)}</div>
                        <p className="text-xs font-bold text-[#B0B0B0]">Based on {analyst.totalReviews} reviews</p>
                      </div>
                    </div>
                  </div>
                </div>

                {displayedReviews.map((review) => (
                  <div key={review.id} className="flex flex-col gap-2 border-b border-[#181B22] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={review.avatar} alt={review.author} className="h-11 w-11 rounded-full" />
                        <div>
                          <p className="text-[15px] font-bold text-white">{review.author}</p>
                          <p className="text-xs font-bold text-[#B0B0B0]">{review.postedAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    </div>
                    <h4 className="text-[15px] font-bold text-white">{review.title}</h4>
                    <p className="text-[15px] font-medium text-[#B0B0B0]">{review.message}</p>
                  </div>
                ))}

                {reviews.length > 3 && !showAllReviews && (
                  <div className="flex justify-center p-4">
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-4 py-2 text-[15px] font-bold text-white backdrop-blur-[50px]"
                    >
                      Show More Reviews
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C1014]/50 backdrop-blur-[50px]">
              <div className="border-b border-[#181B22] p-4">
                <h3 className="text-[19px] font-bold text-[#A06AFF]">Disclaimer</h3>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-medium text-[#B0B0B0]">
                  The information and publications are not meant to be, and do not constitute, financial, investment, trading, or other types of advice or recommendations supplied or endorsed by TyrianTrade. Read more in the{" "}
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
    </div>
  );
};

export default AnalystDetailLanding;
