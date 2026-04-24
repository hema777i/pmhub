import { Hono } from "hono";
import { generateState } from "arctic";
import { setCookie, getCookie } from "hono/cookie";
import { github } from "../lib/oauth.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {
  createSession,
  invalidateSession,
  setSessionCookie,
  deleteSessionCookie,
  authMiddleware,
} from "../lib/auth.js";

const app = new Hono();

app.get("/github", async (c) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, []);
  setCookie(c, "github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 60 * 10,
    path: "/",
  });
  return c.redirect(url.toString());
});

app.get("/github/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, "github_oauth_state");

  if (!code || !state || !storedState || state !== storedState) {
    return c.json({ error: "Invalid state" }, 400);
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();

    const githubUserRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = (await githubUserRes.json()) as any;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.githubId, String(githubUser.id)))
      .get();

    let userId: number;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const result = await db
        .insert(users)
        .values({
          githubId: String(githubUser.id),
          username: githubUser.login,
          avatar: githubUser.avatar_url,
          email: githubUser.email || null,
        })
        .returning();
      userId = result[0].id;
    }

    const sessionId = await createSession(userId);
    setSessionCookie(c, sessionId);
    return c.redirect(process.env.APP_URL || "http://localhost:3000");
  } catch (e) {
    console.error("OAuth error:", e);
    return c.json({ error: "OAuth failed" }, 500);
  }
});

app.post("/logout", authMiddleware, async (c) => {
  const sessionId = getCookie(c, "session");
  if (sessionId) await invalidateSession(sessionId);
  deleteSessionCookie(c);
  return c.json({ success: true });
});

app.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ user: null });
  return c.json({
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
    },
  });
});

export default app;
