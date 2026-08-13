// Knowledge base: chunking, embedding and retrieval over the 8 club documents.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const EMBEDDING_MODEL = "openai/text-embedding-3-small";
export const CHAT_MODEL = "google/gemini-3.5-flash";

const docModules = import.meta.glob("/docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type Chunk = { doc: string; heading: string; content: string };

export function chunkDocuments(): Chunk[] {
  const chunks: Chunk[] = [];
  for (const [path, raw] of Object.entries(docModules)) {
    const doc = path.split("/").pop() as string;
    const lines = raw.split("\n");
    let heading = "Overview";
    let buffer: string[] = [];
    const flush = () => {
      const content = buffer.join("\n").trim();
      if (content.length > 0) chunks.push({ doc, heading, content });
      buffer = [];
    };
    for (const line of lines) {
      const match = /^#{2,3}\s+(.*)$/.exec(line);
      if (match) {
        flush();
        heading = match[1].trim();
        continue;
      }
      if (/^#\s+/.test(line)) continue;
      buffer.push(line);
    }
    flush();
  }
  return chunks;
}

function apiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}

export async function embed(input: string[]): Promise<number[][]> {
  const res = await fetch(`${GATEWAY}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey(),
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
  });
  if (!res.ok) {
    throw new Error(`Embedding request failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { data: { embedding: number[]; index: number }[] };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

/** Embeds and stores the club docs once. Safe to call on every question. */
export async function ensureKnowledgeBase(): Promise<void> {
  const chunks = chunkDocuments();
  const { count, error } = await supabaseAdmin
    .from("kb_chunks")
    .select("id", { count: "exact", head: true })
    .not("embedding", "is", null);
  if (error) throw new Error(`Knowledge base check failed: ${error.message}`);
  if ((count ?? 0) >= chunks.length) return;

  const batchSize = 32;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await embed(batch.map((c) => `${c.doc} — ${c.heading}\n${c.content}`));
    const rows = batch.map((c, idx) => ({
      doc: c.doc,
      heading: c.heading,
      content: c.content,
      embedding: JSON.stringify(vectors[idx]),
    }));
    const { error: upsertError } = await supabaseAdmin
      .from("kb_chunks")
      .upsert(rows, { onConflict: "doc,heading" });
    if (upsertError) throw new Error(`Knowledge base indexing failed: ${upsertError.message}`);
  }
}

export type Match = {
  id: string;
  doc: string;
  heading: string;
  content: string;
  similarity: number;
};

export async function retrieve(question: string, matchCount = 5): Promise<Match[]> {
  const [vector] = await embed([question]);
  const { data, error } = await supabaseAdmin.rpc("match_kb_chunks", {
    query_embedding: JSON.stringify(vector) as unknown as string,
    match_count: matchCount,
  });
  if (error) throw new Error(`Search failed: ${error.message}`);
  return (data ?? []) as Match[];
}

export const SYSTEM_PROMPT = `You are the AWS Student Builder Copilot for the AWS Student Builder Group at RGUKT-ONGOLE.
Answer strictly from the provided context. If the answer isn't clearly in the context, say you don't know — do not guess.
Never invent AWS pricing, service limits, policies, dates, or club rules that are not in the context.
Be concise and friendly, use short markdown formatting, and stay on club and AWS-learning topics.`;

export async function generateAnswer(question: string, matches: Match[]): Promise<string> {
  const context = matches
    .map((m) => `[${m.doc} — ${m.heading}]\n${m.content}`)
    .join("\n\n---\n\n");

  const res = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey(),
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
      ],
    }),
  });

  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (res.status === 402) throw new Error("NO_CREDITS");
  if (!res.ok) throw new Error(`Model request failed (${res.status}): ${await res.text()}`);

  const json = (await res.json()) as { choices: { message: { content: string } }[] };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}
