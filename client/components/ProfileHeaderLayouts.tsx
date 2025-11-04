import { FC, useState } from "react";
import { Trophy, Target, Flame, Star, TrendingUp, Zap, Edit } from "lucide-react";
import { UserStatsWithCalculations } from "@/hooks/useUserStatistics";

interface RightPanelProps {
  stats: UserStatsWithCalculations | null;
  onEditClick: () => void;
}

// Layout 2: Horizontal strip achievements
export const RightPanelLayout2: FC<RightPanelProps> = ({ stats, onEditClick }) => (
  <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-4 sm:p-6 lg:col-span-2 space-y-4">
    {/* Level Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A0FF75] flex-shrink-0">
          <span className="text-lg font-bold text-black">{stats?.current_level || 1}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h3>
          <p className="text-xs text-[#B0B0B0]">{stats?.total_xp || 0} XP</p>
        </div>
      </div>
      <span className="text-lg">⭐ 4.8</span>
    </div>

    {/* XP Bar */}
    <div className="space-y-1">
      <div className="h-2 bg-[#181B22] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#A0FF75] to-[#482090] rounded-full transition-all"
          style={{ width: `${stats?.level_info?.progressPercent || 0}%` }}
        ></div>
      </div>
      <p className="text-xs text-[#B0B0B0]">{stats?.level_info?.progressPercent || 0}% to next level</p>
    </div>

    {/* Horizontal Achievements Strip */}
    <div className="pt-2 border-t border-[#181B22]">
      <p className="text-xs uppercase text-[#B0B0B0] mb-3">Achievements</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { icon: Trophy, label: 'Verified', color: 'from-[#8B5CF6] to-[#A06AFF]' },
          { icon: Target, label: 'Shooter', color: 'from-[#8B5CF6] to-[#A06AFF]' },
          { icon: Flame, label: 'On Fire', color: 'from-[#8B5CF6] to-[#A06AFF]' },
          { icon: Star, label: 'Top Rated', color: 'from-[#8B5CF6] to-[#A06AFF]' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50 whitespace-nowrap flex-shrink-0"
          >
            <Icon className="h-5 w-5 text-[#A06AFF]" />
            <p className="text-[10px] text-[#B0B0B0]">{label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Progress Bars */}
    <div className="pt-2 border-t border-[#181B22] space-y-2">
      <p className="text-xs uppercase text-[#B0B0B0]">In Progress</p>
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-white">Bull Master</p>
          <p className="text-xs text-[#A06AFF]">72%</p>
        </div>
        <div className="h-1 bg-[#181B22] rounded-full overflow-hidden">
          <div className="h-full w-[72%] bg-[#A06AFF] rounded-full"></div>
        </div>
      </div>
    </div>

    <button
      onClick={onEditClick}
      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-xl hover:bg-[#A06AFF]/30 transition-colors"
    >
      <Edit className="h-3 w-3" />
      Edit
    </button>
  </div>
);

// Layout 3: Minimalist compact with graph
export const RightPanelLayout3: FC<RightPanelProps> = ({ stats, onEditClick }) => {
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');

  // Generate sample data points based on progress percentage
  const progressPercent = stats?.level_info?.progressPercent || 0;
  const currentXP = stats?.total_xp || 0;
  const nextLevelXP = stats?.level_info?.nextLevelXP || 100;
  const xpRemaining = nextLevelXP - currentXP;

  const dataPoints = [
    progressPercent * 0.4,
    progressPercent * 0.6,
    progressPercent * 0.8,
    progressPercent * 0.9,
    progressPercent * 1.0,
    progressPercent * 0.85,
    progressPercent * 0.7,
  ];

  const id = Math.random().toString(36).substr(2, 9);
  const gradientId = `${id}-gradient`;
  const strokeId = `${id}-stroke`;

  const chartHeight = 200;
  const chartWidth = 280;
  const padding = 15;
  const maxValue = Math.max(...dataPoints, 100);

  // Generate SVG path
  const points = dataPoints.map((value, idx) => {
    const x = padding + (idx / (dataPoints.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (value / maxValue) * (chartHeight - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${padding + (dataPoints.length - 1) / (dataPoints.length - 1) * (chartWidth - padding * 2)},${chartHeight - padding} L ${padding},${chartHeight - padding} Z`;

  return (
    <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-6 lg:col-span-2 space-y-5">
      {/* Header with Level Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#A0FF75] flex-shrink-0">
            <span className="text-2xl font-bold text-black">{stats?.current_level || 1}</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h3>
            <p className="text-xs text-[#B0B0B0]">Level {stats?.current_level || 1}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#A06AFF] font-bold">{xpRemaining}</p>
          <p className="text-xs text-[#B0B0B0]">XP to next</p>
        </div>
      </div>

      {/* Time Period Toggle */}
      <div className="flex gap-1 bg-[#181B22] p-1 rounded-full w-fit">
        {['Day', 'Week', 'Month', 'Year'].map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period.toLowerCase() as any)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              timePeriod === period.toLowerCase()
                ? 'bg-white text-black'
                : 'text-[#B0B0B0] hover:text-white'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Graph Container with Progress Inside */}
      <div className="relative bg-[#0C1014]/50 border border-[#181B22] rounded-2xl overflow-hidden">
        <div className="relative h-56">
          <svg
            className="h-full w-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Area fill */}
            <path
              d={areaD}
              fill={`url(#${gradientId})`}
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id={gradientId}
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
                id={strokeId}
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

            {/* Line path */}
            <path
              d={pathD}
              stroke={`url(#${strokeId})`}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Progress Percentage Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-white">{progressPercent}%</p>
            <p className="text-xs text-[#B0B0B0] mt-1">Progress</p>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-[#B0B0B0] px-6 py-3 border-t border-[#181B22]">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, dataPoints.length).map((day) => (
            <span key={day} className="text-center">{day}</span>
          ))}
        </div>
      </div>

      {/* XP Details */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50">
          <p className="text-[#B0B0B0] mb-1">Current</p>
          <p className="font-bold text-white">{currentXP}</p>
        </div>
        <div className="p-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50">
          <p className="text-[#B0B0B0] mb-1">Next Level</p>
          <p className="font-bold text-white">{nextLevelXP}</p>
        </div>
        <div className="p-2 rounded-lg border border-[#181B22] bg-[#0C1014]/50">
          <p className="text-[#B0B0B0] mb-1">Remaining</p>
          <p className="font-bold text-[#A0FF75]">{xpRemaining}</p>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="w-full px-3 py-2 text-xs font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-xl hover:bg-[#A06AFF]/30 transition-colors"
      >
        <Edit className="h-3 w-3 inline mr-2" />
        Edit Statistics
      </button>
    </div>
  );
};

// Layout 4: Premium glass effect
export const RightPanelLayout4: FC<RightPanelProps> = ({ stats, onEditClick }) => (
  <div className="rounded-3xl border border-[#181B22] bg-gradient-to-br from-[#0C101480] to-[#181B22]/20 p-4 sm:p-6 lg:col-span-2 space-y-4 backdrop-blur-sm">
    {/* Gradient BG */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#A06AFF]/5 to-[#482090]/5 pointer-events-none"></div>

    <div className="relative space-y-4">
      {/* Level Circle */}
      <div className="flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A0FF75] to-[#482090] shadow-lg">
          <span className="text-3xl font-bold text-white">{stats?.current_level || 1}</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h3>
        <p className="text-sm text-[#A0FF75] font-semibold">{stats?.total_xp || 0} XP</p>
      </div>

      {/* Fancy XP Bar */}
      <div className="space-y-2">
        <div className="h-1.5 bg-[#181B22] rounded-full overflow-hidden border border-[#1F2230]">
          <div
            className="h-full bg-gradient-to-r from-[#A0FF75] via-[#A06AFF] to-[#482090] rounded-full transition-all shadow-lg"
            style={{ width: `${stats?.level_info?.progressPercent || 0}%` }}
          ></div>
        </div>
        <p className="text-xs text-center text-[#B0B0B0]">
          {stats?.level_info?.progressPercent || 0}% · {(stats?.level_info?.nextLevelXP || 100) - (stats?.total_xp || 0)} XP left
        </p>
      </div>

      {/* Achievement Showcase */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { Icon: Trophy, color: 'from-[#8B5CF6] to-[#A06AFF]' },
          { Icon: Target, color: 'from-[#8B5CF6] to-[#A06AFF]' },
          { Icon: Flame, color: 'from-[#8B5CF6] to-[#A06AFF]' },
          { Icon: Star, color: 'from-[#8B5CF6] to-[#A06AFF]' },
        ].map(({ Icon }, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/30 to-[#482090]/20 border border-[#1F2230]"
          >
            <Icon className="h-5 w-5 text-[#A06AFF]" />
          </div>
        ))}
      </div>

      {/* Edit Button */}
      <button
        onClick={onEditClick}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#A06AFF] to-[#482090] rounded-xl hover:opacity-90 transition-opacity"
      >
        <Edit className="h-3 w-3" />
        Edit Statistics
      </button>
    </div>
  </div>
);

// Layout 5: Dark tech style
export const RightPanelLayout5: FC<RightPanelProps> = ({ stats, onEditClick }) => (
  <div className="rounded-3xl border border-[#1F2230] bg-[#000000] p-4 sm:p-6 lg:col-span-2 space-y-4">
    {/* Header Row */}
    <div className="flex items-center justify-between border-b border-[#1F2230] pb-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A0FF75]">
          <span className="text-sm font-bold text-black">{stats?.current_level || 1}</span>
        </div>
        <div>
          <p className="text-xs uppercase text-[#A0FF75] font-mono font-bold">{'LEVEL'}</p>
          <p className="text-sm text-white font-bold">{stats?.level_info?.name || 'Newbie'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase text-[#B0B0B0] font-mono">RATING</p>
        <p className="text-lg font-bold text-white">4.8★</p>
      </div>
    </div>

    {/* XP as code */}
    <div className="font-mono text-xs space-y-1 bg-[#0C1014] p-3 rounded-lg border border-[#1F2230]">
      <p className="text-[#A0FF75]">→ xp: {stats?.total_xp || 0} / {stats?.level_info?.nextLevelXP || 100}</p>
      <p className="text-[#A06AFF]">→ progress: {stats?.level_info?.progressPercent || 0}%</p>
      <div className="h-1 bg-[#181B22] rounded overflow-hidden mt-2">
        <div
          className="h-full bg-[#A0FF75]"
          style={{ width: `${stats?.level_info?.progressPercent || 0}%` }}
        ></div>
      </div>
    </div>

    {/* Achievements as status indicators */}
    <div className="space-y-2">
      <p className="text-xs uppercase text-[#B0B0B0] font-mono">ACHIEVEMENTS</p>
      {[
        { icon: Trophy, name: 'Verified Trader', active: true },
        { icon: Target, name: 'Sharp Shooter', active: true },
        { icon: Flame, name: 'On Fire', active: false },
        { icon: Star, name: 'Top Rated', active: false },
      ].map(({ icon: Icon, name, active }) => (
        <div key={name} className="flex items-center gap-2 text-xs">
          <div className={`h-2 w-2 rounded-full ${active ? 'bg-[#A0FF75]' : 'bg-[#1F2230]'}`}></div>
          <Icon className="h-3 w-3" style={{ color: active ? '#A0FF75' : '#B0B0B0' }} />
          <span style={{ color: active ? '#A0FF75' : '#666666' }}>{name}</span>
        </div>
      ))}
    </div>

    {/* Edit */}
    <button
      onClick={onEditClick}
      className="w-full px-3 py-2 text-xs font-semibold text-black bg-[#A0FF75] rounded-xl hover:bg-[#B8FF94] transition-colors font-mono"
    >
      → EDIT STATS
    </button>
  </div>
);
