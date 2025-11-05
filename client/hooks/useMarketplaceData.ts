import { useState, useEffect } from "react";
import {
  getAnalysts,
  getInvestmentConsultants,
  getTraders,
  getSignals,
  getStrategies,
  getTradingRobots,
  getCourses,
  getScriptProducts,
  getOtherProducts,
} from "@/lib/supabaseQueries";
import type {
  Analyst,
  InvestmentConsultant,
  Trader,
  Signal,
  Strategy,
  TradingRobot,
  Course,
  ScriptProduct,
  OtherProduct,
} from "@/data/marketplaceTypes";

type DataType =
  | "analysts"
  | "investment-consultants"
  | "traders"
  | "signals"
  | "strategies"
  | "trading-robots"
  | "courses"
  | "scripts"
  | "others";

type DataResult =
  | Analyst[]
  | InvestmentConsultant[]
  | Trader[]
  | Signal[]
  | Strategy[]
  | TradingRobot[]
  | Course[]
  | ScriptProduct[]
  | OtherProduct[];

interface UseMarketplaceDataOptions {
  type: DataType;
  enabled?: boolean;
}

export function useMarketplaceData<T extends DataResult>(
  options: UseMarketplaceDataOptions
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options.enabled === false) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let result;

        switch (options.type) {
          case "analysts":
            result = await getAnalysts();
            break;
          case "investment-consultants":
            result = await getInvestmentConsultants();
            break;
          case "traders":
            result = await getTraders();
            break;
          case "signals":
            result = await getSignals();
            break;
          case "strategies":
            result = await getStrategies();
            break;
          case "trading-robots":
            result = await getTradingRobots();
            break;
          case "courses":
            result = await getCourses();
            break;
          case "scripts":
            result = await getScriptProducts();
            break;
          case "others":
            result = await getOtherProducts();
            break;
          default:
            throw new Error(`Unknown data type: ${options.type}`);
        }

        setData(result as T);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.type, options.enabled]);

  return { data, loading, error };
}

export function useAnalysts() {
  return useMarketplaceData<Analyst[]>({ type: "analysts" });
}

export function useInvestmentConsultants() {
  return useMarketplaceData<InvestmentConsultant[]>({
    type: "investment-consultants",
  });
}

export function useTraders() {
  return useMarketplaceData<Trader[]>({ type: "traders" });
}

export function useSignals() {
  return useMarketplaceData<Signal[]>({ type: "signals" });
}

export function useStrategies() {
  return useMarketplaceData<Strategy[]>({ type: "strategies" });
}

export function useTradingRobots() {
  return useMarketplaceData<TradingRobot[]>({ type: "trading-robots" });
}

export function useCourses() {
  return useMarketplaceData<Course[]>({ type: "courses" });
}

export function useScriptProducts() {
  return useMarketplaceData<ScriptProduct[]>({ type: "scripts" });
}

export function useOtherProducts() {
  return useMarketplaceData<OtherProduct[]>({ type: "others" });
}
