import { Hono } from "hono";
import { db, sqlite } from "../db/index.js";
import { knowledgeAreas, knowledgeSubtasks, processGroups } from "../db/schema.js";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/areas", async (c) => {
  const areas = await db.select().from(knowledgeAreas).all();
  return c.json({ areas });
});

app.get("/areas/:id", async (c) => {
  const id = c.req.param("id");
  const area = await db.select().from(knowledgeAreas).where(eq(knowledgeAreas.id, id)).get();
  if (!area) return c.json({ error: "Not found" }, 404);
  const subtasks = await db.select().from(knowledgeSubtasks).where(eq(knowledgeSubtasks.areaId, id)).all();
  return c.json({ area, subtasks });
});

app.get("/process-groups", async (c) => {
  const groups = await db.select().from(processGroups).all();
  return c.json({ processGroups: groups });
});

app.get("/search", async (c) => {
  const q = c.req.query("q");
  if (!q) return c.json({ chunks: [] });

  const rows = sqlite
    .prepare(`SELECT k.id, k.area_id, k.title, k.content, k.chunk_type, k.metadata FROM knowledge_chunks k JOIN knowledge_chunks_fts fts ON k.id = fts.rowid WHERE knowledge_chunks_fts MATCH ? ORDER BY rank LIMIT 10`)
    .all(q) as any[];

  return c.json({ chunks: rows });
});

export default app;
