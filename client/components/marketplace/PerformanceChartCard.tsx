import type { FC } from "react";
import { cn } from "@/lib/utils";

export type PerformanceChartLevel = {
  label: string;
  accent?: boolean;
};

export interface PerformanceChartCardProps {
  levels: readonly PerformanceChartLevel[];
  months: readonly string[];
  highlightValue: string;
  title?: string;
  className?: string;
}

const PerformanceChartCard: FC<PerformanceChartCardProps> = ({
  levels,
  months,
  highlightValue,
  title,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-3xl border border-[#181B22] bg-[#0C1014]/50 p-4 max-[360px]:gap-3 max-[360px]:p-3 backdrop-blur-[50px]",
        className,
      )}
    >
      <h2 className="text-[19px] font-bold text-[#A06AFF] max-[360px]:text-base">
        {title ?? "Performance"}
      </h2>
      <div className="h-px w-full bg-[#181B22]" />
      <div className="relative">
        <div className="relative h-[220px] max-[360px]:h-[140px]">
          <div className="absolute left-0.5 top-0 h-full w-[calc(100%-42px)] max-[360px]:w-[calc(100%-24px)]">
            <svg
              className="h-full w-full"
              viewBox="0 0 652 221"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <g filter="url(#filter0_d_perf)">
                <path
                  d="M9 208.911L16.454 212L21.0091 205.822L25.1502 208.028L26.3926 204.498L29.7054 205.822L33.8465 202.291L37.5735 204.498L49.5826 185.08L51.2391 186.404L56.6225 176.696L58.2789 180.226L60.3494 178.02L62.42 180.226L64.0764 176.696L66.9752 179.343L69.8739 176.696L72.3586 178.02C73.6009 174.048 76.0856 166.016 76.0856 165.663C76.0856 165.31 76.0856 157.278 76.0856 153.307L79.3984 157.278L81.8831 153.307C81.8831 154.189 81.8831 155.601 81.8831 154.189C81.8831 152.777 84.6438 143.009 86.0242 138.302L89.337 151.1L93.8922 140.067L97.2051 139.185L98.4474 131.683L100.932 133.007L102.174 128.593L105.487 136.537L107.144 145.804L108.8 137.42L110.457 142.274L112.113 154.189L114.184 139.185L117.911 149.776L122.88 131.683L127.021 135.213L128.677 130.8L130.748 134.33L134.061 129.917L138.616 144.922L141.101 137.42L144.828 140.067L147.726 129.917L148.555 135.213L151.453 130.8L155.594 147.57L157.665 143.157L158.493 147.57L162.22 144.922L163.462 152.865L165.119 146.687L168.846 143.157L170.502 145.804L171.745 140.067L175.057 147.57L177.542 146.687L181.269 152.865L183.754 146.687L187.067 161.691L190.379 160.367V151.1L192.864 148.452L199.076 157.72L201.975 149.776L203.217 157.72L205.702 156.837L208.186 152.865L209.843 156.837L211.499 144.922L212.741 147.57L214.812 142.274C216.192 145.216 218.953 150.57 218.953 148.452C218.953 146.334 219.781 137.861 220.195 133.889L225.579 142.274L228.063 143.157L228.892 141.391H231.376L234.689 144.922L237.588 145.804L238.416 141.391L240.48 144.922L245.864 135.213L247.935 138.744L250.42 134.33L253.319 138.744L257.874 123.739L261.187 135.213L265.328 128.152L268.641 138.744L272.782 134.33L274.438 138.744L278.165 131.241L280.236 134.771L281.478 129.917L285.205 135.654L287.69 129.475L289.346 136.096L293.073 131.241L296.386 138.744L298.871 132.566L302.184 140.509L304.669 138.744L306.74 140.509L308.811 138.744L311.296 142.715L314.194 139.626L317.093 147.57L318.335 143.157L321.233 148.452L323.718 143.157L326.203 152.865L328.688 149.776L330.758 156.837L333.657 158.602L335.742 152.865L339.469 161.691L341.954 159.485L344.439 163.015L346.509 152.865L349.408 158.161L351.064 153.748L352.306 157.278L354.791 154.189L358.104 161.249L359.346 157.278L363.073 166.546L365.972 162.574L368.457 171.302L372.598 164.78L373.84 169.194L375.496 163.015L378.809 164.78L379.637 160.367L382.536 168.753L384.193 164.339L387.091 164.78L389.162 172.626L390.819 168.753L392.89 171.302L394.546 166.546L396.217 168.753L399.53 164.339L401.186 168.753L403.257 166.546L407.398 176.696L410.711 178.463L412.367 175.374L414.438 183.317L418.165 178.463L419.822 182.876L421.064 176.696L424.377 179.785L426.032 178.463L428.103 181.112L429.76 178.904L432.244 181.994L434.315 178.463L437.214 188.171L438.87 179.343L441.769 186.404L443.425 182.876L445.496 190.379L447.167 187.288L448.823 193.467L450.894 188.612L452.551 191.701L454.621 190.379L457.52 196.996L459.591 195.232L462.904 202.291L464.56 198.762L466.631 200.969L468.288 199.205L471.186 206.264L472.843 205.822L474.914 210.677L477.399 208.469L479.47 209.352L481.955 207.587L483.611 210.235L486.096 205.822L489.409 210.677L491.894 208.911L494.379 212L497.692 206.705L499.348 208.911L501.419 206.705L505.146 208.911L507.631 204.498L509.701 206.264L512.186 204.056L514.671 206.705L517.156 202.732L519.641 206.705L522.54 199.646L524.196 202.291L526.267 199.646L528.752 202.291L531.237 198.762L533.722 202.291L535.792 198.762L538.691 200.528L540.762 197.439L543.661 201.853L545.317 198.762L547.802 201.853L549.872 198.762L552.771 202.732L554.427 200.969L556.498 206.705L558.983 200.528L561.468 203.617L563.953 201.853L566.438 205.822L569.337 199.646L571.407 201.853L573.478 198.762L577.619 203.617L579.69 201.853L582.175 205.822L584.66 200.528L586.73 203.175L589.215 201.853L592.114 206.264L593.771 204.056L596.256 208.469L598.741 205.822L601.226 209.352L603.711 205.822L606.195 209.793L609.094 204.056L611.165 206.705L613.65 204.498L616.135 208.911L618.62 204.056L621.519 207.587L624.418 204.498L627.302 206.837"
                  stroke="#A06AFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_perf"
                  x="0.249756"
                  y="0.698242"
                  width="651.5"
                  height="220.22"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="4" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.627451 0 0 0 0 0.415686 0 0 0 0 1 0 0 0 0.24 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_perf"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_perf"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
            {levels.map((level) => (
              <div key={level.label} className="flex items-center gap-0.5">
                <div
                  className={`h-px flex-1 ${level.accent ? "bg-[#523A83]" : "bg-[#2E2744]"}`}
                />
                <span className="w-10 text-right text-xs font-bold uppercase text-[#B0B0B0] max-[360px]:w-8">
                  {level.label}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute right-4 top-0 z-20 inline-flex items-center justify-center rounded bg-[#A06AFF] px-1 py-0.5">
            <span className="text-center text-xs font-bold uppercase text-white">{highlightValue}</span>
          </div>
        </div>

        <div className="relative left-0.5 top-0.5 flex w-[calc(100%-42px)] max-[360px]:w-[calc(100%-24px)] items-start justify-between gap-2">
          {months.map((month) => (
            <div key={month} className="flex flex-col items-center gap-1">
              <div className="h-2 w-px bg-[#523A83]" />
              <span className="text-center text-xs font-bold uppercase text-[#B0B0B0]">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChartCard;
