import ReactMarkdown from "react-markdown";
import { FileText, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/chat.functions";
import { UnverifiedCard } from "./UnverifiedCard";

export function MessageBubble({
  message,
  onRate,
}: {
  message: ChatMessage;
  onRate: (id: string, feedback: number) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-lg">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[92%] space-y-3">
      {message.unverified ? (
        <UnverifiedCard />
      ) : (
        <>
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed text-foreground">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {message.sources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {message.sources.map((s) => (
                <span
                  key={`${s.doc}-${s.heading}`}
                  className="glass inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  <FileText className="h-3 w-3 text-primary" aria-hidden="true" />
                  Source: {s.doc} — {s.heading}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Helpful"
              onClick={() => onRate(message.id, 1)}
              className={cn(
                "rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground",
                message.feedback === 1 && "bg-primary/20 text-primary",
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Not helpful"
              onClick={() => onRate(message.id, -1)}
              className={cn(
                "rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground",
                message.feedback === -1 && "bg-destructive/20 text-destructive",
              )}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
