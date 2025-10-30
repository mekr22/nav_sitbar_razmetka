import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 250;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const isNetworkError = (error: unknown): boolean => {
  if (!error) {
    return false;
  }

  if (error instanceof TypeError) {
    return error.message?.toLowerCase().includes("failed to fetch") ?? false;
  }

  if (typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "");
    return message.toLowerCase().includes("failed to fetch");
  }

  if (typeof error === "string") {
    return error.toLowerCase().includes("failed to fetch");
  }

  return false;
};

const shouldRetryResponse = (response: Response): boolean => {
  return response.status >= 500 && response.status < 600;
};

const fetchWithRetry: typeof fetch = async (input, init) => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= DEFAULT_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(input, init);

      if (!shouldRetryResponse(response) || attempt === DEFAULT_RETRY_ATTEMPTS) {
        return response;
      }

      lastError = response;
    } catch (error) {
      if (!isNetworkError(error) || attempt === DEFAULT_RETRY_ATTEMPTS) {
        throw error;
      }

      lastError = error;
    }

    const backoff = RETRY_DELAY_MS * Math.pow(2, attempt);
    await sleep(backoff);
  }

  if (lastError instanceof Response) {
    return lastError;
  }

  throw lastError ?? new Error("Supabase network request failed after retries");
};

type TypedSupabaseClient = SupabaseClient;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: TypedSupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: fetchWithRetry,
    },
  });
} else if (import.meta.env.DEV) {
  console.warn(
    "Supabase environment variables are not set. Authentication features are disabled.",
  );
}

export const supabase = client;
