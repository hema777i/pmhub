import type { InferSelectModel } from "drizzle-orm";
import type { users } from "../db/schema.js";

declare module "hono" {
  interface ContextVariableMap {
    user: InferSelectModel<typeof users> | null;
  }
}
