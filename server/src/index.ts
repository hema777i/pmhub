import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import knowledgeRoutes from "./routes/knowledge.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = new Hono();

app.use(logger());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.route("/auth", authRoutes);
app.route("/knowledge", knowledgeRoutes);
app.route("/chat", chatRoutes);

app.get("/health", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT) || 3001;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
