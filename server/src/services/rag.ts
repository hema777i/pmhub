import { db, sqlite } from "../db/index.js";
import { knowledgeAreas } from "../db/schema.js";
import { eq } from "drizzle-orm";

export interface RetrievedChunk {
  id: number;
  areaId: string;
  areaTitle: string;
  title: string;
  content: string;
  chunkType: string;
  score: number;
}

export async function retrieveChunks(query: string): Promise<RetrievedChunk[]> {
  const ftsRows = sqlite
    .prepare(`SELECT k.id, k.area_id, k.title, k.content, k.chunk_type FROM knowledge_chunks k JOIN knowledge_chunks_fts fts ON k.id = fts.rowid WHERE knowledge_chunks_fts MATCH ? ORDER BY rank LIMIT 8`)
    .all(query) as any[];

  const results: RetrievedChunk[] = [];
  for (const row of ftsRows) {
    const area = await db.select().from(knowledgeAreas).where(eq(knowledgeAreas.id, row.area_id)).get();
    results.push({
      id: row.id,
      areaId: row.area_id,
      areaTitle: area?.title || row.area_id,
      title: row.title,
      content: row.content,
      chunkType: row.chunk_type,
      score: 1.0,
    });
  }

  return results;
}
