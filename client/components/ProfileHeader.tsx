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

    const dataPoints = [
      progressPercent * 0.3,
      progressPercent * 0.45,
      progressPercent * 0.65,
      progressPercent * 0.75,
      progressPercent * 0.88,
      progressPercent * 0.92,
      progressPercent * 0.95,
      progressPercent * 0.98,
      progressPercent * 1.0,
      progressPercent * 0.96,
      progressPercent * 0.90,
      progressPercent * 0.82,
      progressPercent * 0.75,
      progressPercent * 0.70,
    ];

    const chartHeight = 120;
    const chartWidth = 300;
    const padding = 8;
    const maxValue = Math.max(...dataPoints, 100);

    const points = dataPoints.map((value, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (chartWidth - padding * 2);
      const y = chartHeight - padding - (value / maxValue) * (chartHeight - padding * 2);
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `M ${points[0]} L ${points.join(' L ')} L ${padding + (dataPoints.length - 1) / (dataPoints.length - 1) * (chartWidth - padding * 2)},${chartHeight - padding} L ${padding},${chartHeight - padding} Z`;

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

                {/* Time Period Toggle */}
                <div className="flex gap-1 bg-[#181B22] p-1 rounded-full w-fit">
                  {['Day', 'Week', 'Month', 'Year'].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                        period === 'Day'
                          ? 'bg-white text-black'
                          : 'text-[#B0B0B0] hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

                {/* Graph */}
                <div className="relative bg-[#0C1014]/50 rounded-xl p-4">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <clipPath id="chart-clip">
                        <rect x="0" y="0" width={(chartWidth * progressPercent) / 100} height={chartHeight} />
                      </clipPath>
                      <linearGradient
                        id="gradientFill"
                        x1="1"
                        y1="1"
                        x2="1"
                        y2={chartHeight}
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#A06AFF" stopOpacity="0.32" />
                        <stop offset="1" stopColor="#181A20" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient
                        id="strokeGradient"
                        x1="1"
                        y1="1"
                        x2="1"
                        y2={chartHeight}
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#C6A6FF" />
                        <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>

                    {/* Filled area (completed progress) */}
                    <g clipPath="url(#chart-clip)">
                      <path d={areaD} fill="url(#gradientFill)" />
                      <path
                        d={pathD}
                        stroke="url(#strokeGradient)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* Outline only (remaining progress) */}
                    <path
                      d={pathD}
                      stroke="#3A3F4D"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.5"
                    />
                  </svg>
                  <div className="flex justify-between text-xs text-[#B0B0B0] mt-2 px-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, dataPoints.length).map((day) => (
                      <span key={day}>{day}</span>
                    ))}
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
