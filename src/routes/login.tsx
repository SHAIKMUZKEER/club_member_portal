import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogIn, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, isVerified } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { ClubBadge } from "@/components/ClubBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | AWS Builder Copilot" },
      {
        name: "description",
        content:
          "Sign in to the AWS Student Builder Group copilot at RGUKT-ONGOLE to ask questions about club docs, workshops and hackathons.",
      },
      { property: "og:title", content: "Sign in | AWS Builder Copilot" },
      {
        property: "og:description",
        content: "Members-only AI copilot for the AWS Student Builder Group at RGUKT-ONGOLE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (user && isVerified(user)) navigate({ to: "/chat" });
  }, [user, navigate]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    if (!isVerified(data.user)) {
      await supabase.auth.signOut();
      setBusy(false);
      toast.error("Please verify your email first — check your inbox for the confirmation link.");
      return;
    }
    setBusy(false);
    navigate({ to: "/chat" });
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setResetSent(true);
  }

  return (
    <div className="hero-glow min-h-screen">
      <AppHeader />
      <main className="mx-auto grid w-full max-w-5xl items-center gap-10 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex w-full max-w-md flex-col items-center justify-self-center">
        <ClubBadge className="mb-6" />
        <div className="glass w-full rounded-2xl p-7 shadow-2xl">

          {mode === "signin" ? (
            <>
              <h1 className="text-2xl font-semibold">Sign in</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Members only — verified club accounts can use the copilot.
              </p>
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@rguktong.ac.in"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  Sign in
                </Button>
              </form>
              <div className="mt-5 flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    setMode("forgot");
                    setResetSent(false);
                  }}
                >
                  Forgot password?
                </button>
                <Link to="/signup" className="text-muted-foreground hover:text-foreground">
                  Create account
                </Link>
              </div>
            </>
          ) : resetSent ? (
            <div className="text-center">
              <MailCheck className="mx-auto h-10 w-10 text-primary" />
              <h1 className="mt-4 text-xl font-semibold">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a password reset link to <span className="text-foreground">{email}</span>.
                Open it to set a new password.
              </p>
              <Button variant="outline" className="mt-6 w-full" onClick={() => setMode("signin")}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">Reset password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email and we'll send a reset link.
              </p>
              <form onSubmit={handleReset} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send reset link
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode("signin")}
                >
                  Back to sign in
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
