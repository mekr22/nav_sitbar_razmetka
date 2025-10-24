import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
  });
} else if (import.meta.env.DEV) {
  console.warn(
    "Supabase environment variables are not set. Authentication features are disabled.",
  );
}

export const supabase = client;
