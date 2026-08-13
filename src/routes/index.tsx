import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, MessageSquare, ShieldCheck, Sparkle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ClubBadge } from "@/components/ClubBadge";
import { Button } from "@/components/ui/button";
import { useAuth, isVerified } from "@/hooks/useAuth";
import sbgLockup from "@/assets/sbg-lockup.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AWS Builder Copilot | Student Builder Group RGUKT-ONGOLE" },
      {
        name: "description",
        content:
          "An AI copilot for the AWS Student Builder Group at RGUKT-ONGOLE, answering only from the official club knowledge base — onboarding, Bedrock, hackathons and workshops.",
      },
      { property: "og:title", content: "AWS Builder Copilot | RGUKT-ONGOLE" },
      {
        property: "og:description",
        content: "Grounded answers from the official AWS Student Builder Group documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: BookOpen,
    title: "Grounded in club docs",
    body: "Every answer is retrieved from the eight official club documents — nothing invented.",
  },
  {
    icon: ShieldCheck,
    title: "Members only",
    body: "Verified email accounts only, with your chat history stored privately per member.",
  },
  {
    icon: Sparkle,
    title: "Cited every time",
    body: "Each answer shows the source file and section, so you can double-check the original.",
  },
];

function Landing() {
  const { user } = useAuth();
  return (
    <div className="hero-glow min-h-screen">
      <AppHeader />

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <ClubBadge />
            <h1 className="mt-5 text-4xl leading-tight font-semibold sm:text-5xl">
              Your <span className="text-gradient">AWS Builder Copilot</span> for the club
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              Ask about onboarding, AWS account setup, Builder Center publishing, Bedrock, Lambda
              patterns, hackathon rules and workshops. Answers come strictly from the official club
              knowledge base.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user && isVerified(user) ? (
                <Button size="lg" asChild>
                  <Link to="/chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Open the copilot
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/signup">Create your account</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="relative w-full">
            <div className="glass glass-hover overflow-hidden rounded-3xl p-3">
              <img
                src={sbgLockup.url}
                alt="AWS Student Builder Group at RGUKT-ONGOLE lockup"
                loading="lazy"
                className="w-full rounded-2xl"
              />
            </div>
          </div>

        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24">
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="glass glass-hover rounded-2xl p-5">
                <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-sm font-semibold">{f.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
