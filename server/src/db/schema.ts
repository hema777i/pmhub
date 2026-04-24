import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const knowledgeAreas = sqliteTable("knowledge_areas", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  shortTitle: text("short_title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  processGroups: text("process_groups", { mode: "json" }).notNull(),
  keyConcepts: text("key_concepts", { mode: "json" }).notNull(),
  inputs: text("inputs", { mode: "json" }).notNull(),
  outputs: text("outputs", { mode: "json" }).notNull(),
  toolsTechniques: text("tools_techniques", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
});

export const knowledgeSubtasks = sqliteTable("knowledge_subtasks", {
  id: text("id").primaryKey(),
  areaId: text("area_id").notNull(),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const processGroups = sqliteTable("process_groups", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  keyActivities: text("key_activities", { mode: "json" }).notNull(),
  deliverables: text("deliverables", { mode: "json" }).notNull(),
  knowledgeAreas: text("knowledge_areas", { mode: "json" }).notNull(),
});

export const knowledgeChunks = sqliteTable("knowledge_chunks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  areaId: text("area_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  chunkType: text("chunk_type").notNull().default("overview"),
  metadata: text("metadata", { mode: "json" }),
  embedding: text("embedding", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
});

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  githubId: text("github_id").notNull().unique(),
  username: text("username").notNull(),
  avatar: text("avatar"),
  email: text("email"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id", { mode: "number" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
});

export const userProgress = sqliteTable("user_progress", {
  userId: integer("user_id", { mode: "number" }).notNull(),
  areaId: text("area_id").notNull(),
  status: text("status").notNull().default("locked"),
  score: integer("score").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

export const userToolData = sqliteTable("user_tool_data", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" }).notNull(),
  toolType: text("tool_type").notNull(),
  title: text("title").notNull(),
  data: text("data", { mode: "json" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

export const chatSessions = sqliteTable("chat_sessions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" }).notNull(),
  title: text("title"),
  model: text("model").notNull().default("deepseek-reasoner"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id", { mode: "number" }).notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  sources: text("sources", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
});
