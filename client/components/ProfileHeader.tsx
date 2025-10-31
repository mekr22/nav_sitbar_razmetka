import { FC, useMemo, useState } from "react";
import { Zap, BookOpen, Calendar } from "lucide-react";

interface ProfileHeaderProps {
  user?: {
    email?: string;
    user_metadata?: {
      username?: string;
    };
  };
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<"Posts" | "Media" | "Premium" | "Likes" | "Security">("Posts");

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

  const navItems = [
    { label: "Posts" as const },
    { label: "Media" as const },
    { label: "Premium" as const },
    { label: "Likes" as const },
    { label: "Security" as const },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Profile Card - Left Side (3 columns) */}
      <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-6 lg:col-span-3 lg:row-span-2">
        {/* Header Background */}
        <div className="mb-6 h-24 rounded-xl bg-gradient-to-r from-[#A06AFF]/20 to-[#482090]/20 border border-[#181B22]" />

        {/* Profile Header Section */}
        <div className="flex flex-col gap-6">
          {/* Top Row: Avatar + Info + Actions */}
          <div className="flex items-start gap-4 justify-between">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-lg sm:text-xl font-bold text-white">
              {initials}
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-1 pt-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">{username}</h2>
              <p className="text-xs sm:text-sm text-[#B0B0B0]">@{username}</p>
                
                {/* Tier Badge */}
                <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#A06AFF] bg-[#A06AFF]/10 px-2 py-1 text-xs font-semibold text-[#A06AFF]">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[#A06AFF] text-white text-[10px] font-bold">
                      4
                    </span>
                    TIER
                  </span>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-[#B0B0B0] whitespace-nowrap">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    Joined {joinDate}
                  </div>
                </div>

                {/* Followers */}
                <div className="mt-2 flex gap-3 text-xs sm:text-sm whitespace-nowrap">
                  <span className="text-[#B0B0B0]">
                    <span className="text-white font-semibold">0</span> Following
                  </span>
                  <span className="text-[#B0B0B0]">
                    <span className="text-white font-semibold">0</span> Followers
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button className="flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap">
                <Zap className="h-4 w-4 mr-1" />
                Donate
              </button>
              <button className="flex h-10 items-center justify-center rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-sm font-semibold text-white transition-colors hover:border-[#1F2230] whitespace-nowrap">
                Edit profile
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col gap-3 border-t border-[#181B22] pt-4">
            {/* Tab Buttons - Distributed by Width */}
            <div className="flex gap-2 w-full">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors ${
                    activeTab === item.label
                      ? "bg-[#A06AFF] text-white"
                      : "text-[#B0B0B0] hover:text-white border border-[#181B22] hover:border-[#1F2230]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* All Filter */}
            <button className="w-fit px-3 py-1 text-xs font-semibold rounded-full border border-[#A06AFF] text-[#A06AFF] hover:bg-[#A06AFF]/10 transition-colors">
              All (0)
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Earnings (2 columns) */}
      <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-6 lg:col-span-2">
        <div className="mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#A06AFF]" />
          <h3 className="text-lg font-bold text-white">Мой заработок</h3>
        </div>

        <div className="space-y-4">
          {/* MRR */}
          <div>
            <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
              MRR (еженедельный доход)
            </p>
            <p className="mt-2 text-2xl font-bold text-white">$500.00</p>
          </div>

          {/* Grid 2x2 */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-3">
              <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
                Всего
              </p>
              <p className="mt-2 text-xl font-bold text-white">$1500.00</p>
            </div>
            <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-3">
              <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
                Подписчики
              </p>
              <p className="mt-2 text-xl font-bold text-white">25</p>
            </div>
            <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-3">
              <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
                Продано постов
              </p>
              <p className="mt-2 text-xl font-bold text-white">15</p>
            </div>
            <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-3">
              <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
                Средняя цена
              </p>
              <p className="mt-2 text-xl font-bold text-white">$10.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Activity (2 columns) */}
      <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-6 lg:col-span-2">
        <div className="mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#A06AFF]" />
          <h3 className="text-lg font-bold text-white">Моя активность</h3>
        </div>

        <div className="space-y-4">
          {/* Posts Row */}
          <div className="flex items-center justify-between rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-4 py-3">
            <p className="text-sm text-[#B0B0B0]">Посты</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>

          {/* Likes Row */}
          <div className="flex items-center justify-between rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-4 py-3">
            <p className="text-sm text-[#B0B0B0]">Лайки</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>

          {/* Comments Row */}
          <div className="flex items-center justify-between rounded-lg border border-[#181B22] bg-[#0C1014]/50 px-4 py-3">
            <p className="text-sm text-[#B0B0B0]">Комментарии</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>

          <p className="text-xs text-[#B0B0B0] pt-2 text-center">За последние 7 дней</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
