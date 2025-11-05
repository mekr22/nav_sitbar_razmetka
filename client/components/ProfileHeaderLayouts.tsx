import { FC, useState, useRef } from "react";
import { Trophy, Target, Flame, Star, TrendingUp, Zap, Edit, Swords, Heart, Gem, Crown } from "lucide-react";
import { UserStatsWithCalculations } from "@/hooks/useUserStatistics";

interface RightPanelProps {
  stats: UserStatsWithCalculations | null;
  onEditClick: () => void;
}

// Layout 2: Horizontal strip achievements
export const RightPanelLayout2: FC<RightPanelProps> = ({ stats, onEditClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressPercent = stats?.level_info?.progressPercent || 0;
  const id = Math.random().toString(36).substr(2, 9);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY > 0 ? 100 : -100;
    }
  };
  const chartWidth = 652;
  const chartHeight = 221;
  const graphStartX = 8.75;
  const graphEndX = 642.75;
  const badgeXInSVG = graphStartX + (progressPercent / 100) * (graphEndX - graphStartX);
  const badgeXPercent = (badgeXInSVG / chartWidth) * 100;
  const pathD = "M8.75 208.213L16.204 211.302L20.7591 205.123L24.9002 207.33L26.1426 203.8L29.4554 205.123L33.5965 201.593L37.3235 203.8L49.3326 184.382L50.9891 185.706L56.3725 175.997L58.0289 179.528L60.0994 177.321L62.17 179.528L63.8264 175.997L66.7252 178.645L69.6239 175.997L72.1086 177.321C73.3509 173.35 75.8356 165.318 75.8356 164.965C75.8356 164.612 75.8356 156.58 75.8356 152.608L79.1484 156.58L81.6331 152.608C81.6331 153.491 81.6331 154.903 81.6331 153.491C81.6331 152.079 84.3938 142.311 85.7742 137.604L89.087 150.402L93.6422 139.369L96.9551 138.487L98.1974 130.984L100.682 132.308L101.924 127.895L105.237 135.839L106.894 145.106L108.55 136.721L110.207 141.576L111.863 153.491L113.934 138.487L117.661 149.078L122.63 130.984L126.771 134.515L128.427 130.102L130.498 133.632L133.811 129.219L138.366 144.224L140.851 136.721L144.578 139.369L147.476 129.219L148.305 134.515L151.203 130.102L155.344 146.871L157.415 142.458L158.243 146.871L161.97 144.224L163.212 152.167L164.869 145.989L168.596 142.458L170.252 145.106L171.495 139.369L174.807 146.871L177.292 145.989L181.019 152.167L183.504 145.989L186.817 160.993L190.129 159.669V150.402L192.614 147.754L198.826 157.021L201.725 149.078L202.967 157.021L205.452 156.139L207.936 152.167L209.593 156.139L211.249 144.224L212.491 146.871L214.562 141.576C215.942 144.518 218.703 149.872 218.703 147.754C218.703 145.636 219.531 137.163 219.945 133.191L225.329 141.576L227.813 142.458L228.642 140.693H231.126L234.439 144.224L237.338 145.106L238.166 140.693L240.237 143.341L245.62 142.458L248.933 135.839L252.246 142.458H253.902L255.145 139.369L258.457 145.989L260.114 142.458L263.013 149.078L269.638 147.754L272.123 161.876L274.193 154.373L277.92 152.167L281.233 165.406L283.304 160.993L287.859 167.613C289.654 164.523 293.325 158.61 293.657 159.669C293.988 160.728 297.936 168.642 299.868 172.467L302.353 168.937L303.595 174.232H306.08L308.565 169.819L309.807 173.35L316.847 164.523L318.917 152.167L321.816 155.697L323.887 150.402L328.442 145.989C330.65 150.255 335.067 158.698 335.067 158.345C335.067 157.992 336.172 152.902 336.724 150.402H339.209L340.451 149.078L345.006 159.669L346.662 157.021L348.733 165.406L350.804 167.613L353.288 183.5L355.359 177.763L357.843 179.528L359.914 162.758L360.742 165.406L363.227 164.523L364.883 169.819L365.297 162.758L368.61 159.669L371.923 169.819L374.408 163.641L377.307 168.937L379.377 162.758H381.033L382.276 157.021L382.69 159.228L385.175 149.078H390.144L392.214 160.552L393.871 162.317L395.527 160.552L400.497 166.73L402.567 164.082L404.224 172.026L406.294 170.702L409.607 176.88L412.092 176.439L414.162 173.791L417.061 165.406L420.788 168.937L422.444 160.552L427.414 163.641L430.726 152.167L437.766 149.078L439.837 152.167L441.079 147.313L443.15 150.843L446.049 140.252L448.947 139.81L451.432 149.078L456.401 153.491L459.3 148.195H460.956L461.785 145.989H466.754L468.824 150.843L471.723 144.224L474.208 145.989L474.622 139.369L479.591 130.102L485.389 132.308L486.217 128.778L491.6 136.28L492.429 131.867L494.499 133.632L499.883 128.778L501.953 115.539L508.165 125.247L513.134 127.454L515.205 125.247L516.861 108.037L519.76 106.271L522.659 104.947L525.143 78.0278L528.456 66.1126L530.527 74.9387L530.941 63.9061L535.082 66.5539L540.465 53.3148L543.778 30.367L547.091 33.8974L550.404 48.0192L552.474 14.9213L554.959 30.367L556.201 28.6018L557.444 31.6909L559.928 25.5126L562.827 36.9865L564.898 28.6018L565.726 44.4887L568.21 36.9865L572.352 38.7518L573.594 45.8126L577.321 20.217L578.563 25.5126L580.22 22.4235H582.29L588.502 8.30176L590.572 36.9865L594.713 40.0757L598.026 51.1083L600.511 40.517C601.339 43.7532 602.996 50.3139 602.996 50.667C602.996 51.02 604.928 41.3996 605.894 36.5452L608.379 41.8409L611.692 20.6583L617.904 15.8039L620.802 18.4518L622.459 12.7148L627.428 53.7561L629.499 49.3431L633.64 50.667L637.367 30.367L642.75 18.4518";
  const areaD = pathD + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] p-4 sm:p-6 lg:col-span-2 space-y-4 min-w-0">
      {/* Level Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-transparent border-2 border-[#A06AFF] flex-shrink-0 shadow-lg shadow-[#A06AFF]/40 relative overflow-hidden" style={{
            transform: 'perspective(800px) rotateX(8deg) rotateY(-8deg) rotateZ(2deg)',
            transformStyle: 'preserve-3d'
          }}>
            <span
              className="text-xl font-black text-white select-none relative z-10"
              style={{
                textShadow: `
                  0 1px 0 rgba(0,0,0,0.8),
                  0 2px 0 rgba(0,0,0,0.7),
                  0 3px 0 rgba(0,0,0,0.6),
                  0 4px 0 rgba(0,0,0,0.5),
                  0 5px 10px rgba(0,0,0,0.8),
                  0 -1px 2px rgba(255,255,255,0.3),
                  0 -2px 4px rgba(255,255,255,0.1)
                `,
                letterSpacing: '-0.5px',
                filter: 'drop-shadow(0 2px 4px rgba(82,58,131,0.5))'
              }}
            >
              {stats?.current_level || 1}
            </span>
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%)',
                pointerEvents: 'none',
                transform: 'translateZ(20px)'
              }}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h3>
            <p className="text-xs text-[#B0B0B0]">{stats?.total_xp || 0} XP</p>
          </div>
        </div>
        <span className="text-lg">⭐ 4.8</span>
      </div>

      {/* Compact Graph */}
      <div className="relative rounded-lg overflow-visible w-full">
        <div className="relative h-20 w-full">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id={`${id}-progress-clip`}>
                <rect x="0" y="0" width={(chartWidth * progressPercent) / 100} height={chartHeight} />
              </clipPath>
              <clipPath id={`${id}-unfilled-clip`}>
                <rect x={(chartWidth * progressPercent) / 100} y="0" width={chartWidth} height={chartHeight} />
              </clipPath>
              <linearGradient
                id={`${id}-filled-gradient`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop stopColor="#A06AFF" stopOpacity="0.5" />
                <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
              </linearGradient>
              <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g clipPath={`url(#${id}-unfilled-clip)`}>
              <path d={areaD} fill="#2A2F3A" opacity="0.3" />
            </g>
            <g clipPath={`url(#${id}-progress-clip)`}>
              <path d={areaD} fill={`url(#${id}-filled-gradient)`} />
              <path d={areaD} fill="#A06AFF" opacity="0.2" />
            </g>
            <path d={pathD} stroke="#A06AFF" strokeWidth="1.5" strokeLinecap="round" filter={`url(#${id}-glow)`} />
          </svg>
          <div
            className="absolute pointer-events-none transform -translate-x-1/2"
            style={{
              left: `${badgeXPercent}%`,
              bottom: '-12px'
            }}
          >
            <div className="bg-[#A06AFF] text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-lg shadow-[#A06AFF]/50 whitespace-nowrap border border-[#C6A6FF]">
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="space-y-1">
        <div className="h-2 bg-[#181B22] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#A0FF75] to-[#482090] rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-[#B0B0B0]">{progressPercent}% to next level</p>
      </div>

      {/* Horizontal Achievements Strip */}
      <div className="pt-2 border-t border-[#181B22]">
        <p className="text-xs uppercase text-[#B0B0B0] mb-3">Achievements</p>
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {[
            { icon: Trophy, label: 'Verified' },
            { icon: Target, label: 'Shooter' },
            { icon: Flame, label: 'On Fire' },
            { icon: Star, label: 'Top Rated' },
            { icon: Swords, label: 'Warrior' },
            { icon: Heart, label: 'Heartthrob' },
            { icon: Gem, label: 'Diamond' },
            { icon: Crown, label: 'Champion' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 flex-shrink-0 hover:border-[#A06AFF] hover:bg-[#A06AFF]/10 transition-colors"
              style={{ width: '70px', minWidth: '70px' }}
            >
              <Icon className="h-5 w-5 text-[#A06AFF]" />
              <p className="text-[10px] text-[#B0B0B0] text-center line-clamp-2">{label}</p>
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
};

// Layout 3: Minimalist compact with graph
export const RightPanelLayout3: FC<RightPanelProps> = ({ stats, onEditClick }) => {

  // Generate sample data points based on progress percentage
  const progressPercent = stats?.level_info?.progressPercent || 0;
  const currentXP = stats?.total_xp || 0;
  const nextLevelXP = stats?.level_info?.nextLevelXP || 100;
  const xpRemaining = nextLevelXP - currentXP;

  const id = Math.random().toString(36).substr(2, 9);
  const gradientId = `${id}-gradient`;
  const strokeId = `${id}-stroke`;

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
    <div className="rounded-3xl border border-[#181B22] bg-[#0C101480] lg:col-span-2 space-y-5 overflow-hidden">

      {/* Graph Container - Full Width */}
      <div className="relative overflow-visible shadow-lg shadow-[#A06AFF]/20">
        <div className="relative h-56 w-full px-6 py-4">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id={`${id}-progress-clip`}>
                <rect x="0" y="0" width={(chartWidth * progressPercent) / 100} height={chartHeight} />
              </clipPath>
              <clipPath id={`${id}-unfilled-clip`}>
                <rect x={(chartWidth * progressPercent) / 100} y="0" width={chartWidth} height={chartHeight} />
              </clipPath>
              <linearGradient
                id={`${id}-filled-gradient`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop stopColor="#A06AFF" stopOpacity="0.5" />
                <stop offset="1" stopColor="#6B3BD7" stopOpacity="0.2" />
              </linearGradient>
              <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Unfilled area (gray) - follows graph curve */}
            <g clipPath={`url(#${id}-unfilled-clip)`}>
              <path
                d={areaD}
                fill="#2A2F3A"
                opacity="0.4"
              />
            </g>

            {/* Filled area with gradient - follows graph curve and structure */}
            <g clipPath={`url(#${id}-progress-clip)`}>
              <path
                d={areaD}
                fill={`url(#${id}-filled-gradient)`}
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
              filter={`url(#${id}-glow)`}
            />
          </svg>

          {/* Progress Badge at Bottom of Graph X-axis */}
          <div
            className="absolute pointer-events-none transform -translate-x-1/2"
            style={{
              left: `${badgeXPercent}%`,
              bottom: '-16px'
            }}
          >
            <div className="bg-[#A06AFF] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-[#A06AFF]/50 whitespace-nowrap border-2 border-[#C6A6FF]">
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Level Info and XP Stats Below Graph */}
      <div className="px-6 py-2">
        <div className="flex flex-row items-center gap-3 h-20">
          {/* Level Info - Explorer */}
          <div className="flex-1 flex items-center justify-center flex-col gap-1 px-3 py-2 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 h-full">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#C77DFF] via-[#A06AFF] to-[#6B3BD7] shadow-lg shadow-[#A06AFF]/50" style={{
              transform: 'perspective(800px) rotateX(8deg) rotateY(-8deg) rotateZ(2deg)',
              transformStyle: 'preserve-3d'
            }}>
              <span
                className="text-base font-black text-white select-none relative z-10"
                style={{
                  textShadow: `
                    0 1px 0 rgba(0,0,0,0.8),
                    0 2px 0 rgba(0,0,0,0.7),
                    0 3px 0 rgba(0,0,0,0.6),
                    0 4px 0 rgba(0,0,0,0.5),
                    0 5px 10px rgba(0,0,0,0.8),
                    0 -1px 2px rgba(255,255,255,0.3),
                    0 -2px 4px rgba(255,255,255,0.1)
                  `,
                  letterSpacing: '-0.5px',
                  filter: 'drop-shadow(0 2px 4px rgba(82,58,131,0.5))'
                }}
              >
                {stats?.current_level || 1}
              </span>
            </div>
            <div className="flex flex-col gap-0 text-center">
              <h3 className="text-[10px] font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h3>
              <p className="text-[9px] text-[#B0B0B0]">Level {stats?.current_level || 1}</p>
            </div>
          </div>

          {/* Current */}
          <div className="flex-1 px-3 py-2 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 text-center text-xs flex flex-col justify-center h-full">
            <p className="text-[#B0B0B0] text-[9px] leading-tight">Current</p>
            <p className="font-bold text-white text-sm">{currentXP}</p>
          </div>

          {/* Next Level */}
          <div className="flex-1 px-3 py-2 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 text-center text-xs flex flex-col justify-center h-full">
            <p className="text-[#B0B0B0] text-[9px] leading-tight">Next Level</p>
            <p className="font-bold text-white text-sm">{nextLevelXP}</p>
          </div>

          {/* Remaining */}
          <div className="flex-1 px-3 py-2 rounded-2xl border border-[#181B22] bg-[#0C1014]/50 text-center text-xs flex flex-col justify-center h-full">
            <p className="text-[#B0B0B0] text-[9px] leading-tight">Remaining</p>
            <p className="font-bold text-[#A0FF75] text-sm">{xpRemaining}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <button
          onClick={onEditClick}
          className="w-full px-3 py-2 text-xs font-semibold text-white bg-[#A06AFF]/20 border border-[#A06AFF] rounded-xl hover:bg-[#A06AFF]/30 transition-colors"
        >
          <Edit className="h-3 w-3 inline mr-2" />
          Edit Statistics
        </button>
      </div>
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

// Layout 5: Dark tech style with integrated progress
export const RightPanelLayout5: FC<RightPanelProps> = ({ stats, onEditClick }) => {
  const progressPercent = stats?.level_info?.progressPercent || 0;
  const currentXP = stats?.total_xp || 0;
  const nextLevelXP = stats?.level_info?.nextLevelXP || 100;
  const xpRemaining = nextLevelXP - currentXP;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="rounded-3xl border border-[#1F2230] bg-gradient-to-b from-[#0A0E12] to-[#000000] p-4 sm:p-6 lg:col-span-2 space-y-6">
      {/* Tier Section with Integrated Progress Circle */}
      <div className="flex flex-col items-center gap-4 pb-4 border-b border-[#1F2230]">
        {/* Circular Progress Indicator */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1F2230" strokeWidth="2.5" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#A0FF75"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Center content */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-bold text-white">{stats?.current_level || 1}</span>
            <p className="text-xs uppercase text-[#A0FF75] font-mono font-bold tracking-wider">Tier</p>
          </div>
        </div>

        {/* Tier Name and Rating */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white">{stats?.level_info?.name || 'Newbie'}</h3>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-xl">⭐</span>
            <span className="text-sm font-bold text-white">4.8</span>
            <span className="text-xs text-[#B0B0B0]">(156 reviews)</span>
          </div>
        </div>
      </div>

      {/* XP Progress Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#A0FF75]">→ progress</span>
          <span className="text-white font-bold">{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-[#1F2230] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#A0FF75] to-[#7FD700] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="text-[#A0FF75]">
            <p className="text-[#B0B0B0] mb-1">Current</p>
            <p className="text-white font-bold">{currentXP}</p>
          </div>
          <div className="text-[#A06AFF]">
            <p className="text-[#B0B0B0] mb-1">Remaining</p>
            <p className="text-white font-bold">{xpRemaining}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1F2230]"></div>

      {/* Achievements as status indicators */}
      <div className="space-y-2">
        <p className="text-xs uppercase text-[#B0B0B0] font-mono tracking-wider">ACHIEVEMENTS</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Trophy, name: 'Verified Trader', active: true },
            { icon: Target, name: 'Sharp Shooter', active: true },
            { icon: Flame, name: 'On Fire', active: false },
            { icon: Star, name: 'Top Rated', active: false },
          ].map(({ icon: Icon, name, active }) => (
            <div
              key={name}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all ${
                active
                  ? 'border-[#A0FF75] bg-[#A0FF75]/10 text-[#A0FF75]'
                  : 'border-[#1F2230] bg-[#0C1014]/50 text-[#666666]'
              }`}
            >
              <Icon className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEditClick}
        className="w-full px-3 py-2 text-xs font-semibold text-black bg-[#A0FF75] rounded-xl hover:bg-[#B8FF94] transition-colors font-mono font-bold tracking-wide"
      >
        → EDIT STATS
      </button>
    </div>
  );
};
