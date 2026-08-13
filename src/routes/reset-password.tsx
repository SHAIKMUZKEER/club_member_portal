import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { ClubBadge } from "@/components/ClubBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | AWS Builder Copilot" },
      {
        name: "description",
        content:
          "Choose a new password for your AWS Student Builder Group copilot account at RGUKT-ONGOLE.",
      },
      { property: "og:title", content: "Set a new password | AWS Builder Copilot" },
      {
        property: "og:description",
        content: "Complete your password reset for the club copilot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated — please sign in.");
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <div className="hero-glow min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-14">
        <ClubBadge className="mb-6" />
        <div className="glass w-full rounded-2xl p-7 shadow-2xl">
          <h1 className="text-2xl font-semibold">Set a new password</h1>
          {!ready && (
            <p className="mt-2 text-sm text-muted-foreground">
              Open this page from the reset link in your email. If the link expired, request a new
              one from the sign-in page.
            </p>
          )}
          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy || !ready}>
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Update password
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
