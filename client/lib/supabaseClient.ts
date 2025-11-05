import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 250;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    if (typeof globalThis.setTimeout === "function") {
      globalThis.setTimeout(resolve, ms);
    } else {
      resolve();
    }
  });

const toErrorMessage = (error: unknown): string => {
  if (!error) {
    return "Unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
};

const isNetworkError = (error: unknown): boolean =>
  toErrorMessage(error).toLowerCase().includes("failed to fetch");

const shouldRetryResponse = (response: Response): boolean => {
  return response.status >= 500 && response.status < 600;
};

const fetchWithRetry: typeof fetch = async (input, init) => {
  let lastError: unknown;

  const supportsRequest = typeof Request !== "undefined";
  const buildRequest = (): Request | null => {
    if (!supportsRequest) {
      return null;
    }

    if (input instanceof Request) {
      try {
        return input.clone();
      } catch (error) {
        console.warn(
          "[supabaseClient] Unable to clone request for retry",
          toErrorMessage(error),
        );
        return new Request(input);
      }
    }

    return new Request(input as RequestInfo, init);
  };

  const executeFetch = async (): Promise<Response> => {
    const request = buildRequest();
    if (request) {
      return fetch(request);
    }
    return fetch(input, init);
  };

  for (let attempt = 0; attempt <= DEFAULT_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await executeFetch();

      if (
        !shouldRetryResponse(response) ||
        attempt === DEFAULT_RETRY_ATTEMPTS
      ) {
        return response;
      }

      lastError = response;
    } catch (error) {
      const isNetworkFailure = isNetworkError(error);
      if (!isNetworkFailure || attempt === DEFAULT_RETRY_ATTEMPTS) {
        if (isNetworkFailure) {
          lastError = error;
          break;
        }
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

  if (isNetworkError(lastError)) {
    const message = toErrorMessage(lastError);
    const body = JSON.stringify({
      error: "network_error",
      message,
      retryAttempts: DEFAULT_RETRY_ATTEMPTS,
    });
    return new Response(body, {
      status: 503,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
