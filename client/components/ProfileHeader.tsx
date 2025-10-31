import { FC, useMemo } from "react";
import { Zap, BookOpen } from "lucide-react";

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

  const navItems = [
    { label: "Posts", active: true },
    { label: "Media", active: false },
    { label: "Premium", active: false },
    { label: "Likes", active: false },
    { label: "Security", active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-6">
        {/* Header Background */}
        <div className="mb-6 h-24 rounded-xl bg-gradient-to-r from-[#A06AFF]/20 to-[#482090]/20 border border-[#181B22]" />

        {/* Profile Info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#A06AFF] to-[#482090] text-2xl font-bold text-white">
              {initials}
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-white">{username}</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#A06AFF] bg-[#A06AFF]/10 px-3 py-1 text-xs font-semibold text-[#A06AFF]">
                  TIER 🏆
                </span>
              </div>
              <p className="text-sm text-[#B0B0B0]">
                Joined {joinDate}
              </p>

              {/* Followers */}
              <div className="flex gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">0</span>
                  <span className="text-xs text-[#B0B0B0]">Following</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">0</span>
                  <span className="text-xs text-[#B0B0B0]">Followers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <Zap className="h-4 w-4 mr-1" />
              Donate
            </button>
            <button className="flex h-10 items-center justify-center rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-sm font-semibold text-white transition-colors hover:border-[#1F2230]">
              Edit profile
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <div className="mt-6 flex gap-2 border-t border-[#181B22] pt-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                item.active
                  ? "bg-[#A06AFF] text-white"
                  : "text-[#B0B0B0] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Earnings & Activity Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Earnings Card */}
        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-6">
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

        {/* Activity Card */}
        <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-6">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#A06AFF]" />
            <h3 className="text-lg font-bold text-white">Мой активность</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
                Посты
              </p>
              <p className="mt-2 text-2xl font-bold text-white">0</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-3">
                <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
                  Лайки
                </p>
                <p className="mt-2 text-xl font-bold text-white">0</p>
              </div>
              <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-3">
                <p className="text-xs uppercase tracking-wide text-[#B0B0B0]">
                  Комментарии
                </p>
                <p className="mt-2 text-xl font-bold text-white">0</p>
              </div>
            </div>

            <p className="text-xs text-[#B0B0B0] pt-2">За последние 7 дней</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
