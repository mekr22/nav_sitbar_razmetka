import { FC, useMemo, useState } from "react";
import { Calendar, Edit } from "lucide-react";
import "./ProfileHeader.css";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { AdminStatsModal } from "./AdminStatsModal";
import { RightPanelLayout2, RightPanelLayout3, RightPanelLayout4, RightPanelLayout5 } from "./ProfileHeaderLayouts";
import { Trophy, Target, Flame, Star, TrendingUp, Zap } from "lucide-react";

interface ProfileHeaderProps {
  user?: {
    email?: string;
    user_metadata?: {
      username?: string;
    };
  };
  layoutTab?: 1 | 2 | 3 | 4 | 5;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, layoutTab = 1 }) => {
  const { stats, updateStatistics, loading: statsLoading } = useUserStatistics();
  const [showStatsModal, setShowStatsModal] = useState(false);

  const username = useMemo(() => {
    return (
      user?.user_metadata?.username ||
      user?.email?.split("@")[0] ||
      "User"
    );
  }, [user]);

  const initials = useMemo(() => {
    const parts = username.split("_");
    return parts.map((p) => p.charAt(0).toUpperCase()).join("");
  }, [username]);

  const joinDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Shared profile card for all layouts
  const profileCard = (
    <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 lg:col-span-3 overflow-hidden min-w-0">
      <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500" />
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col items-center sm:items-start gap-4">
          <div className="-mt-16 sm:-mt-20 lg:-mt-24 mb-4 sm:mb-2">
            <div className="flex h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-3xl sm:text-4xl font-bold text-white border-4 border-[#0C1014]">
              {initials}
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-1 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{username}</h2>
            <p className="text-xs sm:text-sm text-[#B0B0B0]">@{username}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#A06AFF] bg-[#A06AFF]/10 px-2 py-1 text-xs font-semibold text-[#A06AFF] w-fit">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-[#A06AFF] text-white text-[10px] font-bold">
                  4
                </span>
                TIER
              </span>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#B0B0B0]">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                Joined {joinDate}
              </div>
            </div>
            <div className="flex gap-4 text-xs sm:text-sm pt-2">
              <span className="text-[#B0B0B0]">
                <span className="text-white font-semibold">0</span> Following
              </span>
              <span className="text-[#B0B0B0]">
                <span className="text-white font-semibold">0</span> Followers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout 1: Default grid layout
  if (layoutTab === 1) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 w-full">
        {profileCard}

        {/* Right Sidebar - Advanced Level & Achievements (2 columns) */}
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-4 sm:p-6 lg:col-span-2 space-y-6">
          {/* Advanced Level Section */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A0FF75] flex-shrink-0">
                  <span className="text-xl font-bold text-black">{stats?.current_level || 1}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {stats?.level_info?.name || 'Newbie'}
                  </h3>
                  <p className="text-xs text-[#B0B0B0]">Level {stats?.current_level || 1}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-lg">⭐</span>
                <span className="font-bold text-white">4.8</span>
                <span className="text-[#B0B0B0]">(156)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#B0B0B0]">
                  {stats?.total_xp || 0} / {stats?.level_info?.nextLevelXP || 100} XP
                </p>
                <p className="text-[#A0FF75] font-semibold">{stats?.level_info?.progressPercent || 0}%</p>
              </div>
              <div className="h-2 bg-[#181B22] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A0FF75] rounded-full transition-all"
                  style={{ width: `${stats?.level_info?.progressPercent || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#B0B0B0]">
                {(stats?.level_info?.nextLevelXP || 100) - (stats?.total_xp || 0)} XP to reach Level{' '}
                {(stats?.current_level || 1) + 1}
              </p>
              <button
                onClick={() => setShowStatsModal(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-2xl hover:bg-[#A06AFF]/30 transition-colors"
              >
                <Edit className="h-3 w-3" />
                Edit Statistics
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#181B22]"></div>

          {/* Achievements Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">Achievements (4)</h3>
              <span className="text-xs text-[#B0B0B0]">2 in Progress</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-white font-semibold">Verified Trader</p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-white font-semibold">Sharp Shooter</p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-white font-semibold">On Fire</p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-white font-semibold">Top Rated</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#181B22] flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs sm:text-sm text-white font-semibold">Bull Master</p>
                    <span className="text-xs text-[#A06AFF] font-semibold">72%</span>
                  </div>
                  <div className="h-1.5 bg-[#181B22] rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-[#A06AFF] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#181B22] flex-shrink-0">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs sm:text-sm text-white font-semibold">Influencer</p>
                    <span className="text-xs text-[#A06AFF] font-semibold">45%</span>
                  </div>
                  <div className="h-1.5 bg-[#181B22] rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-[#A06AFF] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminStatsModal
          open={showStatsModal}
          onOpenChange={setShowStatsModal}
          stats={stats}
          onSave={updateStatistics}
          loading={statsLoading}
        />
      </div>
    );
  }

  // Layout 2: Horizontal achievements panel
  if (layoutTab === 2) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 w-full">
        {profileCard}
        <RightPanelLayout2 stats={stats} onEditClick={() => setShowStatsModal(true)} />
        <AdminStatsModal
          open={showStatsModal}
          onOpenChange={setShowStatsModal}
          stats={stats}
          onSave={updateStatistics}
          loading={statsLoading}
        />
      </div>
    );
  }

  // Layout 3: Minimalist compact with integrated graph
  if (layoutTab === 3) {
    const progressPercent = stats?.level_info?.progressPercent || 0;
    const currentXP = stats?.total_xp || 0;
    const nextLevelXP = stats?.level_info?.nextLevelXP || 100;
    const xpRemaining = nextLevelXP - currentXP;

    // Use exact Figma path for realistic trading graph
    const chartWidth = 652;
    const chartHeight = 221;
    const graphStartX = 8.75;  // Where the graph begins
    const graphEndX = 642.75;  // Where the graph ends
    const graphRangeX = graphEndX - graphStartX;

    // Calculate badge position on the X-axis based on progress percentage
    const badgeXInSVG = graphStartX + (progressPercent / 100) * graphRangeX;
    const badgeXPercent = (badgeXInSVG / chartWidth) * 100;

    const pathD = "M8.75 208.213L16.204 211.302L20.7591 205.123L24.9002 207.33L26.1426 203.8L29.4554 205.123L33.5965 201.593L37.3235 203.8L49.3326 184.382L50.9891 185.706L56.3725 175.997L58.0289 179.528L60.0994 177.321L62.17 179.528L63.8264 175.997L66.7252 178.645L69.6239 175.997L72.1086 177.321C73.3509 173.35 75.8356 165.318 75.8356 164.965C75.8356 164.612 75.8356 156.58 75.8356 152.608L79.1484 156.58L81.6331 152.608C81.6331 153.491 81.6331 154.903 81.6331 153.491C81.6331 152.079 84.3938 142.311 85.7742 137.604L89.087 150.402L93.6422 139.369L96.9551 138.487L98.1974 130.984L100.682 132.308L101.924 127.895L105.237 135.839L106.894 145.106L108.55 136.721L110.207 141.576L111.863 153.491L113.934 138.487L117.661 149.078L122.63 130.984L126.771 134.515L128.427 130.102L130.498 133.632L133.811 129.219L138.366 144.224L140.851 136.721L144.578 139.369L147.476 129.219L148.305 134.515L151.203 130.102L155.344 146.871L157.415 142.458L158.243 146.871L161.97 144.224L163.212 152.167L164.869 145.989L168.596 142.458L170.252 145.106L171.495 139.369L174.807 146.871L177.292 145.989L181.019 152.167L183.504 145.989L186.817 160.993L190.129 159.669V150.402L192.614 147.754L198.826 157.021L201.725 149.078L202.967 157.021L205.452 156.139L207.936 152.167L209.593 156.139L211.249 144.224L212.491 146.871L214.562 141.576C215.942 144.518 218.703 149.872 218.703 147.754C218.703 145.636 219.531 137.163 219.945 133.191L225.329 141.576L227.813 142.458L228.642 140.693H231.126L234.439 144.224L237.338 145.106L238.166 140.693L240.237 143.341L245.62 142.458L248.933 135.839L252.246 142.458H253.902L255.145 139.369L258.457 145.989L260.114 142.458L263.013 149.078L269.638 147.754L272.123 161.876L274.193 154.373L277.92 152.167L281.233 165.406L283.304 160.993L287.859 167.613C289.654 164.523 293.325 158.61 293.657 159.669C293.988 160.728 297.936 168.642 299.868 172.467L302.353 168.937L303.595 174.232H306.08L308.565 169.819L309.807 173.35L316.847 164.523L318.917 152.167L321.816 155.697L323.887 150.402L328.442 145.989C330.65 150.255 335.067 158.698 335.067 158.345C335.067 157.992 336.172 152.902 336.724 150.402H339.209L340.451 149.078L345.006 159.669L346.662 157.021L348.733 165.406L350.804 167.613L353.288 183.5L355.359 177.763L357.843 179.528L359.914 162.758L360.742 165.406L363.227 164.523L364.883 169.819L365.297 162.758L368.61 159.669L371.923 169.819L374.408 163.641L377.307 168.937L379.377 162.758H381.033L382.276 157.021L382.69 159.228L385.175 149.078H390.144L392.214 160.552L393.871 162.317L395.527 160.552L400.497 166.73L402.567 164.082L404.224 172.026L406.294 170.702L409.607 176.88L412.092 176.439L414.162 173.791L417.061 165.406L420.788 168.937L422.444 160.552L427.414 163.641L430.726 152.167L437.766 149.078L439.837 152.167L441.079 147.313L443.15 150.843L446.049 140.252L448.947 139.81L451.432 149.078L456.401 153.491L459.3 148.195H460.956L461.785 145.989H466.754L468.824 150.843L471.723 144.224L474.208 145.989L474.622 139.369L479.591 130.102L485.389 132.308L486.217 128.778L491.6 136.28L492.429 131.867L494.499 133.632L499.883 128.778L501.953 115.539L508.165 125.247L513.134 127.454L515.205 125.247L516.861 108.037L519.76 106.271L522.659 104.947L525.143 78.0278L528.456 66.1126L530.527 74.9387L530.941 63.9061L535.082 66.5539L540.465 53.3148L543.778 30.367L547.091 33.8974L550.404 48.0192L552.474 14.9213L554.959 30.367L556.201 28.6018L557.444 31.6909L559.928 25.5126L562.827 36.9865L564.898 28.6018L565.726 44.4887L568.21 36.9865L572.352 38.7518L573.594 45.8126L577.321 20.217L578.563 25.5126L580.22 22.4235H582.29L588.502 8.30176L590.572 36.9865L594.713 40.0757L598.026 51.1083L600.511 40.517C601.339 43.7532 602.996 50.3139 602.996 50.667C602.996 51.02 604.928 41.3996 605.894 36.5452L608.379 41.8409L611.692 20.6583L617.904 15.8039L620.802 18.4518L622.459 12.7148L627.428 53.7561L629.499 49.3431L633.64 50.667L637.367 30.367L642.75 18.4518";

    // Create area path for fill - close the path at the bottom
    const areaD = pathD + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

    return (
      <div className="w-full">
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 lg:col-span-5 overflow-hidden">
          {/* Gradient header */}
          <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500" />

          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8">
              {/* Left: Profile Info */}
              <div className="flex flex-col items-center sm:items-start gap-4 flex-shrink-0">
                <div className="-mt-16 sm:-mt-20 lg:-mt-24 mb-4 sm:mb-2">
                  <div className="flex h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-3xl sm:text-4xl font-bold text-white border-4 border-[#0C1014]">
                    {initials}
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{username}</h2>
                  <p className="text-xs sm:text-sm text-[#B0B0B0]">@{username}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#A06AFF] bg-[#A06AFF]/10 px-2 py-1 text-xs font-semibold text-[#A06AFF] w-fit">
                      <span className="flex h-4 w-4 items-center justify-center rounded bg-[#A06AFF] text-white text-[10px] font-bold">
                        4
                      </span>
                      TIER
                    </span>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-[#B0B0B0]">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      Joined {joinDate}
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs sm:text-sm pt-2">
                    <span className="text-[#B0B0B0]">
                      <span className="text-white font-semibold">0</span> Following
                    </span>
                    <span className="text-[#B0B0B0]">
                      <span className="text-white font-semibold">0</span> Followers
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Level & Graph */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Level Header */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#C77DFF] flex-shrink-0">
                    <span className="text-3xl font-bold text-white">{stats?.current_level || 1}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h3>
                    <p className="text-xs text-[#B0B0B0]">Level {stats?.current_level || 1}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[#C77DFF] font-bold">{progressPercent}%</p>
                    <p className="text-xs text-[#B0B0B0]">Progress</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#A06AFF] font-bold">{xpRemaining}</p>
                    <p className="text-xs text-[#B0B0B0]">XP left</p>
                  </div>
                </div>


                {/* Graph */}
                <div className="relative rounded-xl p-4 overflow-visible">
                  <div className="relative w-full h-40">
                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="w-full h-full"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <clipPath id="chart-progress-clip-main">
                          <rect x="0" y="0" width={(chartWidth * progressPercent) / 100} height={chartHeight} />
                        </clipPath>
                        <clipPath id="chart-unfilled-clip-main">
                          <rect x={(chartWidth * progressPercent) / 100} y="0" width={chartWidth} height={chartHeight} />
                        </clipPath>
                        <linearGradient
                          id="filled-gradient-main"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                          gradientUnits="objectBoundingBox"
                        >
                          <stop stopColor="#A06AFF" stopOpacity="0.5" />
                          <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
                        </linearGradient>
                        <filter id="glow-main" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Unfilled area (gray) - follows graph curve */}
                      <g clipPath="url(#chart-unfilled-clip-main)">
                        <path
                          d={areaD}
                          fill="#2A2F3A"
                          opacity="0.4"
                        />
                      </g>

                      {/* Filled area with gradient - follows graph curve and structure */}
                      <g clipPath="url(#chart-progress-clip-main)">
                        <path
                          d={areaD}
                          fill="url(#filled-gradient-main)"
                        />
                        <path
                          d={areaD}
                          fill="#A06AFF"
                          opacity="0.2"
                        />
                      </g>

                      {/* Full outline - always visible at 100% */}
                      <path
                        d={pathD}
                        stroke="#A06AFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        filter="url(#glow-main)"
                      />
                    </svg>

                    {/* Progress Badge at Bottom of Graph X-axis */}
                    <div
                      className="absolute pointer-events-none transform -translate-x-1/2"
                      style={{
                        left: `${badgeXPercent}%`,
                        bottom: '-10px'
                      }}
                    >
                      <div className="bg-[#A06AFF] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg shadow-[#A06AFF]/50 whitespace-nowrap border-2 border-[#C6A6FF]">
                        {progressPercent}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* XP Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50">
                    <p className="text-xs text-[#B0B0B0] mb-1">Current</p>
                    <p className="text-sm font-bold text-white">{currentXP}</p>
                  </div>
                  <div className="p-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50">
                    <p className="text-xs text-[#B0B0B0] mb-1">Next Level</p>
                    <p className="text-sm font-bold text-white">{nextLevelXP}</p>
                  </div>
                  <div className="p-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50">
                    <p className="text-xs text-[#B0B0B0] mb-1">Remaining</p>
                    <p className="text-sm font-bold text-[#C77DFF]">{xpRemaining}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowStatsModal(true)}
                  className="w-full px-3 py-2 text-xs font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-xl hover:bg-[#A06AFF]/30 transition-colors"
                >
                  <Edit className="h-3 w-3 inline mr-2" />
                  Edit Statistics
                </button>
              </div>
            </div>
          </div>
        </div>

        <AdminStatsModal
          open={showStatsModal}
          onOpenChange={setShowStatsModal}
          stats={stats}
          onSave={updateStatistics}
          loading={statsLoading}
        />
      </div>
    );
  }

  // Layout 4: Premium glass effect
  if (layoutTab === 4) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 w-full">
        {profileCard}
        <RightPanelLayout4 stats={stats} onEditClick={() => setShowStatsModal(true)} />
        <AdminStatsModal
          open={showStatsModal}
          onOpenChange={setShowStatsModal}
          stats={stats}
          onSave={updateStatistics}
          loading={statsLoading}
        />
      </div>
    );
  }

  // Layout 5: Dark tech style
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 w-full">
      {profileCard}
      <RightPanelLayout5 stats={stats} onEditClick={() => setShowStatsModal(true)} />
      <AdminStatsModal
        open={showStatsModal}
        onOpenChange={setShowStatsModal}
        stats={stats}
        onSave={updateStatistics}
        loading={statsLoading}
      />
    </div>
  );
};

export default ProfileHeader;
