import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, SendHorizonal, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { EmptyState } from "@/components/chat/EmptyState";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, isVerified } from "@/hooks/useAuth";
import {
  askQuestion,
  clearHistory,
  getHistory,
  rateMessage,
  type ChatMessage,
} from "@/lib/chat.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Builder Copilot chat | AWS Student Builder Group" },
      {
        name: "description",
        content:
          "Ask the AWS Student Builder Group copilot about onboarding, account setup, Bedrock, hackathon rules and workshops — answered only from official club docs.",
      },
      { property: "og:title", content: "Builder Copilot chat" },
      {
        property: "og:description",
        content: "Members-only AI copilot grounded in the RGUKT-ONGOLE club knowledge base.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const ask = useServerFn(askQuestion);
  const history = useServerFn(getHistory);
  const rate = useServerFn(rateMessage);
  const clear = useServerFn(clearHistory);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && (!user || !isVerified(user))) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || !isVerified(user)) return;
    let active = true;
    history({})
      .then((rows) => {
        if (active) setMessages(rows);
      })
      .catch((error: unknown) => {
        console.error(error);
        toast.error("Could not load your chat history.");
      })
      .finally(() => active && setLoadingHistory(false));
    return () => {
      active = false;
    };
  }, [user, history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (!sending) inputRef.current?.focus();
  }, [sending, loadingHistory]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    const optimistic: ChatMessage = {
      id: `pending-${Date.now()}`,
      role: "user",
      content: text,
      sources: [],
      feedback: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const result = await ask({ data: { question: text } });
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimistic.id),
        result.user,
        result.answer,
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
      if (message.includes("RATE_LIMIT")) {
        toast.error("Too many requests right now — please try again in a moment.");
      } else if (message.includes("NO_CREDITS")) {
        toast.error("AI credits are exhausted. Please top up to keep chatting.");
      } else {
        toast.error("The copilot could not answer that request.");
        console.error(error);
      }
    } finally {
      setSending(false);
    }
  }

  async function handleRate(id: string, feedback: number) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === feedback ? null : feedback } : m)),
    );
    try {
      await rate({ data: { messageId: id, feedback } });
    } catch (error) {
      console.error(error);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const displayName =
    (user.user_metadata?.["full_name"] as string | undefined) || user.email?.split("@")[0] || "Builder";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-4">
        <div className="flex-1 space-y-6 py-6">
          {loadingHistory ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              name={displayName}
              onPrefill={(q) => {
                setInput(q);
                inputRef.current?.focus();
              }}
              onAsk={(q) => void send(q)}
            />
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} onRate={handleRate} />)
          )}
          {sending && (
            <p className="animate-pulse text-sm text-muted-foreground">
              Searching the club knowledge base…
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="glass sticky bottom-4 rounded-2xl p-3"
        >
          <label htmlFor="prompt" className="sr-only">
            What do you need help with?
          </label>
          <div className="flex items-end gap-2">
            <Textarea
              id="prompt"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder="Ask the Builder Copilot..."
              className="max-h-40 min-h-11 resize-none border-0 bg-transparent focus-visible:ring-0"
            />
            <Button type="submit" size="icon" disabled={sending || input.trim().length === 0}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
            </Button>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={async () => {
                await clear({});
                setMessages([]);
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-3 w-3" />
              Clear my history
            </button>
          )}
        </form>
      </main>
    </div>
  );
}
