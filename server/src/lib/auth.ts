import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { db } from "../db/index.js";
import { sessions, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { Context, Next } from "hono";

export async function createSession(userId: number): Promise<string> {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  await db.insert(sessions).values({ id, userId, expiresAt });
  return id;
}

export async function validateSession(sessionId: string) {
  if (!sessionId) return null;
  const result = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .get();
  if (!result) return null;
  if (result.session.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }
  return result.user;
}

export async function invalidateSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionCookie(c: Context, sessionId: string) {
  setCookie(c, "session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export function deleteSessionCookie(c: Context) {
  deleteCookie(c, "session", { path: "/" });
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const sessionId = getCookie(c, "session");
  const user = sessionId ? await validateSession(sessionId) : null;
  c.set("user", user);
  await next();
});

export const requireAuth = createMiddleware(async (c, next) => {
  const sessionId = getCookie(c, "session");
  const user = sessionId ? await validateSession(sessionId) : null;
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", user);
  await next();
});
