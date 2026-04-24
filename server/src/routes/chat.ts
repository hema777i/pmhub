import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { chatSessions, chatMessages } from "../db/schema.js";
import { requireAuth } from "../lib/auth.js";
import { retrieveChunks } from "../services/rag.js";
import { createChatStream } from "../services/llm.js";
import { classifyIntent, buildSkill } from "../skills/index.js";

const app = new Hono();

app.use("/*", requireAuth);

app.post("/sessions", async (c) => {
  const user = c.get("user")!;
  const body = (await c.req.json<{ model?: string }>().catch(() => ({}))) as { model?: string };
  const result = await db
    .insert(chatSessions)
    .values({ userId: user.id, title: "新对话", model: body.model || "deepseek-reasoner" })
    .returning();
  return c.json({ session: result[0] });
});

app.get("/sessions", async (c) => {
  const user = c.get("user")!;
  const sessions = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.userId, user.id))
    .orderBy(desc(chatSessions.createdAt))
    .all();
  return c.json({ sessions });
});

app.get("/sessions/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, id))
    .orderBy(chatMessages.createdAt)
    .all();
  return c.json({ messages });
});

app.post("/sessions/:id", async (c) => {
  const sessionId = Number(c.req.param("id"));
  const { message } = await c.req.json();

  // Get session to read model
  const session = await db.select().from(chatSessions).where(eq(chatSessions.id, sessionId)).get();
  if (!session) return c.json({ error: "Session not found" }, 404);

  await db.insert(chatMessages).values({
    sessionId,
    role: "user",
    content: message,
  });

  // Skill System: classify intent and build professional prompt
  const intent = classifyIntent(message);
  const chunks = await retrieveChunks(message);
  const skill = buildSkill(intent, chunks.slice(0, 6));

  const previousMessages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.createdAt)
    .all();

  const messagesForLLM = [
    { role: "system" as const, content: skill.systemPrompt },
    ...previousMessages.map((m) => ({ role: m.role as any, content: m.content })),
  ];

  const result = createChatStream(messagesForLLM, session.model, skill.temperature);

  const response = result.toDataStreamResponse();

  // Fire-and-forget save after stream completes
  result.text.then(async (fullText) => {
    await db.insert(chatMessages).values({
      sessionId,
      role: "assistant",
      content: fullText,
      sources: chunks.slice(0, 5).map((c) => ({ id: c.id, areaId: c.areaId, title: c.title })),
    });
  });

  return response;
});

export default app;
