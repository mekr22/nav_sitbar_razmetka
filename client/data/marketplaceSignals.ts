import type { Signal } from "@/components/marketplace/SignalCard";

export const baseSignals: Signal[] = [
  {
    id: "signal-risk-master",
    name: "Product Name",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128",
    users: "1,748",
    riskLevel: "LOW",
    platforms: ["binance", "mcx", "nyse", "kraken"],
    assets: ["STOCKS", "CRYPTO", "COMMODITIES", "+1"],
    type: "TREND/OSCILLATOR",
    timeframes: ["M15", "H4", "W1"],
    use: "TREND/REVERSAL",
    accuracy: "30%",
    chartImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
  },
  {
    id: "signal-risk-master-2",
    name: "Product Name",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/c9e278b9480a28f27e6e8611aae8e152e0b641f9?width=128",
    users: "1,748",
    riskLevel: "LOW",
    platforms: ["binance", "mcx", "nyse", "kraken"],
    assets: ["STOCKS", "CRYPTO", "COMMODITIES", "+1"],
    type: "TREND/OSCILLATOR",
    timeframes: ["M15", "H4", "W1"],
    use: "TREND/REVERSAL",
    accuracy: "30%",
    chartImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/4c44ba7909f1536707cd404c67a6dbf2a7eddc6c?width=364",
  },
];
