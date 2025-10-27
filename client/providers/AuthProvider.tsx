import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "marketplace.supabase.session";

type PersistedSessionPayload = {
  access_token: string;
  refresh_token: string;
};

const isBrowser = typeof window !== "undefined";

const readPersistedSession = (): PersistedSessionPayload | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as PersistedSessionPayload | null;
    if (!parsed || !parsed.access_token || !parsed.refresh_token) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("[AuthProvider] Unable to read persisted session", error);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const persistSession = (session: Session | null) => {
  if (!isBrowser) {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  const payload: PersistedSessionPayload = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isActive = true;

    const startAutoRefresh = (supabase.auth as unknown as { startAutoRefresh?: () => void }).startAutoRefresh;
    const stopAutoRefresh = (supabase.auth as unknown as { stopAutoRefresh?: () => void }).stopAutoRefresh;

    startAutoRefresh?.();

    const initialize = async () => {
      setLoading(true);

      let currentSession: Session | null = null;

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AuthProvider] Failed to get session", error.message);
        }
        currentSession = data.session ?? null;
      } catch (error) {
        console.error("[AuthProvider] Unexpected error while getting session", error);
      }

      if (!currentSession) {
        const persisted = readPersistedSession();
        if (persisted) {
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: persisted.access_token,
              refresh_token: persisted.refresh_token,
            });
            if (error) {
              console.warn("[AuthProvider] Unable to restore session from storage", error.message);
              if (isBrowser) {
                window.localStorage.removeItem(AUTH_STORAGE_KEY);
              }
            } else {
              currentSession = data.session ?? null;
            }
          } catch (error) {
            console.error("[AuthProvider] Unexpected error while restoring session", error);
          }
        }
      }

      if (!isActive) {
        return;
      }

      persistSession(currentSession);
      setSession(currentSession);
      setLoading(false);
      initializedRef.current = true;
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) {
        return;
      }

      persistSession(nextSession);
      setSession(nextSession ?? null);
      if (!initializedRef.current) {
        setLoading(false);
        initializedRef.current = true;
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
      stopAutoRefresh?.();
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setSession(null);
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("[AuthProvider] Failed to refresh session", error.message);
    }
    persistSession(data.session ?? null);
    setSession(data.session ?? null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      refresh,
    }),
    [loading, refresh, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
