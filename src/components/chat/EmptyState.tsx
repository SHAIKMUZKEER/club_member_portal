import { BookOpen, Rocket, Trophy } from "lucide-react";

const QUICK_ACTIONS = [
  {
    icon: Rocket,
    label: "🚀 Start Building",
    question: "How do I set up my AWS account safely for club labs?",
  },
  {
    icon: BookOpen,
    label: "📚 Learn AWS",
    question: "What is covered in the club workshop schedule this semester?",
  },
  {
    icon: Trophy,
    label: "🏆 Build Projects",
    question: "What starter projects does the club recommend?",
  },
];

export const SUGGESTIONS = [
  "How do I publish on Builder Center?",
  "How do I get started with Bedrock?",
  "What are the hackathon rules?",
  "When is the next workshop?",
];

export function EmptyState({
  name,
  onPrefill,
  onAsk,
}: {
  name: string;
  onPrefill: (q: string) => void;
  onAsk: (q: string) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-1 py-8">
      <h1 className="text-2xl font-semibold sm:text-3xl">
        👋 Welcome, <span className="text-gradient">{name}</span> — Your AWS Builder journey starts
        here.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Answers come only from the official club knowledge base — no guessing.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => onPrefill(action.question)}
            className="glass glass-hover rounded-2xl p-4 text-left"
          >
            <action.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="mt-3 block text-sm font-medium">{action.label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{action.question}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium">What do you need help with?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onAsk(s)}
              className="glass glass-hover rounded-full px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
