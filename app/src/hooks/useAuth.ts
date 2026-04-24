import { useState, useEffect } from "react";
import { api } from "@/services/api";

export interface User {
  id: number;
  username: string;
  avatar: string | null;
  email: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth.me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    window.location.href = `${apiUrl}/auth/github`;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
}
