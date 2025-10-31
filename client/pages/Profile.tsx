import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import ProfileHeader from "@/components/ProfileHeader";

const authSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Profile: FC = () => {
  const { toast } = useToast();
  const client = supabase;
  const { session, loading: authLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setAuthError(null);
  }, [mode]);

  useEffect(() => {
    if (session) {
      reset({ email: "", password: "" });
    }
  }, [reset, session]);

  const handleAuth = async (values: AuthFormValues) => {
    if (!client) {
      toast({
        title: "Supabase not configured",
        description:
          "Set Supabase environment variables to enable authentication.",
        variant: "destructive",
      });
      return;
    }

    setAuthError(null);

    if (mode === "signUp") {
      const { data, error } = await client.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setAuthError(error.message);
        toast({
          title: "Unable to register",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Check your inbox",
        description:
          "We sent a confirmation email. Complete the verification to activate your account.",
      });
      setMode("signIn");
      return;
    }

    const { error } = await client.auth.signInWithPassword(values);

    if (error) {
      setAuthError(error.message);
      toast({
        title: "Unable to sign in",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome back",
      description: "You are now signed in.",
    });
  };

  const handleSignOut = async () => {
    if (!client) {
      return;
    }

    const { error } = await client.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-[#181B22] bg-[#0C101480] px-6 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
          <span className="text-sm font-medium text-white">
            Checking your session...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-[420px]">
        <div className="container-card flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-bold text-white">
              {mode === "signIn"
                ? "Sign in to view your profile"
                : "Create your account"}
            </h1>
            <p className="text-sm text-[#B0B0B0]">
              {mode === "signIn"
                ? "Use your email and password to access your account information."
                : "Enter your email and password to register for a new account."}
            </p>
          </div>

          {!client && (
            <div className="rounded-[16px] border border-[#2E2744] bg-[#0C1014]/70 px-4 py-3 text-left text-xs font-semibold text-[#B0B0B0]">
              Supabase environment variables are missing. Provide
              <code className="mx-1 rounded bg-black/40 px-1 py-0.5 text-[11px] text-white">
                VITE_SUPABASE_URL
              </code>
              and
              <code className="mx-1 rounded bg-black/40 px-1 py-0.5 text-[11px] text-white">
                VITE_SUPABASE_ANON_KEY
              </code>
              to enable authentication. The form is disabled until they are set.
            </div>
          )}

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(handleAuth)}
            noValidate
          >
            <div className="flex flex-col gap-2 text-left">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register("email")}
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-5 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="text-xs font-semibold text-[#FFA0A0]">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-xs font-bold uppercase text-[#B0B0B0]">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-5 text-[15px] text-white placeholder:text-[#B0B0B0] backdrop-blur-[50px] focus:outline-none focus:ring-2 focus:ring-[#A06AFF]"
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="text-xs font-semibold text-[#FFA0A0]">
                  {errors.password.message}
                </span>
              )}
            </div>

            {authError && (
              <div className="rounded-[16px] border border-red-900 bg-red-950/60 px-4 py-3 text-xs font-semibold text-red-200">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="flex h-[46px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-6 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              disabled={isSubmitting || !client}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "signUp" ? "Creating..." : "Signing in..."}
                </>
              ) : mode === "signUp" ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "signIn" ? "signUp" : "signIn"))
            }
            className="text-xs font-semibold text-[#A06AFF] underline transition-opacity hover:opacity-80"
            disabled={isSubmitting}
          >
            {mode === "signIn"
              ? "No account yet? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-6">
      <ProfileHeader user={session?.user} />
      <div className="container-card p-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold text-white">
                Profile Overview
              </h1>
              <p className="text-sm text-webGray">
                Manage your personal information, contact details, and account
                preferences in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#181B22] bg-[#0C101480] px-4 text-sm font-semibold text-white backdrop-blur-[50px] transition-colors hover:border-[#1F2230]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4">
              <p className="text-xs uppercase tracking-wide text-webGray">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Active</p>
              <p className="mt-1 text-xs text-webGray">
                Member since January 2024
              </p>
            </div>
            <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4">
              <p className="text-xs uppercase tracking-wide text-webGray">
                Plan
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Platinum</p>
              <p className="mt-1 text-xs text-webGray">
                Next renewal: 14 Jul 2024
              </p>
            </div>
            <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-4">
              <p className="text-xs uppercase tracking-wide text-webGray">
                Security
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Two-factor enabled
              </p>
              <p className="mt-1 text-xs text-webGray">
                Last login: 2 hours ago
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="container-card p-6">
          <h2 className="text-xl font-semibold text-white">Personal Details</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm text-white/80">
            <div className="flex flex-col">
              <span className="text-xs uppercase text-webGray">Full Name</span>
              <span className="mt-1 font-medium">Devid Stone</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-webGray">Email</span>
              <span className="mt-1 font-medium">
                {session.user.email ?? "devid.stone@example.com"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-webGray">Location</span>
              <span className="mt-1 font-medium">Warsaw, Poland</span>
            </div>
          </div>
        </div>

        <div className="container-card p-6">
          <h2 className="text-xl font-semibold text-white">Preferences</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm text-white/80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="mt-1 text-xs text-webGray">
                  Receive weekly summaries and announcements.
                </p>
              </div>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                Enabled
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">AI Recommendations</p>
                <p className="mt-1 text-xs text-webGray">
                  Personalized suggestions for market opportunities.
                </p>
              </div>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                Enabled
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">Two-Factor Auth</p>
                <p className="mt-1 text-xs text-webGray">
                  Secure your account with an extra verification step.
                </p>
              </div>
              <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-semibold text-green">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
