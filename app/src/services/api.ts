const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function fetchAPI(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    me: () => fetchAPI("/auth/me"),
    logout: () => fetchAPI("/auth/logout", { method: "POST" }),
  },
  knowledge: {
    areas: () => fetchAPI("/knowledge/areas"),
    area: (id: string) => fetchAPI(`/knowledge/areas/${id}`),
    processGroups: () => fetchAPI("/knowledge/process-groups"),
    search: (q: string) => fetchAPI(`/knowledge/search?q=${encodeURIComponent(q)}`),
  },
  chat: {
    sessions: () => fetchAPI("/chat/sessions"),
    createSession: (model?: string) => fetchAPI("/chat/sessions", { method: "POST", body: JSON.stringify({ model }) }),
    messages: (id: number) => fetchAPI(`/chat/sessions/${id}`),
    sendMessage: (id: number, message: string) => {
      return fetch(`${API_BASE}/chat/sessions/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
    },
  },
};
