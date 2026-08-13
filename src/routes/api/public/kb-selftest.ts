import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/kb-selftest")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { ensureKnowledgeBase, retrieve } = await import("@/lib/kb.server");
        const q = new URL(request.url).searchParams.get("q") ?? "What are the hackathon rules?";
        await ensureKnowledgeBase();
        const matches = await retrieve(q, 3);
        return Response.json(
          matches.map((m) => ({ doc: m.doc, heading: m.heading, similarity: m.similarity })),
        );
      },
    },
  },
});
