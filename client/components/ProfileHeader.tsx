import { FC, useMemo } from "react";
import { Zap, Calendar, Trophy, Target, Flame, Star, TrendingUp } from "lucide-react";
import "./ProfileHeader.css";

interface ProfileHeaderProps {
  user?: {
    email?: string;
    user_metadata?: {
      username?: string;
    };
  };
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => {
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 w-full">
      {/* Profile Card - Left Side (3 columns) */}
      <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-0 lg:col-span-3 overflow-hidden min-w-0">
        {/* Header Background Banner */}
        <div className="h-20 sm:h-28 bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500" />

        {/* Profile Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          {/* Avatar positioned over banner */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            {/* Avatar - Overlapped with banner */}
            <div className="-mt-20 sm:-mt-24 mb-4 sm:mb-2">
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
                <span className="text-xl font-bold text-black">42</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base sm:text-lg font-bold text-white">Advanced</h3>
                <p className="text-xs text-[#B0B0B0]">Level 42</p>
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
              <p className="text-[#B0B0B0]">3 750 / 5 000 XP</p>
              <p className="text-[#A0FF75] font-semibold">75%</p>
            </div>
            <div className="h-2 bg-[#181B22] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#A0FF75] rounded-full"></div>
            </div>
            <p className="text-xs text-[#B0B0B0]">1 250 XP to reach Level 43</p>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B5CF6] flex-shrink-0">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">Verified Trader</p>
            </div>

            {/* Achievement 2 */}
            <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B5CF6] flex-shrink-0">
                <Target className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">Sharp Shooter</p>
            </div>

            {/* Achievement 3 */}
            <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B5CF6] flex-shrink-0">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">On Fire</p>
            </div>

            {/* Achievement 4 */}
            <div className="flex items-center gap-3 rounded-xl border border-[#181B22] bg-[#0C1014]/50 p-3 hover:border-[#1F2230] transition-colors cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B5CF6] flex-shrink-0">
                <Star className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold">Top Rated</p>
            </div>
          </div>

          {/* Progress Achievements */}
          <div className="space-y-4">
            {/* Bull Master */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#181B22] flex-shrink-0">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#181B22] flex-shrink-0">
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

    </div>
  );
};

export default ProfileHeader;
