import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClubBadge } from "@/components/ClubBadge";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">Builder Copilot</span>
          </Link>
          <ClubBadge className="hidden md:inline-flex" />
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Join the club</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
