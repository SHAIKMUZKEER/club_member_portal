import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type Source = { doc: string; heading: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: Source[];
  feedback: number | null;
  created_at: string;
  unverified?: boolean;
};

export const UNVERIFIED = "__UNVERIFIED__";
const MIN_SIMILARITY = 0.32;

export const getHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ChatMessage[]> => {
    const { data, error } = await context.supabase
      .from("messages")
      .select("id, role, content, sources, feedback, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content === UNVERIFIED ? "" : row.content,
      sources: (row.sources ?? []) as Source[],
      feedback: row.feedback,
      created_at: row.created_at,
      unverified: row.content === UNVERIFIED,
    }));
  });

export const askQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ question: z.string().min(1).max(2000) }).parse(data))
  .handler(async ({ data, context }): Promise<{ user: ChatMessage; answer: ChatMessage }> => {
    const { ensureKnowledgeBase, retrieve, generateAnswer } = await import("./kb.server");

    const { data: userRow, error: userError } = await context.supabase
      .from("messages")
      .insert({ user_id: context.userId, role: "user", content: data.question })
      .select("id, role, content, sources, feedback, created_at")
      .single();
    if (userError) throw new Error(userError.message);

    await ensureKnowledgeBase();
    const matches = await retrieve(data.question, 5);
    const relevant = matches.filter((m) => m.similarity >= MIN_SIMILARITY);

    let content = UNVERIFIED;
    let sources: Source[] = [];

    if (relevant.length > 0) {
      const generated = await generateAnswer(data.question, relevant);
      const refused = /don'?t know|not (clearly )?in the (provided )?context|cannot find/i.test(
        generated,
      );
      if (generated && !refused) {
        content = generated;
        sources = relevant.slice(0, 3).map((m) => ({ doc: m.doc, heading: m.heading }));
      }
    }

    const { data: botRow, error: botError } = await context.supabase
      .from("messages")
      .insert({
        user_id: context.userId,
        role: "assistant",
        content,
        sources: sources as unknown as never,
      })
      .select("id, role, content, sources, feedback, created_at")
      .single();
    if (botError) throw new Error(botError.message);

    return {
      user: {
        id: userRow.id,
        role: "user",
        content: userRow.content,
        sources: [],
        feedback: null,
        created_at: userRow.created_at,
      },
      answer: {
        id: botRow.id,
        role: "assistant",
        content: content === UNVERIFIED ? "" : content,
        sources,
        feedback: null,
        created_at: botRow.created_at,
        unverified: content === UNVERIFIED,
      },
    };
  });

export const rateMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ messageId: z.string().uuid(), feedback: z.number().int().min(-1).max(1) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("messages")
      .update({ feedback: data.feedback })
      .eq("id", data.messageId)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const clearHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("messages")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
