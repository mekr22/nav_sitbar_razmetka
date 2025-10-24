import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Upload, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCT_TYPES = [
  "Signal",
  "Technical Indicator",
  "Invest-consultant",
  "Analyst",
  "Trader",
  "Script",
  "Course",
  "Robot",
  "Algorithm",
  "Portfolio",
  "Other",
] as const;

type ProductType = (typeof PRODUCT_TYPES)[number];

const AddProduct: FC = () => {
  const navigate = useNavigate();
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType>("Signal");
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);
  const [isPerformanceChartEnabled, setIsPerformanceChartEnabled] =
    useState(true);
  const [isAccuracyChartEnabled, setIsAccuracyChartEnabled] = useState(true);
  const [isDemoEnabled, setIsDemoEnabled] = useState(true);

  const [performanceChartRows, setPerformanceChartRows] = useState<
    { period: string; yield: string }[]
  >([{ period: "", yield: "" }]);
  const [accuracyChartRows, setAccuracyChartRows] = useState<
    { period: string; profitable: string; unprofitable: string }[]
  >([{ period: "", profitable: "", unprofitable: "" }]);

  const addPerformanceRow = () => {
    setPerformanceChartRows([
      ...performanceChartRows,
      { period: "", yield: "" },
    ]);
  };

  const removePerformanceRow = (index: number) => {
    setPerformanceChartRows(performanceChartRows.filter((_, i) => i !== index));
  };

  const addAccuracyRow = () => {
    setAccuracyChartRows([
      ...accuracyChartRows,
      { period: "", profitable: "", unprofitable: "" },
    ]);
  };

  const removeAccuracyRow = (index: number) => {
    setAccuracyChartRows(accuracyChartRows.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1075px] flex-col gap-6 px-3 pb-20 sm:px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[15px]">
        <button
          onClick={() => navigate("/marketplace/my-products")}
          className="font-medium text-[#B0B0B0] hover:text-white"
        >
          Marketplace
        </button>
        <span className="font-bold text-[#808283]">/</span>
        <span className="font-bold text-white">Creating new product</span>
      </div>

      {/* Product Type Selection */}
      <div className="w-full">
        <div className="flex flex-col gap-4 rounded-3xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
          <h1 className="text-2xl font-bold text-white">
            Creating new product
          </h1>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#B0B0B0]">
              Choose product
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowProductTypeDropdown(!showProductTypeDropdown)
                }
                className="flex h-11 w-full items-center justify-between rounded-full border border-[#181B22] bg-[#0C101480] px-6 backdrop-blur-[50px]"
              >
                <span className="text-[15px] font-bold text-white">
                  {selectedProductType}
                </span>
                <ChevronDown className="h-6 w-6 text-white" />
              </button>
              {showProductTypeDropdown && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 flex flex-col gap-0 rounded-[26px] border border-[#181B22] bg-[#0B0E11]/95 p-3 shadow-[24px_48px_48px_0_rgba(0,0,0,0.64)] backdrop-blur-[50px]">
                  {PRODUCT_TYPES.map((type, index) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedProductType(type);
                        setShowProductTypeDropdown(false);
                      }}
                      className={cn(
                        "rounded-full px-5 py-3 text-left text-[15px] font-bold text-white transition-colors hover:bg-[#523A83]",
                        index === 1 && "bg-[#523A83]",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="w-full">
        <div className="flex flex-col rounded-3xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
          {/* Product Preview Header */}
          <div className="flex gap-3 border-b border-[#181B22] p-4">
            <div className="h-[135px] w-[240px] flex-shrink-0 rounded-lg bg-[#2E2744]"></div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[19px] font-bold text-white">
                Your product's title
              </h2>
              <div className="flex items-center gap-6">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.609 20H19.0992C20.249 20 21.1636 19.4761 21.9848 18.7436C24.0709 16.8826 19.167 15 17.4929 15M15.4929 5.06877C15.72 5.02373 15.9558 5 16.1977 5C18.0176 5 19.4929 6.34315 19.4929 8C19.4929 9.65685 18.0176 11 16.1977 11C15.9558 11 15.72 10.9763 15.4929 10.9312"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4.48473 16.1112C3.30576 16.743 0.214557 18.0331 2.0973 19.6474C3.01701 20.436 4.04133 21 5.32914 21H12.6777C13.9655 21 14.9898 20.436 15.9095 19.6474C17.7923 18.0331 14.7011 16.743 13.5221 16.1112C10.7574 14.6296 7.24941 14.6296 4.48473 16.1112Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M13.0007 7.5C13.0007 9.70914 11.2098 11.5 9.00073 11.5C6.79159 11.5 5.00073 9.70914 5.00073 7.5C5.00073 5.29086 6.79159 3.5 9.00073 3.5C11.2098 3.5 13.0007 5.29086 13.0007 7.5Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold uppercase text-white">
                    SELECT Risk LEVEL:
                  </span>
                  <span className="text-xs font-bold uppercase text-white">
                    LOW
                  </span>
                  <ChevronDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4 p-4">
            {/* Product Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Product's title
              </label>
              <input
                type="text"
                placeholder="Enter product title..."
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
              />
            </div>

            {/* Upload Cover Image */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-[28px] border border-dashed border-[#181B22] py-6">
              <Upload className="h-12 w-12 text-[#A06AFF]" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-white">
                Upload cover image
              </h3>
              <p className="text-xs font-bold uppercase text-[#B0B0B0]">
                Drag here or{" "}
                <span className="text-[#A06AFF] underline">select</span>
              </p>
            </div>

            {/* Exchanges */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Exchanges
              </label>
              <input
                type="text"
                placeholder="Enter exchanges (e.g., NYSE, NASDAQ, Binance, Coinbase)"
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
              />
            </div>

            {/* Assets */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Assets
              </label>
              <input
                type="text"
                placeholder="Enter assets (e.g., AAPL, BTC, EUR/USD)"
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Type
              </label>
              <input
                type="text"
                placeholder="Enter indicator type (e.g., Trend, Oscillator)"
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
              />
            </div>

            {/* TimeFrame */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                TimeFrame
              </label>
              <input
                type="text"
                placeholder="Enter timeframe (e.g., M15, H1, D1)"
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
              />
            </div>

            {/* Use */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Use
              </label>
              <input
                type="text"
                placeholder="Enter usage (e.g., Trend, Reversal, Breakout)"
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
              />
            </div>

            {/* Product Accuracy */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Product Accuracy
              </label>
              <input
                type="text"
                placeholder="Enter product accuracy in % (e.g., 75%)"
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
              />
            </div>
          </div>

          {/* Monetization */}
          <div className="flex flex-col gap-2 border-t border-[#181B22] px-4 pb-8 pt-4">
            <h2 className="text-[19px] font-bold text-white">Monetization</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex h-11 flex-1 items-center justify-between rounded-full border border-[#181B22] bg-[#0C101480] px-6 backdrop-blur-[50px]">
                <input
                  type="text"
                  placeholder="Enter price (USD)..."
                  className="flex-1 bg-transparent text-[15px] font-bold text-white placeholder:text-[#B0B0B0] focus:outline-none"
                />
                <span className="text-[15px] font-bold text-[#B0B0B0]">$</span>
              </div>
              <div className="flex h-11 min-w-[200px] flex-1 items-center justify-between rounded-full border border-[#181B22] bg-[#0C101480] px-6 backdrop-blur-[50px]">
                <span className="text-[15px] font-bold text-white">
                  Select monetization type
                </span>
                <ChevronDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="w-full">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[19px] font-bold text-[#A06AFF]">
              Performance Chart
            </h2>
            <button
              type="button"
              onClick={() =>
                setIsPerformanceChartEnabled(!isPerformanceChartEnabled)
              }
              className="flex h-[26px] w-12 items-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] p-0.5"
            >
              <div
                className={cn(
                  "h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform",
                  isPerformanceChartEnabled ? "translate-x-[22px]" : "",
                )}
              />
            </button>
          </div>
          {isPerformanceChartEnabled &&
            performanceChartRows.map((row, index) => (
              <div key={index} className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Select period (e.g., Month)"
                  value={row.period}
                  onChange={(e) => {
                    const newRows = [...performanceChartRows];
                    newRows[index].period = e.target.value;
                    setPerformanceChartRows(newRows);
                  }}
                  className="h-11 flex-1 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] font-bold text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
                />
                <div className="flex h-11 flex-1 items-center justify-between rounded-full border border-[#181B22] bg-[#0C101480] px-6 backdrop-blur-[50px]">
                  <input
                    type="text"
                    placeholder="Enter yield (%)"
                    value={row.yield}
                    onChange={(e) => {
                      const newRows = [...performanceChartRows];
                      newRows[index].yield = e.target.value;
                      setPerformanceChartRows(newRows);
                    }}
                    className="flex-1 bg-transparent text-[15px] font-bold text-white placeholder:text-[#B0B0B0] focus:outline-none"
                  />
                  <span className="text-[15px] font-bold text-[#B0B0B0]">
                    %
                  </span>
                </div>
                {performanceChartRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePerformanceRow(index)}
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0B0E11]"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 3.66602L12.5869 10.3494C12.4813 12.0569 12.4285 12.9107 12.0005 13.5246C11.7889 13.8281 11.5165 14.0842 11.2005 14.2767C10.5614 14.666 9.706 14.666 7.99513 14.666C6.28208 14.666 5.42553 14.666 4.78603 14.2759C4.46987 14.0831 4.19733 13.8265 3.98579 13.5225C3.55792 12.9077 3.5063 12.0527 3.40307 10.3428L3 3.66602"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2 3.66732H14M10.7038 3.66732L10.2487 2.72847C9.9464 2.10482 9.7952 1.793 9.53447 1.59852C9.47667 1.55538 9.4154 1.51701 9.35133 1.48378C9.0626 1.33398 8.71607 1.33398 8.023 1.33398C7.31253 1.33398 6.95733 1.33398 6.66379 1.49006C6.59873 1.52466 6.53665 1.56458 6.47819 1.60943C6.21443 1.81178 6.06709 2.13502 5.77241 2.78149L5.36861 3.66732"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.3335 11V7"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.6665 11V7"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          {isPerformanceChartEnabled && (
            <button
              type="button"
              onClick={addPerformanceRow}
              className="flex h-[26px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-4 backdrop-blur-[50px]"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-[15px] font-bold text-white">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="w-full">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[19px] font-bold text-[#A06AFF]">
              Accuracy Chart
            </h2>
            <button
              type="button"
              onClick={() => setIsAccuracyChartEnabled(!isAccuracyChartEnabled)}
              className="flex h-[26px] w-12 items-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] p-0.5"
            >
              <div
                className={cn(
                  "h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform",
                  isAccuracyChartEnabled ? "translate-x-[22px]" : "",
                )}
              />
            </button>
          </div>
          {isAccuracyChartEnabled &&
            accuracyChartRows.map((row, index) => (
              <div key={index} className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Select period"
                  value={row.period}
                  onChange={(e) => {
                    const newRows = [...accuracyChartRows];
                    newRows[index].period = e.target.value;
                    setAccuracyChartRows(newRows);
                  }}
                  className="h-11 w-32 rounded-full border border-[#181B22] bg-[#0C101480] px-5 text-[15px] font-bold text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
                />
                <input
                  type="text"
                  placeholder="Profitable signals"
                  value={row.profitable}
                  onChange={(e) => {
                    const newRows = [...accuracyChartRows];
                    newRows[index].profitable = e.target.value;
                    setAccuracyChartRows(newRows);
                  }}
                  className="h-11 flex-1 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] font-bold text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
                />
                <input
                  type="text"
                  placeholder="Unprofitable signals"
                  value={row.unprofitable}
                  onChange={(e) => {
                    const newRows = [...accuracyChartRows];
                    newRows[index].unprofitable = e.target.value;
                    setAccuracyChartRows(newRows);
                  }}
                  className="h-11 flex-1 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] font-bold text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
                />
                {accuracyChartRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAccuracyRow(index)}
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#181B22] bg-[#0B0E11]"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 3.66602L12.5869 10.3494C12.4813 12.0569 12.4285 12.9107 12.0005 13.5246C11.7889 13.8281 11.5165 14.0842 11.2005 14.2767C10.5614 14.666 9.706 14.666 7.99513 14.666C6.28208 14.666 5.42553 14.666 4.78603 14.2759C4.46987 14.0831 4.19733 13.8265 3.98579 13.5225C3.55792 12.9077 3.5063 12.0527 3.40307 10.3428L3 3.66602"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2 3.66732H14M10.7038 3.66732L10.2487 2.72847C9.9464 2.10482 9.7952 1.793 9.53447 1.59852C9.47667 1.55538 9.4154 1.51701 9.35133 1.48378C9.0626 1.33398 8.71607 1.33398 8.023 1.33398C7.31253 1.33398 6.95733 1.33398 6.66379 1.49006C6.59873 1.52466 6.53665 1.56458 6.47819 1.60943C6.21443 1.81178 6.06709 2.13502 5.77241 2.78149L5.36861 3.66732"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.3335 11V7"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.6665 11V7"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          {isAccuracyChartEnabled && (
            <button
              type="button"
              onClick={addAccuracyRow}
              className="flex h-[26px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-4 backdrop-blur-[50px]"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-[15px] font-bold text-white">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Demo */}
      <div className="w-full">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]">
          <div className="flex items-center justify-between border-b border-[#181B22] pb-4">
            <h2 className="text-[19px] font-bold text-[#A06AFF]">Demo</h2>
            <button
              type="button"
              onClick={() => setIsDemoEnabled(!isDemoEnabled)}
              className="flex h-[26px] w-12 items-center rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] p-0.5"
            >
              <div
                className={cn(
                  "h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform",
                  isDemoEnabled ? "translate-x-[22px]" : "",
                )}
              />
            </button>
          </div>
          {isDemoEnabled && (
            <div className="flex flex-col items-center justify-center gap-1 rounded-[28px] border border-dashed border-[#181B22] py-6">
              <Upload className="h-12 w-12 text-[#A06AFF]" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-white">
                Upload demo image or video
              </h3>
              <p className="text-xs font-bold uppercase text-[#B0B0B0]">
                Drag here or{" "}
                <span className="text-[#A06AFF] underline">select</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="w-full">
        <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
          <div className="border-b border-[#181B22] p-4">
            <h2 className="text-[19px] font-bold text-[#A06AFF]">
              Description
            </h2>
          </div>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex items-start gap-4">
              <svg
                className="h-6 w-6 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4C2 4.94281 2 5.41421 2.29289 5.70711C2.58579 6 3.05719 6 4 6C4.94281 6 5.41421 6 5.70711 5.70711C6 5.41421 6 4.94281 6 4C6 3.05719 6 2.58579 5.70711 2.29289C5.41421 2 4.94281 2 4 2C3.05719 2 2.58579 2 2.29289 2.29289C2 2.58579 2 3.05719 2 4Z"
                  stroke="#B0B0B0"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 12C2 12.9428 2 13.4142 2.29289 13.7071C2.58579 14 3.05719 14 4 14C4.94281 14 5.41421 14 5.70711 13.7071C6 13.4142 6 12.9428 6 12C6 11.0572 6 10.5858 5.70711 10.2929C5.41421 10 4.94281 10 4 10C3.05719 10 2.58579 10 2.29289 10.2929C2 10.5858 2 11.0572 2 12Z"
                  stroke="#B0B0B0"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 20C2 20.9428 2 21.4142 2.29289 21.7071C2.58579 22 3.05719 22 4 22C4.94281 22 5.41421 22 5.70711 21.7071C6 21.4142 6 20.9428 6 20C6 19.0572 6 18.5858 5.70711 18.2929C5.41421 18 4.94281 18 4 18C3.05719 18 2.58579 18 2.29289 18.2929C2 18.5858 2 19.0572 2 20Z"
                  stroke="#B0B0B0"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 4C10 4.94281 10 5.41421 10.2929 5.70711C10.5858 6 11.0572 6 12 6C12.9428 6 13.4142 6 13.7071 5.70711C14 5.41421 14 4.94281 14 4C14 3.05719 14 2.58579 13.7071 2.29289C13.4142 2 12.9428 2 12 2C11.0572 2 10.5858 2 10.2929 2.29289C10 2.58579 10 3.05719 10 4Z"
                  stroke="#B0B0B0"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 12C10 12.9428 10 13.4142 10.2929 13.7071C10.5858 14 11.0572 14 12 14C12.9428 14 13.4142 14 13.7071 13.7071C14 13.4142 14 12.9428 14 12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10C11.0572 10 10.5858 10 10.2929 10.2929C10 10.5858 10 11.0572 10 12Z"
                  stroke="#B0B0B0"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 20C10 20.9428 10 21.4142 10.2929 21.7071C10.5858 22 11.0572 22 12 22C12.9428 22 13.4142 22 13.7071 21.7071C14 21.4142 14 20.9428 14 20C14 19.0572 14 18.5858 13.7071 18.2929C13.4142 18 12.9428 18 12 18C11.0572 18 10.5858 18 10.2929 18.2929C10 18.5858 10 19.0572 10 20Z"
                  stroke="#B0B0B0"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                type="text"
                placeholder="Enter description..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#B0B0B0] focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-4 self-start"
            >
              <Plus className="h-6 w-6 text-[#B0B0B0]" />
            </button>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="w-full">
        <div className="flex flex-col rounded-2xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]">
          <div className="border-b border-[#181B22] p-4">
            <h2 className="text-[19px] font-bold text-[#A06AFF]">
              Specifications
            </h2>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex h-11 items-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 backdrop-blur-[50px]">
              <div className="flex h-4 w-4 items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-[#A06AFF]"></div>
              </div>
              <input
                type="text"
                placeholder="Strategy: RSI, Bollinger Bands etc..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#B0B0B0] focus:outline-none"
              />
            </div>
            <div className="flex h-11 items-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 backdrop-blur-[50px]">
              <div className="flex h-4 w-4 items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-[#A06AFF]"></div>
              </div>
              <input
                type="text"
                placeholder="Risk: Low, drawdown up to 10% etc..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#B0B0B0] focus:outline-none"
              />
            </div>
            <div className="flex h-11 items-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 backdrop-blur-[50px]">
              <div className="flex h-4 w-4 items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-[#A06AFF]"></div>
              </div>
              <input
                type="text"
                placeholder="Signals: 5–10 per week etc..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#B0B0B0] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full">
        <div className="flex flex-col items-center gap-4 rounded-b-lg px-6 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="flex h-[46px] w-[180px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
            >
              Save Draft
            </button>
            <button
              type="button"
              className="flex h-[46px] w-[180px] items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] font-bold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
            >
              Preview
            </button>
            <button
              type="button"
              className="flex h-[46px] w-[180px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              Publish
            </button>
          </div>
          <p className="text-xs font-bold text-[#B0B0B0]">
            All changes are saved automatically. Last saved at 14:30
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
