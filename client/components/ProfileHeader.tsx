import { FC, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import "./ProfileHeader.css";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { AdminStatsModal } from "./AdminStatsModal";
import { RightPanelLayout2, RightPanelLayout3, RightPanelLayout4, RightPanelLayout5 } from "./ProfileHeaderLayouts";

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

  // Render left profile card (SAME FOR ALL LAYOUTS)
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

  // Layout 2: Horizontal achievements
  if (layoutTab === 2) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 w-full" style={{ position: 'relative' }}>
        {/* Profile Card - Left Side (SAME AS LAYOUT 1) */}
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 lg:col-span-3 overflow-hidden min-w-0">
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
            </div>
          </div>

          {/* Achievements in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">Achievements</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-white font-semibold">Verified</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-white font-semibold">Shooter</p>
                </div>
              </div>
            </div>

            {/* Column 2 - Progress */}
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">In Progress</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-white font-semibold">Bull Master</p>
                  <div className="mt-1 h-1.5 bg-[#181B22] rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-[#A06AFF] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white font-semibold">Influencer</p>
                  <div className="mt-1 h-1.5 bg-[#181B22] rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-[#A06AFF] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowStatsModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-2xl hover:bg-[#A06AFF]/30 transition-colors"
          >
            <Edit className="h-3 w-3" />
            Edit Statistics
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 overflow-hidden">
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

  // Layout 3: Compact side-by-side
  if (layoutTab === 3) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Profile Card - Compact */}
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 overflow-hidden lg:flex-1">
          <div className="h-24 sm:h-32 bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500" />
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col items-center gap-3">
              <div className="-mt-12 sm:-mt-16">
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-2xl font-bold text-white border-4 border-[#0C1014]">
                  {initials}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-lg font-bold text-white">{username}</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#A06AFF] bg-[#A06AFF]/10 px-2 py-0.5 text-xs font-semibold text-[#A06AFF]">
                  <span className="flex h-3 w-3 items-center justify-center rounded bg-[#A06AFF] text-white text-[8px] font-bold">4</span>
                  TIER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel - Vertical */}
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-4 sm:p-6 space-y-4 lg:flex-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats?.current_level || 1}</p>
                <p className="text-xs text-[#B0B0B0]">{stats?.level_info?.name || 'Newbie'}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#A0FF75]">{stats?.level_info?.progressPercent || 0}%</p>
                <p className="text-xs text-[#B0B0B0]">{stats?.total_xp || 0} XP</p>
              </div>
            </div>
            <div className="h-2 bg-[#181B22] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A0FF75] rounded-full transition-all"
                style={{ width: `${stats?.level_info?.progressPercent || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#181B22]">
            <p className="text-xs uppercase text-[#B0B0B0] mb-2">Quick Stats</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-2">
                <p className="text-xs text-[#B0B0B0]">Verified</p>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8B5CF6] mt-1">
                  <Trophy className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-2">
                <p className="text-xs text-[#B0B0B0]">Shooter</p>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8B5CF6] mt-1">
                  <Target className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowStatsModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-2xl hover:bg-[#A06AFF]/30 transition-colors"
          >
            <Edit className="h-3 w-3" />
            Edit
          </button>
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

  // Layout 4: Circular achievement display
  if (layoutTab === 4) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {/* Main Level Card - Centered */}
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-8 w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#A0FF75] to-[#482090]">
              <span className="text-5xl font-bold text-white">{stats?.current_level || 1}</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h2>
              <p className="text-[#B0B0B0] mt-2">{stats?.total_xp || 0} / {stats?.level_info?.nextLevelXP || 100} XP</p>
            </div>
            <div className="w-full">
              <div className="h-3 bg-[#181B22] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#A0FF75] to-[#A06AFF] rounded-full transition-all"
                  style={{ width: `${stats?.level_info?.progressPercent || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#B0B0B0] mt-2">{stats?.level_info?.progressPercent || 0}% to next level</p>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div>
          <h3 className="text-center text-sm font-bold text-white uppercase mb-4">Achievements (4)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#181B22] bg-[#0C1014]/50 hover:bg-[#0C1014] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5CF6]">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-semibold text-white text-center">Verified</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#181B22] bg-[#0C1014]/50 hover:bg-[#0C1014] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5CF6]">
                <Target className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-semibold text-white text-center">Shooter</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#181B22] bg-[#0C1014]/50 hover:bg-[#0C1014] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5CF6]">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-semibold text-white text-center">On Fire</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#181B22] bg-[#0C1014]/50 hover:bg-[#0C1014] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5CF6]">
                <Star className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-semibold text-white text-center">Top Rated</p>
            </div>
          </div>
        </div>

        {/* Profile Card Below */}
        <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 overflow-hidden max-w-sm mx-auto w-full">
          <div className="h-20 bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500" />
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="-mt-10">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-2xl font-bold text-white border-4 border-[#0C1014]">
                  {initials}
                </div>
              </div>
              <h2 className="text-lg font-bold text-white text-center">{username}</h2>
              <p className="text-xs text-[#B0B0B0]">@{username}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowStatsModal(true)}
          className="mx-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-2xl hover:bg-[#A06AFF]/30 transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit Statistics
        </button>

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

  // Layout 5: Minimal card layout
  if (layoutTab === 5) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Profile Mini Card */}
        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-xl font-bold text-white">
            {initials}
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-white">{username}</h3>
            <p className="text-xs text-[#B0B0B0]">@{username}</p>
            <span className="inline-block mt-2 text-xs font-semibold text-[#A06AFF] bg-[#A06AFF]/10 px-2 py-1 rounded-full">TIER 4</span>
          </div>
        </div>

        {/* Level Card */}
        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4">
          <p className="text-xs uppercase text-[#B0B0B0] mb-2">Level</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold text-white">{stats?.current_level || 1}</span>
            <span className="text-sm text-[#A0FF75]">{stats?.level_info?.name || 'Newbie'}</span>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-[#181B22] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A0FF75] rounded-full transition-all"
                style={{ width: `${stats?.level_info?.progressPercent || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#B0B0B0]">{stats?.total_xp || 0} XP</p>
          </div>
        </div>

        {/* Stats Quick View */}
        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4">
          <p className="text-xs uppercase text-[#B0B0B0] mb-3">Quick Stats</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#A06AFF]" />
              <div>
                <p className="text-xs text-[#B0B0B0]">Verified</p>
                <p className="text-sm font-bold text-white">Yes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#A06AFF]" />
              <div>
                <p className="text-xs text-[#B0B0B0]">Shooter</p>
                <p className="text-sm font-bold text-white">72%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Cards */}
        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4">
          <p className="text-xs uppercase text-[#B0B0B0] mb-2">Fire</p>
          <div className="flex items-end gap-2">
            <Flame className="h-6 w-6 text-orange-400" />
            <div>
              <p className="text-xs text-[#B0B0B0]">On Fire</p>
              <p className="text-lg font-bold text-orange-400">Active</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4">
          <p className="text-xs uppercase text-[#B0B0B0] mb-2">Rating</p>
          <div className="flex items-end gap-2">
            <Star className="h-6 w-6 text-[#FFB800]" />
            <div>
              <p className="text-xs text-[#B0B0B0]">Top Rated</p>
              <p className="text-lg font-bold text-white">4.8</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 flex flex-col justify-center items-center text-center gap-2">
          <TrendingUp className="h-6 w-6 text-[#A0FF75]" />
          <div>
            <p className="text-xs text-[#B0B0B0]">Master</p>
            <p className="text-sm font-bold text-white">Bull 72%</p>
          </div>
        </div>

        {/* Edit button - full width */}
        <div className="col-span-full">
          <button
            onClick={() => setShowStatsModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-2xl hover:bg-[#A06AFF]/30 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Statistics
          </button>
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

  // Layout 1: Default grid layout
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 w-full">
      {/* Profile Card - Left Side (3 columns) */}
      <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 lg:col-span-3 overflow-hidden min-w-0">
        {/* Header Background Banner */}
        <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500" />

        {/* Profile Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          {/* Avatar positioned over banner */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            {/* Avatar - Overlapped with banner */}
            <div className="-mt-16 sm:-mt-20 lg:-mt-24 mb-4 sm:mb-2">
              <div className="flex h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-3xl sm:text-4xl font-bold text-white border-4 border-[#0C1014]">
                {initials}
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center sm:items-start gap-1 w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{username}</h2>
              <p className="text-xs sm:text-sm text-[#B0B0B0]">@{username}</p>

              {/* Tier and Join Date Row */}
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

              {/* Followers */}
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

      {/* Right Sidebar - Advanced Level & Achievements (2 columns) */}
      <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-4 sm:p-6 lg:col-span-2 space-y-6 min-w-0">
        {/* Advanced Level Section */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            {/* Level Badge & Info */}
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

            {/* Rating Badge */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-lg">⭐</span>
              <span className="font-bold text-white">4.8</span>
              <span className="text-[#B0B0B0]">(156)</span>
            </div>
          </div>

          {/* XP Info */}
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
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">Achievements (4)</h3>
            <span className="text-xs text-[#B0B0B0]">2 in Progress</span>
          </div>

          {/* Achievement Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Achievement 1 */}
            <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">Verified Trader</p>
            </div>

            {/* Achievement 2 */}
            <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                <Target className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">Sharp Shooter</p>
            </div>

            {/* Achievement 3 */}
            <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">On Fire</p>
            </div>

            {/* Achievement 4 */}
            <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] flex-shrink-0">
                <Star className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">Top Rated</p>
            </div>
          </div>

          {/* Progress Achievements */}
          <div className="space-y-4">
            {/* Bull Master */}
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

            {/* Influencer */}
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

      {/* Admin Stats Modal */}
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
